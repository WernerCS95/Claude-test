import openpyxl, json, re

wb = openpyxl.load_workbook('/root/.claude/uploads/53c3c300-e60c-5687-8bdb-ce975ffd250f/05b9dec6-Naamplate_reference.xlsx', data_only=True)
ws = wb['Sheet1']

date_re = re.compile(r'^\d{4}\.\d{2}\.\d{2}$')
placeholder_re = re.compile(r'^\?+$', re.I)

def norm_elephant(text):
    if not text:
        return text
    t = str(text).strip()
    # collapse "(oliefant|Oliefant|Olifant) XXX (oliefant|Oliefant|Olifant)" variants, any spacing, to the standard form
    m = re.match(r'^\(\s*(?:oliefant|olifant)\s*\)\s*(.+?)\s*\(\s*(?:oliefant|olifant)\s*\)$', t, re.I)
    if m:
        inner = m.group(1).strip()
        return f"(Olifant) {inner} (Olifant)"
    # plain 3-letter code with no marker yet -> apply it (matches current app logic)
    if re.match(r'^[A-Za-z]{3}$', t):
        return f"(Olifant) {t.upper()} (Olifant)"
    return t

rows_out = []
flagged_out = []
current_date = None
header_seen_for_batch = False

r = 1
maxr = ws.max_row
while r <= maxr:
    a = ws.cell(r,1).value
    b = ws.cell(r,2).value
    if isinstance(b, str) and date_re.match(b.strip()):
        current_date = b.strip().replace('.', '-')
        header_seen_for_batch = False
        r += 1
        continue
    if b == 'Naamplate':
        r += 1
        continue
    if b == 'Detail':
        header_seen_for_batch = True
        r += 1
        continue
    # data row: needs a numeric row-index in col A (or at least a Detail value) and a current_date
    detail = b
    if current_date and detail is not None and str(detail).strip() != '':
        qty_req = ws.cell(r,3).value
        qty_on_hand = ws.cell(r,5).value
        qty_to_cut = ws.cell(r,7).value
        col_i = ws.cell(r,9).value   # job nr (split layout) or blank
        col_j = ws.cell(r,10).value  # client, or combined Klient/Job Nr (early layout)
        col_k = ws.cell(r,11).value  # kommentaar

        detail_str = str(detail).strip()
        is_placeholder = bool(placeholder_re.match(detail_str)) or 'moet nog' in detail_str.lower()

        # split vs combined layout: if col_i holds something that looks like
        # a job number (numeric-ish or short code) AND col_j looks like a
        # separate client name, treat as split; otherwise col_j alone is
        # the combined "Klient/Job Nr" field.
        job_nr = None
        client = None
        if col_i not in (None, '') and col_j not in (None, ''):
            job_nr = str(col_i).strip()
            client = str(col_j).strip()
        elif col_j not in (None, ''):
            client = str(col_j).strip()
        elif col_i not in (None, ''):
            client = str(col_i).strip()

        entry = {
            'date': current_date,
            'detail': detail_str,
            'text': norm_elephant(detail_str),
            'qtyReqd': qty_req,
            'jobNo': job_nr,
            'client': client,
            'comment': str(col_k).strip() if col_k else None,
        }
        if is_placeholder:
            flagged_out.append(entry)
        else:
            rows_out.append(entry)
    r += 1

print(f"Parsed {len(rows_out)} valid rows, {len(flagged_out)} flagged rows")
print(f"Distinct dates (batches): {len(set(x['date'] for x in rows_out))}")

with open('/home/user/Claude-test/sync/nameplate_history.json', 'w') as f:
    json.dump({'rows': rows_out, 'flagged': flagged_out}, f, indent=1)

# Build the client -> last-used-text map (most recent date wins per client)
client_map = {}
for row in sorted(rows_out, key=lambda x: x['date']):
    if row['client']:
        key = row['client'].strip().lower()
        client_map[key] = {'text': row['text'], 'clientDisplay': row['client'].strip(), 'lastUsedAt': row['date'] + 'T00:00:00.000Z'}

print(f"Distinct clients in map: {len(client_map)}")
with open('/home/user/Claude-test/sync/nameplate_client_map.json', 'w') as f:
    json.dump(client_map, f, indent=1)

print("\nSample flagged rows:")
for f_ in flagged_out[:10]:
    print(' ', f_['date'], '|', f_['detail'], '|', f_['client'])
