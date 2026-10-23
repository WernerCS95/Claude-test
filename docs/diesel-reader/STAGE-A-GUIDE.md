# Diesel Reader — Stage A: "Can a camera read the pump?"

**Goal of Stage A:** one small camera board looks at the EHAD Classic 10's **LITRE** display and
writes down the reading. You run it for one week next to the normal paper log and compare.
If it reads correctly, we build the rest (Stages B–D). If not, you've spent about R500.

Nothing touches the pump itself — the camera looks at the display from outside.
**Do not open, drill or stick anything inside the dispenser** (it is a sealed, approved unit).

---

## 1. Shopping list

| # | Item | Notes | Approx. price |
|---|------|-------|---------------|
| 1 | **ESP32-CAM (AI-Thinker) with OV2640 camera** | Buy the bundle that includes the **ESP32-CAM-MB** USB board (small board it plugs onto — no soldering). **Buy 2** — cheap boards are sometimes faulty. | R180–R250 each |
| 2 | **microSD card, 8 or 16 GB** | Not bigger than 32 GB. Any brand. | R80 |
| 3 | **Micro-USB cable — a DATA cable** | Many cheap cables only charge. If the laptop doesn't "see" the board, try another cable first. | R50 |
| 4 | **5 V / 2 A USB wall charger** | Powers it at the pump. A good-quality one — weak chargers cause random restarts. | R100 |
| 5 | **3D printed hood + bracket** (you print) | PETG, **matte black**. See section 6. | your filament |
| 6 | Optional: **3M VHB double-sided tape** | To fix the bracket to the pump's outer panel without drilling. | R60 |

Where: Communica, Micro Robotics, DIYElectronics, RS, or Takealot (search "ESP32-CAM MB").

Total ≈ **R500–R700** with two boards.

---

## 2. What you're building (Stage A)

```
  [ EHAD display ]  <- 8–12 cm ->  [ camera in black hood ] --USB--> [ wall charger ]
                                          |
                                     microSD card (stores every reading)
```

The free program **"AI-on-the-edge-device"** (made for reading water/electricity meters)
takes a photo every 30–60 s, reads the digits, and logs them to the memory card.
No programming — it installs from a web browser.

> **Time stamps:** the board gets the date/time from the internet. For the Stage A test,
> switch on your **phone's hotspot** near the pump so it can set its clock (and so you can
> look at it live on your phone). The permanent no-Wi-Fi version (Stage C) adds a tiny
> clock module — we'll do that together later.

---

## 3. Prepare the memory card (on the laptop)

1. Put the microSD card in the laptop (use an adapter if needed).
2. Right-click the card → **Format** → File system **FAT32** → Start.
3. Open the project page: **github.com/jomjol/AI-on-the-edge-device** → on the right click
   **Releases** → open the newest release.
4. Download the file whose name contains **`manual-setup`** (a .zip).
5. Unzip it. Inside is a folder called **`sd-card`**. Open it and copy **everything inside it**
   onto the memory card (onto the card itself, not into a folder).
6. On the card, open **`wlan.ini`** with Notepad. Fill in your **phone hotspot** name and password:
   ```
   ssid = "YourPhoneHotspotName"
   password = "YourHotspotPassword"
   ```
   Save, then eject the card.

---

## 4. Put the program on the board (on the laptop, Chrome or Edge)

1. Push the **ESP32-CAM** onto the **MB** board (pins line up only one way; camera faces up).
   Check the little camera ribbon is clicked into its connector.
2. Plug the MB board into the laptop with the **data** cable.
3. In **Chrome** open: **jomjol.github.io/AI-on-the-edge-device** → click **Install** (web installer).
4. Pick the port that appears (e.g. "USB-SERIAL CH340") → **Install** → wait until it says done.
   - **Nothing appears?** Try another cable, then install the **CH340 driver** (search "CH340 driver Windows").
   - **Fails half-way?** Hold the **IO0** button on the MB board while you plug in, then try again.
5. Unplug. Put the **memory card** into the slot on the ESP32-CAM.

---

## 5. First start and setup (your phone)

1. Switch on your **phone hotspot**, then plug the board in (laptop USB or the wall charger).
2. In the phone's hotspot settings, look at **connected devices** — the board shows up with an
   IP address like `192.168.43.57`. Type that into the phone's browser.
3. The setup screens walk you through it:
   - **Reference image:** take a photo of the display (point the camera at the pump first —
     see section 6). Rotate/straighten it.
   - **Alignment marks:** pick two fixed spots on the panel (e.g. the "LITRE" word and a corner).
   - **Digits:** draw one box over **each digit of the LITRE row only** — not the SALE row.
     The display shows `0.00`, so the last **2** digits are decimals.
4. Set the reading interval to **30 seconds**.
5. **Stop here and send Claude a screenshot of the settings page** — the pump's number goes
   back to 0 on every fill, which a water meter never does, so a few settings must be changed.
   I'll tell you exactly which boxes to change.

---

## 6. The 3D printed hood / bracket

Print in **matte black PETG** (sun and diesel).

- **A short "tunnel" (hood)** from the camera to the display window, so no sun or overhead
  light reflects on the glass. Glare is the #1 reason readings fail.
- Camera **8–12 cm** from the display, square-on or **tilted a few degrees** (straight-on
  can reflect the camera's own LED).
- Holds the ESP32-CAM board with the **MB board left off** at the pump (it runs on 5 V via
  the MB board's USB, or you can keep the MB board on for easy power — simplest for now).
- Fixes to the **outside** of the panel with **VHB tape** or a clamp — **no drilling the pump**.
- Leave a slot for the USB cable and access to the memory card.

Tip: print a quick cardboard-thin test version first to find the right distance.

---

## 7. The one-week test

For 7 days:
1. Leave the camera running at the pump (phone hotspot on when you're there, so you can check).
2. Fill in the paper log **as normal**.
3. Each evening, open the board's web page → **Data / log** and compare its readings with the paper.

Write down per day: fills on paper / fills the camera got right / any misreads (and the time).

**Pass:** at least **19 out of 20** fills read correctly, day and night.
**Common fixes:** more hood (glare), switch the board's flash LED off or lower (night
reflection), move closer/further (focus), redraw the digit boxes.

Send Claude the results and a few photos from the camera — then we plan Stage B–D:
logging each fill with start/end, the vehicle photo, the end-of-day memory-card collect,
and the tablet screen that prints to the right book (cost to company / company expenses).
