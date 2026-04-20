# Juego del Impostor

Una app web para jugar con amigos. Un jugador es el impostor secreto: los demás saben una palabra (por ejemplo, "Volcán") y tienen que descubrir quién no la sabe antes de que se acabe el tiempo.

- **Modo "Un dispositivo"**: se pasan el celular de mano en mano. No necesita internet, ni cuenta, ni nada.
- **Modo "Online"**: cada uno desde su celular. Uno crea la sala, los demás entran con un link.

Hecho con Next.js, TypeScript, Tailwind CSS y Pusher.

---

## 1. Cómo probarlo en tu computadora (sin internet)

Necesitás tener instalado **Node.js 18 o mayor**. Si no lo tenés, andá a [nodejs.org](https://nodejs.org) y bajá la versión LTS.

Abrí una terminal en la carpeta del proyecto (`juego-impostor`) y corré:

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) en el navegador. El **modo "Un dispositivo" funciona sin configurar nada**. Para el modo online te conviene hacer el paso 2.

---

## 2. Configurar Pusher (para el modo online en tiempo real)

El modo online puede funcionar con "polling" (consultar cada 2-3 segundos), pero es mucho más lindo con sincronización instantánea. Pusher te da eso gratis.

### 2.1. Crear cuenta en Pusher

1. Entrá a [https://pusher.com](https://pusher.com) y hacé clic en **Sign up** (arriba a la derecha). Te podés registrar con Google.
2. Una vez adentro, vas a ver el panel de Pusher.

### 2.2. Crear una "app"

1. En el menú de la izquierda entrá a **Channels**.
2. Hacé clic en **Create app**.
3. **Name**: poné `juego-impostor` (o lo que quieras).
4. **Cluster**: elegí el más cercano a tus amigos. Si están en Sudamérica elegí `sa1` (São Paulo) o `us2` (Ohio). Para Europa `eu`.
5. Ignorá las demás opciones y hacé clic en **Create app**.

### 2.3. Copiar las claves

Dentro de la app, andá a la pestaña **App Keys**. Vas a ver 4 datos: `app_id`, `key`, `secret`, `cluster`.

En la carpeta del proyecto, copiá el archivo `.env.local.example` y renombralo a `.env.local`. Abrilo con cualquier editor de texto y pegá los valores así:

```
NEXT_PUBLIC_PUSHER_KEY=la_key_que_copiaste
NEXT_PUBLIC_PUSHER_CLUSTER=sa1
PUSHER_APP_ID=el_app_id
PUSHER_SECRET=el_secret
```

Guardá, y reiniciá el servidor (cortá `npm run dev` con Ctrl+C y volvé a ejecutarlo).

¡Listo! El modo online ahora sincroniza en tiempo real.

---

## 3. Subirlo a Vercel (para jugar desde cualquier celular)

Vercel te deja publicar el juego gratis con una URL tipo `juego-impostor.vercel.app`.

### 3.1. Subir el código a GitHub

1. Si no tenés cuenta, creala en [github.com](https://github.com).
2. Creá un repositorio nuevo (podés llamarlo `juego-impostor`, elegí **Private** si no querés que lo vea nadie).
3. En la terminal, dentro de la carpeta del proyecto:

```bash
git init
git add .
git commit -m "Primera versión"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/juego-impostor.git
git push -u origin main
```

### 3.2. Importar a Vercel

1. Entrá a [vercel.com](https://vercel.com) y registrate con tu cuenta de GitHub.
2. Hacé clic en **Add New → Project**.
3. Elegí el repositorio `juego-impostor` y dale **Import**.
4. En **Environment Variables** pegá las 4 claves de Pusher (las mismas que pusiste en `.env.local`).
5. **Deploy**. En 30-60 segundos te da la URL.

### 3.3. Compartirlo

Cualquier amigo abre la URL en su celular. El anfitrión crea la sala y comparte el link (hay un botón **Compartir** que usa el menú nativo del celular). Listo: pueden jugar desde cualquier lugar.

---

## Tips para jugar

- Mínimo 3 jugadores, máximo 10.
- La dificultad **Fácil** es ideal para las primeras rondas. Subí a **Medio** cuando se aburran.
- El modo "**Impostor a ciegas**" es brutal: el impostor no ve ni la categoría. Muy difícil para quien le toque, pero muy divertido.
- La sala online se autodestruye después de 4 horas sin actividad.

## Resolución de problemas

- **"No se pudo cargar la sala"** → el servidor se reinició (el estado vive en memoria). Volvé a crear la sala.
- **El online va lento** → Pusher no está configurado. Seguí el paso 2.
- **Node.js no lo tengo** → bajalo en [nodejs.org](https://nodejs.org).

---

Hecho para pasar una buena noche con amigos.
