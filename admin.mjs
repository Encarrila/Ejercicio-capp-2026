import { computeTeamScore, ROUNDS } from './app-core.mjs';
import {
  adminLogin,
  isFirebaseConfigured,
  listenSession,
  listenSessionRegistry,
  listenTeams,
  updateSession,
} from './firebase-service.mjs';
import {
  appFrame,
  copyText,
  formatTimeLeft,
  params,
  qs,
  renderRoundPills,
  renderScenarioCard,
  renderSetupPending,
} from './ui-common.mjs';

const app = qs('app');
const query = params();
let state = {
  sessionCode: query.get('session') || '',
  pin: query.get('pin') || '',
  session: null,
  teams: [],
  sessionRegistry: [],
  timerId: null,
  unsubSession: null,
  unsubTeams: null,
  unsubRegistry: null,
};

if (!isFirebaseConfigured()) {
  app.innerHTML = renderSetupPending();
} else {
  connectRegistry();
  if (state.sessionCode && state.pin) login(state.sessionCode, state.pin);
  else renderLogin();
}

function connectRegistry() {
  state.unsubRegistry?.();
  state.unsubRegistry = listenSessionRegistry((sessions) => {
    state.sessionRegistry = sessions;
    if (state.session) renderAdmin();
    else renderLogin();
  });
}

function renderLogin(error = '') {
  app.innerHTML = appFrame({
    title: 'Ingreso de administrador',
    subtitle: 'Entrá con el código de sesión y el PIN admin para controlar rondas, ver envíos y compartir el cierre.',
    actions: `
      <div class="soft-box stack-sm">
        <div class="section-title">Accesos rápidos</div>
        <a class="btn btn-soft" href="index.html">Crear una sesión</a>
        <a class="btn btn-soft" href="team.html">Ingreso de equipo</a>
      </div>
    `,
    body: `
      ${renderScenarioCard()}
      <section class="grid layout">
        <article class="card stack-md" style="max-width:720px;">
          <div class="section-title">Entrar a una sesión</div>
          <div class="grid two">
            <div>
              <label>Código de sesión</label>
              <input id="sessionCode" value="${state.sessionCode}" placeholder="Ej. A8K4P2" />
            </div>
            <div>
              <label>PIN admin</label>
              <input id="adminPin" value="${state.pin}" placeholder="Ej. 48275" />
            </div>
          </div>
          ${error ? `<div class="callout bad">${error}</div>` : ''}
          <button class="btn btn-primary" id="loginBtn">Entrar</button>
        </article>
        <article class="card stack-md">
          <div class="section-title">Sesiones creadas</div>
          ${renderSessionRegistry()}
        </article>
      </section>
    `,
  });

  qs('loginBtn')?.addEventListener('click', () => login(qs('sessionCode').value, qs('adminPin').value));
  attachCopyHandlers();
}

async function login(sessionCode, pin) {
  try {
    const session = await adminLogin(sessionCode, pin);
    state.sessionCode = sessionCode.trim().toUpperCase();
    state.pin = String(pin).trim();
    state.session = session;
    connectListeners();
    renderAdmin();
  } catch (err) {
    renderLogin(err.message || 'No pudimos validar el acceso.');
  }
}

function connectListeners() {
  state.unsubSession?.();
  state.unsubTeams?.();
  state.unsubSession = listenSession(state.sessionCode, (session) => {
    state.session = session;
    renderAdmin();
  });
  state.unsubTeams = listenTeams(state.sessionCode, (teams) => {
    state.teams = teams.sort((a, b) => a.teamId.localeCompare(b.teamId));
    renderAdmin();
  });
  startTimerRefresh();
}

function startTimerRefresh() {
  clearInterval(state.timerId);
  state.timerId = setInterval(() => {
    const timerNode = qs('countdown');
    if (timerNode && state.session) timerNode.textContent = formatTimeLeft(state.session.roundEndsAt, state.session.roundClosed);
  }, 1000);
}

function renderAdmin() {
  if (!state.session) return;
  const ranking = state.teams
    .map((team) => ({ team, score: computeTeamScore(team) }))
    .sort((a, b) => b.score.total - a.score.total);
  const currentRound = Number(state.session.currentRound || 0);
  const base = `${window.location.origin}${window.location.pathname.replace(/admin\.html$/, '')}`;
  const shareBase = `${base}team.html?session=${state.sessionCode}&code=`;

  app.innerHTML = appFrame({
    title: `Administrador · ${state.session.title || 'Sesión en vivo'}`,
    subtitle: 'Abrí rondas, ajustá el tiempo, chequeá envíos y cerrá antes de tiempo si lo necesitás.',
    actions: `
      <div class="kpi-strip">
        <div class="kpi-card"><div class="label">Sesión</div><div class="value mono">${state.sessionCode}</div><div class="sub">Código compartido</div></div>
        <div class="kpi-card"><div class="label">PIN admin</div><div class="value mono">${state.session.adminPin}</div><div class="sub">Guardalo para reingresar</div></div>
        <div class="kpi-card"><div class="label">Ronda activa</div><div class="value">${currentRound === 0 ? 'Lobby' : currentRound === 4 ? 'Debrief' : `Ronda ${currentRound}`}</div><div class="sub">Estado actual</div></div>
        <div class="kpi-card"><div class="label">Tiempo</div><div class="value timer-text" id="countdown">${formatTimeLeft(state.session.roundEndsAt, state.session.roundClosed)}</div><div class="sub">${state.session.roundClosed ? 'Ronda cerrada' : 'Cronómetro en vivo'}</div></div>
      </div>
    `,
    body: `
      ${renderRoundPills(currentRound === 0 ? 0 : currentRound)}
      <section class="grid layout">
        <article class="card stack-md">
          <div class="section-title">Control de la sesión</div>
          <div class="grid two">
            <div>
              <label>Minutos por ronda</label>
              <input id="roundDurationMinutes" type="number" min="5" max="45" step="1" value="${state.session.roundDurationMinutes || 15}" />
            </div>
            <div class="soft-box stack-sm">
              <strong>Contexto de la ronda actual</strong>
              <div class="small muted">${currentRound >= 1 && currentRound <= 3 ? ROUNDS[currentRound - 1].brief : currentRound === 4 ? 'Instancia final de cierre y debrief.' : 'Todavía no hay una ronda abierta.'}</div>
            </div>
          </div>
          <div class="tabs">
            <button class="btn ${currentRound === 1 ? 'active' : ''}" data-open-round="1">Abrir ronda 1</button>
            <button class="btn ${currentRound === 2 ? 'active' : ''}" data-open-round="2">Abrir ronda 2</button>
            <button class="btn ${currentRound === 3 ? 'active' : ''}" data-open-round="3">Abrir ronda 3</button>
            <button class="btn ${currentRound === 4 ? 'active' : ''}" data-open-round="4">Ir a debrief</button>
            <button class="btn btn-soft" id="saveDurationBtn">Guardar duración</button>
            <button class="btn btn-soft" id="closeRoundBtn" ${currentRound < 1 || currentRound > 3 ? 'disabled' : ''}>Cerrar ronda ahora</button>
          </div>
          <div class="callout info">
            Cuando abrís una ronda, todos los equipos ven el cambio al instante y vuelven automáticamente al Paso 1.
          </div>
          <div class="grid two">
            <div class="soft-box">
              <strong>Base de ingreso de equipos</strong>
              <div class="small muted" style="margin-top:6px;">Cada equipo entra con el mismo código de sesión y su código individual.</div>
              <div class="mono small" style="margin-top:8px;">${shareBase}</div>
            </div>
            <div class="soft-box">
              <strong>Link directo del admin</strong>
              <div class="mono small" style="margin-top:8px;">${window.location.href}</div>
              <button class="btn btn-small copy-btn" data-copy="${window.location.href}" style="margin-top:10px;">Copiar link admin</button>
            </div>
          </div>
        </article>
        <article class="card stack-md">
          <div class="section-title">Estado por equipo</div>
          <table class="table">
            <thead>
              <tr>
                <th>Equipo</th>
                <th>Código</th>
                <th>Ronda 1</th>
                <th>Ronda 2</th>
                <th>Ronda 3</th>
                <th>Última actividad</th>
              </tr>
            </thead>
            <tbody>
              ${state.teams.map((team) => `
                <tr>
                  <td><strong>${team.name}</strong><br /><span class="small muted">${team.teamId}</span></td>
                  <td class="mono">${team.accessCode}</td>
                  <td>${renderSubmitted(team.rounds?.['1']?.submitted)}</td>
                  <td>${renderSubmitted(team.rounds?.['2']?.submitted)}</td>
                  <td>${renderSubmitted(team.rounds?.['3']?.submitted)}</td>
                  <td class="small muted">${team.lastSeenAt ? new Date(team.lastSeenAt).toLocaleTimeString() : 'Sin actividad'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </article>
      </section>

      <section class="grid layout-wide">
        <article class="card stack-md">
          <div class="section-title">Ranking e informes</div>
          <div class="stack-md">
            ${ranking.map((entry, index) => renderRankingCard(entry, index)).join('') || '<div class="soft-box">Todavía no hay equipos cargados.</div>'}
          </div>
        </article>
        <article class="card stack-md">
          <div class="section-title">Sesiones guardadas</div>
          ${renderSessionRegistry()}
        </article>
      </section>
    `,
  });

  document.querySelectorAll('[data-open-round]').forEach((button) => {
    button.addEventListener('click', async () => {
      const targetRound = Number(button.dataset.openRound);
      const minutes = safeDurationValue();
      const patch = targetRound === 4
        ? { currentRound: 4, status: 'debrief', roundEndsAt: null, roundClosed: true, roundDurationMinutes: minutes }
        : { currentRound: targetRound, status: 'active', roundEndsAt: Date.now() + minutes * 60 * 1000, roundClosed: false, roundDurationMinutes: minutes };
      await updateSession(state.sessionCode, patch);
    });
  });

  qs('saveDurationBtn')?.addEventListener('click', async () => {
    await updateSession(state.sessionCode, { roundDurationMinutes: safeDurationValue() });
    flashButton('saveDurationBtn', 'Guardado');
  });

  qs('closeRoundBtn')?.addEventListener('click', async () => {
    if (currentRound < 1 || currentRound > 3) return;
    await updateSession(state.sessionCode, { roundEndsAt: Date.now(), roundClosed: true, status: 'active' });
    flashButton('closeRoundBtn', 'Ronda cerrada');
  });

  attachCopyHandlers();
}

function renderRankingCard(entry, index) {
  return `
    <div class="team-card stack-sm">
      <div class="space-between">
        <div>
          <div class="small muted">#${index + 1}</div>
          <strong>${entry.team.name}</strong>
        </div>
        <div class="right">
          <div style="font-size:28px;font-weight:900;">${entry.score.total}</div>
          <div class="small muted">${entry.score.normalized}% · ${entry.score.band}</div>
        </div>
      </div>
      <div class="metrics-grid">
        <div class="metric"><strong>Estrategia</strong><span>${entry.score.categoryTotals.strategy}</span></div>
        <div class="metric"><strong>Interesados</strong><span>${entry.score.categoryTotals.people}</span></div>
        <div class="metric"><strong>Entrega</strong><span>${entry.score.categoryTotals.delivery}</span></div>
        <div class="metric"><strong>Riesgos</strong><span>${entry.score.categoryTotals.risk}</span></div>
      </div>
      <div class="small muted">${entry.score.report.summary}</div>
    </div>
  `;
}

function renderSessionRegistry() {
  if (!state.sessionRegistry.length) return '<div class="soft-box">Todavía no hay sesiones registradas.</div>';
  return `
    <table class="table">
      <thead>
        <tr>
          <th>Sesión</th>
          <th>PIN</th>
          <th>Equipos</th>
          <th>Estado</th>
          <th>Creada</th>
        </tr>
      </thead>
      <tbody>
        ${state.sessionRegistry.map((session) => `
          <tr>
            <td><strong>${session.code}</strong><br /><span class="small muted">${session.title || ''}</span></td>
            <td class="mono">${session.adminPin || '-'}</td>
            <td>${session.teamCount || '-'}</td>
            <td>${session.currentRound === 4 ? 'Debrief' : session.currentRound ? `Ronda ${session.currentRound}` : 'Lobby'}</td>
            <td class="small muted">${session.createdAt ? new Date(session.createdAt).toLocaleString() : '-'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function renderSubmitted(value) {
  if (value) return '<span class="badge good">Enviado</span>';
  return '<span class="badge warn">Pendiente</span>';
}

function attachCopyHandlers() {
  document.querySelectorAll('.copy-btn').forEach((button) => {
    button.addEventListener('click', async () => {
      await copyText(button.dataset.copy || '');
      const original = button.textContent;
      button.textContent = 'Copiado';
      setTimeout(() => { button.textContent = original; }, 1200);
    });
  });
}

function safeDurationValue() {
  return Math.max(5, Math.min(45, Number(qs('roundDurationMinutes')?.value || state.session?.roundDurationMinutes || 15)));
}

function flashButton(id, text) {
  const button = qs(id);
  if (!button) return;
  const original = button.textContent;
  button.textContent = text;
  setTimeout(() => {
    button.textContent = original;
  }, 1200);
}
