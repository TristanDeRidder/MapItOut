# Amaralys Interactive Map

## Beschrijving

De Amaralys Interactive Map is een interactieve 3D webapplicatie gebaseerd op de boekenreeks **The Empyrean**. Dit project combineert moderne webtechnologieën om een meeslepende ervaring te creëren waarin gebruikers het continent Amaralys kunnen verkennen.

### Wat maakt dit project uniek?

- **Interactieve 3D-omgeving**: Gebouwd met React Three Fiber (R3F) voor realtime 3D rendering in de browser
- **Fysica-simulatie**: Rapier physics engine voor realistische interacties
- **Custom 3D-modellen**: Zelfgemaakte 3D-assets gecreëerd in Blender
- **Locatie-gebaseerde navigatie**: Points of Interest (POI) gemarkeerd met interactieve dolken op het continent
- **Dynamische pagina's**: Elke locatie heeft een eigen detailpagina met 3D-model en contextuele informatie

## ✨ Features

- **🎬 GSAP Animaties**

  - Vloeiende animaties bij het laden van pagina's
  - Smooth transitions bij navigatie tussen locaties
  - Geanimeerde camera bewegingen

- **🗺️ Interactieve Kaart**

  - Verken het continent Amaralys in 3D
  - Klik op dolken om verschillende Points of Interest te ontdekken
  - Intuïtieve navigatie met camera controls

- **📍 Points of Interest**

  - Gedetailleerde 3D-modellen van belangrijke locaties uit de boeken
  - Informatiekaarten met context en beschrijvingen
  - Immersieve presentatie van elke locatie

- **⚡ Physics Elementen**

  - Realistische physics op de Basgiath pagina
  - Interactieve objecten met Rapier physics engine

- **🎨 Visuele Effecten**
  - Bliksem effecten voor dramatische sfeer
  - Dynamische sky environments
  - Professionele lighting setup

## 🚀 Installatie & Gebruik

### Vereisten

- Node.js (versie 16 of hoger)
- npm of yarn package manager

### Installatie Stappen

1. **Clone of download het project**

   ```bash
   cd MapItOut
   ```

2. **Installeer dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   - De applicatie draait standaard op `http://localhost:5173`
   - Open deze URL in een moderne browser (Chrome, Firefox, Safari, Edge)

### Build voor productie

```bash
npm run build
```

De geoptimaliseerde productie build wordt gegenereerd in de `dist/` folder.

## 🛠️ Technologieën

- **Frontend Framework**: React 18 + TypeScript
- **3D Rendering**: React Three Fiber
- **3D Helpers**: @react-three/drei
- **Physics Engine**: @react-three/rapier
- **Animaties**: GSAP
- **Build Tool**: Vite
- **3D Modeling**: Blender
- **Styling**: CSS3
- **Deployment**: Vercel

## 📁 Project Structure

```
MapItOut/
├── public/
│   └── fonts/                    # Font bestanden
├── src/
│   ├── main.tsx                  # Applicatie entry point
│   ├── index.css                 # Globale styles
│   ├── global.d.ts               # TypeScript type declaraties
│   ├── assets/
│   │   └── sounds/               # Audio bestanden voor sfeer
│   ├── canvasses/                # 3D Canvas componenten
│   │   ├── Continent.tsx         # 3D canvas voor continent view
│   │   └── Locations.tsx         # 3D canvas voor locatie details
│   ├── components/               # Herbruikbare componenten
│   │   ├── Camera/
│   │   │   ├── ArcCamera.tsx     # Arc rotatie camera component
│   │   │   └── CameraPinned.tsx  # Gepinde camera component
│   │   ├── Lightning/
│   │   │   └── Lightning.tsx     # Bliksem effect component
│   │   ├── Loader/
│   │   │   └── RouteLoader.tsx   # Route loading component
│   │   ├── LocationCard/
│   │   │   └── LocationCard.tsx  # Locatie informatie card
│   │   └── Sky/
│   │       └── Sky.tsx            # Sky environment component
│   ├── data/                     # JSON data bestanden
│   │   ├── locations.json        # Locatie data en beschrijvingen
│   │   └── pins.json             # Pin posities en configuraties
│   ├── models/                   # 3D model bestanden (GLB/GLTF)
│   └── pages/                    # Route pagina componenten
│       ├── App.tsx               # Hoofd applicatie component & routing
│       ├── App.css               # App-specifieke styles
│       └── POI.tsx               # Point of Interest detail pagina
├── index.html                    # HTML entry point
├── package.json                  # NPM dependencies en scripts
├── vite.config.ts                # Vite build configuratie
├── tsconfig.json                 # TypeScript base configuratie
├── tsconfig.app.json             # TypeScript app-specifieke config
├── tsconfig.node.json            # TypeScript node configuratie
├── eslint.config.js              # ESLint code quality regels
└── vercel.json                   # Vercel deployment configuratie
```

## 🙏 Credits

### 3D Modellen

- **Eigen werk**: De meeste 3D modellen zijn zelfgemaakt in Blender
- **Tent model**: [Military Tent (Roman)](https://skfb.ly/oTVGN) door Mehdi Shahsavan
- **Tafel model**: [Medieval Table](https://skfb.ly/pxo8v) door Truogannn

### Inspiratie

- **The Empyrean Series** door Rebecca Yarros - Voor de wereldopbouw en locaties

## 📝 Licentie

Dit project is een educatieve eindopdracht voor Artevelde Hogeschool.
