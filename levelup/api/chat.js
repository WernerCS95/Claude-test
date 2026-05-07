export const config = { runtime: 'edge' }

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
      },
    })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
  }

  const apiKey = req.headers.get('x-api-key') || process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'No API key. Add ANTHROPIC_API_KEY to Vercel env vars or enter one in Settings.' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    )
  }

  let body
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 })
  }

  const { messages, system, max_tokens = 1024 } = body

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens,
        system,
        messages,
      }),
    })

    const data = await upstream.json()

    if (!upstream.ok) {
      // Anthropic error shape: { type: "error", error: { type: "...", message: "..." } }
      // Normalize to a plain string so the client can always do json.error
      const errMsg = data?.error?.message ?? data?.error ?? `Anthropic API error ${upstream.status}`
      return new Response(JSON.stringify({ error: typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg) }), {
        status: upstream.status,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    })
  }
}
