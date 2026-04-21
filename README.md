# VANNY Games Vault

Una app web con varios juegos casuales para reunirse con amigos. Pensada para usar desde el celular, sin instalar nada, sin cuenta.

Hecha con Next.js, TypeScript, Tailwind CSS y Pusher.

---

## Juegos incluidos

### 🎭 El Juego del Impostor
Uno de los jugadores es el impostor secreto: los demás saben una palabra (por ejemplo, *Volcán*) y tienen que descubrir quién no la sabe antes de que se acabe el tiempo.

- **15 categorías · 2-8 jugadores · Local + Online**
- Modo "Un dispositivo": se pasan el celular de mano en mano.
- Modo "Online": cada uno desde su celular, con código de sala.
- Opcional: "Impostor a ciegas" — el impostor tampoco ve la categoría.

### ❓ ¿Quién Soy?
Cada jugador recibe una palabra/personaje secreta de una categoría. Háganse preguntas cara a cara o por chat externo y traten de adivinar lo que tiene el otro.

- **15 categorías · 2-6 jugadores · Local + Online**
- Cuando un jugador adivina lo que tiene otro, suma 1 punto. Si falla, pierde 1 (mín 0).
- Comparación flexible: ignora mayúsculas, tildes, espacios y permite hasta 2 errores de tipeo.
- Dos modos de victoria: "primero a X puntos" o "X rondas".
- Tiempo configurable por ronda (2 a 10 minutos).

---

## 1. Cómo probarlo en tu computadora

Necesitás tener instalado **Node.js 18 o mayor**. Si no lo tenés, andá a [nodejs.org](https://nodejs.org) y bajá la versión LTS.

Abrí una terminal en la carpeta del proyecto y corré:

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000). Los modos **locales** funcionan sin configurar nada. Para los modos online te conviene hacer el paso 2.

---

## 2. Configurar Pusher (para el modo online en tiempo real)

El modo online puede funcionar con "polling" (consultar cada 2-3 segundos), pero es mucho más lindo con sincronización instantánea. Pusher te da eso gratis.

### 2.1. Crear cuenta en Pusher

1. Entrá a [https://pusher.com](https://pusher.com) y hacé clic en **Sign up**. Te podés registrar con Google.
2. Una vez adentro, vas a ver el panel de Pusher.

### 2.2. Crear una "app"

1. En el menú de la izquierda entrá a **Channels**.
2. Hacé clic en **Create app**.
3. **Name**: poné `vanny-games-vault` (o lo que quieras).
4. **Cluster**: elegí el más cercano a tus amigos. Si están en Sudamérica elegí `sa1` (São Paulo) o `us2` (Ohio). Para Europa `eu`.
5. Ignorá las demás opciones y hacé clic en **Create app**.

### 2.3. Copiar las claves

Dentro de la app, andá a la pestaña **App Keys**. Copiá `app_id`, `key`, `secret`, `cluster`.

En la carpeta del proyecto, creá un archivo `.env.local` con:

```
NEXT_PUBLIC_PUSHER_KEY=la_key_que_copiaste
NEXT_PUBLIC_PUSHER_CLUSTER=sa1
PUSHER_APP_ID=el_app_id
PUSHER_SECRET=el_secret
```

Reiniciá el servidor (Ctrl+C y `npm run dev` de vuelta). El online ahora sincroniza en tiempo real para los dos juegos.

---

## 3. Subirlo a Vercel

Vercel te deja publicar gratis con una URL tipo `vanny-games-vault.vercel.app`.

### 3.1. Subir el código a GitHub

```bash
git init
git add .
git commit -m "Primera versión"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/vanny-games-vault.git
git push -u origin main
```

### 3.2. Importar a Vercel

1. Entrá a [vercel.com](https://vercel.com) y registrate con GitHub.
2. **Add New → Project**, elegí el repo, **Import**.
3. En **Environment Variables** pegá las 4 claves de Pusher.
4. **Deploy**. En 30-60 segundos te da la URL.

Cualquier amigo abre la URL en su celular. El anfitrión crea la sala y comparte el link (hay un botón **Compartir** que usa el menú nativo). Listo.

---

## Estructura

```
src/app/
  page.tsx                       # Hub: cards con los juegos disponibles
  impostor/
    local/                       # Juego del impostor en un dispositivo
    online/                      # Crear/entrar a sala online
    sala/[codigo]/               # Sala online
  quien-soy/
    local/                       # ¿Quién Soy? en un dispositivo
    online/
    sala/[codigo]/
  api/
    impostor/sala/...            # API del impostor
    quien-soy/sala/...           # API de ¿Quién Soy?
src/components/
  juego/                         # Componentes del impostor (local)
  online/                        # Componentes del impostor (online)
  quien-soy/                     # Componentes de ¿Quién Soy?
  ui/                            # Sistema de diseño compartido
src/lib/
  palabras.ts                    # Las 15 categorías con palabras (compartido)
  utils.ts                       # Helpers + esMismaPalabra (fuzzy match)
```

Las rutas viejas (`/local`, `/online`, `/sala/:codigo`) redirigen automáticamente a `/impostor/...`.

---

## Tips

- Las salas online se autodestruyen después de 4 horas sin actividad.
- En "¿Quién Soy?" la comparación es flexible: si la palabra es "Leonardo da Vinci", aceptan "leonardo da vinci", "davinci", "da vinci", etc.
- Modo experto del impostor: "Impostor a ciegas" — ni siquiera ve la categoría.

## Resolución de problemas

- **"No se pudo cargar la sala"** → el servidor se reinició (el estado vive en memoria). Volvé a crear la sala.
- **El online va lento** → Pusher no está configurado. Seguí el paso 2.

---

Hecho para pasar una buena noche con amigos.
