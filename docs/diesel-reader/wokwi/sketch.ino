/*
  Leader Diesel Reader — HUB simulation (Wokwi)
  ------------------------------------------------
  Stand-ins (the simulator has no cameras):
    Slide switch  = nozzle (lifted / back in the holster)
    Knob (pot)    = the pump's LITRE display (CAM A "reads" it)
    Log line      = CAM B taking the vehicle photo
  Real parts: clock (time stamps), microSD (stores every fill),
              green LED (status), blue button (weekly "collect").
*/
#include <SPI.h>
#include <SD.h>
#include <Wire.h>
#include <RTClib.h>

const int PIN_NOZZLE = 26;   // slide switch -> LOW = nozzle lifted
const int PIN_BUTTON = 27;   // "Collect" button -> LOW = pressed
const int PIN_LED    = 2;    // green status LED
const int PIN_LITRES = 34;   // knob = litres display
const int PIN_SD_CS  = 5;    // microSD chip select
const float MAX_LITRES = 200.0;  // knob fully turned = 200.00 L
const char* LOG_FILE = "/fills.csv";

RTC_DS1307 rtc;
bool sdOk = false;
bool filling = false;
bool lastNozzleUp = false;
int potAtStart = 0;
int fillNo = 0;
DateTime fillStart;
String photoName;
unsigned long lastShow = 0, lastBlink = 0;
bool ledOn = false;

String two(int v){ return v < 10 ? String("0") + String(v) : String(v); }
String dateStr(const DateTime& t){ return String(t.year()) + "-" + two(t.month()) + "-" + two(t.day()); }
String timeStr(const DateTime& t){ return two(t.hour()) + ":" + two(t.minute()) + ":" + two(t.second()); }

// CAM A: the display starts at 0.00 when the nozzle lifts, then counts up.
// A pump display never counts DOWN during a fill, so a lower reading is
// treated as a misread and ignored — the highest reading is the fill.
float litresShown = 0;
float readLitres(){
  int d = analogRead(PIN_LITRES) - potAtStart;
  if(d < 0) d = 0;
  float now = d * MAX_LITRES / 4095.0;
  if(now > litresShown) litresShown = now;
  return litresShown;
}

bool nozzleUp(){ return digitalRead(PIN_NOZZLE) == LOW; }

void setup(){
  Serial.begin(115200);
  pinMode(PIN_NOZZLE, INPUT_PULLUP);
  pinMode(PIN_BUTTON, INPUT_PULLUP);
  pinMode(PIN_LED, OUTPUT);

  Serial.println("\n=== Leader Diesel Reader — hub ===");
  if(!rtc.begin()) Serial.println("!! Clock not found — check SDA/SCL wires");
  else if(!rtc.isrunning()) rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));

  sdOk = SD.begin(PIN_SD_CS);
  if(!sdOk) Serial.println("!! Memory card not found — check SD wires");
  else {
    if(!SD.exists(LOG_FILE)){
      File f = SD.open(LOG_FILE, FILE_WRITE);
      f.println("fill,date,start,end,litres,photo");
      f.close();
    }
    File f = SD.open(LOG_FILE);
    while(f.available()) if(f.read() == '\n') fillNo++;
    f.close();
    fillNo = max(0, fillNo - 1);   // minus the header line
  }
  DateTime now = rtc.now();
  Serial.println("Clock: " + dateStr(now) + " " + timeStr(now));
  Serial.println("Fills on the card so far: " + String(fillNo));
  Serial.println("\nHow to use: turn the knob to 0, flip the switch (nozzle lifted),");
  Serial.println("turn the knob up (diesel flowing), flip it back (nozzle in).");
  Serial.println("Press the blue button to collect the week's fills.\n");
  lastNozzleUp = nozzleUp();
  digitalWrite(PIN_LED, HIGH);   // steady on = ready
}

void startFill(){
  filling = true;
  potAtStart = analogRead(PIN_LITRES);
  litresShown = 0;
  fillStart = rtc.now();
  photoName = "IMG_" + String(fillStart.year()) + two(fillStart.month()) + two(fillStart.day()) + "_" +
              two(fillStart.hour()) + two(fillStart.minute()) + two(fillStart.second()) + ".jpg";
  Serial.println("▶ Nozzle lifted " + timeStr(fillStart) + " — display reset to 0.00 L");
  Serial.println("📷 CAM B: vehicle photo saved as " + photoName);
}

void endFill(){
  filling = false;
  float litres = readLitres();
  DateTime end = rtc.now();
  digitalWrite(PIN_LED, HIGH);
  if(litres < 0.05){
    Serial.println("■ Nozzle back — no diesel issued, nothing saved.\n");
    return;
  }
  fillNo++;
  String line = String(fillNo) + "," + dateStr(fillStart) + "," + timeStr(fillStart) + "," +
                timeStr(end) + "," + String(litres, 2) + "," + photoName;
  if(sdOk){
    File f = SD.open(LOG_FILE, FILE_APPEND);
    f.println(line);
    f.close();
  }
  Serial.println("■ Nozzle back " + timeStr(end) + " — FILL #" + String(fillNo) + ": " + String(litres, 2) + " L");
  Serial.println(sdOk ? "💾 Saved to memory card\n" : "!! NOT saved — no memory card\n");
}

void collect(){
  Serial.println("\n===== WEEKLY COLLECT (what the tablet would download) =====");
  if(!sdOk){ Serial.println("No memory card."); return; }
  File f = SD.open(LOG_FILE);
  float total = 0; int n = 0; bool header = true;
  String row = "";
  while(f.available()){
    char c = f.read();
    if(c == '\r') continue;
    if(c != '\n'){ row += c; continue; }
    Serial.println(row);
    if(!header){
      int a = 0; for(int i = 0; i < 4; i++) a = row.indexOf(',', a) + 1;
      total += row.substring(a, row.indexOf(',', a)).toFloat(); n++;
    }
    header = false; row = "";
  }
  f.close();
  Serial.println("Total: " + String(n) + " fill(s), " + String(total, 2) + " L");
  Serial.println("============================================================\n");
}

void loop(){
  bool up = nozzleUp();
  if(up != lastNozzleUp){
    delay(30);                      // ignore switch bounce
    up = nozzleUp();
    if(up != lastNozzleUp){
      lastNozzleUp = up;
      if(up && !filling) startFill();
      else if(!up && filling) endFill();
    }
  }

  if(filling){
    if(millis() - lastShow > 1000){ lastShow = millis(); Serial.println("   CAM A reads display: " + String(readLitres(), 2) + " L"); }
    if(millis() - lastBlink > 250){ lastBlink = millis(); ledOn = !ledOn; digitalWrite(PIN_LED, ledOn); }  // blinking = filling
  }

  if(digitalRead(PIN_BUTTON) == LOW){
    collect();
    while(digitalRead(PIN_BUTTON) == LOW) delay(10);
  }
  delay(10);
}
