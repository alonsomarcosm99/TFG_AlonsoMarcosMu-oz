# Publicación estática del TFG

## Propósito

La publicación en GitHub Pages conserva la interfaz Angular del TFG y permite recorrer autenticación, gestión y ejecución de programas sin exponer el backend Plumber ni ejecutar código R recibido desde Internet.

## Arquitectura

La configuración `demo` reemplaza `environment.ts`, activa navegación con hash y registra `demo.interceptor.ts`. El interceptor responde a la lista cerrada de endpoints del frontend con fixtures en memoria. Cualquier endpoint no previsto devuelve 404 y nunca se delega a `localhost`.

La configuración local normal conserva el comportamiento original con Docker Compose y backend R.

## Despliegue

El workflow `.github/workflows/pages.yml` instala desde `package-lock.json`, ejecuta tests, construye Angular con `--configuration demo` y publica `proyecto/dist/proyecto/browser`.

URL prevista: `https://alonsomarcosm99.github.io/TFG_AlonsoMarcosMu-oz/`.

## Limitaciones

Login, registro, subida, borrado y ejecución son interacciones simuladas. La finalidad es enseñar la interfaz y el contrato funcional, no ofrecer ejecución remota pública.

Última verificación pública: 2026-06-22, respuesta HTTP 200 y workflow completo.
