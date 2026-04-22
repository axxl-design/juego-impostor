import type { Carta } from "./types";

export const CARTAS_PODERES: Carta[] = [
  // ============ JUVENTUD ============
  {
    id: "pod-j-01",
    mundo: "poderes",
    rolesRelevantes: [],
    etapaMax: "juventud",
    titulo: "El poder se manifiesta",
    descripcion:
      "Estás en el subte. Un ruido fuerte. Tu poder se dispara solo por primera vez. La gente se asusta. Una cámara te grabó.",
    icono: "⚡",
    tags: ["descubrimiento", "dramatica"],
    opciones: [
      {
        texto: "Bajarte en la próxima estación y desaparecer.",
        efectos: { karma: 0, influencia: -3, salud: -5 },
        consecuenciaTexto:
          "Nadie te reconoce. Te borrás de redes. Aprendés a controlar el poder en silencio durante años.",
      },
      {
        texto: "Quedarte y ayudar: tranquilizar al pasaje.",
        efectos: { karma: 10, influencia: 8, nivelPoder: 5 },
        consecuenciaTexto:
          "El video se hace viral en positivo. Te llaman medios. Salís en TV sonriendo. La vida cambia.",
      },
      {
        texto: "Amenazar a la gente para que borren los videos.",
        efectos: { karma: -15, influencia: 5, nivelPoder: 3 },
        consecuenciaTexto:
          "Algunos los borran. Dos los publican igual. Tu debut público es como villano menor.",
      },
      {
        texto: "Contactar a un científico que investiga casos como el tuyo.",
        efectos: { karma: 5, influencia: 5, nivelPoder: 10, salud: -3 },
        consecuenciaTexto:
          "Te hace estudios. Entendés más cómo funciona tu poder. A cambio, firmás confidencialidades raras.",
      },
    ],
  },
  {
    id: "pod-j-02",
    mundo: "poderes",
    rolesRelevantes: [],
    etapaMax: "juventud",
    titulo: "Accidente en un edificio",
    descripcion:
      "Incendio en un edificio residencial. Tu poder podría ayudar, pero aún está en nivel latente y podés empeorar la situación.",
    icono: "🏢",
    tags: ["dramatica", "poder"],
    opciones: [
      {
        texto: "Intervenir con todo lo que tenés.",
        efectos: { karma: 12, salud: -15, nivelPoder: 10, influencia: 10 },
        consecuenciaTexto:
          "Salvás a cuatro personas. Te quemás la espalda. Saliste en las noticias como 'el héroe anónimo'.",
      },
      {
        texto: "Llamar a emergencias y ayudar desde afuera.",
        efectos: { karma: 8, influencia: 0 },
        consecuenciaTexto:
          "Llegan los bomberos. Ayudás a sacar a gente por escaleras. Todos ayudan. Vos también.",
      },
      {
        texto: "Filmar y subir a redes para fama.",
        efectos: { karma: -15, influencia: 15 },
        consecuenciaTexto:
          "El video explota. Te criticarán meses después pero los seguidores no se van. Vivís de eso un tiempo.",
      },
      {
        texto: "No hacer nada y seguir tu vida.",
        efectos: { karma: -10, salud: 0 },
        consecuenciaTexto:
          "Te enterás por las noticias que murieron tres personas. No sabés si pudiste haber cambiado eso. No te lo sacás.",
      },
    ],
  },
  {
    id: "pod-j-03",
    mundo: "poderes",
    rolesRelevantes: [],
    etapaMax: "juventud",
    titulo: "La corporación te quiere",
    descripcion:
      "Una corporación biotecnológica te ofrece un contrato enorme para estudiar tu poder. Laboratorio, departamento, sueldo increíble. Una sola cláusula: exclusividad total.",
    icono: "🧪",
    tags: ["poder", "etica"],
    opciones: [
      {
        texto: "Firmar. Es mucho dinero.",
        efectos: { riqueza: 30, nivelPoder: 15, karma: -5, influencia: 5 },
        consecuenciaTexto:
          "Tu vida se estabiliza. Los estudios son exhaustivos. Con los años descubrís que venden resultados a militares.",
      },
      {
        texto: "Rechazar: no querés ser experimento.",
        efectos: { karma: 10, riqueza: -5, nivelPoder: 5 },
        consecuenciaTexto:
          "Trabajás como cualquiera. Aprendés tu poder solo/a. Más despacio, sin ataduras.",
      },
      {
        texto: "Negociar cláusulas: publicación abierta, no militar.",
        efectos: { karma: 5, riqueza: 15, nivelPoder: 10 },
        consecuenciaTexto:
          "Aceptan algunas condiciones. Los estudios avanzan. Algunos resultados se publican. Otros no.",
      },
      {
        texto: "Firmar y filtrar info a la prensa en secreto.",
        efectos: { karma: 8, riqueza: 10, nivelPoder: 10, salud: -8 },
        consecuenciaTexto:
          "Sobrevivís dos años en ambos lados. Cuando te descubren, tenés que huir. Pero el caso explota.",
      },
    ],
  },
  {
    id: "pod-j-04",
    mundo: "poderes",
    rolesRelevantes: ["elemental", "fuerza"],
    etapaMax: "juventud",
    titulo: "Un asalto en la calle",
    descripcion:
      "Vas caminando y ves a dos tipos asaltando a una señora. Tenés poder, pero nivel latente. Intervenir es riesgoso.",
    icono: "🚨",
    tags: ["poder", "etica"],
    opciones: [
      {
        texto: "Intervenir usando el poder con toda la fuerza.",
        efectos: { karma: 10, nivelPoder: 8, salud: -10, influencia: 5 },
        consecuenciaTexto:
          "Los asaltantes salen corriendo. Uno se lastima al caer. La señora te abraza llorando. Una cámara te ve.",
      },
      {
        texto: "Distraer sin usar el poder abiertamente.",
        efectos: { karma: 8, salud: -5, influencia: 3 },
        consecuenciaTexto:
          "Gritás, los asustás. Huyen. La señora te agradece. Nadie te filmó.",
      },
      {
        texto: "Llamar a la policía mientras grabás desde lejos.",
        efectos: { karma: 0, influencia: 0 },
        consecuenciaTexto:
          "La policía llega tarde. Los asaltantes ya se fueron con la cartera. Tu video sirve para identificarlos.",
      },
      {
        texto: "Seguir tu camino. No es tu problema.",
        efectos: { karma: -12, salud: 0 },
        consecuenciaTexto:
          "Horas después te enterás que la señora terminó en terapia intensiva. Vivís meses evitando esa calle.",
      },
    ],
  },
  {
    id: "pod-j-05",
    mundo: "poderes",
    rolesRelevantes: ["telepatia"],
    etapaMax: "juventud",
    titulo: "Leés un secreto que no querías",
    descripcion:
      "Sin querer, leés el pensamiento de un amigo cercano. Está planeando hacer algo muy grave con su pareja.",
    icono: "🧠",
    tags: ["etica", "familia"],
    opciones: [
      {
        texto: "Avisar a la pareja de manera anónima.",
        efectos: { karma: 15, influencia: 0, salud: -5 },
        consecuenciaTexto:
          "La pareja se protege a tiempo. Tu amigo pierde a esa persona. Nunca te enterás del todo cómo termina. Vivís con eso.",
      },
      {
        texto: "Hablar con tu amigo directamente.",
        efectos: { karma: 10, influencia: 5, nivelPoder: 3 },
        consecuenciaTexto:
          "Se sorprende que sepas. Se derrumba. Pide ayuda profesional. La amistad cambia, pero sigue.",
      },
      {
        texto: "No intervenir. Es su vida.",
        efectos: { karma: -20, salud: -10 },
        consecuenciaTexto:
          "Sucede lo que temías. Vos sabías. El peso es enorme. Te aleja de muchas personas en los años siguientes.",
      },
      {
        texto: "Denunciarlo a la policía con los detalles que leíste.",
        efectos: { karma: 8, influencia: -10, nivelPoder: 5 },
        consecuenciaTexto:
          "Lo detienen antes. No hay pruebas suficientes. Sale libre a los días. Tu amistad se rompe. La pareja queda a salvo.",
      },
    ],
  },
  {
    id: "pod-j-06",
    mundo: "poderes",
    rolesRelevantes: ["tecnologico"],
    etapaMax: "juventud",
    titulo: "Hackeás sin querer",
    descripcion:
      "Tu implante accede a los sistemas bancarios de una corporación. Ves cuentas. Podrías desviar dinero a gente que lo necesita — o quedártelo.",
    icono: "💻",
    tags: ["etica", "poder"],
    opciones: [
      {
        texto: "No tocar nada y salir limpio.",
        efectos: { karma: 5, nivelPoder: 3 },
        consecuenciaTexto:
          "Te desconectás. Aprendés a filtrar mejor tu poder. Guardás la sensación de haber mirado algo prohibido.",
      },
      {
        texto: "Desviar dinero a organizaciones reales que ayudan a gente.",
        efectos: { karma: 15, influencia: 5, riqueza: 0, nivelPoder: 8, salud: -5 },
        consecuenciaTexto:
          "Dos ONGs reciben fondos inexplicables. La corporación investiga. Vos dormís con alertas todo el año.",
      },
      {
        texto: "Desviar una suma para vos.",
        efectos: { karma: -20, riqueza: 30, nivelPoder: 5, salud: -8 },
        consecuenciaTexto:
          "Vivís bien mientras dure. Tres años después, forense digital te llega. Empieza una vida en fuga.",
      },
      {
        texto: "Denunciar anónimamente irregularidades reales que encontraste.",
        efectos: { karma: 18, influencia: 10, nivelPoder: 10, salud: -5 },
        consecuenciaTexto:
          "La corporación cae en escándalo. Vos quedás fuera. Alguien sospecha pero no te llegan. Te convertís en leyenda de foros.",
      },
    ],
  },
  {
    id: "pod-j-07",
    mundo: "poderes",
    rolesRelevantes: ["velocidad"],
    etapaMax: "juventud",
    titulo: "La carrera clandestina",
    descripcion:
      "Te invitan a una carrera ilegal donde corren 'raros' como vos. Dinero fuerte. Apuestas. Riesgo de exposición.",
    icono: "🏁",
    tags: ["poder", "etica"],
    opciones: [
      {
        texto: "Correr y ganar.",
        efectos: { riqueza: 25, nivelPoder: 12, karma: -3, salud: -8, influencia: 5 },
        consecuenciaTexto:
          "Ganás la primera carrera. Ganás cuatro más. Tu cuerpo se acostumbra al límite. Te hacés una red turbia.",
      },
      {
        texto: "Correr pero perder a propósito.",
        efectos: { karma: -5, nivelPoder: 5 },
        consecuenciaTexto:
          "No ganás mucho pero quedás adentro. Seguís observando. No sabés si querés entrar de verdad.",
      },
      {
        texto: "Rechazar y no contarle a nadie.",
        efectos: { karma: 5 },
        consecuenciaTexto:
          "Volvés a tu vida. A veces te preguntás qué hubiera pasado. Las cuentas siguen tensas.",
      },
      {
        texto: "Infiltrarte para denunciar la red.",
        efectos: { karma: 15, influencia: 8, nivelPoder: 10, salud: -15 },
        consecuenciaTexto:
          "Después de un año, tu denuncia hace caer el circuito. Alguien jura vengarse. Tenés que mudarte.",
      },
    ],
  },
  {
    id: "pod-j-08",
    mundo: "poderes",
    rolesRelevantes: [],
    etapaMax: "juventud",
    titulo: "Otro 'raro' te busca",
    descripcion:
      "Un joven con un poder distinto al tuyo te contacta. Dice que hay un grupo de personas como ustedes. Quiere que te unas.",
    icono: "🤝",
    tags: ["descubrimiento"],
    opciones: [
      {
        texto: "Unirte al grupo.",
        efectos: { karma: 5, influencia: 10, nivelPoder: 10, salud: -3 },
        consecuenciaTexto:
          "Encontrás gente que te entiende por primera vez. Aprendés rápido. El grupo tiene reglas internas duras.",
      },
      {
        texto: "Rechazar por ahora, guardar el contacto.",
        efectos: { karma: 0, nivelPoder: 3 },
        consecuenciaTexto:
          "Seguís solo/a pero con un contacto guardado. En tres años los buscás y te reciben.",
      },
      {
        texto: "Denunciarlos: no sabés si son buena gente.",
        efectos: { karma: -15, influencia: 0, salud: -5 },
        consecuenciaTexto:
          "La policía investiga. Algunos del grupo se dispersan. Uno te jura venganza. Vivís mirando para atrás.",
      },
      {
        texto: "Aceptar reunirte pero mantener distancia al principio.",
        efectos: { karma: 5, influencia: 5, nivelPoder: 5 },
        consecuenciaTexto:
          "Vas a unas pocas reuniones. Te caen bien algunos. Te mantenés al margen. La decisión final queda para después.",
      },
    ],
  },
  {
    id: "pod-j-09",
    mundo: "poderes",
    rolesRelevantes: [],
    etapaMax: "juventud",
    titulo: "La persona que amás descubre tu secreto",
    descripcion:
      "Tu pareja te descubre usando el poder sin querer. No sabían. Están en shock.",
    icono: "💔",
    tags: ["amor", "familia", "dramatica"],
    opciones: [
      {
        texto: "Contarle todo, sin filtros.",
        efectos: { karma: 12, influencia: 0, salud: 0 },
        consecuenciaTexto:
          "Llora, pregunta, se enoja. Al final se quedan. La confianza crece después de la tormenta.",
      },
      {
        texto: "Minimizar: 'no es gran cosa'.",
        efectos: { karma: -5, salud: -3 },
        consecuenciaTexto:
          "Acepta temporalmente. La duda queda. Un año después te deja porque 'le mentiste'.",
      },
      {
        texto: "Borrarle la memoria usando a un 'raro' conocido.",
        efectos: { karma: -20, nivelPoder: 0, salud: -10 },
        consecuenciaTexto:
          "Funciona. Pero algo entre ustedes queda vacío. No entiende por qué siempre te nota algo ajeno.",
      },
      {
        texto: "Dejarla vos antes de que te deje.",
        efectos: { karma: -5, salud: -8 },
        consecuenciaTexto:
          "Cortás la relación. Te quedás solo/a. Años después, te cruzás y hay una conversación pendiente que nunca tienen.",
      },
    ],
  },
  {
    id: "pod-j-10",
    mundo: "poderes",
    rolesRelevantes: [],
    etapaMax: "juventud",
    titulo: "El primer villano",
    descripcion:
      "Aparece alguien con poderes haciendo daño real. Son más fuertes que vos. La ciudad está en pánico.",
    icono: "☠️",
    tags: ["dramatica", "poder"],
    opciones: [
      {
        texto: "Enfrentarlo vos solo/a.",
        efectos: { karma: 15, salud: -25, nivelPoder: 15, influencia: 15 },
        consecuenciaTexto:
          "Ganás apenas. Dos semanas en hospital. Te convertís en figura pública. Tu anonimato se fue.",
      },
      {
        texto: "Organizar a otros 'raros' para ir juntos.",
        efectos: { karma: 10, influencia: 15, nivelPoder: 10 },
        consecuenciaTexto:
          "Formás un grupo improvisado. Juntos lo detienen. Algunos quedan heridos. Nace una identidad colectiva.",
      },
      {
        texto: "Colaborar con las fuerzas oficiales.",
        efectos: { karma: 8, influencia: 10, nivelPoder: 5 },
        consecuenciaTexto:
          "El gobierno te da credenciales. Lo detienen entre varios. Ganás legitimidad y ataduras burocráticas.",
      },
      {
        texto: "Esconderte hasta que pase.",
        efectos: { karma: -15, salud: 3 },
        consecuenciaTexto:
          "Otros detienen al villano a costa de vidas. Te enterás por diario. Te miras en el espejo con vergüenza.",
      },
    ],
  },
  // ============ MADUREZ ============
  {
    id: "pod-m-01",
    mundo: "poderes",
    rolesRelevantes: [],
    etapaMin: "madurez",
    etapaMax: "madurez",
    titulo: "Registro obligatorio",
    descripcion:
      "El gobierno crea un registro obligatorio para 'personas con habilidades'. Incluye controles médicos, ubicación, informes.",
    icono: "📋",
    tags: ["poder", "etica"],
    opciones: [
      {
        texto: "Registrarse y colaborar.",
        efectos: { karma: 0, influencia: 10, riqueza: 5, salud: -3 },
        consecuenciaTexto:
          "La vida es más fácil en lo burocrático. Sabés que alguien tiene tu perfil. La libertad se reduce un poco.",
      },
      {
        texto: "Registrarse pero dando información mínima.",
        efectos: { karma: 3, influencia: 5, riqueza: 0 },
        consecuenciaTexto:
          "Burocracia a medias. Nadie te molesta mucho. Sabés que tenés que moverte despacio en público.",
      },
      {
        texto: "No registrarse y vivir en la clandestinidad.",
        efectos: { karma: 8, influencia: -10, riqueza: -15, salud: -8 },
        consecuenciaTexto:
          "Tu vida se complica. Cuidás cada uso del poder. Encontrás una red de no registrados que te ayuda.",
      },
      {
        texto: "Liderar una campaña pública contra el registro.",
        efectos: { karma: 18, influencia: 15, salud: -10, riqueza: -10 },
        consecuenciaTexto:
          "Te hacés figura pública. Amenazas, apoyos, viajes. El registro se reforma parcialmente. Quedás en la historia.",
      },
    ],
  },
  {
    id: "pod-m-02",
    mundo: "poderes",
    rolesRelevantes: [],
    etapaMin: "madurez",
    etapaMax: "madurez",
    titulo: "Un aprendiz",
    descripcion:
      "Un chico de 16 con tu mismo tipo de poder te busca. Está perdido, sin familia que entienda. Quiere aprender de vos.",
    icono: "🧑‍🏫",
    tags: ["legado", "familia"],
    opciones: [
      {
        texto: "Tomarlo/a como aprendiz completo.",
        efectos: { karma: 15, influencia: 5, nivelPoder: 5, riqueza: -5 },
        consecuenciaTexto:
          "Pasás años enseñando. El chico crece con tu estilo. Se convierte en mejor persona de lo que esperaba él mismo.",
      },
      {
        texto: "Darle contactos y derivarlo a otros maestros.",
        efectos: { karma: 5, influencia: 5 },
        consecuenciaTexto:
          "Lo conectás con tres personas confiables. Crece entre ellos. Te manda cartas cada tanto.",
      },
      {
        texto: "Rechazarlo: ya tenés suficiente.",
        efectos: { karma: -10, salud: 3 },
        consecuenciaTexto:
          "Se va. Años después te enterás que terminó mal — en la calle, o peor. Eso te pesa hasta el final.",
      },
      {
        texto: "Aprovecharte: usarlo/a como ayudante barato.",
        efectos: { karma: -18, riqueza: 10, nivelPoder: 3 },
        consecuenciaTexto:
          "Te sirve tres años. Al final se revela contra vos. Cuando conquista algo propio, no te perdona.",
      },
    ],
  },
  {
    id: "pod-m-03",
    mundo: "poderes",
    rolesRelevantes: [],
    etapaMin: "madurez",
    etapaMax: "madurez",
    titulo: "Sacrificio colectivo",
    descripcion:
      "Un desastre masivo amenaza una ciudad entera. Con otros 'raros' podés detenerlo, pero requiere usar el poder al máximo — algunos podrían morir.",
    icono: "🌋",
    tags: ["dramatica", "muerte", "poder"],
    opciones: [
      {
        texto: "Ser el primero/a en ofrecerse.",
        efectos: { karma: 20, salud: -30, nivelPoder: 20, influencia: 20 },
        consecuenciaTexto:
          "Sobrevivís por poco. Dos compañeros mueren. La ciudad se salva. Te erigen una estatua en vida.",
      },
      {
        texto: "Participar pero cuidarte.",
        efectos: { karma: 8, salud: -15, nivelPoder: 10, influencia: 10 },
        consecuenciaTexto:
          "Cumplís tu parte. No sos el héroe pero no sos cobarde. Sobrevivís. La ciudad tiene pérdidas parciales.",
      },
      {
        texto: "Dirigir sin ir al frente.",
        efectos: { karma: 5, influencia: 15, nivelPoder: 5, salud: -5 },
        consecuenciaTexto:
          "Tus decisiones salvan vidas. Otros van al frente. Algunos no vuelven. Cargás eso como carga administrativa.",
      },
      {
        texto: "Evacuar sin pelear.",
        efectos: { karma: -5, influencia: -10, salud: 5 },
        consecuenciaTexto:
          "Sobrevivís cómodo. Algunos te reprochan en público durante años. Otros entienden que elegir vivir no es cobardía.",
      },
    ],
  },
  {
    id: "pod-m-04",
    mundo: "poderes",
    rolesRelevantes: [],
    etapaMin: "madurez",
    etapaMax: "madurez",
    titulo: "La traición del grupo",
    descripcion:
      "Descubrís que tu grupo de 'raros' está planeando algo mucho más oscuro de lo que creías — usar poderes para controlar zonas económicas.",
    icono: "⛓️",
    tags: ["traicion", "etica"],
    opciones: [
      {
        texto: "Denunciar al grupo a las autoridades.",
        efectos: { karma: 18, influencia: -15, salud: -10 },
        consecuenciaTexto:
          "Varios del grupo caen. Algunos juran venganza. Tenés que mudarte. Dormís con un ojo abierto años.",
      },
      {
        texto: "Irte en silencio y olvidar.",
        efectos: { karma: -5, influencia: -5, salud: -5 },
        consecuenciaTexto:
          "Te alejás sin hacer ruido. El grupo sigue. Años después, en las noticias ves lo que hicieron. Te ahogás en el sillón.",
      },
      {
        texto: "Quedarte para sabotearlos desde adentro.",
        efectos: { karma: 12, influencia: 5, salud: -15, nivelPoder: 10 },
        consecuenciaTexto:
          "Dos años de doble vida. Hacés caer piezas clave. Te descubren. Escapás por poco. La red se desmantela.",
      },
      {
        texto: "Unirte del todo. Si no podés contra ellos...",
        efectos: { karma: -25, influencia: 25, riqueza: 25, nivelPoder: 15, salud: -5 },
        consecuenciaTexto:
          "El grupo te acepta con honores. Te hacés rico/a. Años después no reconocés a la persona que fuiste a los 20.",
      },
    ],
  },
  {
    id: "pod-m-05",
    mundo: "poderes",
    rolesRelevantes: [],
    etapaMin: "madurez",
    etapaMax: "madurez",
    titulo: "Un hijo sin poderes",
    descripcion:
      "Tu hijo/a adolescente descubrió que no heredó tu poder. Lo vive como una tragedia. Pelea con vos por eso.",
    icono: "👶",
    tags: ["familia", "legado"],
    opciones: [
      {
        texto: "Insistir que los poderes no son todo.",
        efectos: { karma: 10, influencia: 0 },
        consecuenciaTexto:
          "Pelean un año. Eventualmente se reconcilian. Termina siendo mejor persona de lo que vos sabés ser.",
      },
      {
        texto: "Buscar tratamientos experimentales para 'activar' algo.",
        efectos: { karma: -5, riqueza: -25, salud: -5 },
        consecuenciaTexto:
          "Tres años de clínicas dudosas. Nada funciona. Tu hijo/a te reprocha haberle hecho sentir incompleto/a.",
      },
      {
        texto: "Dejarlo/a encontrar su camino sin intervenir.",
        efectos: { karma: 5, salud: 0 },
        consecuenciaTexto:
          "Pasa por años duros. Sale adelante con una fortaleza que no tiene que ver con poderes.",
      },
      {
        texto: "Contactarlo con la comunidad de 'normales' aliados.",
        efectos: { karma: 12, influencia: 5 },
        consecuenciaTexto:
          "Encuentra una identidad en esa comunidad. Se vuelve puente entre 'raros' y 'normales' como nadie antes.",
      },
    ],
  },
  {
    id: "pod-m-06",
    mundo: "poderes",
    rolesRelevantes: ["elemental"],
    etapaMin: "madurez",
    etapaMax: "madurez",
    titulo: "Tu elemento se descontrola",
    descripcion:
      "En una discusión fuerte, tu elemento se liberó y hirió a alguien cercano. No fue intencional. No es la primera vez que casi pasa.",
    icono: "🔥",
    tags: ["dramatica", "familia"],
    opciones: [
      {
        texto: "Aislarse un año para entrenar.",
        efectos: { karma: 5, nivelPoder: 20, influencia: -10, salud: -3 },
        consecuenciaTexto:
          "Un año en un lugar alejado con maestros. Volvés con control absoluto. Perdiste amigos pero no volviste a herir a nadie.",
      },
      {
        texto: "Tratamiento médico para bloquear el poder.",
        efectos: { karma: 10, nivelPoder: -30, salud: -10, riqueza: -15 },
        consecuenciaTexto:
          "Te volvés 'normal'. La vida es más calma. A veces sentís un vacío. Tu herido te perdona y viven en paz.",
      },
      {
        texto: "Disculparte y seguir, pero con cuidado.",
        efectos: { karma: 0, salud: -5 },
        consecuenciaTexto:
          "Tres meses después pasa algo parecido. Vuelven las consecuencias. La relación se rompe del todo.",
      },
      {
        texto: "Entrenamiento intensivo con otros elementales.",
        efectos: { karma: 10, nivelPoder: 15, influencia: 5 },
        consecuenciaTexto:
          "Encontrás comunidad. Aprendés control junto con otros. Volvés más vos. El herido te ayuda en el regreso.",
      },
    ],
  },
  // ============ VEJEZ ============
  {
    id: "pod-v-01",
    mundo: "poderes",
    rolesRelevantes: [],
    etapaMin: "vejez",
    titulo: "El poder se debilita",
    descripcion:
      "Tu cuerpo cambia. El poder responde menos. Ya no podés hacer lo que hacías a los 40. Te sentís útil y obsoleto a la vez.",
    icono: "⏳",
    tags: ["legado", "dramatica"],
    opciones: [
      {
        texto: "Aceptar y dedicarte a enseñar.",
        efectos: { karma: 15, influencia: 10, salud: 3, nivelPoder: -10 },
        consecuenciaTexto:
          "Formás a una generación nueva. Tu estilo se multiplica. Tu nombre se menciona en aulas.",
      },
      {
        texto: "Buscar tratamientos para prolongar el poder.",
        efectos: { karma: 0, riqueza: -20, nivelPoder: 10, salud: -15 },
        consecuenciaTexto:
          "Funciona parcialmente. Pagás caro en salud. Te morís antes, pero con poder hasta el final.",
      },
      {
        texto: "Dejar de usarlo del todo y vivir como 'normal'.",
        efectos: { karma: 5, salud: 10, nivelPoder: -20 },
        consecuenciaTexto:
          "Tu vida se simplifica. Algunos no entienden. Vos te sentís liberado/a de un peso que llevaste toda la vida.",
      },
      {
        texto: "Un último acto grande antes del declive.",
        efectos: { karma: 15, salud: -20, influencia: 20, nivelPoder: -15 },
        consecuenciaTexto:
          "Hacés algo que queda en la memoria colectiva. Te debilita para siempre. No te arrepentís un solo día.",
      },
    ],
  },
  {
    id: "pod-v-02",
    mundo: "poderes",
    rolesRelevantes: [],
    etapaMin: "vejez",
    titulo: "Un viejo enemigo regresa",
    descripcion:
      "Alguien con quien peleaste hace cuarenta años aparece en tu puerta. Envejeció también. No trae rencor — tiene preguntas.",
    icono: "🕊️",
    tags: ["legado"],
    opciones: [
      {
        texto: "Dejarlo pasar y hablar horas.",
        efectos: { karma: 15, salud: 3 },
        consecuenciaTexto:
          "Tres horas. Beben té. Lloran. Al despedirse se dan la mano. Vive algunos años más, tranquilos.",
      },
      {
        texto: "Cerrarle la puerta.",
        efectos: { karma: -8, salud: 0 },
        consecuenciaTexto:
          "Se va sin pelear. Muere un mes después. Te enterás por el diario. No te sentís bien con el silencio.",
      },
      {
        texto: "Hablar pero con cuidado.",
        efectos: { karma: 5, salud: 0 },
        consecuenciaTexto:
          "Una hora. No se dicen todo pero algo se repara. Se despiden con un saludo corto. Es suficiente.",
      },
      {
        texto: "Pedirle perdón vos mismo primero.",
        efectos: { karma: 18, salud: 5 },
        consecuenciaTexto:
          "Se sorprende. Llora. Te perdona y te pide perdón también. Cambia algo dentro tuyo esa tarde.",
      },
    ],
  },
  {
    id: "pod-v-03",
    mundo: "poderes",
    rolesRelevantes: [],
    etapaMin: "vejez",
    titulo: "El mundo olvida",
    descripcion:
      "Una nueva generación de 'raros' no recuerda tu época. Las leyes que se aprobaron por las luchas de tu generación están siendo desmanteladas.",
    icono: "📚",
    tags: ["legado", "poder"],
    opciones: [
      {
        texto: "Salir del retiro para pelear de nuevo.",
        efectos: { karma: 15, influencia: 10, salud: -20, nivelPoder: 5 },
        consecuenciaTexto:
          "Das discursos, escribís, aparecés en TV. Agregás años de militancia a tu vida. El cuerpo te pasa factura.",
      },
      {
        texto: "Escribir memorias y testimonios para archivos.",
        efectos: { karma: 12, influencia: 8, salud: -5 },
        consecuenciaTexto:
          "Generás material que se usa décadas después. Algunos lo usan para resistir en momentos difíciles.",
      },
      {
        texto: "Asesorar en silencio a los líderes actuales.",
        efectos: { karma: 10, influencia: 5 },
        consecuenciaTexto:
          "Tu teléfono suena cada tanto. Aconsejás sin exponerte. Algunas decisiones cambian gracias a vos. Nadie lo sabe.",
      },
      {
        texto: "Aceptar: cada generación tiene su lucha.",
        efectos: { karma: 5, salud: 5 },
        consecuenciaTexto:
          "Dejás que la historia avance. Algunos errores se repiten, otros se evitan. Morís con paz — con tristeza pero con paz.",
      },
    ],
  },
];
