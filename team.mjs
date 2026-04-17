import {
  ARCHITECTURE_POOL,
  computeTeamScore,
  DECISIONS,
  RESOURCE_BUCKETS,
  RISK_POOL,
  ROUNDS,
  ROUND_LIMITS,
  MAX_DECISIONS_PER_ROUND,
} from './app-core.mjs';
import {
  isFirebaseConfigured,
  listenSession,
  listenTeam,
  saveRound,
  saveRoundDraft,
  teamLogin,
} from './firebase-service.mjs';
import {
  appFrame,
  formatTimeLeft,
  params,
  qs,
  renderRoundPills,
  renderSetupPending,
} from './ui-common.mjs';

const app = qs('app');
const query = params();
let state = {
  sessionCode: query.get('session') || '',
  accessCode: query.get('code') || '',
  session: null,
  team: null,
  activeStep: 1,
  lastRoundSeen: null,
  timerId: null,
  unsubSession: null,
  unsubTeam: null,
};

if (!isFirebaseConfigured()) {
  app.innerHTML = renderSetupPending();
} else if (state.sessionCode && state.accessCode) {
  login(state.sessionCode, state.accessCode);
} else {
  renderLogin();
}

function renderLogin(error = '') {
  app.innerHTML = appFrame({
    title: 'Ingreso de equipo',
    subtitle:
      'Entren con el código de sesión y el código de equipo. Cuando el administrador abra una ronda, van a ver el mismo estado en tiempo real.',
    actions: `
      <div class="soft-box stack-sm">
        <div class="section-title">Accesos rápidos</div>
        <a class="btn btn-soft" href="index.html">Volver al inicio</a>
        <a class="btn btn-soft" href="admin.html">Ingreso admin</a>
      </div>
    `,
    body: `
      <section class="card stack-md" style="max-width:720px;">
        <div class="grid two">
          <div>
            <label>Código de sesión</label>
            <input id="sessionCode" value="${state.sessionCode}" placeholder="Ej. A8K4P2" />
          </div>
          <div>
            <label>Código de equipo</label>
            <input id="accessCode" value="${state.accessCode}" placeholder="Ej. K7D4P" />
          </div>
        </div>
        <div class="callout info">Tip: todas las mesas comparten el código de sesión, pero cada una entra con su propio código de equipo.</div>
        ${error ? `<div class="callout bad">${error}</div>` : ''}
        <button class="btn btn-primary" id="teamLoginBtn">Entrar</button>
      </section>
    `,
  });

  qs('teamLoginBtn').addEventListener('click', () => login(qs('sessionCode').value, qs('accessCode').value));
}

async function login(sessionCode, accessCode) {
  try {
    const team = await teamLogin(sessionCode, accessCode);
    state.sessionCode = sessionCode.trim().toUpperCase();
    state.accessCode = accessCode.trim().toUpperCase();
    state.team = team;
    connectListeners();
  } catch (err) {
    renderLogin(err.message || 'No pudimos validar ese código.');
  }
}

function connectListeners() {
  state.unsubSession?.();
  state.unsubTeam?.();
  state.unsubSession = listenSession(state.sessionCode, (session) => {
    const previousRound = state.session?.currentRound ?? null;
    state.session = session;
    const nextRound = session?.currentRound ?? null;
    if (previousRound !== nextRound) state.activeStep = 1;
    state.lastRoundSeen = nextRound;
    renderTeam();
  });
  state.unsubTeam = listenTeam(state.sessionCode, state.team.teamId, (team) => {
    state.team = team;
    renderTeam();
  });
  startTimerRefresh();
}

function startTimerRefresh() {
  clearInterval(state.timerId);
  state.timerId = setInterval(() => {
    const timerNode = qs('teamCountdown');
    if (timerNode && state.session) {
      timerNode.textContent = formatTimeLeft(state.session.roundEndsAt, state.session.roundClosed);
    }
  }, 1000);
}

function renderTeam() {
  if (!state.session || !state.team) return;
  const currentRound = Number(state.session.currentRound || 0);
  const currentRoundState = currentRound >= 1 && currentRound <= 3 ? state.team.rounds?.[String(currentRound)] || {} : null;
  const score = computeTeamScore(state.team);
  const previousTotal = score.rounds
    .filter((round) => round.roundId < Math.min(currentRound || 1, 4))
    .reduce((sum, round) => sum + round.roundTotal, 0);

  app.innerHTML = appFrame({
    title: `${state.team.name} · Vista de equipo`,
    subtitle: 'Recorran la ronda activa paso a paso. Durante el juego sólo van a ver el avance previo; la devolución completa aparece al final, en el debrief.',
    actions: `
      <div class="kpi-strip">
        <div class="kpi-card"><div class="label">Sesión</div><div class="value mono">${state.sessionCode}</div><div class="sub">Código compartido</div></div>
        <div class="kpi-card"><div class="label">Equipo</div><div class="value">${state.team.name}</div><div class="sub">Código ${state.accessCode}</div></div>
        <div class="kpi-card"><div class="label">Avance acumulado</div><div class="value">${currentRound === 4 ? score.total : previousTotal}</div><div class="sub">${currentRound === 4 ? 'Resultado final' : currentRound <= 1 ? 'Todavía no hay rondas cerradas' : 'Consolidado hasta la ronda anterior'}</div></div>
        <div class="kpi-card"><div class="label">Tiempo</div><div class="value timer-text" id="teamCountdown">${formatTimeLeft(state.session.roundEndsAt, state.session.roundClosed)}</div><div class="sub">${state.session.roundClosed ? 'Cierre anticipado o tiempo cumplido' : 'Reloj de la ronda'}</div></div>
      </div>
    `,
    body: `
      ${renderRoundPills(currentRound)}
      ${renderRoundHeader(currentRound, currentRoundState)}
      ${renderMainTeamArea(currentRound, currentRoundState)}
    `,
  });

  bindTeamEvents(currentRound);
}

function renderRoundHeader(currentRound, currentRoundState) {
  if (currentRound === 0) {
    return `
      <section class="card stack-md">
        <div class="section-title">Esperando al administrador</div>
        <div class="soft-box">
          Cuando el administrador abra una ronda, acá van a aparecer el contexto, la consigna y los pasos de trabajo.
        </div>
      </section>
    `;
  }

  if (currentRound === 4) {
    return `
      <section class="card stack-md">
        <div class="section-title">Debrief final</div>
        <div class="callout good">La etapa de juego terminó. Ahora ya pueden mirar el informe final del equipo.</div>
      </section>
    `;
  }

  const round = ROUNDS[currentRound - 1];
  const limits = ROUND_LIMITS[currentRound];
  const decisions = selectedDecisions(currentRound, currentRoundState);
  const budgetUsed = decisions.reduce((sum, item) => sum + item.cost, 0);
  const timeUsed = decisions.reduce((sum, item) => sum + item.time, 0);

  return `
    <section class="card stack-md">
      <div class="section-title">Ronda activa</div>
      <h2>${round.title}</h2>
      <div class="callout info small">${round.intro}</div>
      <div class="round-summary-grid">
        <div class="soft-box stack-sm">
          <strong>Qué parte del inicio están trabajando</strong>
          <div class="small muted">${round.dimension}</div>
        </div>
        <div class="soft-box stack-sm">
          <strong>En qué punto del proyecto están</strong>
          <div class="small muted">${round.moment}</div>
        </div>
      </div>
      <div class="soft-box stack-sm">
        <strong>Consigna</strong>
        <div class="small muted">${round.brief}</div>
      </div>
      <div class="round-status-grid">
        <div class="metric"><strong>Decisiones elegidas</strong><span>${(currentRoundState?.decisions || []).length} / ${MAX_DECISIONS_PER_ROUND}</span></div>
        <div class="metric"><strong>Presupuesto usado</strong><span>${budgetUsed} / ${limits.budget}</span></div>
        <div class="metric"><strong>Tiempo usado</strong><span>${timeUsed} / ${limits.time}</span></div>
        <div class="metric"><strong>Estado</strong><span>${currentRoundState?.submitted ? 'Enviado' : state.session.roundClosed ? 'Ronda cerrada' : 'En curso'}</span></div>
      </div>
    </section>
  `;
}

function renderMainTeamArea(currentRound, currentRoundState) {
  if (currentRound === 0) return '';
  if (currentRound === 4) {
    const report = computeTeamScore(state.team).report;
    return renderFinalReport(report);
  }

  const round = ROUNDS[currentRound - 1];
  return `
    <section class="stack-md">
      <div class="step-nav">
        <button class="btn ${state.activeStep === 1 ? 'active' : ''}" data-step="1">Paso 1</button>
        <button class="btn ${state.activeStep === 2 ? 'active' : ''}" data-step="2">Paso 2</button>
        <button class="btn ${state.activeStep === 3 ? 'active' : ''}" data-step="3">Paso 3</button>
      </div>

      <article class="card stack-md ${state.activeStep === 1 ? '' : 'hidden'}" id="panel-step-1">
        <div class="section-title">Paso 1</div>
        <h2>${round.step1Title}</h2>
        <p class="subtitle">${round.step1Help}</p>
        <div class="decision-grid">
          ${DECISIONS[currentRound].map((decision) => {
            const checked = currentRoundState?.decisions?.includes(decision.id);
            return `
              <label class="decision-card ${checked ? 'selected' : ''}">
                <div class="decision-row">
                  <input type="checkbox" data-decision="${decision.id}" ${checked ? 'checked' : ''} />
                  <div class="decision-body">
                    <div class="decision-title">${decision.label}</div>
                    <div class="decision-copy">${decision.helper || ''}</div>
                    <div class="tag-row">
                      <span class="tag">Costo ${decision.cost}</span>
                      <span class="tag">Tiempo ${decision.time}</span>
                      ${(decision.tags || []).map((tag) => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                  </div>
                </div>
              </label>
            `;
          }).join('')}
        </div>
      </article>

      <article class="card stack-md ${state.activeStep === 2 ? '' : 'hidden'}" id="panel-step-2">
        <div class="section-title">Paso 2</div>
        <h2>${round.step2Title}</h2>
        <p class="subtitle">${round.step2Help}</p>
        ${currentRound === 1 ? renderStakeholderExercise(currentRoundState) : ''}
        ${currentRound === 2 ? renderArchitectureExercise(currentRoundState) : ''}
        ${currentRound === 3 ? renderRiskExercise(currentRoundState) : ''}
      </article>

      <article class="card stack-md ${state.activeStep === 3 ? '' : 'hidden'}" id="panel-step-3">
        <div class="section-title">Paso 3</div>
        <h2>${round.step3Title}</h2>
        <p class="subtitle">${round.step3Help}</p>
        <div class="soft-box stack-sm">
          <strong>Chequeo rápido antes de enviar</strong>
          <ul class="bullet-list">
            <li>Eligieron como máximo ${MAX_DECISIONS_PER_ROUND} decisiones.</li>
            <li>El foco del proyecto quedó claro para esta etapa.</li>
            <li>No se pasaron de tiempo ni presupuesto.</li>
            <li>Completaron el ejercicio asociado a esta etapa del inicio.</li>
          </ul>
        </div>
        ${state.session.roundClosed ? '<div class="callout warn">La ronda fue cerrada por el administrador. Si no llegaron a enviar, se toma el último avance guardado.</div>' : '<div class="callout info">Cuando envían la ronda, el administrador la ve al instante.</div>'}
        <div class="row wrap">
          <button class="btn btn-soft" id="saveDraftBtn">Guardar avance</button>
          <button class="btn btn-primary" id="submitRoundBtn" ${state.session.roundClosed ? 'disabled' : ''}>Enviar ronda</button>
        </div>
        ${currentRoundState?.submitted ? '<div class="callout good">Esta ronda ya fue enviada. Pueden seguir mirando el contenido, pero el envío ya quedó registrado.</div>' : ''}
      </article>
    </section>
  `;
}

function renderStakeholderExercise(roundState) {
  const selected = new Set(roundState?.exerciseSelection || []);
  const options = [
    ['ceo', 'CEO / sponsor ejecutivo'],
    ['operaciones', 'Gerencia de Operaciones / Siniestros'],
    ['it', 'IT / Arquitectura'],
    ['compliance', 'Compliance / Legales'],
    ['rrhh_change', 'RRHH / Gestión del cambio'],
    ['broker', 'Brokers / canal comercial'],
    ['cliente', 'Cliente final'],
    ['proveedor_ai', 'Proveedor externo de IA'],
    ['prensa', 'Prensa / comunicación externa'],
    ['auditoria_general', 'Auditoría general corporativa completa'],
  ];
  return `
    <div class="callout info small">Marquen a los actores que realmente conviene sentar en la mesa al inicio. No se trata de invitar a todo el mundo, sino de priorizar con criterio.</div>
    <div class="exercise-grid">
      ${options.map(([id, label]) => `
        <label class="choice">
          <input type="checkbox" data-exercise-item="${id}" ${selected.has(id) ? 'checked' : ''} />
          <span>${label}</span>
        </label>
      `).join('')}
    </div>
  `;
}

function renderArchitectureExercise(roundState) {
  const selected = new Set(roundState?.exerciseSelection || []);
  return `
    <div class="callout info small">Marquen las definiciones que no deberían faltar en una buena arquitectura inicial del proyecto. Algunas son centrales; otras todavía serían accesorias o prematuras.</div>
    <div class="exercise-grid">
      ${ARCHITECTURE_POOL.map((item) => `
        <label class="choice">
          <input type="checkbox" data-exercise-item="${item.id}" ${selected.has(item.id) ? 'checked' : ''} />
          <span>${item.label}</span>
        </label>
      `).join('')}
    </div>
  `;
}

function renderRiskExercise(roundState) {
  const selected = new Set(roundState?.exerciseSelection || []);
  return `
    <div class="callout info small">Marquen los macro-riesgos que de verdad podrían complicar el arranque del proyecto. No todo lo que parece plausible debería condicionar la decisión en esta etapa.</div>
    <div class="exercise-grid">
      ${RISK_POOL.map((item) => `
        <label class="choice">
          <input type="checkbox" data-exercise-item="${item.id}" ${selected.has(item.id) ? 'checked' : ''} />
          <span>${item.label}</span>
        </label>
      `).join('')}
    </div>
  `;
}

function renderResourceExercise(roundState) {
  const allocation = roundState?.resourceAllocation || {};
  return `
    <div class="resource-grid">
      ${RESOURCE_BUCKETS.map((bucket) => `
        <div class="resource-card">
          <div class="resource-row">
            <div>
              <strong>${bucket.label}</strong>
              <div class="small muted">No hace falta repartir parejo: prioricen con criterio.</div>
            </div>
            <input type="number" min="0" max="10" step="1" data-resource="${bucket.id}" value="${allocation[bucket.id] ?? 0}" />
          </div>
        </div>
      `).join('')}
    </div>
    <div class="callout info">Tienen 10 fichas en total. Si dejan un frente crítico en cero, el plan queda más frágil.</div>
  `;
}

function renderFinalReport(report) {
  return `
    <section class="report-grid">
      <article class="card stack-md">
        <div class="section-title">Resultado final</div>
        <div class="kpi-strip two-up">
          <div class="kpi-card"><div class="label">Puntaje final</div><div class="value">${report.total}</div><div class="sub">${report.normalized}% de referencia del simulador</div></div>
          <div class="kpi-card"><div class="label">Nivel general</div><div class="value">${report.band}</div><div class="sub">Lectura del arranque propuesto</div></div>
        </div>
        <div class="soft-box">${report.summary}</div><div class="callout info small"><strong>Cómo leer este informe:</strong> no evalúa si eligieron la única respuesta correcta, sino cuán consistente quedó el inicio del proyecto en términos de terreno, arquitectura y viabilidad.</div>
        <div>
          <strong>Punto más fuerte</strong>
          <div class="small muted" style="margin-top:4px;">${translateMetric(report.strongest[0])} (${report.strongest[1]})</div>
        </div>
        <div>
          <strong>Punto a reforzar</strong>
          <div class="small muted" style="margin-top:4px;">${translateMetric(report.weakest[0])} (${report.weakest[1]})</div>
        </div>
      </article>
      <article class="card stack-md">
        <div class="section-title">Desglose por ronda</div>
        <div class="stack-md">
          ${report.rounds.map((round) => `
            <div class="team-card stack-sm">
              <div class="space-between">
                <strong>${round.title}</strong>
                <span class="badge">${round.total} pts</span>
              </div>
              <div class="small muted">${round.note}</div>
              <div class="small">Decisiones: ${round.decisionsScore} pts · Ejercicio: ${round.exerciseScore} pts · Evento: ${round.eventPoints} pts · Penalización: ${round.penalty} pts</div>
              <div class="small muted">${round.exerciseSummary}</div>
            </div>
          `).join('')}
          ${report.highlights.length ? `
            <div class="callout good small">
              <strong>Qué hicieron bien</strong>
              <ul class="bullet-list">${report.highlights.map((item) => `<li>${item}</li>`).join('')}</ul>
            </div>
          ` : ''}
          ${report.warnings.length ? `
            <div class="callout warn small">
              <strong>Qué les jugó en contra</strong>
              <ul class="bullet-list">${report.warnings.map((item) => `<li>${item}</li>`).join('')}</ul>
            </div>
          ` : ''}
        </div>
      </article>
    </section>
  `;
}

function bindTeamEvents(currentRound) {
  document.querySelectorAll('[data-step]').forEach((button) => {
    button.addEventListener('click', () => {
      state.activeStep = Number(button.dataset.step);
      renderTeam();
    });
  });

  if (currentRound < 1 || currentRound > 3 || !state.team) return;

  document.querySelectorAll('[data-decision]').forEach((input) => {
    input.addEventListener('change', async () => {
      const roundState = cloneRoundState(currentRound);
      const values = new Set(roundState.decisions || []);
      if (input.checked && values.size >= MAX_DECISIONS_PER_ROUND) {
        input.checked = false;
        showButtonFeedback('submitRoundBtn', `Máximo ${MAX_DECISIONS_PER_ROUND} decisiones`);
        return;
      }
      if (input.checked) values.add(input.dataset.decision);
      else values.delete(input.dataset.decision);
      roundState.decisions = [...values];
      await saveRoundDraft(state.sessionCode, state.team.teamId, currentRound, roundState);
    });
  });

  document.querySelectorAll('[data-exercise-item]').forEach((input) => {
    input.addEventListener('change', async () => {
      const roundState = cloneRoundState(currentRound);
      const values = new Set(roundState.exerciseSelection || []);
      if (input.checked) values.add(input.dataset.exerciseItem);
      else values.delete(input.dataset.exerciseItem);
      roundState.exerciseSelection = [...values];
      await saveRoundDraft(state.sessionCode, state.team.teamId, currentRound, roundState);
    });
  });

  document.querySelectorAll('[data-resource]').forEach((input) => {
    input.addEventListener('change', async () => {
      const roundState = cloneRoundState(currentRound);
      roundState.resourceAllocation = roundState.resourceAllocation || {};
      roundState.resourceAllocation[input.dataset.resource] = Number(input.value || 0);
      await saveRoundDraft(state.sessionCode, state.team.teamId, currentRound, roundState);
    });
  });

  qs('saveDraftBtn')?.addEventListener('click', async () => {
    const roundState = collectRoundState(currentRound);
    await saveRoundDraft(state.sessionCode, state.team.teamId, currentRound, roundState);
    showButtonFeedback('saveDraftBtn', 'Guardado');
  });

  qs('submitRoundBtn')?.addEventListener('click', async () => {
    const roundState = collectRoundState(currentRound);
    await saveRound(state.sessionCode, state.team.teamId, currentRound, roundState);
    showButtonFeedback('submitRoundBtn', 'Enviado');
  });
}

function collectRoundState(currentRound) {
  const existing = cloneRoundState(currentRound);
  existing.decisions = [...document.querySelectorAll('[data-decision]:checked')].map((item) => item.dataset.decision);
  if (currentRound >= 1 && currentRound <= 3) {
    existing.exerciseSelection = [...document.querySelectorAll('[data-exercise-item]:checked')].map((item) => item.dataset.exerciseItem);
  }
  return existing;
}

function cloneRoundState(currentRound) {
  const raw = state.team.rounds?.[String(currentRound)] || {};
  return JSON.parse(JSON.stringify(raw));
}

function selectedDecisions(roundId, roundState) {
  const ids = roundState?.decisions || [];
  return DECISIONS[roundId].filter((decision) => ids.includes(decision.id));
}

function showButtonFeedback(id, text) {
  const button = qs(id);
  if (!button) return;
  const original = button.textContent;
  button.textContent = text;
  setTimeout(() => { button.textContent = original; }, 1200);
}

function translateMetric(metric) {
  return {
    strategy: 'Estrategia',
    people: 'Gestión de interesados',
    delivery: 'Capacidad de entrega',
    risk: 'Gestión de riesgos',
  }[metric] || metric;
}
