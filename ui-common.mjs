import { SCENARIO, ROUNDS } from './app-core.mjs';

export function appFrame({ title, subtitle, body, actions = '' }) {
  return `
    <div class="page">
      <header class="hero card">
        <div>
          <div class="eyebrow">Simulador colaborativo · dirección de proyectos</div>
          <h1>${title}</h1>
          <p class="subtitle">${subtitle}</p>
        </div>
        <div class="hero-actions">
          ${actions}
        </div>
      </header>
      ${body}
    </div>
  `;
}

export function renderSetupPending() {
  return appFrame({
    title: 'Configuración pendiente de Firebase',
    subtitle:
      'Para usar la sincronización en tiempo real entre dispositivos, primero completá el archivo firebase-config.js con la configuración de tu proyecto Firebase Realtime Database.',
    body: `
      <section class="card stack-lg">
        <div class="callout warn">
          <strong>Antes de probarla online:</strong> reemplazá los placeholders del archivo <span class="mono">firebase-config.js</span> por la configuración real de tu proyecto.
        </div>
        <div class="stack-sm">
          <div class="section-title">Qué sigue</div>
          <ol class="ordered">
            <li>Creá un proyecto Firebase y registrá una app web.</li>
            <li>Creá una base de datos Realtime Database en modo de prueba.</li>
            <li>Pegá la configuración en <span class="mono">firebase-config.js</span>, incluyendo <span class="mono">databaseURL</span>.</li>
            <li>Subí todos los archivos al repo que publiques con GitHub Pages.</li>
          </ol>
        </div>
      </section>
    `,
  });
}

export function renderScenarioCard() {
  return `
    <section class="card stack-md">
      <div class="section-title">Contexto del proyecto</div>
      <h2>${SCENARIO.title}</h2>
      <p class="subtitle">${SCENARIO.shortDescription}</p>
      <div class="grid two">
        <div class="soft-box">
          <strong>Lo que está pasando</strong>
          <ul class="bullet-list">
            ${SCENARIO.context.map((item) => `<li>${item}</li>`).join('')}
          </ul>
        </div>
        <div class="soft-box">
          <strong>Objetivo del workshop</strong>
          <p>${SCENARIO.objective}</p>
          <strong style="display:block;margin-top:10px;">Qué se espera al final</strong>
          <ul class="bullet-list">
            ${SCENARIO.successCriteria.map((item) => `<li>${item}</li>`).join('')}
          </ul>
        </div>
      </div>
    </section>
  `;
}

export function renderRoundPills(currentRound) {
  return `
    <div class="round-strip">
      ${ROUNDS.map((round) => `
        <div class="round-pill ${Number(currentRound) === round.id ? 'active' : ''}">
          <div class="round-pill-title">${round.title}</div>
          <div class="round-pill-meta">Ronda ${round.id}</div>
        </div>
      `).join('')}
      <div class="round-pill ${Number(currentRound) === 4 ? 'active' : ''}">
        <div class="round-pill-title">Debrief</div>
        <div class="round-pill-meta">cierre</div>
      </div>
    </div>
  `;
}

export function formatTimeLeft(roundEndsAt, roundClosed = false) {
  if (roundClosed) return 'Ronda cerrada';
  if (!roundEndsAt) return 'Sin cronómetro activo';
  const ms = roundEndsAt - Date.now();
  if (ms <= 0) return 'Tiempo cumplido';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export function qs(id) {
  return document.getElementById(id);
}

export function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function copyText(value) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(value);
  const input = document.createElement('textarea');
  input.value = value;
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  input.remove();
  return Promise.resolve();
}

export function params() {
  return new URLSearchParams(window.location.search);
}
