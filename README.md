# Gestió de Contactes — Projecte RA2

Aplicació web per gestionar contactes personals amb agenda integrada.

**Mòdul:** 0373 — Desenvolupament Web en Entorn Client  
**Curs:** 2025-2026

## Tecnologies

- Vue 3 + Composition API + TypeScript
- PrimeVue 4 (tema Aura)
- Axios + json-server (Fake API)
- Vitest (tests unitaris)
- Vue Router 4

## Requisits previs

- Node.js v18+
- npm v9+

## Instal·lació

```bash
npm install
```

## Execució

Cal tenir **dues terminals obertes** simultàniament:

```bash
# Terminal 1 — API (json-server, port 3001)
npx json-server db.json --port 3001

# Terminal 2 — App (Vite, port 5173)
npm run dev
```

Obre el navegador a `http://localhost:5173`

## Tests

```bash
npm run test
```

## Build de producció

```bash
npm run build
```

## Funcionalitats

- CRUD de contactes amb validació 
- CRUD de grups amb selector de color
- Historial de crides i missatges
- Gestió de favorits
- Filtres per nom, grup i ordenació
- Estadístiques amb computed properties