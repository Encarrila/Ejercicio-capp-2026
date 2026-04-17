export const APP_VERSION = '1.2.0';

export const SCENARIO = {
  title: 'Boreal Seguros · Inicio de proyecto para un piloto de IA',
  shortDescription:
    'Una aseguradora mediana quiere lanzar, en 90 días, un piloto de IA que ayude a agilizar la gestión de siniestros simples de autos sin afectar la experiencia del cliente ni comprometer compliance.',
  context: [
    'Hoy el circuito de siniestros simples tarda en promedio 8 días corridos entre la denuncia, la validación inicial y la resolución.',
    'La gerencia general quiere una mejora visible en tiempos y productividad, pero pidió un arranque acotado y defendible.',
    'Operaciones teme más retrabajo y poca claridad sobre cómo va a cambiar el trabajo diario si el proyecto se diseña sólo desde staff o tecnología.',
    'IT advierte que hay integraciones con sistemas legados y que no conviene prometer entregables que después no puedan sostenerse.',
    'Compliance y Legales están atentos al uso de datos personales, la trazabilidad de las decisiones y la comunicación al cliente.',
  ],
  objective:
    'Practicar el inicio de un proyecto recorriendo tres focos complementarios: terreno, arquitectura inicial y viabilidad inicial.',
  successCriteria: [
    'Terreno claro: propósito, contexto e interesados iniciales bien elegidos.',
    'Arquitectura inicial coherente: objetivo, entregables, tiempos y criterios de éxito.',
    'Viabilidad inicial razonable: restricciones, supuestos y macro-riesgos bien tratados.',
    'Decisiones consistentes con un arranque realista y no sobredimensionado.',
  ],
};

export const ROUND_LIMITS = {
  1: { budget: 5, time: 4 },
  2: { budget: 5, time: 4 },
  3: { budget: 5, time: 4 },
};

export const MAX_DECISIONS_PER_ROUND = 3;

export const ROUNDS = [
  {
    id: 1,
    title: 'Ronda 1 · Inicio del proyecto: terreno',
    dimension: 'Terreno (por qué / quién / dónde)',
    intro:
      'El sponsor habilitó explorar la iniciativa, pero el proyecto todavía no está realmente armado. En esta primera ronda no toca prometer solución ni plan detallado: primero necesitan entender bien por qué vale la pena arrancar, a quién afecta y en qué contexto concreto se va a mover.',
    moment:
      'Están en el minuto cero del proyecto. La conversación correcta en esta etapa pasa por propósito, stakeholders y contexto, no por querer cerrar todo de entrada.',
    brief:
      'Construyan un terreno inicial compartido: para qué arranca el proyecto, qué alcance conviene darle en esta etapa y qué actores vale la pena involucrar temprano.',
    step1Title: 'Paso 1 · Definir el terreno inicial',
    step1Help:
      'Seleccionen hasta 3 decisiones para darle foco al inicio. Busquen un arranque entendible, acotado y con sentido de negocio.',
    step2Title: 'Paso 2 · Identificar interesados clave',
    step2Help:
      'Marquen los actores que conviene sentar en la mesa al inicio. La idea no es listar a todos, sino priorizar a quienes habilitan, condicionan o enriquecen este arranque.',
    step3Title: 'Paso 3 · Revisar si el terreno quedó sólido',
    step3Help:
      'Antes de enviar, confirmen que el punto de partida se entiende: propósito, contexto, interesados y un recorte inicial creíble.',
  },
  {
    id: 2,
    title: 'Ronda 2 · Inicio del proyecto: arquitectura inicial',
    dimension: 'Arquitectura (qué / cuándo)',
    intro:
      'Con el terreno más claro, ahora toca darle forma al proyecto. Todavía no están haciendo planificación detallada, pero sí una primera arquitectura: qué objetivo concreto persigue el arranque, qué entregable o hito inicial tendría sentido mostrar y con qué criterio van a juzgar si el proyecto empezó bien.',
    moment:
      'Siguen dentro de la etapa de inicio, pero ya pasaron del entendimiento al diseño inicial. En esta ronda importa transformar la necesidad en objetivo, entregables, tiempos de referencia y criterios de éxito.',
    brief:
      'Armen una arquitectura inicial defendible: objetivo del proyecto, entregables del arranque, hitos temporales razonables y criterios de éxito que orienten la conversación.',
    step1Title: 'Paso 1 · Diseñar la arquitectura inicial',
    step1Help:
      'Seleccionen hasta 3 decisiones para convertir el arranque en una propuesta de proyecto más concreta y defendible.',
    step2Title: 'Paso 2 · Elegir definiciones clave',
    step2Help:
      'Marquen las definiciones que no deberían faltar en una buena arquitectura inicial. Algunas son centrales para arrancar; otras pueden esperar.',
    step3Title: 'Paso 3 · Revisar si la arquitectura cierra',
    step3Help:
      'Antes de enviar, chequeen si el proyecto ya tiene una forma clara: necesidad, objetivo, entregables, tiempos iniciales y criterios de éxito.',
  },
  {
    id: 3,
    title: 'Ronda 3 · Inicio del proyecto: viabilidad inicial',
    dimension: 'Viabilidad (con qué / qué puede fallar)',
    intro:
      'Ya tienen un terreno y una arquitectura inicial. Ahora necesitan hacer el chequeo de realidad: qué restricciones duras tiene este arranque, qué supuestos están dando por válidos y qué macro-riesgos podrían poner en jaque el proyecto si no se atienden desde el inicio.',
    moment:
      'Siguen en la etapa de inicio, pero ahora evalúan si lo que diseñaron realmente se puede sostener. La pregunta de fondo es simple: ¿este proyecto puede arrancar así sin quedar demasiado expuesto?',
    brief:
      'Pongan a prueba la viabilidad del arranque: hagan visibles las restricciones, los supuestos clave y los macro-riesgos que podrían afectar el comienzo del proyecto.',
    step1Title: 'Paso 1 · Cuidar la viabilidad del arranque',
    step1Help:
      'Seleccionen hasta 3 decisiones para volver más viable el inicio. Acá importan el realismo, las dependencias críticas y los resguardos mínimos.',
    step2Title: 'Paso 2 · Identificar macro-riesgos',
    step2Help:
      'Marquen los riesgos que realmente podrían complicar el inicio del proyecto. No todo lo plausible merece la misma atención en esta etapa.',
    step3Title: 'Paso 3 · Revisar si el arranque es viable',
    step3Help:
      'Antes de enviar, confirmen que el proyecto no quedó sobreprometido ni demasiado frágil frente a restricciones, supuestos flojos o riesgos mal cubiertos.',
  },
];

export const DECISIONS = {
  1: [
    {
      id: 'r1_piloto_acotado',
      label: 'Recortar el arranque a un piloto bien acotado.',
      helper: 'Ayuda a que el proyecto tenga foco desde el día uno y evita abrir más frentes de los que puede sostener.',
      cost: 2,
      time: 1,
      effects: { strategy: 8, people: 0, delivery: 6, risk: 1 },
      tags: ['foco', 'alcance'],
    },
    {
      id: 'r1_kpis',
      label: 'Aclarar desde el inicio para qué se quiere mover este proyecto.',
      helper: 'Hace visible el propósito del arranque y evita discutir solución antes de entender el para qué.',
      cost: 1,
      time: 1,
      effects: { strategy: 7, people: 0, delivery: 4, risk: 1 },
      tags: ['propósito'],
    },
    {
      id: 'r1_workshop_interesados',
      label: 'Hacer una instancia corta de alineamiento con áreas clave.',
      helper: 'Sirve para construir una foto inicial compartida del problema, el contexto y los actores del arranque.',
      cost: 2,
      time: 1,
      effects: { strategy: 2, people: 8, delivery: 1, risk: 3 },
      tags: ['stakeholders'],
    },
    {
      id: 'r1_mirar_experiencia',
      label: 'Incluir la mirada del cliente y del canal en el contexto inicial.',
      helper: 'Evita que el proyecto se defina solo desde adentro y mejora la comprensión del terreno real.',
      cost: 1,
      time: 1,
      effects: { strategy: 4, people: 4, delivery: 1, risk: 0 },
      tags: ['contexto'],
    },
    {
      id: 'r1_arrancar_grande',
      label: 'Intentar abarcar varias líneas o frentes desde el comienzo.',
      helper: 'Suena ambicioso, pero vuelve borroso el terreno y complica el inicio del proyecto.',
      cost: 3,
      time: 2,
      effects: { strategy: 1, people: 0, delivery: -4, risk: -6 },
      tags: ['sobrealcance'],
    },
    {
      id: 'r1_vendor_centro',
      label: 'Tomar la propuesta del proveedor como guía principal del arranque.',
      helper: 'Hace más rápido el arranque aparente, pero pone la solución antes del problema y del contexto.',
      cost: 1,
      time: 1,
      effects: { strategy: -3, people: 0, delivery: 0, risk: -3 },
      tags: ['solución primero'],
    },
  ],
  2: [
    {
      id: 'r2_plan_adopcion',
      label: 'Traducir la necesidad en un objetivo concreto de proyecto.',
      helper: 'Ayuda a pasar del problema a un objetivo entendible y medible para el arranque.',
      cost: 2,
      time: 1,
      effects: { strategy: 8, people: 1, delivery: 2, risk: 1 },
      tags: ['objetivo'],
    },
    {
      id: 'r2_controles_compliance',
      label: 'Definir un entregable visible y un primer hito temporal realista.',
      helper: 'Da forma a la arquitectura inicial del proyecto sin caer todavía en un plan exhaustivo.',
      cost: 2,
      time: 1,
      effects: { strategy: 3, people: 0, delivery: 7, risk: 1 },
      tags: ['entregables', 'tiempo'],
    },
    {
      id: 'r2_negociar_alcance',
      label: 'Acordar criterios de éxito y un primer recorte de alcance.',
      helper: 'Ordena la conversación sobre qué va a contar como buen arranque y qué todavía queda afuera.',
      cost: 1,
      time: 1,
      effects: { strategy: 6, people: 2, delivery: 4, risk: 3 },
      tags: ['criterios'],
    },
    {
      id: 'r2_alinear_areas',
      label: 'Alinear con negocio, IT y sponsor la secuencia inicial de trabajo.',
      helper: 'Mejora la arquitectura del proyecto porque baja ambigüedad sobre qué se hace primero y con quién.',
      cost: 3,
      time: 2,
      effects: { strategy: 2, people: 5, delivery: 4, risk: 4 },
      tags: ['secuencia'],
    },
    {
      id: 'r2_saltar_operaciones',
      label: 'Fijar una fecha fuerte sin definir antes entregables y criterios.',
      helper: 'Puede sonar ejecutivo, pero deja una arquitectura frágil y más difícil de defender.',
      cost: 1,
      time: 1,
      effects: { strategy: -3, people: 0, delivery: 1, risk: -5 },
      tags: ['fecha vacía'],
    },
    {
      id: 'r2_prometer_fecha_cerrada',
      label: 'Prometer un entregable amplio sin validar si realmente es el primero que conviene.',
      helper: 'Empuja a comprometer una forma del proyecto antes de ordenar prioridad, secuencia y criterio de éxito.',
      cost: 1,
      time: 1,
      effects: { strategy: -4, people: 0, delivery: 0, risk: -4 },
      tags: ['promesa prematura'],
    },
  ],
  3: [
    {
      id: 'r3_alinear_dependencias',
      label: 'Alinear dependencias técnicas antes de cerrar fechas del inicio.',
      helper: 'Vuelve más realista el arranque porque expone temprano lo que podría bloquear la ejecución.',
      cost: 2,
      time: 1,
      effects: { strategy: 1, people: 0, delivery: 8, risk: 4 },
      tags: ['dependencias'],
    },
    {
      id: 'r3_contingencia',
      label: 'Definir restricciones duras, resguardos y plan de contingencia mínimo.',
      helper: 'Protege el arranque frente a fallas, desvíos o condiciones que el proyecto no controla del todo.',
      cost: 1,
      time: 1,
      effects: { strategy: 0, people: 0, delivery: 1, risk: 8 },
      tags: ['restricciones'],
    },
    {
      id: 'r3_equipo_dedicado',
      label: 'Dejar explícitos los supuestos clave de disponibilidad y soporte.',
      helper: 'Hace visible con qué recursos y apoyos reales cuenta el proyecto para empezar.',
      cost: 2,
      time: 1,
      effects: { strategy: 2, people: 2, delivery: 4, risk: 3 },
      tags: ['supuestos'],
    },
    {
      id: 'r3_prueba_usuarios',
      label: 'Preparar un arranque controlado antes de ampliar el alcance.',
      helper: 'Reduce exposición y permite aprender rápido sin comprometer de más al proyecto.',
      cost: 2,
      time: 1,
      effects: { strategy: 1, people: 4, delivery: 4, risk: 2 },
      tags: ['resguardo'],
    },
    {
      id: 'r3_lanzar_todo',
      label: 'Apostar a varios frentes en paralelo para ganar velocidad.',
      helper: 'Puede dar sensación de avance, pero vuelve más frágil la viabilidad del inicio.',
      cost: 3,
      time: 1,
      effects: { strategy: 0, people: 0, delivery: 2, risk: -7 },
      tags: ['sobreexposición'],
    },
    {
      id: 'r3_revisar_riesgos',
      label: 'Revisar macro-riesgos y mitigaciones antes de formalizar el arranque.',
      helper: 'Ayuda a decidir si el proyecto realmente puede empezar así o si todavía hay huecos críticos.',
      cost: 1,
      time: 1,
      effects: { strategy: 2, people: 0, delivery: 0, risk: 6 },
      tags: ['macro-riesgos'],
    },
  ],
};

export const STAKEHOLDER_POOL = [
  { id: 'ceo', label: 'CEO / sponsor ejecutivo', weight: 4, category: 'core' },
  { id: 'operaciones', label: 'Gerencia de Operaciones / Siniestros', weight: 4, category: 'core' },
  { id: 'it', label: 'IT / Arquitectura', weight: 4, category: 'core' },
  { id: 'compliance', label: 'Compliance / Legales', weight: 4, category: 'core' },
  { id: 'rrhh_change', label: 'RRHH / Gestión del cambio', weight: 2, category: 'secondary' },
  { id: 'broker', label: 'Brokers / canal comercial', weight: 2, category: 'secondary' },
  { id: 'cliente', label: 'Cliente final', weight: 2, category: 'secondary' },
  { id: 'proveedor_ai', label: 'Proveedor externo de IA', weight: -2, category: 'noise' },
  { id: 'prensa', label: 'Prensa / comunicación externa', weight: -3, category: 'noise' },
  { id: 'auditoria_general', label: 'Auditoría general corporativa completa', weight: -1, category: 'noise' },
];

export const ARCHITECTURE_POOL = [
  { id: 'objetivo_claro', label: 'Objetivo concreto del proyecto en términos de negocio', weight: 4, category: 'core' },
  { id: 'entregable_inicial', label: 'Entregable visible para el arranque o primer hito', weight: 4, category: 'core' },
  { id: 'criterios_exito', label: 'Criterios de éxito del inicio o del piloto', weight: 4, category: 'core' },
  { id: 'hitos_tiempo', label: 'Hitos o tiempos iniciales razonables', weight: 3, category: 'core' },
  { id: 'dependencias_clave', label: 'Dependencias que condicionan los primeros entregables', weight: 3, category: 'core' },
  { id: 'responsables_clave', label: 'Responsables clave del arranque', weight: 2, category: 'secondary' },
  { id: 'nombre_comercial', label: 'Nombre comercial definitivo del proyecto', weight: -2, category: 'noise' },
  { id: 'disenio_slides', label: 'Diseño final de las slides para el comité', weight: -1, category: 'noise' },
  { id: 'manual_extendido', label: 'Manual completo de operación futura', weight: -3, category: 'noise' },
  { id: 'campania_prensa', label: 'Plan de comunicación externa a prensa', weight: -2, category: 'noise' },
];

export const RISK_POOL = [
  { id: 'datos_sensibles', label: 'Uso inadecuado de datos personales o sensibles de clientes', weight: 4, category: 'core' },
  { id: 'integracion_legacy', label: 'Demoras o fallas por dependencias con sistemas legados', weight: 4, category: 'core' },
  { id: 'trazabilidad', label: 'Falta de trazabilidad para explicar decisiones o recomendaciones', weight: 4, category: 'core' },
  { id: 'baja_adopcion', label: 'Baja adopción del proyecto por parte del equipo operativo', weight: 3, category: 'core' },
  { id: 'calidad_datos', label: 'Calidad o disponibilidad insuficiente de los datos necesarios', weight: 3, category: 'core' },
  { id: 'supuesto_disponibilidad', label: 'Suposición poco realista sobre tiempo disponible de las áreas clave', weight: 2, category: 'secondary' },
  { id: 'sesgo_modelo', label: 'Respuestas inconsistentes en algunos tipos de casos', weight: 2, category: 'secondary' },
  { id: 'newsletter_interno', label: 'Cambio de formato del newsletter interno del trimestre', weight: -2, category: 'noise' },
  { id: 'beneficios_rrhh', label: 'Revisión anual del paquete de beneficios internos', weight: -2, category: 'noise' },
  { id: 'mobiliario_oficina', label: 'Renovación del mobiliario de una oficina administrativa', weight: -1, category: 'noise' },
];

export const RESOURCE_BUCKETS = [
  { id: 'negocio', label: 'Negocio y Operaciones', ideal: 2, criticalMin: 1 },
  { id: 'it_datos', label: 'IT y Datos', ideal: 3, criticalMin: 2 },
  { id: 'adopcion', label: 'Gestión del cambio y capacitación', ideal: 2, criticalMin: 1 },
  { id: 'compliance', label: 'Compliance / Legal', ideal: 1, criticalMin: 1 },
  { id: 'contingencia', label: 'Contingencia y seguimiento', ideal: 2, criticalMin: 1 },
];

export const TEAM_DEFAULT_ROUND = () => ({
  decisions: [],
  exerciseSelection: [],
  resourceAllocation: defaultResourceAllocation(),
  submitted: false,
  updatedAt: 0,
});

export function defaultResourceAllocation() {
  return Object.fromEntries(RESOURCE_BUCKETS.map((item) => [item.id, 0]));
}

export function defaultTeamState(index = 1) {
  return {
    teamId: `equipo-${index}`,
    name: `Equipo ${index}`,
    accessCode: '',
    rounds: {
      1: TEAM_DEFAULT_ROUND(),
      2: TEAM_DEFAULT_ROUND(),
      3: TEAM_DEFAULT_ROUND(),
    },
    notes: '',
    lastSeenAt: 0,
  };
}

export function createRandomCode(length = 6, alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789') {
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return result;
}

export function createSessionCode() {
  return createRandomCode(6);
}

export function createAdminPin() {
  return createRandomCode(5, '23456789');
}

export function normalizeSessionCode(value = '') {
  return String(value).trim().toUpperCase();
}

export function getDecisionById(roundId, decisionId) {
  return (DECISIONS[roundId] || []).find((item) => item.id === decisionId) || null;
}

export function pickRoundDecisions(roundId, selectedIds = []) {
  return selectedIds.map((id) => getDecisionById(roundId, id)).filter(Boolean);
}

export function scoreStakeholderExercise(selectedIds = []) {
  const unique = [...new Set(selectedIds)];
  let score = 0;
  const correct = [];
  const noisy = [];
  unique.forEach((id) => {
    const item = STAKEHOLDER_POOL.find((s) => s.id === id);
    if (!item) return;
    score += item.weight;
    if (item.weight > 0) correct.push(item.label);
    if (item.weight < 0) noisy.push(item.label);
  });
  score = clamp(score, 0, 22);
  return {
    score,
    correct,
    noisy,
    summary: buildExerciseSummary({
      score,
      correctCount: correct.length,
      noisyCount: noisy.length,
      positiveLabel: 'interesados relevantes',
      noisyLabel: 'actores que no sumaban en esta etapa',
    }),
  };
}

export function scoreArchitectureExercise(selectedIds = []) {
  const unique = [...new Set(selectedIds)];
  let score = 0;
  const correct = [];
  const noisy = [];
  unique.forEach((id) => {
    const item = ARCHITECTURE_POOL.find((entry) => entry.id === id);
    if (!item) return;
    score += item.weight;
    if (item.weight > 0) correct.push(item.label);
    if (item.weight < 0) noisy.push(item.label);
  });
  score = clamp(score, 0, 22);
  return {
    score,
    correct,
    noisy,
    summary: buildExerciseSummary({
      score,
      correctCount: correct.length,
      noisyCount: noisy.length,
      positiveLabel: 'definiciones útiles para la arquitectura inicial',
      noisyLabel: 'definiciones accesorias o prematuras',
    }),
  };
}

export function scoreRiskExercise(selectedIds = []) {
  const unique = [...new Set(selectedIds)];
  let score = 0;
  const correct = [];
  const noisy = [];
  unique.forEach((id) => {
    const item = RISK_POOL.find((risk) => risk.id === id);
    if (!item) return;
    score += item.weight;
    if (item.weight > 0) correct.push(item.label);
    if (item.weight < 0) noisy.push(item.label);
  });
  score = clamp(score, 0, 22);
  return {
    score,
    correct,
    noisy,
    summary: buildExerciseSummary({
      score,
      correctCount: correct.length,
      noisyCount: noisy.length,
      positiveLabel: 'riesgos bien elegidos',
      noisyLabel: 'riesgos que metían ruido',
    }),
  };
}

export function scoreResourceExercise(allocationInput = {}) {
  const allocation = RESOURCE_BUCKETS.reduce((acc, bucket) => {
    acc[bucket.id] = safeInt(allocationInput[bucket.id]);
    return acc;
  }, {});

  const totalAssigned = Object.values(allocation).reduce((sum, value) => sum + value, 0);
  const distance = RESOURCE_BUCKETS.reduce(
    (sum, bucket) => sum + Math.abs((allocation[bucket.id] || 0) - bucket.ideal),
    0,
  );

  let score = 20 - distance * 2;
  const notes = [];

  RESOURCE_BUCKETS.forEach((bucket) => {
    if ((allocation[bucket.id] || 0) < bucket.criticalMin) {
      score -= 4;
      notes.push(`Quedó corta la asignación en ${bucket.label.toLowerCase()}.`);
    }
  });

  if (totalAssigned > 10) {
    score -= (totalAssigned - 10) * 4;
    notes.push('Se pasaron de las 10 fichas disponibles.');
  }

  if (totalAssigned < 8) {
    score -= 3;
    notes.push('Quedó capacidad sin asignar y el plan pierde potencia.');
  }

  const strongAreas = RESOURCE_BUCKETS.filter((bucket) => allocation[bucket.id] === bucket.ideal).map((bucket) => bucket.label);
  score = clamp(score, 0, 24);

  return {
    score,
    totalAssigned,
    allocation,
    strongAreas,
    notes,
    summary:
      score >= 17
        ? 'La asignación de capacidad quedó equilibrada y consistente con un piloto realista.'
        : score >= 10
          ? 'La asignación de capacidad es aceptable, aunque deja algunos frentes más débiles de lo recomendable.'
          : 'La asignación de capacidad dejó huecos importantes para sostener el piloto.',
  };
}

export function computeRoundResult(teamState, roundId) {
  const roundState = teamState?.rounds?.[roundId] || TEAM_DEFAULT_ROUND();
  const decisions = pickRoundDecisions(roundId, roundState.decisions || []);
  const decisionPoints = decisions.reduce(
    (acc, decision) => ({
      strategy: acc.strategy + (decision.effects.strategy || 0),
      people: acc.people + (decision.effects.people || 0),
      delivery: acc.delivery + (decision.effects.delivery || 0),
      risk: acc.risk + (decision.effects.risk || 0),
      budgetUsed: acc.budgetUsed + decision.cost,
      timeUsed: acc.timeUsed + decision.time,
    }),
    { strategy: 0, people: 0, delivery: 0, risk: 0, budgetUsed: 0, timeUsed: 0 },
  );

  let exercise = { score: 0, summary: 'No resuelto.', correct: [], noisy: [], strongAreas: [], notes: [] };
  const categories = {
    strategy: decisionPoints.strategy,
    people: decisionPoints.people,
    delivery: decisionPoints.delivery,
    risk: decisionPoints.risk,
  };

  if (roundId === 1) {
    exercise = scoreStakeholderExercise(roundState.exerciseSelection || []);
    categories.people += Math.round(exercise.score * 0.7);
    categories.strategy += Math.round(exercise.score * 0.3);
  }

  if (roundId === 2) {
    exercise = scoreArchitectureExercise(roundState.exerciseSelection || []);
    categories.strategy += Math.round(exercise.score * 0.6);
    categories.delivery += Math.round(exercise.score * 0.4);
  }

  if (roundId === 3) {
    exercise = scoreRiskExercise(roundState.exerciseSelection || []);
    categories.risk += Math.round(exercise.score * 0.8);
    categories.strategy += Math.round(exercise.score * 0.2);
  }

  const event = scoreRoundEvent(roundId, roundState, exercise);
  const limits = ROUND_LIMITS[roundId];
  const overloadPenalty = computeOverloadPenalty(
    decisionPoints.budgetUsed,
    decisionPoints.timeUsed,
    limits.budget,
    limits.time,
    decisions.length,
    MAX_DECISIONS_PER_ROUND,
  );
  const decisionScore = Math.max(0, decisionPoints.strategy + decisionPoints.people + decisionPoints.delivery + decisionPoints.risk);
  const subtotalBeforeFloor =
    categories.strategy + categories.people + categories.delivery + categories.risk + event.points + overloadPenalty;

  const roundTotal = Math.max(0, subtotalBeforeFloor);

  return {
    roundId,
    title: ROUNDS.find((round) => round.id === roundId)?.title || `Ronda ${roundId}`,
    decisions,
    decisionPoints,
    decisionScore,
    exercise,
    event,
    overloadPenalty,
    budgetUsed: decisionPoints.budgetUsed,
    timeUsed: decisionPoints.timeUsed,
    categories: {
      strategy: Math.max(0, categories.strategy),
      people: Math.max(0, categories.people),
      delivery: Math.max(0, categories.delivery),
      risk: Math.max(0, categories.risk),
    },
    roundTotal,
    submitted: !!roundState.submitted,
  };
}

export function computeTeamScore(teamState) {
  const rounds = [1, 2, 3].map((roundId) => computeRoundResult(teamState, roundId));
  const categoryTotals = rounds.reduce(
    (acc, round) => ({
      strategy: acc.strategy + round.categories.strategy,
      people: acc.people + round.categories.people,
      delivery: acc.delivery + round.categories.delivery,
      risk: acc.risk + round.categories.risk,
    }),
    { strategy: 0, people: 0, delivery: 0, risk: 0 },
  );

  const total = rounds.reduce((sum, round) => sum + round.roundTotal, 0);
  const normalized = Math.round((total / MAX_THEORETICAL_TOTAL) * 100);
  const band =
    normalized >= 80 ? 'muy sólido' : normalized >= 60 ? 'sólido con ajustes' : normalized >= 40 ? 'aceptable pero frágil' : 'débil';

  return {
    total,
    normalized,
    band,
    rounds,
    categoryTotals,
    report: generatePerformanceReport({ teamState, total, normalized, band, rounds, categoryTotals }),
  };
}

export const MAX_THEORETICAL_TOTAL = 210;

export function generatePerformanceReport({ teamState, total, normalized, band, rounds, categoryTotals }) {
  const strongest = sortEntriesDesc(categoryTotals)[0];
  const weakest = sortEntriesAsc(categoryTotals)[0];
  const highlights = [];
  const warnings = [];

  rounds.forEach((round) => {
    if (round.event.outcome === 'success') highlights.push(`${round.title}: sostuvieron bien la exigencia principal de la ronda.`);
    if (round.event.outcome === 'partial') highlights.push(`${round.title}: llegaron a una resolución aceptable, aunque con algunos huecos.`);
    if (round.event.outcome === 'fail') warnings.push(`${round.title}: el planteo quedó expuesto frente a la exigencia principal de la ronda.`);
    if (round.overloadPenalty < 0) warnings.push(`${round.title}: se excedieron en decisiones, presupuesto o tiempo respecto del marco de la ronda.`);
  });

  if ((teamState?.rounds?.[1]?.exerciseSelection || []).length === 0) warnings.push('En la ronda 1 no trabajaron de forma explícita la priorización de interesados del arranque.');
  if ((teamState?.rounds?.[2]?.exerciseSelection || []).length === 0) warnings.push('En la ronda 2 no trabajaron de forma explícita las definiciones básicas de la arquitectura inicial.');
  if ((teamState?.rounds?.[3]?.exerciseSelection || []).length === 0) warnings.push('En la ronda 3 no trabajaron de forma explícita los macro-riesgos del arranque.');

  const summary =
    normalized >= 80
      ? 'El equipo armó un inicio de proyecto sólido: entendió bien el terreno, le dio forma a una arquitectura inicial defendible y cuidó la viabilidad del arranque.'
      : normalized >= 60
        ? 'El equipo construyó un inicio de proyecto consistente, aunque dejó algunos puntos ciegos que convendría reforzar antes de avanzar.'
        : normalized >= 40
          ? 'El equipo logró una base de inicio usable, pero con debilidades visibles en foco, arquitectura o viabilidad que podrían complicar el proyecto.'
          : 'El equipo no llegó a consolidar un inicio de proyecto creíble: faltó foco en el terreno, claridad en la arquitectura o resguardo de la viabilidad.';

  return {
    total,
    normalized,
    band,
    summary,
    strongest,
    weakest,
    highlights,
    warnings,
    rounds: rounds.map((round) => ({
      roundId: round.roundId,
      title: round.title,
      total: round.roundTotal,
      decisions: round.decisions.length,
      decisionsScore: round.decisionScore,
      budgetUsed: round.budgetUsed,
      timeUsed: round.timeUsed,
      exerciseScore: round.exercise.score,
      exerciseSummary: round.exercise.summary,
      eventLabel: round.event.label,
      eventOutcome: round.event.outcome,
      eventPoints: round.event.points,
      penalty: round.overloadPenalty,
      note: describeRound(round),
    })),
  };
}

export function scoreRoundEvent(roundId, roundState, exercise) {
  const decisions = roundState.decisions || [];
  if (roundId === 1) {
    const checks = [
      decisions.includes('r1_piloto_acotado'),
      decisions.includes('r1_kpis'),
      exercise.score >= 12,
    ].filter(Boolean).length;
    return buildEventResult('Presión temprana del sponsor', checks, {
      success: 10,
      partial: 4,
      fail: -6,
    });
  }
  if (roundId === 2) {
    const checks = [
      decisions.includes('r2_plan_adopcion'),
      decisions.includes('r2_controles_compliance'),
      exercise.score >= 12,
    ].filter(Boolean).length;
    return buildEventResult('La arquitectura inicial es cuestionada por falta de definición', checks, {
      success: 12,
      partial: 5,
      fail: -8,
    });
  }
  if (roundId === 3) {
    const checks = [
      decisions.includes('r3_alinear_dependencias'),
      decisions.includes('r3_contingencia'),
      exercise.score >= 12,
    ].filter(Boolean).length;
    return buildEventResult('El comité pone a prueba la viabilidad del arranque', checks, {
      success: 12,
      partial: 5,
      fail: -8,
    });
  }
  return { label: '', points: 0, outcome: 'none' };
}

function buildEventResult(label, checks, scores) {
  if (checks >= 3) return { label, points: scores.success, outcome: 'success' };
  if (checks === 2) return { label, points: scores.partial, outcome: 'partial' };
  return { label, points: scores.fail, outcome: 'fail' };
}

export function computeOverloadPenalty(usedBudget, usedTime, budgetLimit, timeLimit, decisionCount = 0, maxDecisions = MAX_DECISIONS_PER_ROUND) {
  const budgetPenalty = usedBudget > budgetLimit ? (usedBudget - budgetLimit) * 5 : 0;
  const timePenalty = usedTime > timeLimit ? (usedTime - timeLimit) * 5 : 0;
  const decisionPenalty = decisionCount > maxDecisions ? (decisionCount - maxDecisions) * 8 : 0;
  return -(budgetPenalty + timePenalty + decisionPenalty);
}

export function describeRound(round) {
  const notes = [];

  if (round.decisions.length === 0) notes.push('No seleccionaron decisiones para estructurar esta parte del inicio.');
  else if (round.decisions.length === 1) notes.push('Tomaron una única decisión de foco; el arranque quedó bastante acotado.');
  else if (round.decisions.length <= MAX_DECISIONS_PER_ROUND) notes.push('Las decisiones elegidas dieron forma al trabajo de la ronda sin sobredimensionarlo.');
  else notes.push('Tomaron más decisiones de las recomendadas para esta ronda.');

  if (round.exercise.score >= 16) notes.push('El ejercicio complementario quedó muy bien resuelto.');
  else if (round.exercise.score >= 10) notes.push('El ejercicio complementario quedó razonablemente cubierto.');
  else notes.push('El ejercicio complementario dejó huecos importantes.');

  if (round.event.outcome === 'success') notes.push('El equipo sostuvo con solidez la exigencia principal de la ronda.');
  if (round.event.outcome === 'partial') notes.push('La exigencia principal quedó cubierta de manera parcial.');
  if (round.event.outcome === 'fail') notes.push('La exigencia principal dejó expuesto el planteo del equipo.');
  if (round.overloadPenalty < 0) notes.push('Hubo penalización por excederse en decisiones, presupuesto o tiempo.');

  return notes.join(' ');
}

function buildExerciseSummary({ score, correctCount, noisyCount, positiveLabel, noisyLabel }) {
  if (score >= 16) return `Buen resultado: identificaron ${correctCount} ${positiveLabel} y casi no metieron ruido.`;
  if (score >= 10) return `Resultado aceptable: identificaron ${correctCount} ${positiveLabel}, aunque con algo de dispersión.`;
  if (noisyCount > 0) return `Resultado débil: aparecieron ${noisyCount} ${noisyLabel}.`;
  return 'Resultado débil: faltó cobertura de elementos clave para esta etapa.';
}

function sortEntriesDesc(obj) {
  return Object.entries(obj).sort((a, b) => b[1] - a[1]);
}

function sortEntriesAsc(obj) {
  return Object.entries(obj).sort((a, b) => a[1] - b[1]);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function safeInt(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}
