# TrabajoFinalEfsi_Engelberg - Mascota Virtual

## Descripción del Proyecto
SPA desarrollada con React + Vite donde cada usuario cría una mascota virtual con hambre, energía y felicidad, animada mediante sprites pixelados.

## Stack Tecnológico
- **Frontend**: React 18 + Vite
- **Ruteo**: React Router DOM
- **Estado**: Context API
- **Persistencia**: LocalStorage
- **Deploy**: GitHub Pages

## Estructura del Proyecto
```
src/
├── components/          # Componentes reutilizables
├── contexts/           # Context API (User + Pet)
├── hooks/              # Custom hooks
├── pages/              # Páginas principales
├── utils/              # Utilidades y helpers
├── assets/             # Sprites e imágenes
└── styles/             # Estilos CSS
```

## Rutas Implementadas
- `/` - Estado resumido + sprite animado + barras de stats
- `/auth` - Login/registro simple
- `/alimentar` - Botón con cooldown visible
- `/jugar` - Minijuego breve
- `/dormir` - Acción con temporizador

## Reglas del Juego
- **Tick**: Cada 5 minutos (hambre-5, energía-3, felicidad-2)
- **Alimentar**: hambre +20, cooldown 60s
- **Jugar**: felicidad +15, energía -10, cooldown 60s
- **Dormir**: sleeping=true durante 30s → luego energía +25

## Instalación y Ejecución
```bash
npm install
npm run dev
```

## Deploy
El proyecto está configurado para GitHub Pages con base path `/mascota-virtual/`

## Recursos Gráficos
Los sprites utilizados provienen de bancos de assets gratuitos (por definir).

## Equipo
- Integrantes del grupo TrabajoFinalEfsi_Engelberg