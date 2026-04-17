import { createSession, isFirebaseConfigured } from './firebase-service.mjs';
import { appFrame, copyText, qs, renderScenarioCard, renderSetupPending } from './ui-common.mjs';

const app = qs('app');

if (!isFirebaseConfigured()) {
  app.innerHTML = renderSetupPending();
} else {
  render();
}

function render(result = null, error = '') {
  const baseUrl = new URL(window.location.href);
  const cleanBase = `${baseUrl.origin}${baseUrl.pathname.replace(/index\.html$/, '')}`;
  app.innerHTML = appFrame({
    title: 'Simulador en tiempo real · IA en seguros',
    subtitle:
      'Creá una sesión para 2 a 6 equipos. Después, cada grupo entra desde su dispositivo con el código de sesión y su código de equipo. El administrador controla la ronda y ve el estado en vivo.',
    actions: `
      <div class="soft-box stack-sm">
        <div class="section-title">Accesos</div>
        <a class="btn btn-soft" href="admin.html">Ir al acceso de administrador</a>
        <a class="btn btn-soft" href="team.html">Ir al acceso de equipo</a>
      </div>
    `,
    body: `
      ${renderScenarioCard()}
      <section class="grid layout">
        <article class="card stack-md">
          <div class="section-title">Crear una sesión nueva</div>
          <div class="grid two">
            <div>
              <label>Cantidad de equipos</label>
              <select id="teamCount">
                <option value="2">2 equipos</option>
                <option value="3">3 equipos</option>
                <option value="4">4 equipos</option>
                <option value="5">5 equipos</option>
                <option value="6" selected>6 equipos</option>
              </select>
            </div>
            <div>
              <label>Minutos por ronda</label>
              <input id="roundDuration" type="number" min="5" max="45" step="1" value="15" />
            </div>
          </div>
          <div class="soft-box">
            <strong>Qué genera el sistema</strong>
            <ul class="bullet-list">
              <li>Código único de sesión</li>
              <li>PIN de administrador</li>
              <li>Un código distinto por equipo</li>
              <li>URLs directas para compartir</li>
            </ul>
          </div>
          ${error ? `<div class="callout bad">${error}</div>` : ''}
          <button class="btn btn-primary" id="createSessionBtn">Crear sesión</button>
        </article>
        <article class="card stack-md">
          <div class="section-title">Cómo usarla</div>
          <ol class="ordered">
            <li>Creás la sesión acá mismo y definís cuántos equipos van a jugar.</li>
            <li>Compartís el código de sesión con toda la clase.</li>
            <li>Le pasás a cada mesa su código de equipo.</li>
            <li>Entrás como administrador para abrir cada ronda, controlar el tiempo y mirar envíos.</li>
          </ol>
          <div class="callout info">
            <strong>Consejo práctico:</strong> proyectá la vista de administrador y dejá que cada equipo entre desde su celular o notebook con la vista de equipo.
          </div>
        </article>
      </section>
      ${result ? renderSessionResult(result, cleanBase) : ''}
    `,
  });

  qs('createSessionBtn')?.addEventListener('click', async () => {
    const btn = qs('createSessionBtn');
    const teamCount = Number(qs('teamCount').value || 6);
    const duration = Number(qs('roundDuration').value || 15);
    btn.disabled = true;
    btn.textContent = 'Creando sesión...';
    try {
      const session = await createSession(teamCount, duration);
      render(session, '');
      attachCopyHandlers();
    } catch (err) {
      render(null, err.message || 'No pudimos crear la sesión.');
    } finally {
      const currentBtn = qs('createSessionBtn');
      if (currentBtn) {
        currentBtn.disabled = false;
        currentBtn.textContent = 'Crear sesión';
      }
    }
  });

  attachCopyHandlers();
}

function renderSessionResult(session, base) {
  const adminUrl = `${base}admin.html?session=${session.code}&pin=${session.adminPin}`;
  return `
    <section class="card stack-lg">
      <div class="section-title">Sesión creada</div>
      <div class="grid four">
        <div class="soft-box">
          <strong>Código de sesión</strong>
          <div class="mono" style="font-size:24px;font-weight:900;margin-top:8px;">${session.code}</div>
        </div>
        <div class="soft-box">
          <strong>PIN admin</strong>
          <div class="mono" style="font-size:24px;font-weight:900;margin-top:8px;">${session.adminPin}</div>
        </div>
        <div class="soft-box">
          <strong>Equipos</strong>
          <div style="font-size:24px;font-weight:900;margin-top:8px;">${session.teams.length}</div>
        </div>
        <div class="soft-box">
          <strong>Minutos por ronda</strong>
          <div style="font-size:24px;font-weight:900;margin-top:8px;">${session.roundDurationMinutes}</div>
        </div>
      </div>

      <div class="grid layout-wide">
        <div class="stack-md">
          <div class="callout good">
            <strong>Acceso del administrador:</strong><br />
            <span class="mono">${adminUrl}</span>
            <div style="margin-top:10px;"><button class="btn btn-small copy-btn" data-copy="${adminUrl}">Copiar link admin</button></div>
          </div>
          <div class="section-title">Accesos de equipos</div>
          <div class="grid two">
            ${session.teams.map((team) => {
              const url = `${base}team.html?session=${session.code}&code=${team.accessCode}`;
              return `
                <div class="team-card stack-sm">
                  <div class="space-between">
                    <strong>${team.name}</strong>
                    <span class="badge">${team.teamId}</span>
                  </div>
                  <div>Código equipo: <span class="mono">${team.accessCode}</span></div>
                  <div class="small muted">Link directo:</div>
                  <div class="mono small">${url}</div>
                  <button class="btn btn-small copy-btn" data-copy="${url}">Copiar link</button>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        <div class="stack-md">
          <div class="section-title">Recordatorio</div>
          <div class="soft-box">
            <ul class="bullet-list">
              <li>Abrí primero la vista de administrador y verificá la sesión.</li>
              <li>Después compartí los links o los códigos de cada equipo.</li>
              <li>Cuando empiece la actividad, abrí la ronda 1 desde la vista admin.</li>
              <li>Si hace falta, podés cambiar la duración y cerrar una ronda antes de tiempo.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  `;
}

function attachCopyHandlers() {
  document.querySelectorAll('.copy-btn').forEach((button) => {
    button.addEventListener('click', async () => {
      await copyText(button.dataset.copy || '');
      const original = button.textContent;
      button.textContent = 'Copiado';
      setTimeout(() => {
        button.textContent = original;
      }, 1200);
    });
  });
}
