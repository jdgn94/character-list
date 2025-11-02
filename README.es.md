# Instrucciones para iniciar el servidor Character List API

## Requisitos
- Node.js >= 18
- pnpm o npm
- pm2 instalado globalmente (`npm install -g pm2`)

## Instalación

1. Clona el repositorio y entra en la carpeta del proyecto:
   ```bash
   cd /home/jdgn/Code/characterList/api
   ```
2. Instala las dependencias:
   ```bash
   pnpm install
   # o
   npm install
   ```
3. Configura el archivo `.env` con tus credenciales:
   ```env
   PORT=3000
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=changeme
   DB_NAME=character_list
   TELEGRAM_API_KEY=tu-api-key-telegram
   CLOUDYNARI_API_KEY=tu-api-key-cloudynari
   CLOUDYNARI_API_URL=https://api.cloudynari.example
   ```

## Iniciar en modo desarrollo con pm2

```bash
pm2 start ecosystem.config.js
pm2 logs character-list-api-dev
```

## Iniciar sin pm2 (modo desarrollo)

```bash
pnpm start:dev
# o
npm run start:dev
```

## Iniciar en producción (opcional)

1. Compila el proyecto:
   ```bash
   pnpm build
   # o
   npm run build
   ```
2. Ejecuta el servidor:
   ```bash
   node dist/main.js
   # o con pm2 (agrega un entry en ecosystem.config.js si lo deseas)
   ```

## Notas
- El archivo `.env` no debe subirse al repositorio.
- Revisa los logs en la carpeta `logs/`.
- Para detener el servidor con pm2:
  ```bash
  pm2 stop character-list-api-dev
  ```
