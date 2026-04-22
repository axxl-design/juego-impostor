import type { Carta } from "./types";

export const CARTAS_MEDIEVAL: Carta[] = [
  // ============ JUVENTUD ============
  {
    id: "med-j-01",
    mundo: "medieval",
    rolesRelevantes: [],
    etapaMax: "juventud",
    titulo: "La cosecha que no fue",
    descripcion:
      "Una helada tardía arruinó medio campo. El recaudador del señor llega el lunes. Tu familia mira el suelo.",
    icono: "🌾",
    tags: ["cotidiana", "familia"],
    opciones: [
      {
        texto: "Vender el último caballo para cubrir el tributo.",
        efectos: { riqueza: -10, salud: -5, karma: 3 },
        consecuenciaTexto: "Tu padre no dice nada. Tu madre llora esa noche. Cubriste el tributo.",
      },
      {
        texto: "Mentir al recaudador diciendo que la plaga mató más de lo que mató.",
        efectos: { karma: -6, influencia: 3, riqueza: 5 },
        consecuenciaTexto:
          "El recaudador duda pero firma. Tu vecino te mira sabiendo que mentiste. Le conviene callar.",
      },
      {
        texto: "Proponer al señor labrar sus tierras en lugar del tributo.",
        efectos: { karma: 4, influencia: 5, salud: -8 },
        consecuenciaTexto: "El capataz te ríe en la cara, pero acepta. Esa temporada dormís menos.",
      },
      {
        texto: "Robar grano de un vecino más acomodado.",
        efectos: { karma: -12, riqueza: 8, influencia: -3 },
        consecuenciaTexto: "Nadie lo sabe. Vos, sí. El granero del vecino queda un poco más vacío cada mes.",
      },
    ],
  },
  {
    id: "med-j-02",
    mundo: "medieval",
    rolesRelevantes: [],
    etapaMax: "juventud",
    titulo: "La feria del pueblo",
    descripcion:
      "Hay una feria en la plaza. Vienen mercaderes de ciudades lejanas. La oportunidad no vuelve por meses.",
    icono: "🎪",
    tags: ["cotidiana"],
    opciones: [
      {
        texto: "Invertir tus ahorros en telas para revender.",
        efectos: { riqueza: 10, influencia: 4 },
        consecuenciaTexto: "Vendés bien. Volvés con el triple de lo gastado. Te ganás un nombre modesto.",
      },
      {
        texto: "Gastar en vino y compañía — te lo merecés.",
        efectos: { riqueza: -8, salud: 5, karma: -2 },
        consecuenciaTexto: "Te despertás con resaca y menos moneda, pero esa noche la contás años.",
      },
      {
        texto: "Escuchar chismes de nobles en la taberna.",
        efectos: { influencia: 6, karma: -1 },
        consecuenciaTexto: "Descubrís que el barón de Valois está por caer. Guardás el dato.",
      },
      {
        texto: "Perseguir a un ladrón que robó a una viuda.",
        efectos: { karma: 8, salud: -10, influencia: 3 },
        consecuenciaTexto: "Lo alcanzás tras tres calles. Le devolvés la bolsa. Llevás una cicatriz nueva.",
      },
    ],
  },
  {
    id: "med-j-03",
    mundo: "medieval",
    rolesRelevantes: ["campesino", "artesano", "bardo"],
    etapaMax: "juventud",
    titulo: "Reclutamiento forzoso",
    descripcion:
      "Un sargento del rey golpea tu puerta. La guerra contra los reinos del sur demanda hombres jóvenes. Te tocó.",
    icono: "⚔️",
    tags: ["guerra", "dramatica"],
    opciones: [
      {
        texto: "Ir a la guerra sin quejarte. Quizás volvés con honores.",
        efectos: { salud: -20, influencia: 15, karma: -5, rango: "Soldado de leva" },
        consecuenciaTexto: "Sobrevivís dos batallas. Volvés con una medalla y un temblor en la mano derecha.",
      },
      {
        texto: "Pagar al sargento para quedarte.",
        efectos: { riqueza: -25, karma: -3, influencia: -3 },
        consecuenciaTexto: "El sargento acepta la moneda. Tu nombre desaparece de la lista. Pero ya no sos el mismo.",
        requiereRiquezaMin: 25,
      },
      {
        texto: "Huir al bosque y volverte jornalero de otro reino.",
        efectos: { karma: -4, salud: -10, influencia: -10, riqueza: -5 },
        consecuenciaTexto: "Sobrevivís, pero vivís con otro nombre. Tu familia ya no puede volver a llamarte.",
      },
      {
        texto: "Organizar a otros jóvenes del pueblo para negociar con el señor.",
        efectos: { karma: 10, influencia: 8, salud: -5 },
        consecuenciaTexto:
          "El señor accede a enviar la mitad de los reclutas. Algunos te odian. Otros te deben la vida.",
      },
    ],
  },
  {
    id: "med-j-04",
    mundo: "medieval",
    rolesRelevantes: ["caballero"],
    etapaMax: "juventud",
    titulo: "Tu primer combate real",
    descripcion:
      "Tu señor te ordena marchar con sus tropas a sofocar una revuelta campesina. Los rebeldes son hambrientos, no soldados.",
    icono: "🛡️",
    tags: ["guerra", "dramatica", "etica"],
    opciones: [
      {
        texto: "Cumplir la orden: cargar al frente.",
        efectos: { influencia: 10, karma: -15, riqueza: 5 },
        consecuenciaTexto:
          "La carga es breve y brutal. Tu armadura queda manchada. El señor te felicita. Dormís mal seis meses.",
      },
      {
        texto: "Proponer primero una tregua para escucharlos.",
        efectos: { karma: 12, influencia: -5 },
        consecuenciaTexto:
          "Parley de tres horas. Cae el número de víctimas. El capitán te marca como tibio.",
      },
      {
        texto: "Pelear, pero perdonar a los heridos que se rinden.",
        efectos: { karma: 5, influencia: 3, salud: -5 },
        consecuenciaTexto: "Algunos rebeldes vuelven vivos a sus familias. Nadie te lo olvida, ni bueno ni malo.",
      },
      {
        texto: "Fingir una herida y retirarte del campo.",
        efectos: { karma: -3, influencia: -12, salud: -3 },
        consecuenciaTexto:
          "Te cubrís con un rasguño. El capitán sospecha pero no dice nada. Tu ascenso se retrasa diez años.",
      },
    ],
  },
  {
    id: "med-j-05",
    mundo: "medieval",
    rolesRelevantes: ["noble", "caballero"],
    etapaMax: "juventud",
    titulo: "El casamiento arreglado",
    descripcion:
      "Tus padres pactaron tu matrimonio con alguien que no conocés. La familia trae tierras, títulos, deudas y un carácter difícil.",
    icono: "💍",
    tags: ["amor", "familia"],
    opciones: [
      {
        texto: "Aceptar el pacto. Es lo que se hace en tu casa.",
        efectos: { riqueza: 15, influencia: 10, karma: -2, rango: "Esposo/a de casa noble" },
        consecuenciaTexto:
          "La boda es fría pero impecable. Los años siguientes tienen paz fragil y algunas noches tristes.",
      },
      {
        texto: "Romper el pacto públicamente. Enamorate de quien vos elijas.",
        efectos: { karma: 8, influencia: -20, riqueza: -15 },
        consecuenciaTexto: "Escándalo en la corte. Tu familia te habla menos. Te sentís libre, y pobre.",
      },
      {
        texto: "Aceptar el matrimonio pero mantener amor en secreto con alguien más.",
        efectos: { karma: -5, influencia: 5, riqueza: 8 },
        consecuenciaTexto: "Tenés dos vidas. Ninguna te pertenece del todo. Pero funcionan, por ahora.",
      },
      {
        texto: "Negociar: aceptar si te dan voz en las decisiones del señorío.",
        efectos: { karma: 3, influencia: 15, riqueza: 5 },
        consecuenciaTexto: "Tu futura pareja sonríe por primera vez: le gustó que pelees. Es un comienzo raro pero honesto.",
      },
    ],
  },
  {
    id: "med-j-06",
    mundo: "medieval",
    rolesRelevantes: ["bardo"],
    etapaMax: "juventud",
    titulo: "La canción prohibida",
    descripcion:
      "Escribiste una balada que ridiculiza al obispo del condado. La gente la tararea en los bosques. Un funcionario te pide los pergaminos.",
    icono: "🎶",
    tags: ["etica", "traicion"],
    opciones: [
      {
        texto: "Entregar los pergaminos y pedir perdón.",
        efectos: { karma: -4, influencia: -8, salud: 3 },
        consecuenciaTexto:
          "El obispo te perdona en público. En privado, tu nombre queda marcado en una lista larga.",
      },
      {
        texto: "Negar que sea tuya y culpar a otro bardo.",
        efectos: { karma: -12, influencia: 2, salud: 5 },
        consecuenciaTexto:
          "El otro bardo termina en un calabozo. Salís limpio. Cuando cantás, la garganta te pesa.",
      },
      {
        texto: "Reclamarla con orgullo y multiplicarla en otras plazas.",
        efectos: { karma: 10, influencia: 10, salud: -15, riqueza: -5 },
        consecuenciaTexto:
          "Te meten preso tres meses. Cuando salís, sos leyenda. Los juglares cantan tu balada por años.",
      },
      {
        texto: "Huir del condado antes de que llegue el juicio.",
        efectos: { karma: 2, influencia: -5, riqueza: -10, salud: -5 },
        consecuenciaTexto:
          "Cruzás la frontera con lo puesto. Tres reinos de distancia, la canción sigue llegando antes que vos.",
      },
    ],
  },
  {
    id: "med-j-07",
    mundo: "medieval",
    rolesRelevantes: ["artesano"],
    etapaMax: "juventud",
    titulo: "El encargo del castillo",
    descripcion:
      "El alcaide te encarga forjar una espada ceremonial. Paga el doble, pero te pide que escondas un pequeño compartimiento en el pomo. No pregunta para qué.",
    icono: "🗡️",
    tags: ["etica"],
    opciones: [
      {
        texto: "Cumplir el encargo sin hacer preguntas.",
        efectos: { riqueza: 20, karma: -5, influencia: 5 },
        consecuenciaTexto:
          "Recibís la paga. Un mes después, oís que murió un noble rival del alcaide. No sabés si fue el pomo. Igual no dormís bien.",
      },
      {
        texto: "Avisar al noble rival en secreto.",
        efectos: { karma: 10, influencia: 10, salud: -5, riqueza: -15 },
        consecuenciaTexto:
          "El noble te paga en silencio para que calles el resto de tus días. Quedás en medio de dos enemigos.",
      },
      {
        texto: "Forjar la espada sin el compartimiento y decir que era imposible.",
        efectos: { karma: 6, influencia: -5, riqueza: -5 },
        consecuenciaTexto:
          "El alcaide paga la mitad y te quita futuros trabajos. Quedaste con la conciencia — y con menos plata.",
      },
      {
        texto: "Sabotear el compartimiento para que nunca se abra.",
        efectos: { karma: 4, influencia: 3, riqueza: 10 },
        consecuenciaTexto:
          "El alcaide no se entera. Cobraste completo. La espada se hereda, no se usa. Nadie muere.",
      },
    ],
  },
  {
    id: "med-j-08",
    mundo: "medieval",
    rolesRelevantes: ["campesino", "artesano"],
    etapaMax: "juventud",
    titulo: "La peste llega al pueblo",
    descripcion:
      "Tres casas tienen enfermos. El médico del señor solo atiende nobles. La gente empieza a señalar a una vieja hierbatera.",
    icono: "🦠",
    tags: ["dramatica", "muerte", "etica"],
    opciones: [
      {
        texto: "Ayudar a la hierbatera a atender enfermos.",
        efectos: { karma: 15, salud: -20, influencia: 5 },
        consecuenciaTexto:
          "Se salvan más de los que pensaban. Vos enfermás, pero te recuperás. El pueblo te pone un apodo nuevo.",
      },
      {
        texto: "Encerrarte en tu casa con comida para un mes.",
        efectos: { karma: -3, salud: 5, riqueza: -8 },
        consecuenciaTexto:
          "Sobrevivís. Cuando salís, faltan caras conocidas. Nadie te lo reprocha, pero tampoco te saludan igual.",
      },
      {
        texto: "Llevar la acusación de la vieja al cura para quedar bien con el pueblo.",
        efectos: { karma: -15, influencia: 10, salud: 0 },
        consecuenciaTexto:
          "La hierbatera es expulsada. El pueblo te considera un líder. Los enfermos siguen enfermos, pero nadie te mira.",
      },
      {
        texto: "Escapar al pueblo vecino por unas semanas.",
        efectos: { karma: -5, salud: 8, influencia: -8, riqueza: -5 },
        consecuenciaTexto:
          "La peste pasa. Cuando volvés, te miran con distancia. Te recuperaste, pero algo no vuelve.",
      },
    ],
  },
  {
    id: "med-j-09",
    mundo: "medieval",
    rolesRelevantes: [],
    etapaMax: "juventud",
    titulo: "Un romance inesperado",
    descripcion:
      "Alguien de una familia rival del pueblo empieza a buscarte en las ferias. Los ojos se encuentran demasiado seguido.",
    icono: "💘",
    tags: ["amor", "familia"],
    opciones: [
      {
        texto: "Dejarte llevar. La vida es corta.",
        efectos: { karma: 4, salud: 10, influencia: -5, riqueza: -3 },
        consecuenciaTexto:
          "Se ven a escondidas. Es feliz y es peligroso. Las familias van a enterarse antes o después.",
      },
      {
        texto: "Cortar por lo sano antes de que crezca.",
        efectos: { karma: 2, salud: -3, influencia: 3 },
        consecuenciaTexto:
          "Pasás años pensando en qué hubiese pasado. Tu vida sigue, tranquila, sin esa chispa.",
      },
      {
        texto: "Buscar una alianza entre las familias a través tuyo.",
        efectos: { karma: 8, influencia: 10, salud: -5 },
        consecuenciaTexto:
          "Meses de negociación tensa. Al final, un pacto frágil. La aldea gana un año de paz.",
      },
      {
        texto: "Usar el romance para obtener información de la familia rival.",
        efectos: { karma: -12, influencia: 12, salud: -5 },
        consecuenciaTexto:
          "Le sacás secretos sin que se dé cuenta. Los usás bien. Cuando lo descubre, algo se rompe — en los dos.",
      },
    ],
  },
  {
    id: "med-j-10",
    mundo: "medieval",
    rolesRelevantes: ["noble"],
    etapaMax: "juventud",
    titulo: "Intriga en la corte menor",
    descripcion:
      "Un primo segundo te invita a una conspiración contra el conde del distrito. Promete títulos, tierras, y una 'nueva era'.",
    icono: "🗝️",
    tags: ["traicion", "poder", "dramatica"],
    opciones: [
      {
        texto: "Aceptar y conspirar en silencio.",
        efectos: { karma: -10, influencia: 20, riqueza: 15, salud: -5 },
        consecuenciaTexto:
          "La conspiración triunfa. Recibís tierras nuevas. Cada banquete te recuerda a quiénes traicionaron.",
      },
      {
        texto: "Fingir aceptar y delatar al conde.",
        efectos: { karma: -5, influencia: 25, riqueza: 10 },
        consecuenciaTexto:
          "Tu primo cae. El conde te da favor. Te queda un apodo en los pasillos: el doble lengua.",
      },
      {
        texto: "Rechazar el ofrecimiento con respeto.",
        efectos: { karma: 8, influencia: -3 },
        consecuenciaTexto:
          "Tu primo no te habla más. La conspiración igual pasa sin vos. Quedás limpio pero al margen.",
      },
      {
        texto: "Advertir al conde de modo anónimo.",
        efectos: { karma: 6, influencia: 8 },
        consecuenciaTexto:
          "El conde refuerza guardias. Algunos caen, otros huyen. Tu primo sospecha pero no tiene prueba.",
      },
    ],
  },
  {
    id: "med-j-11",
    mundo: "medieval",
    rolesRelevantes: ["bardo", "artesano"],
    etapaMax: "juventud",
    titulo: "La invitación a la capital",
    descripcion:
      "Un noble de paso escucha tu trabajo y te invita a presentarte en la capital. Es una oportunidad enorme — y un salto al vacío.",
    icono: "🏛️",
    tags: ["descubrimiento"],
    opciones: [
      {
        texto: "Ir. Todo o nada.",
        efectos: { influencia: 20, riqueza: -10, salud: -5, rango: "Profesional de la capital" },
        consecuenciaTexto: "La capital es cruel. Tres meses de hambre. Después, una puerta se abre.",
      },
      {
        texto: "Quedarte. Tu pueblo te necesita.",
        efectos: { karma: 5, influencia: 3, riqueza: 5 },
        consecuenciaTexto:
          "Vivís bien, con tu gente. La oportunidad no vuelve. Dormís tranquilo.",
      },
      {
        texto: "Ir, pero con un plan — ahorrar primero, salir cuando puedas volver.",
        efectos: { influencia: 12, riqueza: 5, salud: -3 },
        consecuenciaTexto:
          "Arrancás con pies de plomo. Crecés despacio. No brillás, pero no te caés.",
      },
      {
        texto: "Pedirle al noble que te financie.",
        efectos: { influencia: 10, riqueza: 10, karma: -3 },
        consecuenciaTexto:
          "Te lleva como protegido. Le debés todo. Le servís, pero empezás a ver cómo él te usa.",
      },
    ],
  },
  {
    id: "med-j-12",
    mundo: "medieval",
    rolesRelevantes: ["caballero"],
    etapaMax: "juventud",
    titulo: "Un caballero rival te desafía",
    descripcion:
      "En un torneo de tercera categoría, un caballero más veterano te provoca delante de todos. Quiere pelear. Tu honor está en juego.",
    icono: "🤺",
    tags: ["dramatica"],
    opciones: [
      {
        texto: "Aceptar el duelo y pelear con todo.",
        efectos: { salud: -15, influencia: 15, karma: 0 },
        consecuenciaTexto:
          "Lo derrotás, pero él te deja una herida que te acompaña. Ganás respeto pero también un enemigo.",
      },
      {
        texto: "Rechazar con una frase ingeniosa que desarme la provocación.",
        efectos: { karma: 5, influencia: 8, salud: 0 },
        consecuenciaTexto:
          "La gente ríe. El rival se retira humillado. Años después, te busca de nuevo, más furioso.",
      },
      {
        texto: "Proponer un desafío de habilidad en lugar de sangre.",
        efectos: { influencia: 10, karma: 3 },
        consecuenciaTexto:
          "Competencia de arquería. Empatan. Ambos quedan bien. Se respetan de lejos desde ese día.",
      },
      {
        texto: "Pedirle a tu escudero que acepte el duelo en tu lugar.",
        efectos: { karma: -10, influencia: -5, salud: 3 },
        consecuenciaTexto:
          "Tu escudero cae herido. Sobrevive. Nunca vuelve a mirarte a los ojos de la misma manera.",
      },
    ],
  },
  {
    id: "med-j-13",
    mundo: "medieval",
    rolesRelevantes: [],
    etapaMax: "juventud",
    titulo: "Hambruna en la aldea vecina",
    descripcion:
      "La aldea vecina tuvo dos cosechas perdidas. Hombres desesperados merodean el camino. Tu pueblo armó una guardia.",
    icono: "🥖",
    tags: ["etica", "dramatica"],
    opciones: [
      {
        texto: "Donar parte de tu despensa para que coman.",
        efectos: { karma: 14, riqueza: -15, influencia: 8 },
        consecuenciaTexto:
          "Algunos viven por vos. Tu familia come menos en invierno. Pero duermen tranquilos.",
      },
      {
        texto: "Organizar a los hombres del pueblo para repeler a los extraños.",
        efectos: { karma: -4, influencia: 10, salud: -5 },
        consecuenciaTexto:
          "El camino queda limpio. Dos muertos en la zanja. Tu pueblo duerme con las puertas trancadas.",
      },
      {
        texto: "Vender grano caro a los hambrientos que tengan algo para pagar.",
        efectos: { karma: -10, riqueza: 20, influencia: 3 },
        consecuenciaTexto:
          "Ganaste una fortuna. Aprendiste cuánto se puede cobrar por hambre. Eso no se olvida.",
      },
      {
        texto: "Ir a la aldea vecina a ayudar a organizar su cosecha.",
        efectos: { karma: 10, influencia: 5, salud: -10 },
        consecuenciaTexto:
          "Pasás seis semanas allá. Volvés flaco. La aldea vecina te recibe cada año con un asado.",
      },
    ],
  },
  {
    id: "med-j-14",
    mundo: "medieval",
    rolesRelevantes: [],
    etapaMax: "juventud",
    titulo: "El hijo que no planeabas",
    descripcion:
      "Te enterás de que vas a ser padre/madre. No estabas preparado/a. Ni vos ni la otra persona.",
    icono: "👶",
    tags: ["familia", "dramatica"],
    opciones: [
      {
        texto: "Asumir la responsabilidad: casarte y criar.",
        efectos: { karma: 10, riqueza: -10, salud: -5, rango: "Padre/madre de familia" },
        consecuenciaTexto:
          "La vida se ordena distinto. Menos libertad, más propósito. Tu primer hijo aprende a caminar rápido.",
      },
      {
        texto: "Mandar dinero pero seguir tu vida.",
        efectos: { karma: -8, riqueza: -5, influencia: 0 },
        consecuenciaTexto:
          "El chico crece sabiendo que hay un padre/madre lejano. Te odia y te extraña por partes iguales.",
      },
      {
        texto: "Negarlo todo y desaparecer.",
        efectos: { karma: -18, riqueza: 0, salud: -3 },
        consecuenciaTexto:
          "Huís a otro condado. Nadie te busca. Años después, alguien que se te parece te reconoce en una feria.",
      },
      {
        texto: "Asumir pero pedir ayuda a tu familia para criar juntos.",
        efectos: { karma: 8, riqueza: -5, influencia: 5 },
        consecuenciaTexto:
          "Tu hermana/o te da una habitación. Crían al chico entre todos. Funciona mejor de lo que pensabas.",
      },
    ],
  },
  {
    id: "med-j-15",
    mundo: "medieval",
    rolesRelevantes: ["caballero", "noble"],
    etapaMax: "juventud",
    titulo: "La orden de ejecutar al ladrón",
    descripcion:
      "Tu señor te ordena ejecutar a un ladrón capturado. Tiene diecisiete años. Robó pan.",
    icono: "⚖️",
    tags: ["etica", "dramatica", "muerte"],
    opciones: [
      {
        texto: "Obedecer la orden.",
        efectos: { karma: -15, influencia: 10, rango: "Caballero obediente" },
        consecuenciaTexto:
          "Firmaste la ejecución. Esa misma noche, tu espada pesa distinto. El señor te asciende.",
      },
      {
        texto: "Fingir que escapó y dejarlo ir.",
        efectos: { karma: 12, influencia: -10, riqueza: -5 },
        consecuenciaTexto:
          "Lo dejás lejos con dos monedas. El señor sospecha. Tu ascenso se congela por años.",
      },
      {
        texto: "Proponer al señor que lo ponga al servicio de tu casa como sirviente.",
        efectos: { karma: 8, influencia: 3 },
        consecuenciaTexto:
          "El señor acepta a regañadientes. El chico te sirve con lealtad. Un día se convertirá en tu mejor escudero.",
      },
      {
        texto: "Desafiar la orden abiertamente frente al señor.",
        efectos: { karma: 10, influencia: -20, riqueza: -10 },
        consecuenciaTexto:
          "El señor te destituye. El ladrón igual muere, por otra espada. Ganás honor y perdés casi todo.",
      },
    ],
  },
  // ============ MADUREZ ============
  {
    id: "med-m-01",
    mundo: "medieval",
    rolesRelevantes: [],
    etapaMin: "madurez",
    etapaMax: "madurez",
    titulo: "Un hijo quiere lo que no tuviste",
    descripcion:
      "Tu hijo/a mayor te pide dinero para probar suerte en la capital. Quiere estudiar con un maestro renombrado.",
    icono: "🎓",
    tags: ["familia", "legado"],
    opciones: [
      {
        texto: "Darle todo lo que tenés guardado.",
        efectos: { karma: 12, riqueza: -25, influencia: 8 },
        consecuenciaTexto:
          "Tu hijo/a parte. Años después manda cartas agradecidas y unas monedas. Fue la mejor apuesta de tu vida.",
      },
      {
        texto: "Darle la mitad y pedirle que se busque la otra.",
        efectos: { karma: 6, riqueza: -12, influencia: 5 },
        consecuenciaTexto:
          "Le cuesta más pero aprende a pelear. Vuelve a visitarte con sus propios ahorros.",
      },
      {
        texto: "Negarle el dinero. Tu pueblo lo necesita también.",
        efectos: { karma: -5, riqueza: 5, influencia: -3 },
        consecuenciaTexto:
          "Tu hijo/a se va igual, con lo puesto. Te escribe menos. El enojo dura años.",
      },
      {
        texto: "Usar tu influencia para conseguirle un mecenas.",
        efectos: { karma: 8, influencia: -10 },
        consecuenciaTexto:
          "Gastás favores. Le consiguen un maestro. Tu red de aliados queda debilitada pero tu hijo prospera.",
      },
    ],
  },
  {
    id: "med-m-02",
    mundo: "medieval",
    rolesRelevantes: ["noble", "caballero"],
    etapaMin: "madurez",
    etapaMax: "madurez",
    titulo: "El rey muere sin heredero claro",
    descripcion:
      "El rey ha muerto. Tres primos se disputan la corona. El consejo te llama — sos uno de los pocos nobles neutrales que queda.",
    icono: "👑",
    tags: ["poder", "dramatica", "legado"],
    opciones: [
      {
        texto: "Apoyar al primo más joven, el más manejable.",
        efectos: { karma: -5, influencia: 20, riqueza: 15, rango: "Consejero de la corona" },
        consecuenciaTexto:
          "Tu candidato gana. Te sentás en el consejo. Tu sombra crece. Tu sueño también se hace más liviano.",
      },
      {
        texto: "Apoyar al primo más capaz, aunque sea difícil.",
        efectos: { karma: 10, influencia: 25, riqueza: 5, rango: "Mano del rey" },
        consecuenciaTexto:
          "Tu candidato gana. Reforma el reino. Te da un título. La historia te recordará.",
      },
      {
        texto: "Proponerte vos mismo — tenés sangre suficiente.",
        efectos: { karma: 0, influencia: -10, riqueza: 0, salud: -10 },
        consecuenciaTexto:
          "Nadie te toma en serio. Quedás mal con los tres primos. Sobrevivís de milagro dos intentos de envenenamiento.",
        requiereInfluenciaMin: 60,
      },
      {
        texto: "Mantenerte neutral y dejar que decidan los demás.",
        efectos: { karma: 3, influencia: -5 },
        consecuenciaTexto:
          "Gana el primo menos interesante. Gobiernan mal. Tu condado sobrevive porque estás lejos de la capital.",
      },
    ],
  },
  {
    id: "med-m-03",
    mundo: "medieval",
    rolesRelevantes: [],
    etapaMin: "madurez",
    etapaMax: "madurez",
    titulo: "El viejo amigo pide asilo",
    descripcion:
      "Un amigo de la infancia toca tu puerta de noche. Lo persigue un juez del reino por una deuda que podría ser falsa.",
    icono: "🚪",
    tags: ["etica", "familia"],
    opciones: [
      {
        texto: "Esconderlo. Los amigos son sagrados.",
        efectos: { karma: 12, influencia: -10, riqueza: -5, salud: -3 },
        consecuenciaTexto:
          "Le das refugio un año. Un soldado lo reconoce. Pagás una multa grande. Él te manda cartas por el resto de sus días.",
      },
      {
        texto: "Entregarlo a las autoridades. La ley es la ley.",
        efectos: { karma: -12, influencia: 8, riqueza: 5 },
        consecuenciaTexto:
          "Termina en un calabozo. Muere al año. Tu pueblo te respeta más. Tu sueño no vuelve del todo.",
      },
      {
        texto: "Ayudarlo a cruzar la frontera al reino vecino.",
        efectos: { karma: 8, riqueza: -10 },
        consecuenciaTexto:
          "Se va y sobrevive. Te agradece en cada carta. Nunca te contás demasiado de esa noche.",
      },
      {
        texto: "Financiarle un buen abogado para que limpie el nombre.",
        efectos: { karma: 10, riqueza: -20, influencia: 3 },
        consecuenciaTexto:
          "Después de dos años, gana el juicio. Vuelve como hombre libre. Tu caja quedó vacía, pero tu amigo sigue.",
      },
    ],
  },
  {
    id: "med-m-04",
    mundo: "medieval",
    rolesRelevantes: ["artesano", "campesino"],
    etapaMin: "madurez",
    etapaMax: "madurez",
    titulo: "La oferta del gremio",
    descripcion:
      "El gremio te propone presidirlo. Viene con poder local y con enemigos. Los actuales líderes no se van sin pelea.",
    icono: "🔨",
    tags: ["poder"],
    opciones: [
      {
        texto: "Aceptar y confrontar abiertamente a los líderes actuales.",
        efectos: { karma: 3, influencia: 20, riqueza: 10, rango: "Presidente del gremio" },
        consecuenciaTexto:
          "Tres votaciones tensas. Ganás la última por poco. El gremio entra en una nueva era, con fricciones.",
      },
      {
        texto: "Aceptar pero hacer alianzas con los viejos líderes.",
        efectos: { karma: -3, influencia: 15, riqueza: 15 },
        consecuenciaTexto:
          "Gobierno compartido. Todos mantienen algo. El gremio no avanza mucho, pero funciona.",
      },
      {
        texto: "Rechazar, no querés enemigos grandes.",
        efectos: { karma: 0, influencia: -5, riqueza: 0 },
        consecuenciaTexto:
          "Seguís con tu taller. Otro toma el cargo y te ignora. Pasan los años, tranquilo.",
      },
      {
        texto: "Aceptar y purgar a los líderes viejos sin piedad.",
        efectos: { karma: -15, influencia: 25, riqueza: 20 },
        consecuenciaTexto:
          "Les armás acusaciones, los sacás en tres meses. El gremio te teme y te obedece. Tu nombre se menciona bajo la mesa.",
      },
    ],
  },
  {
    id: "med-m-05",
    mundo: "medieval",
    rolesRelevantes: [],
    etapaMin: "madurez",
    etapaMax: "madurez",
    titulo: "La visita del inquisidor",
    descripcion:
      "Un clérigo de alto rango pasa por el pueblo investigando rumores. Hay vecinos que temen, otros que quieren delatar.",
    icono: "📜",
    tags: ["etica", "traicion"],
    opciones: [
      {
        texto: "Recibirlo con honores y colaborar con la investigación.",
        efectos: { karma: -8, influencia: 15, riqueza: 5 },
        consecuenciaTexto:
          "Dos vecinos son juzgados. Uno es inocente. Tu nombre sube en los registros eclesiásticos.",
      },
      {
        texto: "Negarle la entrada con una excusa y hacer tiempo.",
        efectos: { karma: 8, influencia: -10, salud: -5 },
        consecuenciaTexto:
          "Dos familias escapan antes del interrogatorio. Tu reputación oficial queda marcada por años.",
      },
      {
        texto: "Colaborar pero esconder pruebas que sabés que son falsas.",
        efectos: { karma: 6, influencia: 5, salud: -3 },
        consecuenciaTexto:
          "El inquisidor cierra el caso sin condenas. Nadie sabe lo que hiciste. Vos sí.",
      },
      {
        texto: "Sobornarlo para que se vaya rápido.",
        efectos: { karma: -5, influencia: 3, riqueza: -15 },
        consecuenciaTexto:
          "Acepta la bolsa y se retira. Vuelve en dos años pidiendo más. Te convertís en su cliente.",
      },
    ],
  },
  {
    id: "med-m-06",
    mundo: "medieval",
    rolesRelevantes: ["bardo"],
    etapaMin: "madurez",
    etapaMax: "madurez",
    titulo: "Maestro de un nuevo bardo",
    descripcion:
      "Un joven con talento enorme te pide que le enseñes. Es mejor que vos — y vos lo ves.",
    icono: "🎼",
    tags: ["legado"],
    opciones: [
      {
        texto: "Enseñarle todo, sin reservas.",
        efectos: { karma: 12, influencia: 5, riqueza: -5 },
        consecuenciaTexto:
          "Años después su fama te supera. Cuando lo mencionan, menciona tu nombre primero.",
      },
      {
        texto: "Enseñarle lo justo, guardar tus mejores secretos.",
        efectos: { karma: -3, influencia: 3 },
        consecuenciaTexto:
          "Crece igual. Con el tiempo descubre tus secretos solo. Pierde el respeto que te tenía.",
      },
      {
        texto: "Rechazarlo para que no te eclipse.",
        efectos: { karma: -10, influencia: -3 },
        consecuenciaTexto:
          "Busca otro maestro. Triunfa igual. Te cruzás con él en cortes y siempre hay hielo.",
      },
      {
        texto: "Hacerlo tu socio en una compañía de bardos.",
        efectos: { karma: 8, influencia: 15, riqueza: 10 },
        consecuenciaTexto:
          "La compañía crece. Tocan en cuatro reinos. Tu nombre queda asociado al de él para siempre, y eso está bien.",
      },
    ],
  },
  {
    id: "med-m-07",
    mundo: "medieval",
    rolesRelevantes: [],
    etapaMin: "madurez",
    etapaMax: "madurez",
    titulo: "Un incendio en el pueblo",
    descripcion:
      "Un incendio consume tres casas en la noche. Mueren dos personas. Se señala a un vecino como culpable, pero no hay pruebas.",
    icono: "🔥",
    tags: ["dramatica", "etica"],
    opciones: [
      {
        texto: "Sumarte a la turba que exige justicia.",
        efectos: { karma: -15, influencia: 5 },
        consecuenciaTexto:
          "Linchan al vecino. Al mes se descubre que fue un accidente. Ya no hay manera de arreglarlo.",
      },
      {
        texto: "Defender al acusado frente al pueblo.",
        efectos: { karma: 15, influencia: -10, salud: -5 },
        consecuenciaTexto:
          "Le gritan, te amenazan. Se hace una investigación lenta. El vecino queda libre pero marcado.",
      },
      {
        texto: "Coordinar la reconstrucción de las casas mientras se investiga.",
        efectos: { karma: 10, influencia: 12, riqueza: -10 },
        consecuenciaTexto:
          "Las familias vuelven a tener techo antes del invierno. El pueblo te mira distinto desde ese día.",
      },
      {
        texto: "Aprovechar para comprar los terrenos quemados baratos.",
        efectos: { karma: -18, riqueza: 25, influencia: -5 },
        consecuenciaTexto:
          "Los dueños venden con lágrimas. Años después construís taberna y posada. Te hacen rico. No dormís bien.",
      },
    ],
  },
  {
    id: "med-m-08",
    mundo: "medieval",
    rolesRelevantes: ["caballero", "noble"],
    etapaMin: "madurez",
    etapaMax: "madurez",
    titulo: "Un vasallo te traiciona",
    descripcion:
      "Descubrís que tu vasallo más cercano estuvo vendiendo secretos a tu rival. La evidencia es clara.",
    icono: "🗡️",
    tags: ["traicion", "dramatica"],
    opciones: [
      {
        texto: "Ejecutarlo públicamente. Ejemplo.",
        efectos: { karma: -10, influencia: 15 },
        consecuenciaTexto:
          "El resto entiende. Nadie más te traiciona. Por años. Al menos de frente.",
      },
      {
        texto: "Exiliarlo con su familia al borde del reino.",
        efectos: { karma: 3, influencia: 8 },
        consecuenciaTexto:
          "Vive hasta la vejez, pobre y distante. A veces lamenta la cárcel que eligió.",
      },
      {
        texto: "Usarlo como espía doble contra tu rival.",
        efectos: { karma: -5, influencia: 25, salud: -5 },
        consecuenciaTexto:
          "Durante cinco años te pasa información. Tu rival cae. Tu vasallo muere en extrañas circunstancias. No preguntás.",
      },
      {
        texto: "Perdonarlo a cambio de su hijo como rehén.",
        efectos: { karma: -3, influencia: 10 },
        consecuenciaTexto:
          "El chico crece en tu castillo. El padre manda cartas cada semana. El chico te llama 'mi señor' sin irony.",
      },
    ],
  },
  {
    id: "med-m-09",
    mundo: "medieval",
    rolesRelevantes: [],
    etapaMin: "madurez",
    etapaMax: "madurez",
    titulo: "Invierno más duro en una década",
    descripcion:
      "El invierno llegó temprano y con fuerza. La despensa alcanza solo para los tuyos. Vecinos golpean la puerta.",
    icono: "❄️",
    tags: ["etica", "familia"],
    opciones: [
      {
        texto: "Repartir comida hasta donde alcance.",
        efectos: { karma: 14, riqueza: -15, salud: -10 },
        consecuenciaTexto:
          "Todos pasan el invierno más flacos. Nadie muere. Tu familia está orgullosa y débil.",
      },
      {
        texto: "Esconder la comida y decir que vos también pasás hambre.",
        efectos: { karma: -10, riqueza: 5, salud: 5 },
        consecuenciaTexto:
          "Sobrevivís bien. Dos vecinos mueren de frío y hambre. Nadie sabe. Tus hijos crecen sin saber esto.",
      },
      {
        texto: "Organizar una olla común con los que tienen algo.",
        efectos: { karma: 18, influencia: 10, riqueza: -8, salud: -5 },
        consecuenciaTexto:
          "El pueblo entero pasa el invierno junto en un granero calentado. Tu nombre se recuerda por años.",
      },
      {
        texto: "Vender comida a precios de oro.",
        efectos: { karma: -18, riqueza: 25, influencia: -10 },
        consecuenciaTexto:
          "Te hacés rico en dos meses. Cuando vuelve la primavera, varios no te saludan más.",
      },
    ],
  },
  {
    id: "med-m-10",
    mundo: "medieval",
    rolesRelevantes: ["noble"],
    etapaMin: "madurez",
    etapaMax: "madurez",
    titulo: "Embajada al reino vecino",
    descripcion:
      "El rey te envía de embajador al reino del norte, con el que estamos al borde de la guerra. Tu misión: evitarla.",
    icono: "🕊️",
    tags: ["poder", "dramatica"],
    opciones: [
      {
        texto: "Negociar con firmeza: concedé poco, exigí mucho.",
        efectos: { karma: 5, influencia: 18, salud: -5, rango: "Embajador/a de la corona" },
        consecuenciaTexto:
          "Tres meses de reuniones. Volvés con un tratado que evita la guerra por diez años. El rey te honra.",
      },
      {
        texto: "Comprar a los consejeros del otro rey.",
        efectos: { karma: -8, influencia: 15, riqueza: -20 },
        consecuenciaTexto:
          "Funciona. La paz se firma. Tu tesoro queda vacío. Los consejeros te siguen pidiendo cada año.",
      },
      {
        texto: "Proponer un matrimonio real entre las cortes.",
        efectos: { karma: 3, influencia: 20, riqueza: 5 },
        consecuenciaTexto:
          "Se casan dos primos que no se conocían. La paz dura veinte años. El matrimonio, menos.",
      },
      {
        texto: "Fracasar a propósito porque te conviene la guerra.",
        efectos: { karma: -25, influencia: 10, riqueza: 30 },
        consecuenciaTexto:
          "Estalla la guerra. Vendés armas a ambos lados. Te enriquecés. Años después no podés mirar a los tullidos.",
      },
    ],
  },
  {
    id: "med-m-11",
    mundo: "medieval",
    rolesRelevantes: [],
    etapaMin: "madurez",
    etapaMax: "madurez",
    titulo: "Un hijo quiere casarse por amor",
    descripcion:
      "Tu hijo/a anuncia que quiere casarse con alguien de una familia mucho más humilde. Todos esperan que los frenes.",
    icono: "💞",
    tags: ["familia", "amor"],
    opciones: [
      {
        texto: "Bendecir la boda.",
        efectos: { karma: 10, influencia: -5, riqueza: -3 },
        consecuenciaTexto:
          "La familia se divide un tiempo. El matrimonio prospera. Tus nietos te aman desde que nacen.",
      },
      {
        texto: "Negar permiso y arreglar otro matrimonio.",
        efectos: { karma: -12, influencia: 10, riqueza: 10 },
        consecuenciaTexto:
          "Tu hijo/a obedece con rencor. El matrimonio arreglado funciona, pero hay silencios largos en la mesa.",
      },
      {
        texto: "Aceptar pero ponerle condiciones económicas a la otra familia.",
        efectos: { karma: 3, influencia: 5, riqueza: 5 },
        consecuenciaTexto:
          "Negociás una dote. Todos firman algo. El amor sobrevive, y también el equilibrio financiero.",
      },
      {
        texto: "Desheredar a tu hijo/a si insiste.",
        efectos: { karma: -20, influencia: 3, riqueza: 15 },
        consecuenciaTexto:
          "Se va sin nada. No lo volvés a ver. En el lecho de muerte preguntás por él y nadie puede traerlo.",
      },
    ],
  },
  {
    id: "med-m-12",
    mundo: "medieval",
    rolesRelevantes: ["caballero", "noble"],
    etapaMin: "madurez",
    etapaMax: "madurez",
    titulo: "Campaña de invierno",
    descripcion:
      "El rey ordena una campaña militar en pleno invierno. Tus hombres no están preparados. Muchos van a morir por el frío, no por el enemigo.",
    icono: "🏔️",
    tags: ["guerra", "dramatica", "muerte"],
    opciones: [
      {
        texto: "Marchar con disciplina y rezar.",
        efectos: { karma: -3, influencia: 10, salud: -20 },
        consecuenciaTexto:
          "Llegás al frente con la mitad de los hombres. Ganás la batalla. Tu nombre se graba en piedra.",
      },
      {
        texto: "Aducir problemas logísticos y retrasarte todo lo posible.",
        efectos: { karma: 5, influencia: -10, salud: -5 },
        consecuenciaTexto:
          "Evitás el peor frío. El rey te reprende. Algunos aliados entienden, otros no.",
      },
      {
        texto: "Desobedecer y volver con tus hombres.",
        efectos: { karma: 10, influencia: -20, riqueza: -15 },
        consecuenciaTexto:
          "Salvás vidas, perdés tierras. El rey te quita medio señorío. Tus hombres te besan las manos.",
      },
      {
        texto: "Enviar a tus hombres bajo otro comandante y quedarte enfermo.",
        efectos: { karma: -12, influencia: 5, salud: 5 },
        consecuenciaTexto:
          "Tus hombres van. La mitad muere. Vos te curás rápido. Nadie te dice nada de frente.",
      },
    ],
  },
  // ============ VEJEZ ============
  {
    id: "med-v-01",
    mundo: "medieval",
    rolesRelevantes: [],
    etapaMin: "vejez",
    titulo: "La sucesión",
    descripcion:
      "Sentís que te quedan pocos años. Tenés dos hijos. Uno te parece justo pero torpe. El otro capaz pero cruel.",
    icono: "📜",
    tags: ["legado", "familia"],
    opciones: [
      {
        texto: "Nombrar sucesor al justo. Alguien lo asesorará.",
        efectos: { karma: 12, influencia: -5 },
        consecuenciaTexto:
          "Gobierna con bondad y medianidad. El condado sobrevive. Los hermanos se mantienen en paz.",
      },
      {
        texto: "Nombrar al capaz. El condado necesita fortaleza.",
        efectos: { karma: -8, influencia: 15 },
        consecuenciaTexto:
          "Gobierna con mano dura. El condado crece. Tu otro hijo desaparece en circunstancias raras.",
      },
      {
        texto: "Dividir el señorío entre ambos.",
        efectos: { karma: 5, influencia: -10, riqueza: -10 },
        consecuenciaTexto:
          "Los hermanos pelean años. Al final uno cede. El señorío queda debilitado pero intacto.",
      },
      {
        texto: "Nombrar a un consejo formado por tus vasallos.",
        efectos: { karma: 8, influencia: -15 },
        consecuenciaTexto:
          "Innovador para la época. Funciona unas décadas. Al final alguien toma el poder. La historia lo recordará.",
      },
    ],
  },
  {
    id: "med-v-02",
    mundo: "medieval",
    rolesRelevantes: [],
    etapaMin: "vejez",
    titulo: "Una cara del pasado",
    descripcion:
      "Un viejo amigo — o enemigo — reaparece después de décadas. Trae una deuda o una disculpa. No está claro.",
    icono: "👤",
    tags: ["legado"],
    opciones: [
      {
        texto: "Recibirlo como si nada hubiera pasado.",
        efectos: { karma: 10, salud: 5 },
        consecuenciaTexto:
          "Pasan horas contándose la vida. Lloran. Al despedirse, ninguno dice 'adiós'.",
      },
      {
        texto: "Escuchar sin perdonar.",
        efectos: { karma: 0, salud: -3 },
        consecuenciaTexto:
          "Lo dejás hablar, dos horas. Después le cerrás la puerta con amabilidad. Esa noche no dormís.",
      },
      {
        texto: "Exigirle lo que te debe.",
        efectos: { karma: -5, riqueza: 10 },
        consecuenciaTexto:
          "Paga con lo que tiene — que es poco. Se va más pobre. Vos, un poco menos.",
      },
      {
        texto: "Pedirle perdón vos.",
        efectos: { karma: 15, salud: 5 },
        consecuenciaTexto:
          "Él se sorprende. Vos también. Algo se cierra. Dormís tranquilo por primera vez en años.",
      },
    ],
  },
  {
    id: "med-v-03",
    mundo: "medieval",
    rolesRelevantes: [],
    etapaMin: "vejez",
    titulo: "La peste vuelve",
    descripcion:
      "Una nueva ola de peste. Tu casa tiene médico propio. Los aldeanos, no. Golpean la puerta.",
    icono: "🦠",
    tags: ["etica", "muerte"],
    opciones: [
      {
        texto: "Abrir la puerta: el médico atiende a todos.",
        efectos: { karma: 15, salud: -15, influencia: 10, riqueza: -5 },
        consecuenciaTexto:
          "Muchos sobreviven. Tu médico se enferma. Tú también. Te recuperás, él no.",
      },
      {
        texto: "Cerrar la puerta. Tu familia primero.",
        efectos: { karma: -10, salud: 5, influencia: -5 },
        consecuenciaTexto:
          "Los tuyos sobreviven casi todos. Afuera mueren vecinos que conocías de toda la vida.",
      },
      {
        texto: "Enviar al médico al pueblo y protegerte vos adentro.",
        efectos: { karma: 8, salud: 0, influencia: 5 },
        consecuenciaTexto:
          "El médico vuelve a la semana, agotado y vivo. Salvó lo que pudo. Tu familia está a salvo.",
      },
      {
        texto: "Cobrar por la consulta del médico. Así ayuda más a largo plazo.",
        efectos: { karma: 0, riqueza: 10, influencia: 3 },
        consecuenciaTexto:
          "El sistema funciona, pero los más pobres mueren igual. Vos te convencés de que hiciste lo que pudiste.",
      },
    ],
  },
  {
    id: "med-v-04",
    mundo: "medieval",
    rolesRelevantes: [],
    etapaMin: "vejez",
    titulo: "Un nieto te pide un consejo",
    descripcion:
      "Tu nieto/a, con veinte años, te pregunta qué hubieras hecho distinto. Te mira con ojos serios.",
    icono: "🌳",
    tags: ["legado", "familia"],
    opciones: [
      {
        texto: "Decirle la verdad sobre tus mayores errores.",
        efectos: { karma: 12, influencia: 5 },
        consecuenciaTexto:
          "Se va con lágrimas y con algo que no se enseña en ningún lado. Años después honra tu nombre.",
      },
      {
        texto: "Darle una versión edulcorada.",
        efectos: { karma: 0, influencia: 3 },
        consecuenciaTexto:
          "Se va contento. Repite tus errores. No es culpa tuya del todo, pero algo es.",
      },
      {
        texto: "Decirle que la vida no se explica, que la viva.",
        efectos: { karma: 5, influencia: 0 },
        consecuenciaTexto:
          "Se va pensando. Años después, vuelve con preguntas más precisas. Hablan hasta el amanecer.",
      },
      {
        texto: "Escribir tus memorias para que las lea cuando vos ya no estés.",
        efectos: { karma: 8, influencia: 8, salud: -5 },
        consecuenciaTexto:
          "Pasás meses escribiendo. Tus memorias circulan después. Algunos te odian, otros te aman más.",
      },
    ],
  },
  {
    id: "med-v-05",
    mundo: "medieval",
    rolesRelevantes: [],
    etapaMin: "vejez",
    titulo: "El último banquete",
    descripcion:
      "Un banquete de reconciliación con rivales históricos. Algunos en la mesa te odiaron. Otros te amaron. Todos van a beber juntos.",
    icono: "🍷",
    tags: ["legado"],
    opciones: [
      {
        texto: "Pedir disculpas públicas.",
        efectos: { karma: 18, influencia: -5 },
        consecuenciaTexto:
          "Un silencio enorme. Alguien llora. Te despedís con abrazos inesperados.",
      },
      {
        texto: "Brindar por los vivos sin mirar atrás.",
        efectos: { karma: 8, influencia: 5 },
        consecuenciaTexto:
          "Un brindis que se recuerda. Nadie queda tranquilo del todo. Pero tampoco hay golpes.",
      },
      {
        texto: "Recordarle a todos los favores que les hiciste.",
        efectos: { karma: -8, influencia: 8 },
        consecuenciaTexto:
          "La mitad agacha la cabeza. La otra mitad se va ofendida. Durmieron dos meses pensándote.",
      },
      {
        texto: "Dejar que cada uno hable, sin intervenir.",
        efectos: { karma: 10, influencia: 3 },
        consecuenciaTexto:
          "La mesa va sola. Al final, quedan tres sentados contigo. Uno de ellos te perdona esa noche.",
      },
    ],
  },
  {
    id: "med-v-06",
    mundo: "medieval",
    rolesRelevantes: ["noble"],
    etapaMin: "vejez",
    titulo: "El testamento final",
    descripcion:
      "Llega el momento de escribir el testamento. Hay tierras, oro, cargos. Y decisiones que sobrevivirán a tu nombre.",
    icono: "🖋️",
    tags: ["legado"],
    opciones: [
      {
        texto: "Repartir equitativamente entre todos tus hijos.",
        efectos: { karma: 10, influencia: -5 },
        consecuenciaTexto:
          "Nadie se enoja, nadie se alegra mucho. El nombre de la familia queda intacto una generación más.",
      },
      {
        texto: "Dejar casi todo al hijo mayor (como manda la tradición).",
        efectos: { karma: -5, influencia: 5 },
        consecuenciaTexto:
          "El mayor gana peso. Los otros se arman de rencor en silencio. En veinte años habrá cuentas.",
      },
      {
        texto: "Dejar una parte importante a obras de caridad.",
        efectos: { karma: 18, influencia: 3, riqueza: -10 },
        consecuenciaTexto:
          "Un hospicio lleva tu nombre. Tus hijos se sienten estafados, pero te citan en sus discursos.",
      },
      {
        texto: "Dejar todo a tu amante secreto/a, escándalo incluido.",
        efectos: { karma: -10, influencia: -20, riqueza: 0 },
        consecuenciaTexto:
          "Escándalo después de tu muerte. Las familias pelean décadas. Tu nombre se evita en las mesas por un siglo.",
      },
    ],
  },
  {
    id: "med-v-07",
    mundo: "medieval",
    rolesRelevantes: [],
    etapaMin: "vejez",
    titulo: "El cuerpo falla",
    descripcion:
      "Las articulaciones te duelen. Un médico te ofrece un tratamiento caro y experimental que podría agregar años — o acelerar el final.",
    icono: "🩺",
    tags: ["dramatica", "muerte"],
    opciones: [
      {
        texto: "Aceptar el tratamiento.",
        efectos: { salud: 15, riqueza: -20, karma: 0 },
        consecuenciaTexto:
          "Te recuperás más de lo que esperabas. Tres años extra. Los usás bien.",
      },
      {
        texto: "Rechazarlo. Es tu cuerpo y su destino.",
        efectos: { salud: -8, karma: 3 },
        consecuenciaTexto:
          "El declive es lento y digno. Aceptás lo que sos. Los tuyos te acompañan.",
      },
      {
        texto: "Probarlo, pero solo si es gratuito. Donarlo al hospicio.",
        efectos: { karma: 15, salud: 5, riqueza: -5 },
        consecuenciaTexto:
          "El médico acepta a regañadientes. Funciona con varios enfermos humildes. Tu cuerpo también mejora, un poco.",
      },
      {
        texto: "Usar lo que queda de tu energía en terminar algo importante.",
        efectos: { salud: -10, karma: 10, influencia: 8 },
        consecuenciaTexto:
          "Terminás esa obra, ese libro, ese tratado. Morís tranquilo. Pasan los siglos y algunos siguen leyéndote.",
      },
    ],
  },
  {
    id: "med-v-08",
    mundo: "medieval",
    rolesRelevantes: [],
    etapaMin: "vejez",
    titulo: "La guerra que viene",
    descripcion:
      "Se acerca una nueva guerra. Sabés que vas a alcanzar a verla empezar, no a terminarla. Tus nietos van a pelear.",
    icono: "⚔️",
    tags: ["guerra", "legado", "familia"],
    opciones: [
      {
        texto: "Usar toda tu influencia para que los tuyos no vayan al frente.",
        efectos: { karma: -5, influencia: -10, riqueza: -15 },
        consecuenciaTexto:
          "Tus nietos pelean lejos del frente. Sobreviven. Algunos primos mueren. Vivís la culpa de ese favor.",
      },
      {
        texto: "Entrenar a tus nietos vos mismo para que peleen bien.",
        efectos: { karma: 5, influencia: 5, salud: -10 },
        consecuenciaTexto:
          "Pasás seis meses enseñándoles todo. Pelean con honor. Algunos vuelven, otros no.",
      },
      {
        texto: "Financiar la guerra desde la retaguardia para salir beneficiado.",
        efectos: { karma: -15, riqueza: 25 },
        consecuenciaTexto:
          "Te hacés más rico. Ves nietos muriendo a tu lado en los años finales. Tu fortuna duele.",
      },
      {
        texto: "Pronunciar un discurso público pidiendo la paz.",
        efectos: { karma: 15, influencia: 8 },
        consecuenciaTexto:
          "Te escuchan con respeto. La guerra ocurre igual. Pero algunos recuerdan tus palabras cuando todo termina.",
      },
    ],
  },
];
