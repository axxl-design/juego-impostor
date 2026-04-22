# VANNY Games Vault

Una app web con varios juegos casuales para reunirse con amigos. Pensada para usar desde el celular, sin instalar nada, sin cuenta.

Hecha con Next.js, TypeScript, Tailwind CSS y Pusher.

---

## Juegos incluidos

### 🎭 El Juego del Impostor
Uno de los jugadores es el impostor secreto: los demás saben una palabra (por ejemplo, *Volcán*) y tienen que descubrir quién no la sabe antes de que se acabe el tiempo.

- **15 categorías · 3-10 jugadores · Local + Online**
- Modo "Un dispositivo": se pasan el celular de mano en mano.
- Modo "Online": cada uno desde su celular, con código de sala.
- El impostor ve la categoría pero no la palabra. Puede arriesgarse a adivinar y ganar instantáneamente.

**Reglas extra (opt-in, se combinan libremente):**

- 💡 **Pistas** · El impostor puede pedir hasta 3 pistas (letra inicial, cantidad de letras, palabra relacionada) pagando 1 pt c/u. Los civiles pueden pedir un contexto colectivo 1 vez por ronda.
- 🏆 **Puntaje persistente** · Se suman puntos ronda a ronda con leaderboard (+3 civil correcto, +5 impostor sobreviviente, +7 impostor que adivina, +1 víctima).
- 🎯 **Robo de puntos** · El civil que vota bien le roba 2 pts al impostor. Requiere Puntaje persistente.
- ⚡ **Poderes aleatorios** · 1-2 jugadores reciben un poder secreto por ronda (Vidente, Escudo, Doble agente, Traductor).
- 💬 **Preguntas sugeridas** · Panel plegable con preguntas neutras para romper el hielo.
- 👑 **Jefe Final cada 5 rondas** · Ronda especial con 2 impostores, categoría Mezcla total y puntaje x2. Requiere Puntaje persistente.

### 🎴 VANNY Deal
Juego de cartas multijugador inspirado en Monopoly Deal, ambientado en el universo VANNY. Cada turno **robás 2 cartas, jugás hasta 3**, y descartás si quedás con más de 7 en la mano. Ganás al completar 3 sets de colores distintos (modo Clásico) o 2 (modo Rápido).

- **2-5 jugadores · Solo online · 2 modos**
- **Mazo de 91 cartas** — 28 propiedades en 10 grupos de colores + 2 servicios, 20 cartas de dinero, 33 cartas de acción (15 tipos distintos), 3 Casas, 2 Torres, 8 comodines bicolor y 2 arcoíris.
- **Condiciones de victoria configurables:** 3 sets, 2 sets, por tiempo (15 min, gana mayor valor en mesa+banco), o por valor total en millones.
- **Tiempo por turno configurable:** 30/60/90s o sin límite.
- **15 cartas especiales** (todas adaptadas con temática VANNY): Renta Universal, Renta Bicolor, Cumpleaños VANNY, Impuesto Imperial, ¡Pasá Conmigo!, Robo Selectivo, Intercambio Forzado, Asalto al Monopolio, No Gracias (con cascadas de NG sobre NG), Casa/Torre, Espionaje (ver mano ajena 10s), Auditoría Fiscal, Megáfono Viral (duplica próxima acción), Juicio Popular (votación 15s).
- **Reconexión con localStorage:** si se te corta, volvés a entrar al mismo link y seguís. Si el host se va, otro jugador asume el rol.
- **Toda la lógica corre en servidor:** cliente solo emite intenciones, servidor valida turno, carta, pago, idempotencia por actionId.
- **Estilo visual comic/cartoon** en las cartas: bordes gruesos, sombras duras, emojis grandes, paleta viva por tipo.

### ❓ ¿Quién Soy?
Cada jugador recibe una palabra/personaje secreta de una categoría. Háganse preguntas cara a cara o por chat externo y traten de adivinar lo que tiene el otro.

- **15 categorías · 2-6 jugadores · Local + Online**
- Cuando un jugador adivina lo que tiene otro, suma 1 punto. Si falla, pierde 1 (mín 0).
- Comparación flexible: ignora mayúsculas, tildes, espacios y permite hasta 2 errores de tipeo.
- Dos modos de victoria: "primero a X puntos" o "X rondas".

**Reglas extra (opt-in):**

- 💡 **Pistas** · Cada jugador puede pedir hasta 3 pistas sobre su propia palabra. Cada una cuesta 1 pt (mín 1 pt para pedirla).
- 🛡️ **Escudo comprable** · Con 5+ pts podés comprar un escudo por 2 pts. Evita el próximo fallo.

---

## En desarrollo / Pausado

### 🌍 Vidas
RPG narrativo de vida entera (3 mundos, 1-2 jugadores, local + online con IA opcional). El prototipo está hecho pero pausado para liberar bundle y enfocar el trabajo en otros juegos.

El código completo vive en `src/_paused/vidas/` — Next.js ignora carpetas con prefijo `_`, y `tsconfig.json` excluye `src/_paused/**` del type-check. Para retomar el juego:

1. Mover `src/_paused/vidas/app/vidas` → `src/app/vidas`
2. Mover `src/_paused/vidas/api/vidas` → `src/app/api/vidas`
3. Mover `src/_paused/vidas/lib/*` → `src/lib/`
4. Mover `src/_paused/vidas/components/vidas` → `src/components/vidas`
5. Reagregar la card en `src/app/page.tsx` y reactivar la sección en este README.

### Sistema de pistas: enriquecer palabras

Las palabras de `src/lib/palabras.ts` se pueden enriquecer en `src/lib/palabras-meta.ts` con dos campos opcionales por palabra:

- `relacionada` — palabra asociada que aparece como pista nivel 3 del impostor (ej: "Messi" → "Argentina").
- `contextoCivil` — descripción corta para los civiles sin revelar la palabra (ej: "Deportista argentino, uno de los más destacados de su disciplina").

No hace falta enriquecer las 2700+ palabras: si no hay meta, el sistema usa fallbacks automáticos por categoría.

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

## 4. Configurar almacenamiento compartido (MUY IMPORTANTE si ya deployaste)

Si tus amigos a veces reciben **"Sala no encontrada"** aunque la sala exista, es porque Vercel corre tu código en varias instancias distintas: la sala se crea en una, y el segundo jugador cae en otra que no la ve. Se arregla guardando las salas en una base de datos compartida. Es gratis con Upstash.

### 4.1. Crear cuenta en Upstash

1. Entrá a [console.upstash.com](https://console.upstash.com) y hacé clic en **Sign up**. Registrate con Google o GitHub (lo más rápido).
2. Aceptá los términos.

### 4.2. Crear la base de datos Redis

1. En el panel, hacé clic en **Create Database**.
2. **Name**: poné `vanny-salas` (o lo que quieras).
3. **Primary Region**: elegí la más cercana a vos. Si estás en Sudamérica, elegí `South America (São Paulo)`. Si no, `US East (N. Virginia)` anda bien.
4. **Type**: dejá `Regional` (la opción por defecto).
5. Hacé clic en **Create**.

### 4.3. Copiar las claves

1. Al abrir la base, bajá a la sección **REST API**.
2. Vas a ver dos líneas que dicen `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN`. Hay un botón de copiar al lado de cada una.

### 4.4. Pegar las claves en Vercel

1. Entrá a tu proyecto en [vercel.com](https://vercel.com).
2. **Settings → Environment Variables**.
3. Agregá dos variables nuevas:
   - Nombre: `UPSTASH_REDIS_REST_URL` — Valor: la URL que copiaste.
   - Nombre: `UPSTASH_REDIS_REST_TOKEN` — Valor: el token que copiaste.
4. Asegurate que estén marcadas para **Production**, **Preview** y **Development**.
5. Guardá.

### 4.5. Redeployar

En Vercel, andá a **Deployments**, abrí el último y hacé clic en los tres puntos `...` → **Redeploy**. En un minuto queda actualizado.

Listo. Ahora las salas viven en Redis y funcionan entre todas las instancias. El bug de "Sala no encontrada" desaparece.

> **Nota:** si no configurás Upstash, la app sigue funcionando con un "Map en memoria" — está bien para jugar solo con una persona más en la misma ventana, pero con amigos reales en producción podés tener fallos. Seguí los pasos de arriba.

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
  vanny-deal/
    page.tsx                     # Landing del juego de cartas
    sala/[codigo]/               # Sala online (lobby + mesa + overlays)
  api/
    impostor/sala/...            # API del impostor
    quien-soy/sala/...           # API de ¿Quién Soy?
    vanny-deal/
      sala/crear                 # POST crear sala
      sala/[codigo]              # GET estado público
      sala/[codigo]/mano         # GET mano privada (por jugadorId)
      sala/[codigo]/accion       # POST acciones (dispatch de todo)
src/components/
  juego/                         # Componentes del impostor (local)
  online/                        # Componentes del impostor (online)
  quien-soy/                     # Componentes de ¿Quién Soy?
  ui/                            # Sistema de diseño compartido
src/lib/
  palabras.ts                    # Las 15 categorías con palabras (compartido)
  utils.ts                       # Helpers + esMismaPalabra (fuzzy match)
  vanny-deal/                    # Motor del juego de cartas
    types.ts                     # Todos los tipos del juego
    colores.ts                   # 10 grupos de colores + 2 servicios, rentas
    mazo.ts                      # Construcción del mazo (91 cartas)
    utils.ts                     # Helpers (renta, sets completos, shuffle determinista)
    motor.ts                     # Acciones base (lobby, jugar propiedad/dinero, pagar, etc.)
    acciones.ts                  # 15 cartas especiales + No Gracias en cascada + Juicio + Espionaje
  sala-store-vanny-deal.ts       # Persistencia (Upstash) + dispatch de acciones
  use-sala-vanny-deal.ts         # Hook cliente (Pusher + polling + mano privada)
src/_paused/                     # Código pausado, NO compila (excluido en tsconfig)
  vidas/                         # RPG narrativo, listo para retomar
```

Las rutas viejas (`/local`, `/online`, `/sala/:codigo`) redirigen automáticamente a `/impostor/...`.

---

## Tips

- Las salas online se autodestruyen después de 4 horas sin actividad.
- En "¿Quién Soy?" la comparación es flexible: si la palabra es "Leonardo da Vinci", aceptan "leonardo da vinci", "davinci", "da vinci", etc.
- Las reglas extra son todas opcionales: si no activás ninguna, los juegos funcionan igual de simples que siempre.
- El ícono **?** del header abre el modal "Cómo jugar" con todas las reglas explicadas.

## Resolución de problemas

- **"Sala no encontrada" aunque la sala exista** → estás en Vercel y no configuraste Upstash. Seguí el paso 4.
- **"No se pudo cargar la sala"** → el servidor se reinició (si no usás Upstash, el estado vive en memoria). Volvé a crear la sala, o configurá Upstash (paso 4).
- **El online va lento** → Pusher no está configurado. Seguí el paso 2.

---

Hecho para pasar una buena noche con amigos.
