# Simulador multiusuario · IA en seguros

Esta versión está pensada para publicarse como sitio estático en GitHub Pages y usar **Firebase Realtime Database** para sincronización en tiempo real entre administrador y equipos, sin necesidad de pasar a Firestore.

## Archivos principales

- `index.html`: landing para crear sesión y repartir accesos.
- `admin.html`: vista del facilitador.
- `team.html`: vista de cada equipo.
- `app-core.mjs`: reglas del juego, scoring e informes.
- `firebase-service.mjs`: conexión en tiempo real con Realtime Database.
- `firebase-config.js`: configuración de tu proyecto Firebase. **Acá pegás tu API info**.
- `database.rules.json`: reglas base sugeridas para workshop.
- `styles.css`: estilos.
- `tests/scoring.test.mjs`: pruebas del motor de scoring.

## Dónde pegar la configuración de Firebase

Abrí `firebase-config.js` y reemplazá los placeholders:

```js
export const firebaseConfig = {
  apiKey: 'PEGAR_API_KEY',
  authDomain: 'PEGAR_AUTH_DOMAIN',
  databaseURL: 'PEGAR_DATABASE_URL',
  projectId: 'PEGAR_PROJECT_ID',
  storageBucket: 'PEGAR_STORAGE_BUCKET',
  messagingSenderId: 'PEGAR_MESSAGING_SENDER_ID',
  appId: 'PEGAR_APP_ID',
};
```

`databaseURL` es obligatoria en esta versión porque la app usa Realtime Database.

## Puesta en marcha

1. Creá un proyecto Firebase y registrá una app web.
2. Creá una base de datos **Realtime Database** en modo de prueba.
3. En la pestaña **Rules**, pegá el contenido de `database.rules.json`.
4. Reemplazá los placeholders de `firebase-config.js` por la configuración real.
5. Publicá la carpeta completa en GitHub Pages.

## Importante sobre seguridad

Las reglas incluidas están pensadas para un workshop o piloto rápido. No son reglas endurecidas para producción. Para un despliegue más seguro conviene agregar autenticación, controles por rol y reglas más estrictas.

## Cómo correr tests

```bash
node tests/scoring.test.mjs
```

## Sugerencia de uso en clase

1. Crear la sesión desde `index.html`.
2. Compartir código de sesión y links de equipos.
3. Abrir cada ronda desde `admin.html`.
4. Proyectar el ranking en vivo en el cierre.
5. Usar el informe por equipo para el debrief.
