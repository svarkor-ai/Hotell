# PLAN: Sea View Hotel — Förbättringar

## GOAL
Förbättra Sea View Hotel-webbplatsen med: (1) riktiga rumsbilder, (2) förbättrad kalender, (3) hero-sektion, dark mode och micro-animationer.

## ACCEPTANCE
- Rumsbilder visas på alla rumskort och i detaljmodaler
- Kalender visar tillgänglighet per rum med klickbara datum
- Hero-sektion syns på startsidan
- Dark mode-toggle fungerar
- Alla CSS-gradients ersatta med `<img>` där det behövs

## MODULER (i sekvens)

### T1: Rumsbilder (P0)
- Ladda ner 4 royalty-free bilder från Unsplash (single/double/four_person + hero)
- Skapa `/static/images/rooms/` mapp
- Uppdatera `rooms.js` för att använda `<img>` istället för gradient
- Uppdatera `index.html` med hero-sektion
- Uppdatera `booking-flow.js` med bilder i bokningsmodal
- Uppdatera `design-system.css` för bild-stilar

### T2: Kalender förbättring (P0)
- Uppdatera `calendar.js` för per-rum-vy istället för matris
- Lägg till klickbara datum (in/check → check-out)
- Lägg till visuellt feedback för valda datum
- Förbättra legend och rumssortering

### T3: Hero, Dark Mode & Micro-animationer (P1)
- Hero-sektion med stort bild
- Dark mode-toggle-knapp
- Smooth transitions och hover-effekter
- Förbättrad footer

## FILER ATT ÄNDRA
- static/js/calendar.js
- static/js/rooms.js
- static/js/booking-flow.js
- static/css/design-system.css
- static/css/style.css
- templates/index.html
- static/images/rooms/ (ny)
