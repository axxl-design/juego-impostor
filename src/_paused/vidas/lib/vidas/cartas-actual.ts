import type { Carta } from "./types";

export const CARTAS_ACTUAL: Carta[] = [
  // ============ JUVENTUD ============
  {
    id: "act-j-01",
    mundo: "actual",
    rolesRelevantes: [],
    etapaMax: "juventud",
    titulo: "La primera entrevista importante",
    descripcion:
      "Entrevista para un puesto que cambiaría tu carrera. Tu amigo te dice que falseó currículums y le funcionó.",
    icono: "💼",
    tags: ["etica", "cotidiana"],
    opciones: [
      {
        texto: "Ir con tu currículum real, con humildad.",
        efectos: { karma: 5, influencia: 3 },
        consecuenciaTexto:
          "No te quedás con el puesto, pero el entrevistador te recomienda a una empresa menor. Empieza más lento, termina bien.",
      },
      {
        texto: "Inflar logros pero no inventar nada grave.",
        efectos: { karma: -3, influencia: 8, riqueza: 5 },
        consecuenciaTexto:
          "Quedás. El primer mes es agotador tratando de cubrir lo que dijiste. Aprendés rápido.",
      },
      {
        texto: "Inventar un título universitario completo.",
        efectos: { karma: -15, influencia: 15, riqueza: 10 },
        consecuenciaTexto:
          "Nadie lo verifica. Sos senior en un año. Dos años después, alguien empieza a hacer preguntas.",
      },
      {
        texto: "Aplicar a otro puesto que sí tenés en tu nivel.",
        efectos: { karma: 3, influencia: 0 },
        consecuenciaTexto:
          "No parecía tan glamoroso, pero pasás la prueba. Tres años después te ascienden por mérito real.",
      },
    ],
  },
  {
    id: "act-j-02",
    mundo: "actual",
    rolesRelevantes: [],
    etapaMax: "juventud",
    titulo: "Tu mejor amigo/a te pide que mientas",
    descripcion:
      "Tu amigo/a del alma te pide que mientas en una reunión laboral importante — confirmes que estaba contigo un día que no.",
    icono: "🤝",
    tags: ["etica", "familia"],
    opciones: [
      {
        texto: "Mentir por él/ella.",
        efectos: { karma: -5, influencia: 3, salud: -3 },
        consecuenciaTexto:
          "Le salvás el pellejo. A veces te pregunta si lo harías de nuevo. Vos no estás seguro.",
      },
      {
        texto: "Negarte pero ayudarlo/a a buscar una mejor salida.",
        efectos: { karma: 8, salud: 0 },
        consecuenciaTexto:
          "Asume la responsabilidad él/ella mismo. Te agradece meses después. La amistad sobrevive más fuerte.",
      },
      {
        texto: "Mentir a cambio de que te deba un favor.",
        efectos: { karma: -10, influencia: 8 },
        consecuenciaTexto:
          "Cobrás ese favor dos años después. Él/ella te mira distinto desde entonces.",
      },
      {
        texto: "Contar la verdad a su jefe para 'ayudarlo'.",
        efectos: { karma: -12, influencia: 0 },
        consecuenciaTexto:
          "Pierde el puesto. La amistad se acaba ese mismo mes. Ganás credibilidad ante gente que no te importa.",
      },
    ],
  },
  {
    id: "act-j-03",
    mundo: "actual",
    rolesRelevantes: ["empresario"],
    etapaMax: "juventud",
    titulo: "Primera ronda de inversión",
    descripcion:
      "Un fondo ofrece $500K por el 40% de tu startup. Necesitás el dinero. El fundador te está pidiendo que mientas un poco en las proyecciones.",
    icono: "💸",
    tags: ["etica", "poder"],
    opciones: [
      {
        texto: "Aceptar y exagerar proyecciones 'razonablemente'.",
        efectos: { karma: -8, influencia: 15, riqueza: 25, rango: "Fundador/a con ronda cerrada" },
        consecuenciaTexto:
          "Cerrás la ronda. Los primeros seis meses son desesperados para cumplir. Lo lográs, pero no como dijiste.",
      },
      {
        texto: "Presentar cifras reales aunque sean menos atractivas.",
        efectos: { karma: 8, influencia: 10, riqueza: 10 },
        consecuenciaTexto:
          "Negocian a la baja. Cierran con $250K por 25%. Más difícil, pero más limpio.",
      },
      {
        texto: "Rechazar y buscar otro fondo.",
        efectos: { karma: 3, influencia: -3, riqueza: -5 },
        consecuenciaTexto:
          "Seis meses más de búsqueda. Al final conseguís un deal más chico, más sano. Le decís a tu equipo.",
      },
      {
        texto: "Aceptar pero pedir que el fondo firme cláusulas fuertes si no cumplís.",
        efectos: { karma: 5, influencia: 15, riqueza: 20 },
        consecuenciaTexto:
          "El fondo respeta la movida. Cierran. Trabajás con dureza. En dos años, los números se cumplen.",
      },
    ],
  },
  {
    id: "act-j-04",
    mundo: "actual",
    rolesRelevantes: ["politico"],
    etapaMax: "juventud",
    titulo: "Tu primer escándalo",
    descripcion:
      "Un periodista encuentra fotos tuyas con un líder cuestionado. No estuviste ahí por nada turbio, pero se ve mal.",
    icono: "📸",
    tags: ["poder", "traicion"],
    opciones: [
      {
        texto: "Explicar con detalle qué pasó, aunque suene aburrido.",
        efectos: { karma: 10, influencia: -5 },
        consecuenciaTexto:
          "La nota pasa sin pena ni gloria. Perdés dos puntos en encuestas. Recuperás en tres meses.",
      },
      {
        texto: "Negar todo y amenazar con juicio.",
        efectos: { karma: -5, influencia: 5 },
        consecuenciaTexto:
          "El diario retrocede. Tu imagen queda intacta. El periodista te espera años.",
      },
      {
        texto: "Pagar al diario para que no salga.",
        efectos: { karma: -15, influencia: 8, riqueza: -15 },
        consecuenciaTexto:
          "Silencio total. Cinco años después, otro medio saca todo — incluido el pago. Escándalo doble.",
      },
      {
        texto: "Filtrar un escándalo de tu rival para tapar el tuyo.",
        efectos: { karma: -18, influencia: 15 },
        consecuenciaTexto:
          "Tu rival cae en desgracia. El tuyo pasa al olvido. Dormís con una incomodidad que no se va.",
      },
    ],
  },
  {
    id: "act-j-05",
    mundo: "actual",
    rolesRelevantes: ["artista"],
    etapaMax: "juventud",
    titulo: "El productor cuestionable",
    descripcion:
      "Un productor famoso quiere firmarte. Es una oportunidad enorme. Sabés que tuvo denuncias por abusos laborales.",
    icono: "🎙️",
    tags: ["etica", "dramatica"],
    opciones: [
      {
        texto: "Firmar y callar.",
        efectos: { karma: -10, influencia: 20, riqueza: 20, rango: "Artista con sello importante" },
        consecuenciaTexto:
          "Tu carrera despega. En entrevistas, cambiás de tema cuando te preguntan por él. Dura tres años.",
      },
      {
        texto: "Rechazar y denunciar públicamente.",
        efectos: { karma: 18, influencia: 5, riqueza: -10 },
        consecuenciaTexto:
          "Tu nombre se hace conocido por razones distintas. Algunas puertas se cierran. Otras se abren.",
      },
      {
        texto: "Firmar pero condicionar: cambio de equipo, cláusulas éticas.",
        efectos: { karma: 5, influencia: 15, riqueza: 10 },
        consecuenciaTexto:
          "Acepta algunas condiciones. Te considera molesto/a. Lográs cierta fama sin pactar del todo con él.",
      },
      {
        texto: "Firmar y juntar pruebas para denunciarlo cuando tengas más poder.",
        efectos: { karma: 0, influencia: 12, riqueza: 15, salud: -8 },
        consecuenciaTexto:
          "Cinco años después, con tu carrera consolidada, ayudás a destaparlo. El costo emocional es alto.",
      },
    ],
  },
  {
    id: "act-j-06",
    mundo: "actual",
    rolesRelevantes: ["periodista"],
    etapaMax: "juventud",
    titulo: "La fuente anónima",
    descripcion:
      "Una fuente te filtra documentos sobre un funcionario poderoso. Son auténticos pero la fuente podría tener motivos turbios.",
    icono: "📰",
    tags: ["etica", "poder"],
    opciones: [
      {
        texto: "Publicar sin investigar a la fuente.",
        efectos: { karma: 3, influencia: 15, riqueza: 5 },
        consecuenciaTexto:
          "Bomba mediática. Al mes se revela que la fuente era otro político rival. Tu credibilidad queda golpeada.",
      },
      {
        texto: "Publicar solo después de verificar con otras fuentes.",
        efectos: { karma: 10, influencia: 20 },
        consecuenciaTexto:
          "Tres meses de investigación. Publicás una nota sólida. Ganás un premio. Te llaman de medios grandes.",
      },
      {
        texto: "No publicar: no te convencen los motivos de la fuente.",
        efectos: { karma: 5, influencia: 0 },
        consecuenciaTexto:
          "Otros publican primero. Perdés la exclusiva. Tu redactor te mira serio pero respeta la decisión.",
      },
      {
        texto: "Negociar con el funcionario: ofrecer enterrar la nota por algo.",
        efectos: { karma: -20, influencia: 15, riqueza: 20 },
        consecuenciaTexto:
          "El funcionario paga. La nota muere. Te quedás con una libreta de contactos poderosa y una incomodidad permanente.",
      },
    ],
  },
  {
    id: "act-j-07",
    mundo: "actual",
    rolesRelevantes: ["medico"],
    etapaMax: "juventud",
    titulo: "El paciente sin papeles",
    descripcion:
      "Guardia de sábado. Llega un paciente grave sin documentos, sin cobertura. El jefe te pide derivarlo a un hospital público lejano.",
    icono: "🚑",
    tags: ["etica", "dramatica"],
    opciones: [
      {
        texto: "Atenderlo igual, asumiendo el costo para el hospital.",
        efectos: { karma: 15, influencia: -5, salud: -5 },
        consecuenciaTexto:
          "El paciente se recupera. El jefe te amonesta pero no te echa. Algunos colegas te respetan más.",
      },
      {
        texto: "Derivarlo como pide el protocolo.",
        efectos: { karma: -10, influencia: 3 },
        consecuenciaTexto:
          "Muere en el traslado. Nadie te responsabiliza. Pero vos sabés. Te persigue un año.",
      },
      {
        texto: "Atenderlo con lo mínimo y después derivarlo.",
        efectos: { karma: 3, influencia: 0, salud: -3 },
        consecuenciaTexto:
          "Lo estabilizás. Llega vivo al otro hospital. Te quedás pensando si pudiste haber hecho más.",
      },
      {
        texto: "Pagar vos el traslado privado para que llegue rápido.",
        efectos: { karma: 12, riqueza: -8 },
        consecuenciaTexto:
          "El paciente se recupera. Nunca se entera de lo que hiciste. Tu sueldo de residente queda chico ese mes.",
      },
    ],
  },
  {
    id: "act-j-08",
    mundo: "actual",
    rolesRelevantes: [],
    etapaMax: "juventud",
    titulo: "Un familiar enfermo",
    descripcion:
      "Tu abuelo/a queda postrado/a. No hay cuidadores. Tu familia te mira. Vos tenés el tiempo más flexible.",
    icono: "🏠",
    tags: ["familia", "dramatica"],
    opciones: [
      {
        texto: "Mudarte a cuidarlo/a tiempo completo.",
        efectos: { karma: 15, influencia: -10, riqueza: -15, salud: -5 },
        consecuenciaTexto:
          "Dos años de tu vida ahí. Tu carrera se congela. Cuando muere, dejás una mano tibia y algo para toda la vida.",
      },
      {
        texto: "Aportar dinero para contratar a alguien.",
        efectos: { karma: 3, riqueza: -15 },
        consecuenciaTexto:
          "La persona contratada es buena. Visitás los fines de semana. Todos ganan un poco. Nadie gana todo.",
      },
      {
        texto: "Decir que no podés y dejar que otro familiar se haga cargo.",
        efectos: { karma: -8, riqueza: 3, salud: 0 },
        consecuenciaTexto:
          "Tu hermana lo asume. Te mira distinto para siempre. Las cenas familiares se vuelven tensas.",
      },
      {
        texto: "Organizar una rotación entre todos los parientes.",
        efectos: { karma: 10, influencia: 5, salud: -3 },
        consecuenciaTexto:
          "Tres meses de negociación familiar. El sistema funciona raro pero funciona. Todos sufren menos.",
      },
    ],
  },
  {
    id: "act-j-09",
    mundo: "actual",
    rolesRelevantes: ["empresario", "politico"],
    etapaMax: "juventud",
    titulo: "El contrato del gobierno",
    descripcion:
      "Ganás una licitación pública. El funcionario que firma te sugiere que le 'regales' un viaje a su familia.",
    icono: "📝",
    tags: ["etica"],
    opciones: [
      {
        texto: "Aceptar. Es como funciona todo.",
        efectos: { karma: -12, influencia: 12, riqueza: 20 },
        consecuenciaTexto:
          "El contrato se firma. Viene otro más grande. Cinco años después, una investigación te incluye.",
      },
      {
        texto: "Rechazar con cortesía.",
        efectos: { karma: 8, influencia: -5, riqueza: -5 },
        consecuenciaTexto:
          "El contrato se traba meses. Al final sale por la fuerza de la burocracia. Ganás un nombre limpio pero menor.",
      },
      {
        texto: "Rechazar y denunciar.",
        efectos: { karma: 15, influencia: -15, riqueza: -10 },
        consecuenciaTexto:
          "Escándalo. El funcionario cae. Te cuesta años conseguir otro contrato público, pero los privados te buscan.",
      },
      {
        texto: "Proponer donar ese dinero a un proyecto que te convenga en imagen.",
        efectos: { karma: -3, influencia: 10, riqueza: 5 },
        consecuenciaTexto:
          "El funcionario acepta — le sirve igual. La fundación te queda como escudo en próximos escándalos.",
      },
    ],
  },
  {
    id: "act-j-10",
    mundo: "actual",
    rolesRelevantes: [],
    etapaMax: "juventud",
    titulo: "La oferta para irte del país",
    descripcion:
      "Una empresa extranjera te ofrece el doble de sueldo por irte afuera. Tu pareja y tu familia están acá.",
    icono: "✈️",
    tags: ["familia", "dramatica"],
    opciones: [
      {
        texto: "Irte solo/a y volver cada tanto.",
        efectos: { karma: -3, riqueza: 20, influencia: 10, salud: -5 },
        consecuenciaTexto:
          "El sueldo ayuda. Las visitas son cortas. Tu pareja dura tres años a distancia. La familia, más.",
      },
      {
        texto: "Irte con tu pareja.",
        efectos: { karma: 5, riqueza: 15, influencia: 8, salud: -3 },
        consecuenciaTexto:
          "Empiezan de cero afuera. Pelean los primeros meses. Después arman algo propio. Les cuesta volver.",
      },
      {
        texto: "Rechazar y quedarte.",
        efectos: { karma: 5, riqueza: 0, influencia: 0 },
        consecuenciaTexto:
          "Seguís tu vida. Cinco años después te preguntás a veces qué hubiera pasado. No te arrepentís demasiado.",
      },
      {
        texto: "Usar la oferta para negociar un aumento en tu trabajo actual.",
        efectos: { karma: 3, riqueza: 10, influencia: 8 },
        consecuenciaTexto:
          "Tu empresa aumenta el sueldo. El jefe te mira distinto: ahora sos 'de los que se van si pueden'.",
      },
    ],
  },
  {
    id: "act-j-11",
    mundo: "actual",
    rolesRelevantes: ["artista"],
    etapaMax: "juventud",
    titulo: "Publicidad con marca ética dudosa",
    descripcion:
      "Una marca de fast fashion te ofrece un contrato enorme. Son conocidos por condiciones laborales terribles.",
    icono: "📣",
    tags: ["etica"],
    opciones: [
      {
        texto: "Firmar. Necesitás el dinero.",
        efectos: { karma: -15, riqueza: 30, influencia: 10 },
        consecuenciaTexto:
          "Pagan un año de gastos. Un colectivo te cuestiona. Tu seguidor/a más fiel te da unfollow. Tu mamá te llama.",
      },
      {
        texto: "Rechazar con un tweet viral.",
        efectos: { karma: 15, riqueza: -10, influencia: 15 },
        consecuenciaTexto:
          "Tu gesto se hace público. Ganás seguidores y respeto. Otras marcas éticas te buscan.",
      },
      {
        texto: "Firmar y donar la mitad del cachet a organizaciones laborales.",
        efectos: { karma: 5, riqueza: 15, influencia: 5 },
        consecuenciaTexto:
          "Algunos lo leen como lavado, otros como coherencia. Todos tienen un poco de razón.",
      },
      {
        texto: "Rechazar en privado, sin hacer ruido.",
        efectos: { karma: 8, riqueza: -5, influencia: 0 },
        consecuenciaTexto:
          "Nadie se entera. Seguís buscando trabajo. Dormís bien. Ese mes, las cuentas duelen un poco.",
      },
    ],
  },
  {
    id: "act-j-12",
    mundo: "actual",
    rolesRelevantes: ["periodista"],
    etapaMax: "juventud",
    titulo: "La nota que te bajan",
    descripcion:
      "Editaste una investigación durante tres meses. El director te la baja: 'no es el momento'. Adivinás por qué — toca a un anunciante.",
    icono: "🗞️",
    tags: ["etica", "traicion"],
    opciones: [
      {
        texto: "Aceptar y guardar la nota para mejor momento.",
        efectos: { karma: -3, influencia: 3, salud: -3 },
        consecuenciaTexto:
          "Nunca llega el 'mejor momento'. Al final, otro medio la saca. Vos quedás con los materiales y el sabor amargo.",
      },
      {
        texto: "Filtrarla a un medio independiente.",
        efectos: { karma: 12, influencia: 0, riqueza: -5, salud: -5 },
        consecuenciaTexto:
          "Sale en otro lado. El director sospecha. Tu posición queda incómoda. Renunciás a los dos meses.",
      },
      {
        texto: "Renunciar y publicarla en tu propio blog.",
        efectos: { karma: 15, influencia: -5, riqueza: -15 },
        consecuenciaTexto:
          "Tu blog crece de a poco. Años después se vuelve referencia. El primer año, tus cuentas tiemblan.",
      },
      {
        texto: "Negociar: publicarla pero con menos nombres.",
        efectos: { karma: 0, influencia: 5 },
        consecuenciaTexto:
          "Sale diluida. Algunos lectores agradecen. Otros ven el nombre del anunciante y entienden todo.",
      },
    ],
  },
  // ============ MADUREZ ============
  {
    id: "act-m-01",
    mundo: "actual",
    rolesRelevantes: [],
    etapaMin: "madurez",
    etapaMax: "madurez",
    titulo: "Un hijo te dice que no quiere tu vida",
    descripcion:
      "Tu hijo/a, recién adolescente, te dice que no quiere seguir tu carrera. Que está cansado/a de que le proyectes lo que no fuiste.",
    icono: "👨‍👦",
    tags: ["familia", "legado"],
    opciones: [
      {
        texto: "Escuchar, disculparse, acompañarlo/a en lo que elija.",
        efectos: { karma: 15, influencia: 3 },
        consecuenciaTexto:
          "La relación cambia. Él/ella te cuenta más cosas. Termina eligiendo un camino raro que funciona.",
      },
      {
        texto: "Defender tu vida: mostrarle lo que costó lo que tiene.",
        efectos: { karma: -5, influencia: 0 },
        consecuenciaTexto:
          "Se va del cuarto gritando. Vuelve a cenar esa noche en silencio. La distancia va a durar años.",
      },
      {
        texto: "Proponerle un trato: que pruebe algo propio un año con tu apoyo.",
        efectos: { karma: 10, riqueza: -10 },
        consecuenciaTexto:
          "Prueba. Fracasa en lo que quiere, pero aprende cosas que no sabía. Vuelve a casa respetándote.",
      },
      {
        texto: "Ignorarlo y esperar que se le pase.",
        efectos: { karma: -10, influencia: 0 },
        consecuenciaTexto:
          "No se le pasa. A los 18 se va a vivir solo/a. Vuelve para Navidad con una pareja que no conocés.",
      },
    ],
  },
  {
    id: "act-m-02",
    mundo: "actual",
    rolesRelevantes: ["politico"],
    etapaMin: "madurez",
    etapaMax: "madurez",
    titulo: "Te ofrecen la presidencia del partido",
    descripcion:
      "Te proponen presidir el partido, pero a cambio tenés que abandonar un proyecto de ley que impulsaste desde cero.",
    icono: "🏛️",
    tags: ["poder", "etica"],
    opciones: [
      {
        texto: "Aceptar. Desde la presidencia vas a hacer más.",
        efectos: { karma: -5, influencia: 25, riqueza: 10, rango: "Presidente/a del partido" },
        consecuenciaTexto:
          "El proyecto muere. Hacés otras cosas desde arriba. A veces te preguntás si hubiera salido.",
      },
      {
        texto: "Rechazar. El proyecto es tu identidad.",
        efectos: { karma: 15, influencia: -10, riqueza: -5 },
        consecuenciaTexto:
          "El proyecto se aprueba al año. Te quedás como un referente menor pero respetado. No te arrepentís nunca.",
      },
      {
        texto: "Negociar: presidencia y el proyecto sobrevive en otra forma.",
        efectos: { karma: 3, influencia: 15, riqueza: 5 },
        consecuenciaTexto:
          "Presidís y el proyecto se aprueba diluido. No es lo que soñaste. Es algo.",
      },
      {
        texto: "Aceptar y usar la presidencia para impulsar el proyecto a pesar del acuerdo.",
        efectos: { karma: 5, influencia: 10 },
        consecuenciaTexto:
          "Peleás internamente meses. Te quieren sacar. Al final, el proyecto sale. Tu presidencia termina antes.",
      },
    ],
  },
  {
    id: "act-m-03",
    mundo: "actual",
    rolesRelevantes: ["empresario"],
    etapaMin: "madurez",
    etapaMax: "madurez",
    titulo: "Tu socio quiere traicionar a un cliente",
    descripcion:
      "Tu socio propone cerrar un contrato mintiendo sobre las condiciones. El cliente nunca se entera — el contrato es larguísimo. Son $5M.",
    icono: "🤝",
    tags: ["etica", "traicion"],
    opciones: [
      {
        texto: "Firmar sin decir nada.",
        efectos: { karma: -18, riqueza: 30, influencia: 10 },
        consecuenciaTexto:
          "Cobran. Cuatro años después el cliente empieza a leer letra chica. Empieza una tormenta.",
      },
      {
        texto: "Negarte y amenazar con romper la sociedad.",
        efectos: { karma: 12, influencia: 5, riqueza: -10 },
        consecuenciaTexto:
          "Tu socio retrocede. El contrato se cierra honestamente por menos. La relación entre ustedes queda resquebrajada.",
      },
      {
        texto: "Avisar al cliente de manera anónima.",
        efectos: { karma: 15, influencia: -10, riqueza: -15 },
        consecuenciaTexto:
          "El contrato se cae. El socio sospecha. La sociedad se rompe al año. Vos dormís bien.",
      },
      {
        texto: "Exigir cláusulas de protección al cliente antes de firmar.",
        efectos: { karma: 5, influencia: 10, riqueza: 15 },
        consecuenciaTexto:
          "Tu socio se enoja pero acepta. El cliente firma algo real. Gana un cliente satisfecho, y ganan menos.",
      },
    ],
  },
  {
    id: "act-m-04",
    mundo: "actual",
    rolesRelevantes: ["medico"],
    etapaMin: "madurez",
    etapaMax: "madurez",
    titulo: "Jefatura del hospital",
    descripcion:
      "Te ofrecen jefatura del servicio. Significa menos horas de guardia pero más política hospitalaria. Algunos colegas te apoyan por la política, no por el medicine.",
    icono: "🏥",
    tags: ["poder", "etica"],
    opciones: [
      {
        texto: "Aceptar y dedicarte a mejorar el servicio.",
        efectos: { karma: 10, influencia: 20, riqueza: 10, rango: "Jefe/a de servicio" },
        consecuenciaTexto:
          "Tres años de reformas. Algunos cambios duraderos. Perdés cercanía con algunos pacientes. Era necesario.",
      },
      {
        texto: "Rechazar: preferís el contacto clínico.",
        efectos: { karma: 8, influencia: -10 },
        consecuenciaTexto:
          "Otro toma el cargo. Gobierna con pragmatismo. Vos seguís salvando vidas en salas concretas.",
      },
      {
        texto: "Aceptar y devolver favores a quienes te apoyaron.",
        efectos: { karma: -10, influencia: 25, riqueza: 15 },
        consecuenciaTexto:
          "Crece un esquema de favores. El servicio anda bien. Algunos pacientes esperan más de la cuenta. Nadie se queja alto.",
      },
      {
        texto: "Aceptar solo si se renueva la mitad del staff administrativo.",
        efectos: { karma: 5, influencia: 15, salud: -5 },
        consecuenciaTexto:
          "Negociás durante semanas. Te ganás enemigos pero el servicio se oxigena. El primer año es infernal.",
      },
    ],
  },
  {
    id: "act-m-05",
    mundo: "actual",
    rolesRelevantes: [],
    etapaMin: "madurez",
    etapaMax: "madurez",
    titulo: "Crisis económica nacional",
    descripcion:
      "El país entra en recesión profunda. Tus ahorros pueden perder la mitad. Un amigo te pasa un dato de inversión riesgosa pero muy rentable.",
    icono: "📉",
    tags: ["etica", "dramatica"],
    opciones: [
      {
        texto: "Invertir en el dato del amigo.",
        efectos: { riqueza: 25, karma: -5, salud: -5 },
        consecuenciaTexto:
          "Funciona. Doblás tu capital. Dos amigos tuyos pierden todo en la misma crisis. No les contás cómo salvaste el tuyo.",
      },
      {
        texto: "Mover todo a dólares físicos en una caja de seguridad.",
        efectos: { riqueza: 5 },
        consecuenciaTexto:
          "Conservás valor pero no crecés. Dormís bien. Aprendés que 'no perder' es a veces ganar.",
      },
      {
        texto: "Ayudar con parte de tus ahorros a la familia ampliada que está peor.",
        efectos: { karma: 18, riqueza: -20 },
        consecuenciaTexto:
          "Dos primos salen a flote gracias a vos. Te quedan menos ahorros pero cenas familiares más alegres por años.",
      },
      {
        texto: "Aprovechar para comprar propiedades baratas a gente desesperada.",
        efectos: { karma: -15, riqueza: 20 },
        consecuenciaTexto:
          "Construís un patrimonio sólido. Dos familias recuerdan tu firma en los papeles. Te cruzan en la calle sin saludarte.",
      },
    ],
  },
  {
    id: "act-m-06",
    mundo: "actual",
    rolesRelevantes: ["artista"],
    etapaMin: "madurez",
    etapaMax: "madurez",
    titulo: "Crisis creativa larga",
    descripcion:
      "Llevás dos años sin producir nada que te guste. Las obras que salen son repeticiones. Tu agente te presiona para otro lanzamiento.",
    icono: "🎨",
    tags: ["dramatica"],
    opciones: [
      {
        texto: "Forzar un lanzamiento y salir de gira.",
        efectos: { riqueza: 15, karma: -3, salud: -10, influencia: 3 },
        consecuenciaTexto:
          "La crítica es tibia. Los fans lo aceptan pero no se emocionan. Vos te sentís hueco meses.",
      },
      {
        texto: "Tomarte un año sabático completo.",
        efectos: { karma: 8, riqueza: -20, salud: 10, influencia: -5 },
        consecuenciaTexto:
          "Viajás, leés, escribís sin publicar. Al año y medio, una obra nueva te sale de adentro. Es la mejor en años.",
      },
      {
        texto: "Colaborar con un artista joven para renovarte.",
        efectos: { karma: 10, influencia: 10, riqueza: 5 },
        consecuenciaTexto:
          "Hacen algo híbrido. A la crítica la divide. A vos te revive. El joven te menciona en entrevistas.",
      },
      {
        texto: "Anunciar tu retiro. Ver qué pasa.",
        efectos: { influencia: -5, salud: 5 },
        consecuenciaTexto:
          "La gente habla de tu retiro. Una ola de nostalgia renueva tu catálogo. Volvés en dos años 'por última vez'.",
      },
    ],
  },
  {
    id: "act-m-07",
    mundo: "actual",
    rolesRelevantes: [],
    etapaMin: "madurez",
    etapaMax: "madurez",
    titulo: "Un viejo amor reaparece",
    descripcion:
      "En una boda te cruzás con alguien con quien saliste hace veinte años. Están juntos tres horas hablando. Tu pareja no estaba ahí.",
    icono: "💌",
    tags: ["amor", "familia"],
    opciones: [
      {
        texto: "Contarle todo a tu pareja al llegar a casa.",
        efectos: { karma: 10, influencia: 0, salud: 0 },
        consecuenciaTexto:
          "Pelean un rato. Después hablan más que en años. La relación se fortalece — o al menos, se hace más honesta.",
      },
      {
        texto: "No decir nada y borrar los mensajes.",
        efectos: { karma: -5, salud: -3 },
        consecuenciaTexto:
          "Vida sigue. A veces pensás en esa noche. Las fotos de la boda te incomodan cada tanto.",
      },
      {
        texto: "Mantener un chat que se vuelve cada vez más intenso.",
        efectos: { karma: -15, salud: -10 },
        consecuenciaTexto:
          "Seis meses de doble vida. Termina mal. Tu pareja descubre todo. La ruptura es lenta y fea.",
      },
      {
        texto: "Cortar el contacto después de esa noche.",
        efectos: { karma: 8, salud: 0 },
        consecuenciaTexto:
          "Una conversación difícil al otro día. Se despiden con dignidad. Tu pareja no se entera nunca, y no hace falta.",
      },
    ],
  },
  {
    id: "act-m-08",
    mundo: "actual",
    rolesRelevantes: ["periodista", "politico", "empresario"],
    etapaMin: "madurez",
    etapaMax: "madurez",
    titulo: "Amenaza grave",
    descripcion:
      "Recibís una amenaza creíble por un trabajo tuyo. Hay antecedentes de gente en tu posición que terminó mal.",
    icono: "⚠️",
    tags: ["dramatica"],
    opciones: [
      {
        texto: "Seguir adelante con custodia.",
        efectos: { karma: 10, influencia: 10, riqueza: -10, salud: -5 },
        consecuenciaTexto:
          "Dos años con guardaespaldas. Tu trabajo sale. Nada grave pasa. Vivís con miedo de fondo por años.",
      },
      {
        texto: "Frenar la investigación/proyecto.",
        efectos: { karma: -10, influencia: -10, salud: 5 },
        consecuenciaTexto:
          "Todo se detiene. Dormís mejor. Con los años te arrepentís, pero no lo decís mucho.",
      },
      {
        texto: "Hacer público el tema y la amenaza.",
        efectos: { karma: 15, influencia: 15, salud: -8 },
        consecuenciaTexto:
          "Escándalo. El que amenazaba pierde poder. Tu trabajo se acelera. Ganás aliados inesperados.",
      },
      {
        texto: "Salir del país unos meses.",
        efectos: { karma: 0, influencia: -5, riqueza: -15 },
        consecuenciaTexto:
          "Una pausa forzosa. Volvés con ganas y con perspectiva. La historia sigue, con vos o sin vos.",
      },
    ],
  },
  {
    id: "act-m-09",
    mundo: "actual",
    rolesRelevantes: [],
    etapaMin: "madurez",
    etapaMax: "madurez",
    titulo: "Salud mental en crisis",
    descripcion:
      "Llevás meses con insomnio, ansiedad, llanto sin motivo. El trabajo no para. Tu entorno no nota.",
    icono: "🌧️",
    tags: ["dramatica"],
    opciones: [
      {
        texto: "Empezar terapia y medicación con un profesional serio.",
        efectos: { salud: 15, riqueza: -8, karma: 5 },
        consecuenciaTexto:
          "Seis meses duros. Después, algo se afloja. Aprendés cosas de vos que no querías ver.",
      },
      {
        texto: "Seguir empujando. 'Se me va a pasar'.",
        efectos: { salud: -20, influencia: 5 },
        consecuenciaTexto:
          "A los dos años colapsás. Licencia forzada. Volver cuesta más que si hubieras parado antes.",
      },
      {
        texto: "Tomarte una licencia larga y viajar sin rumbo.",
        efectos: { salud: 10, riqueza: -15, influencia: -5 },
        consecuenciaTexto:
          "Tres meses por otros países. Volvés cansado pero con ganas. Tu trabajo te espera con otra cara.",
      },
      {
        texto: "Cambiar radicalmente de trabajo.",
        efectos: { salud: 8, riqueza: -10, influencia: -10 },
        consecuenciaTexto:
          "Reinvención total. Ganás menos pero estás vivo. Algunos amigos te piden consejos; te buscan distinto.",
      },
    ],
  },
  {
    id: "act-m-10",
    mundo: "actual",
    rolesRelevantes: ["empresario", "politico"],
    etapaMin: "madurez",
    etapaMax: "madurez",
    titulo: "Despido masivo inminente",
    descripcion:
      "La empresa/gestión tiene que despedir 200 personas para sobrevivir. El equipo financiero ya tiene la lista.",
    icono: "📋",
    tags: ["etica", "poder"],
    opciones: [
      {
        texto: "Firmar los despidos tal como vienen.",
        efectos: { karma: -12, influencia: 5, riqueza: 10 },
        consecuenciaTexto:
          "La empresa sobrevive. 200 familias en crisis. Vos recordás algunos apellidos de la lista años después.",
      },
      {
        texto: "Renegociar con sindicatos: menos despidos pero recortes de sueldo.",
        efectos: { karma: 10, influencia: 10, riqueza: -5 },
        consecuenciaTexto:
          "Negociación de meses. Despiden a 80 en lugar de 200. La empresa sobrevive más tensa pero viva.",
      },
      {
        texto: "Bajarse vos mismo el sueldo y pedir que todos los directivos hagan lo mismo.",
        efectos: { karma: 18, influencia: 15, riqueza: -15 },
        consecuenciaTexto:
          "Algunos directivos renuncian furiosos. Otros te siguen. Despiden a 50. Tu nombre queda en la memoria del staff.",
      },
      {
        texto: "Renunciar y no firmar ninguna lista.",
        efectos: { karma: 8, influencia: -15, riqueza: -20 },
        consecuenciaTexto:
          "Alguien más firma. Los despidos ocurren igual. Vos no firmaste. Te queda eso, y no mucho más.",
      },
    ],
  },
  // ============ VEJEZ ============
  {
    id: "act-v-01",
    mundo: "actual",
    rolesRelevantes: [],
    etapaMin: "vejez",
    titulo: "Jubilación y vacío",
    descripcion:
      "Te jubilás. El primer mes es alivio. El tercer mes, el silencio del departamento te pesa.",
    icono: "🪑",
    tags: ["legado"],
    opciones: [
      {
        texto: "Volver a trabajar de consultor/a.",
        efectos: { riqueza: 10, influencia: 5, salud: -5 },
        consecuenciaTexto:
          "Seguís sintiéndote útil. El ritmo es más suave. Algunos jóvenes te respetan genuinamente.",
      },
      {
        texto: "Dedicarte a un hobby que siempre postergaste.",
        efectos: { karma: 10, salud: 8 },
        consecuenciaTexto:
          "Pintás, escribís, jardín, lo que sea. Al año tenés amigos nuevos que no sabían lo que hacías antes.",
      },
      {
        texto: "Viajar mientras el cuerpo aguante.",
        efectos: { karma: 5, riqueza: -20, salud: 5 },
        consecuenciaTexto:
          "Cinco años de viajes. Volvés con cuadernos llenos. Nietos con mapas que vos les regalaste.",
      },
      {
        texto: "Dedicarte a cuidar a tus nietos.",
        efectos: { karma: 15, salud: 0 },
        consecuenciaTexto:
          "Tus hijos te necesitan. Tus nietos te aman. Te convertís en el abuelo/a que no tuviste.",
      },
    ],
  },
  {
    id: "act-v-02",
    mundo: "actual",
    rolesRelevantes: [],
    etapaMin: "vejez",
    titulo: "Un hijo te pide ayuda financiera grande",
    descripcion:
      "Tu hijo/a adulto/a está mal económicamente. Te pide una suma que alteraría tus planes de vejez.",
    icono: "💳",
    tags: ["familia"],
    opciones: [
      {
        texto: "Darle lo que pide sin condiciones.",
        efectos: { karma: 10, riqueza: -25 },
        consecuenciaTexto:
          "Tu vejez se hace más austera. Tu hijo/a se recupera. Años después te devuelve lo que puede.",
      },
      {
        texto: "Darle una parte y ayudarle a armar un plan.",
        efectos: { karma: 10, riqueza: -15, influencia: 5 },
        consecuenciaTexto:
          "Le costó aceptar los consejos. Al segundo año, logra estabilidad. Te lo agradece en una cena.",
      },
      {
        texto: "Negar el dinero: 'es momento que aprendas'.",
        efectos: { karma: -8, riqueza: 0 },
        consecuenciaTexto:
          "Lo logra solo/a con años de sufrimiento. Te guarda rencor. Hablan de vez en cuando.",
      },
      {
        texto: "Ofrecerle mudarse con vos para ahorrar.",
        efectos: { karma: 8, riqueza: -5, salud: 0 },
        consecuenciaTexto:
          "Conviven dos años. Complicado al principio, lindo al final. Entiende cosas de vos que no sabía.",
      },
    ],
  },
  {
    id: "act-v-03",
    mundo: "actual",
    rolesRelevantes: [],
    etapaMin: "vejez",
    titulo: "La enfermedad seria",
    descripcion:
      "Te diagnostican algo que puede ser terminal. Hay tratamiento invasivo, muy duro, con 50% de éxito.",
    icono: "💊",
    tags: ["dramatica", "muerte"],
    opciones: [
      {
        texto: "Hacer el tratamiento completo.",
        efectos: { salud: 20, riqueza: -25, karma: 0 },
        consecuenciaTexto:
          "Meses de sufrimiento. Sobrevivís. Te quedan años más, diferentes, con otra relación con el cuerpo.",
      },
      {
        texto: "Rechazar el tratamiento: calidad sobre cantidad.",
        efectos: { salud: -15, karma: 5 },
        consecuenciaTexto:
          "Los meses que te quedan los usás con intención. Te despedís con tiempo de los que querés.",
      },
      {
        texto: "Hacer solo tratamientos paliativos.",
        efectos: { salud: 0, karma: 3 },
        consecuenciaTexto:
          "Sobrevivís un año más sin grandes dolores. Ni lucha total ni rendición. Algo en el medio.",
      },
      {
        texto: "Hacer el tratamiento y usar tus últimos ahorros en viajes entre ciclos.",
        efectos: { salud: 10, riqueza: -25, karma: 8 },
        consecuenciaTexto:
          "Tratás y vivís. Algunos viajes cortos, con los tuyos. Las fotos que dejás son un regalo.",
      },
    ],
  },
  {
    id: "act-v-04",
    mundo: "actual",
    rolesRelevantes: [],
    etapaMin: "vejez",
    titulo: "Las memorias",
    descripcion:
      "Un editor te propone escribir tus memorias. Hay cosas que contar que pueden doler a personas vivas.",
    icono: "📖",
    tags: ["legado"],
    opciones: [
      {
        texto: "Escribir todo sin censura.",
        efectos: { karma: 5, influencia: 15, riqueza: 15 },
        consecuenciaTexto:
          "Sale. Escándalo leve. Dos familiares no te hablan más. Se convierte en referencia histórica.",
      },
      {
        texto: "Escribir pero cambiar nombres y detalles sensibles.",
        efectos: { karma: 10, influencia: 8, riqueza: 10 },
        consecuenciaTexto:
          "Sale suave. Algunos identifican a las personas igual. Ganás lectores sin destrozar vínculos.",
      },
      {
        texto: "Rechazar: 'mi vida no es material'.",
        efectos: { karma: 5, influencia: -3 },
        consecuenciaTexto:
          "Escribe otra persona una biografía tuya, con datos públicos. Es decente pero no es tuya.",
      },
      {
        texto: "Escribir pero pedir que se publique post-mortem.",
        efectos: { karma: 8, influencia: 10 },
        consecuenciaTexto:
          "Treinta años después sale, sin vos. Genera conversación. Tus nietos la leen con orgullo incómodo.",
      },
    ],
  },
];
