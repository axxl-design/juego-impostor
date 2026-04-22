import type { Carta } from "./types";

export const CARTAS_PAREJA: Carta[] = [
  // ============ MEDIEVAL ============
  {
    id: "med-par-01",
    mundo: "medieval",
    rolesRelevantes: [],
    etapaMax: "juventud",
    soloRelacion: "pareja",
    titulo: "Propuesta de matrimonio",
    descripcion:
      "Después de meses de cortejo, tu compañero/a de vida te lleva al río. Lleva un anillo que su abuela le heredó. Va a preguntar.",
    icono: "💍",
    tags: ["amor", "familia"],
    opciones: [
      {
        texto: "Aceptar con lágrimas.",
        efectos: { karma: 8, salud: 10, vinculo: 15 },
        consecuenciaTexto:
          "Se abrazan al río. Esa noche, la noticia recorre el pueblo. Sus familias los esperan con vino y pan.",
      },
      {
        texto: "Pedir tiempo para pensar.",
        efectos: { karma: 0, vinculo: -6 },
        consecuenciaTexto:
          "Él/ella guarda el anillo en silencio. La cena esa noche es tensa. Lo hablan tres veces más antes de decidir.",
      },
      {
        texto: "Aceptar pero pedir una boda pequeña, sin presiones familiares.",
        efectos: { karma: 5, vinculo: 10, riqueza: 5 },
        consecuenciaTexto:
          "Se casan en la capilla del bosque. Diez personas. El recuerdo más honesto de sus vidas.",
      },
      {
        texto: "Rechazar y explicar que no estás listo/a.",
        efectos: { karma: -5, salud: -5, vinculo: -15 },
        consecuenciaTexto:
          "Él/ella se aleja un tiempo. Vuelven a hablar. La confianza se quebró. Quizás se reconstruya. Quizás no.",
      },
    ],
  },
  {
    id: "med-par-02",
    mundo: "medieval",
    rolesRelevantes: [],
    etapaMin: "madurez",
    etapaMax: "madurez",
    soloRelacion: "pareja",
    titulo: "Pérdida de un hijo en común",
    descripcion:
      "Un hijo/a mutuo/a muere en la infancia por fiebres. El dolor los agarra de maneras distintas.",
    icono: "🕯️",
    tags: ["familia", "muerte", "dramatica"],
    opciones: [
      {
        texto: "Acompañarlo/a en el duelo, abrir tu propio dolor.",
        efectos: { karma: 15, salud: -15, vinculo: 12 },
        consecuenciaTexto:
          "Meses de llanto compartido. Algo los une para siempre. Sobreviven con una cicatriz común.",
      },
      {
        texto: "Cerrarse en uno mismo y trabajar más.",
        efectos: { karma: -3, salud: -10, vinculo: -12 },
        consecuenciaTexto:
          "Él/ella se siente solo/a. El matrimonio se enfría. Años después es solo costumbre.",
      },
      {
        texto: "Buscar un nuevo hijo/a pronto.",
        efectos: { karma: 5, salud: -5, vinculo: 3 },
        consecuenciaTexto:
          "Llega otro al año. Los revive a ambos. El primero sigue presente, siempre, como un silencio entre ustedes.",
      },
      {
        texto: "Peregrinar juntos a un santuario distante.",
        efectos: { karma: 10, salud: -8, riqueza: -10, vinculo: 10 },
        consecuenciaTexto:
          "Tres meses de camino. Llegan juntos. No saben si les funcionó, pero vuelven un poco más parados.",
      },
    ],
  },
  {
    id: "med-par-03",
    mundo: "medieval",
    rolesRelevantes: [],
    etapaMin: "madurez",
    etapaMax: "madurez",
    soloRelacion: "pareja",
    titulo: "Rumores de infidelidad",
    descripcion:
      "Llegan a tu pareja rumores de que vos estuviste con alguien más. No son ciertos — pero son creíbles.",
    icono: "🗣️",
    tags: ["amor", "traicion", "dramatica"],
    opciones: [
      {
        texto: "Enfrentar los rumores abiertamente con tu pareja.",
        efectos: { karma: 10, vinculo: 8 },
        consecuenciaTexto:
          "Charla larga. Te creen. La confianza sale más fuerte. Pero algo se estiró en el medio.",
      },
      {
        texto: "Ignorar los rumores y seguir como si nada.",
        efectos: { karma: -3, vinculo: -10 },
        consecuenciaTexto:
          "Él/ella asume cosas. La distancia crece. Un día la pregunta estalla sin aviso y ya es tarde.",
      },
      {
        texto: "Rastrear al que esparció los rumores y confrontarlo.",
        efectos: { karma: 5, influencia: 3, vinculo: 5 },
        consecuenciaTexto:
          "Un antiguo pretendiente celoso. Se retracta en público. La pareja se ríe al final, amargamente.",
      },
      {
        texto: "Usar los rumores como excusa para buscar consuelo en otro lado.",
        efectos: { karma: -20, vinculo: -20 },
        consecuenciaTexto:
          "Convertís una mentira en verdad. Cuando se descubre, no hay vuelta atrás. La historia la contarán otros.",
      },
    ],
  },
  {
    id: "med-par-04",
    mundo: "medieval",
    rolesRelevantes: [],
    etapaMin: "vejez",
    soloRelacion: "pareja",
    titulo: "El invierno de la vejez",
    descripcion:
      "Tu pareja está más frágil que vos. El invierno es crudo. Hay que elegir: medicinas caras para él/ella o leña suficiente para el mes.",
    icono: "❄️",
    tags: ["familia", "dramatica"],
    opciones: [
      {
        texto: "Priorizar las medicinas. Vos aguantás el frío.",
        efectos: { karma: 15, salud: -15, vinculo: 18 },
        consecuenciaTexto:
          "Pasan el invierno juntos. Tu cuerpo queda más dañado. Él/ella te cuida en primavera.",
      },
      {
        texto: "Priorizar la leña: sobrevivir los dos.",
        efectos: { karma: 0, salud: -3, vinculo: -5 },
        consecuenciaTexto:
          "Sobreviven. Pero su salud nunca se recupera del todo. Los últimos años son más lentos.",
      },
      {
        texto: "Pedir ayuda a los hijos aunque les incomode.",
        efectos: { karma: 10, salud: 3, vinculo: 8 },
        consecuenciaTexto:
          "Vienen con leña y dinero. Se organiza algo familiar. Todos invierten un poco, todos ganan un poco.",
      },
      {
        texto: "Vender un objeto familiar importante para cubrir todo.",
        efectos: { karma: 5, riqueza: 10, vinculo: 5 },
        consecuenciaTexto:
          "La joya o la espada heredada se va a otra casa. Tu pareja llora con vos. Pero sobreviven juntos.",
      },
    ],
  },
  // ============ ACTUAL ============
  {
    id: "act-par-01",
    mundo: "actual",
    rolesRelevantes: [],
    etapaMax: "juventud",
    soloRelacion: "pareja",
    titulo: "¿Nos casamos?",
    descripcion:
      "Después de tres años juntos, tu pareja plantea la pregunta: casamiento, o seguir como hasta ahora. Cada uno quiere algo distinto.",
    icono: "💐",
    tags: ["amor", "familia"],
    opciones: [
      {
        texto: "Decir que sí al casamiento.",
        efectos: { karma: 8, vinculo: 12, riqueza: -10 },
        consecuenciaTexto:
          "Fiesta con 80 personas. Una peleíta sobre quién invita a quién. Terminan bailando hasta las 4.",
      },
      {
        texto: "Proponer casamiento civil sin fiesta grande.",
        efectos: { karma: 5, vinculo: 8, riqueza: -2 },
        consecuenciaTexto:
          "Registro civil, diez personas, comida casera. A tus suegros les duele. A vos no.",
      },
      {
        texto: "Proponer seguir conviviendo sin papeles.",
        efectos: { karma: 0, vinculo: -5 },
        consecuenciaTexto:
          "Él/ella se resigna pero guarda un poquito de frustración. La tocan seis veces en los próximos cinco años.",
      },
      {
        texto: "Pedir más tiempo.",
        efectos: { karma: -3, vinculo: -12 },
        consecuenciaTexto:
          "Él/ella duda del futuro. Tres meses después se plantean si siguen. Cambian algunas reglas.",
      },
    ],
  },
  {
    id: "act-par-02",
    mundo: "actual",
    rolesRelevantes: [],
    etapaMax: "juventud",
    soloRelacion: "pareja",
    titulo: "¿Hijos sí, hijos no?",
    descripcion:
      "Tu pareja quiere un hijo ya. Vos no estás tan seguro/a. La diferencia viene saliendo en las charlas.",
    icono: "👶",
    tags: ["familia", "amor", "dramatica"],
    opciones: [
      {
        texto: "Sí, vamos con todo. Querer, aunque tengas miedo.",
        efectos: { karma: 10, vinculo: 15, riqueza: -15, salud: -5 },
        consecuenciaTexto:
          "Al año tienen un bebé. Todo cambia. Es caótico y hermoso. Nunca más tienen una noche igual.",
      },
      {
        texto: "Proponer esperar dos años y decidir juntos.",
        efectos: { karma: 5, vinculo: 0 },
        consecuenciaTexto:
          "Dos años después se replantean. Uno cambió de idea. Ya no es tan claro qué va a pasar.",
      },
      {
        texto: "Decir no definitivamente.",
        efectos: { karma: 0, vinculo: -12 },
        consecuenciaTexto:
          "Él/ella acepta con dolor. Años después viene el resentimiento. O se reconstruye. O no.",
      },
      {
        texto: "Proponer adopción en lugar de tener biológicos.",
        efectos: { karma: 15, vinculo: 10, riqueza: -20, salud: -3 },
        consecuenciaTexto:
          "Un proceso largo. Llega un niño/a. Son padres distintos al molde pero profundamente. Otras familias les preguntan cómo se animaron.",
      },
    ],
  },
  {
    id: "act-par-03",
    mundo: "actual",
    rolesRelevantes: [],
    etapaMin: "madurez",
    etapaMax: "madurez",
    soloRelacion: "pareja",
    titulo: "La relación se apagó",
    descripcion:
      "Hace meses no hay deseo, ni peleas, ni risas profundas. Es convivencia amable. Uno de los dos lo nombra primero.",
    icono: "🥀",
    tags: ["amor", "dramatica"],
    opciones: [
      {
        texto: "Terapia de pareja intensiva.",
        efectos: { karma: 10, vinculo: 10, riqueza: -15 },
        consecuenciaTexto:
          "Seis meses de terapia. Algunas cosas vuelven, otras no. Se quedan distintos pero juntos, con ganas.",
      },
      {
        texto: "Tomarse un tiempo separados.",
        efectos: { karma: 3, vinculo: -5 },
        consecuenciaTexto:
          "Tres meses viviendo cada uno por su lado. Vuelven con claridad. Algunos vuelven fortalecidos; otros, a firmar.",
      },
      {
        texto: "Separarse y seguir con dignidad.",
        efectos: { karma: 5, vinculo: -20, riqueza: -10, salud: -5 },
        consecuenciaTexto:
          "Sin gritos. Arreglan lo legal en meses. Años después, son amigos. La vida sigue, diferente.",
      },
      {
        texto: "Decidir seguir pero con acuerdos nuevos de convivencia.",
        efectos: { karma: 0, vinculo: 5 },
        consecuenciaTexto:
          "Hablan de todo lo que antes se callaban. Cada uno retoma espacios propios. Funciona mejor que antes, raro.",
      },
    ],
  },
  {
    id: "act-par-04",
    mundo: "actual",
    rolesRelevantes: [],
    etapaMin: "madurez",
    etapaMax: "madurez",
    soloRelacion: "pareja",
    titulo: "Crisis económica — juntos",
    descripcion:
      "Recesión nacional. Uno de los dos pierde el trabajo. Con los ahorros comunes hay que decidir: bancar al que perdió o dividir gastos por igual.",
    icono: "💰",
    tags: ["familia", "dramatica"],
    opciones: [
      {
        texto: "Bancar al que perdió — toda la caja común es de los dos.",
        efectos: { karma: 10, vinculo: 15, riqueza: -10 },
        consecuenciaTexto:
          "Nueve meses duros. Finalmente el otro consigue trabajo. Se quedan con una anécdota que van a contar siempre.",
      },
      {
        texto: "Dividir todo por igual, cada uno se arregla como puede.",
        efectos: { karma: -5, vinculo: -15 },
        consecuenciaTexto:
          "La pareja que pierde trabajo empieza a pedir al banco. La otra persona toma postre mientras el/la otro/a no. Algo se rompe.",
      },
      {
        texto: "Tomar un proyecto juntos mientras buscan trabajos estables.",
        efectos: { karma: 8, vinculo: 10, riqueza: 5 },
        consecuenciaTexto:
          "Arman algo chiquito desde la cocina. Crece despacio. Descubren que trabajar juntos les va mejor que por separado.",
      },
      {
        texto: "Pedir ayuda a familiares y negociar plazos.",
        efectos: { karma: 3, vinculo: 5, riqueza: -5 },
        consecuenciaTexto:
          "Los suegros ayudan con algo. Sigue siendo tenso. La pareja se sostiene. Devuelven el préstamo con los años.",
      },
    ],
  },
  // ============ PODERES ============
  {
    id: "pod-par-01",
    mundo: "poderes",
    rolesRelevantes: [],
    etapaMax: "juventud",
    soloRelacion: "pareja",
    titulo: "Ambos tienen poderes — ¿lo dicen?",
    descripcion:
      "Descubren que ambos son 'raros'. Cada uno creyó que era el único/a. La revelación los sacude.",
    icono: "⚡",
    tags: ["amor", "descubrimiento"],
    opciones: [
      {
        texto: "Contarse todo, sin filtros, celebrar el hallazgo.",
        efectos: { karma: 15, vinculo: 20, nivelPoder: 5 },
        consecuenciaTexto:
          "Pasan noches contándose desde el primer uso. Entrenan juntos. Se vuelven un equipo raro y profundo.",
      },
      {
        texto: "Uno se resiste a hablar del tema — 'ya lo veremos'.",
        efectos: { karma: -3, vinculo: -8 },
        consecuenciaTexto:
          "La conversación queda colgando. Meses después la retoman con más dolor. Lo que debía unirlos los separa un tiempo.",
      },
      {
        texto: "Pactar que nunca van a usar el poder en su relación.",
        efectos: { karma: 5, vinculo: 5, nivelPoder: -5 },
        consecuenciaTexto:
          "Una regla difícil pero respetada. El poder queda para afuera. La intimidad se vuelve casi normal.",
      },
      {
        texto: "Plantearse juntos si usar los poderes para algún proyecto grande.",
        efectos: { karma: 8, vinculo: 12, influencia: 5 },
        consecuenciaTexto:
          "Empiezan a imaginar un futuro común con proyección. Arman algo — una ONG, una red. El amor crece con el propósito.",
      },
    ],
  },
  {
    id: "pod-par-02",
    mundo: "poderes",
    rolesRelevantes: [],
    etapaMin: "madurez",
    etapaMax: "madurez",
    soloRelacion: "pareja",
    titulo: "Uno quiere retirarse, el otro seguir",
    descripcion:
      "Después de años de usar el poder juntos en causas grandes, uno de los dos está agotado y quiere retirarse. El otro quiere seguir.",
    icono: "🛑",
    tags: ["amor", "dramatica"],
    opciones: [
      {
        texto: "Retirarse juntos por el/la que está agotado.",
        efectos: { karma: 10, vinculo: 15, influencia: -10 },
        consecuenciaTexto:
          "Pasan años más privados. El que quería seguir lo extraña, pero el amor pesa más. Viven bien.",
      },
      {
        texto: "Seguir el/la que quiere pero con menos intensidad.",
        efectos: { karma: 5, vinculo: 3, influencia: 5 },
        consecuenciaTexto:
          "El que quiere seguir se acopla. Hacen cosas más chicas. Ni uno ni otro del todo contento, pero juntos.",
      },
      {
        texto: "Cada uno su camino, conviviendo con la diferencia.",
        efectos: { karma: 0, vinculo: -10, influencia: 5 },
        consecuenciaTexto:
          "El activo sigue. El otro descansa. Se cruzan en casa de noche. Las conversaciones se vuelven más cortas.",
      },
      {
        texto: "El activo se retira también, pero haciendo un último proyecto de legado.",
        efectos: { karma: 15, vinculo: 12, salud: -8, influencia: 10 },
        consecuenciaTexto:
          "Un año intenso de despedida. Al final, los dos paran. Dejan una escuela, un archivo, algo que sigue después.",
      },
    ],
  },
  {
    id: "pod-par-03",
    mundo: "poderes",
    rolesRelevantes: [],
    etapaMin: "vejez",
    soloRelacion: "pareja",
    titulo: "La despedida anticipada",
    descripcion:
      "Tu pareja empieza a perder la memoria. Todavía te reconoce, pero hay momentos de niebla. Saben que el tiempo lúcido se acaba.",
    icono: "🌫️",
    tags: ["amor", "muerte", "familia"],
    opciones: [
      {
        texto: "Grabar mensajes de vida juntos para los dos, y para los nietos.",
        efectos: { karma: 18, vinculo: 20, salud: -3 },
        consecuenciaTexto:
          "Pasan semanas llorando y riendo frente a una cámara vieja. Los videos quedan para generaciones.",
      },
      {
        texto: "Hacer un viaje largo a lugares que significaron algo.",
        efectos: { karma: 15, vinculo: 15, riqueza: -20, salud: -5 },
        consecuenciaTexto:
          "Tres meses recorriendo. En cada lugar él/ella recuerda algo. Es la última vez que se ríen así.",
      },
      {
        texto: "Quedarse en casa, cada día normal.",
        efectos: { karma: 10, vinculo: 10 },
        consecuenciaTexto:
          "Rutinas compartidas, tés, caminatas cortas. Cada día es el último y el único. Suficiente.",
      },
      {
        texto: "Alejarse emocionalmente para prepararte al dolor.",
        efectos: { karma: -15, vinculo: -20, salud: -10 },
        consecuenciaTexto:
          "Te protegés pero él/ella lo siente. Muere sin sentirte cerca. Cargás con eso el resto de tus días.",
      },
    ],
  },
];
