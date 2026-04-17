import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import {
  getDatabase,
  ref,
  get,
  set,
  update,
  onValue,
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js';
import { firebaseConfig } from './firebase-config.js';
import {
  SCENARIO,
  createSessionCode,
  createAdminPin,
  createRandomCode,
  defaultTeamState,
  normalizeSessionCode,
} from './app-core.mjs';

let app = null;
let db = null;

export function isFirebaseConfigured() {
  return !!firebaseConfig
    && !!firebaseConfig.projectId
    && !!firebaseConfig.apiKey
    && !!firebaseConfig.databaseURL
    && !String(firebaseConfig.projectId).startsWith('PEGAR_')
    && !String(firebaseConfig.databaseURL).startsWith('PEGAR_');
}

export function ensureFirebase() {
  if (!isFirebaseConfigured()) {
    throw new Error('Falta completar firebase-config.js con tu configuración real de Firebase Realtime Database.');
  }
  if (!app) {
    app = initializeApp(firebaseConfig);
    db = getDatabase(app);
  }
  return db;
}

export async function createSession(teamCount, roundDurationMinutes = 15) {
  const database = ensureFirebase();
  const code = await uniqueCode(database);
  const adminPin = createAdminPin();
  const now = Date.now();
  const safeDuration = Math.max(1, Number(roundDurationMinutes) || 15);

  const teams = Array.from({ length: teamCount }, (_, index) => {
    const team = defaultTeamState(index + 1);
    team.accessCode = createRandomCode(5);
    return team;
  });

  const payload = {
    meta: {
      code,
      adminPin,
      currentRound: 0,
      roundEndsAt: null,
      roundClosed: false,
      roundDurationMinutes: safeDuration,
      status: 'lobby',
      teamCount,
      title: SCENARIO.title,
      shortDescription: SCENARIO.shortDescription,
      context: SCENARIO.context,
      objective: SCENARIO.objective,
      successCriteria: SCENARIO.successCriteria,
      createdAt: now,
      updatedAt: now,
    },
    teams: Object.fromEntries(
      teams.map((team) => [
        team.teamId,
        {
          teamId: team.teamId,
          name: team.name,
          accessCode: team.accessCode,
          rounds: team.rounds,
          notes: '',
          lastSeenAt: 0,
          createdAt: now,
          updatedAt: now,
        },
      ]),
    ),
  };

  await set(ref(database, `pmSessions/${code}`), payload);
  return { code, adminPin, teams, roundDurationMinutes: safeDuration };
}

export async function adminLogin(sessionCode, adminPin) {
  const database = ensureFirebase();
  const normalized = normalizeSessionCode(sessionCode);
  const snap = await get(ref(database, `pmSessions/${normalized}/meta`));
  if (!snap.exists()) throw new Error('No encontramos una sesión con ese código.');
  const data = snap.val();
  if (String(data.adminPin) !== String(adminPin).trim()) throw new Error('El PIN de administrador no coincide.');
  return { id: normalized, ...data };
}

export async function teamLogin(sessionCode, accessCode) {
  const database = ensureFirebase();
  const normalized = normalizeSessionCode(sessionCode);
  const snap = await get(ref(database, `pmSessions/${normalized}/teams`));
  if (!snap.exists()) throw new Error('No encontramos una sesión con ese código.');
  const teams = snap.val() || {};
  const cleanedCode = String(accessCode).trim().toUpperCase();
  const match = Object.entries(teams).find(([, team]) => String(team.accessCode || '').trim().toUpperCase() === cleanedCode);
  if (!match) throw new Error('El código de equipo no coincide con la sesión.');
  const [id, team] = match;
  return { id, ...team };
}

export function listenSession(sessionCode, callback) {
  const database = ensureFirebase();
  return onValue(ref(database, `pmSessions/${normalizeSessionCode(sessionCode)}/meta`), (snap) => {
    if (!snap.exists()) {
      callback(null);
      return;
    }
    callback({ id: normalizeSessionCode(sessionCode), ...snap.val() });
  });
}

export function listenTeams(sessionCode, callback) {
  const database = ensureFirebase();
  return onValue(ref(database, `pmSessions/${normalizeSessionCode(sessionCode)}/teams`), (snap) => {
    const value = snap.val() || {};
    const teams = Object.entries(value).map(([id, team]) => ({ id, ...team }));
    callback(teams);
  });
}

export function listenTeam(sessionCode, teamId, callback) {
  const database = ensureFirebase();
  return onValue(ref(database, `pmSessions/${normalizeSessionCode(sessionCode)}/teams/${teamId}`), (snap) => {
    if (!snap.exists()) {
      callback(null);
      return;
    }
    callback({ id: teamId, ...snap.val() });
  });
}

export function listenSessionRegistry(callback) {
  const database = ensureFirebase();
  return onValue(ref(database, 'pmSessions'), (snap) => {
    const value = snap.val() || {};
    const sessions = Object.entries(value)
      .map(([code, payload]) => ({ code, ...(payload.meta || {}) }))
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    callback(sessions);
  });
}

export async function updateSession(sessionCode, patch) {
  const database = ensureFirebase();
  await update(ref(database, `pmSessions/${normalizeSessionCode(sessionCode)}/meta`), {
    ...patch,
    updatedAt: Date.now(),
  });
}

export async function updateTeam(sessionCode, teamId, patch) {
  const database = ensureFirebase();
  await update(ref(database, `pmSessions/${normalizeSessionCode(sessionCode)}/teams/${teamId}`), {
    ...patch,
    updatedAt: Date.now(),
  });
}

export async function saveRound(sessionCode, teamId, roundId, roundState) {
  const database = ensureFirebase();
  const teamBasePath = `pmSessions/${normalizeSessionCode(sessionCode)}/teams/${teamId}`;
  const roundRef = ref(database, `${teamBasePath}/rounds/${roundId}`);
  const snap = await get(roundRef);
  const current = snap.exists() ? snap.val() : {};
  const now = Date.now();

  await update(ref(database, teamBasePath), {
    [`rounds/${roundId}`]: {
      ...current,
      ...roundState,
      submitted: true,
      updatedAt: now,
    },
    lastSeenAt: now,
    updatedAt: now,
  });
}

export async function saveRoundDraft(sessionCode, teamId, roundId, roundState) {
  const database = ensureFirebase();
  const teamBasePath = `pmSessions/${normalizeSessionCode(sessionCode)}/teams/${teamId}`;
  const roundRef = ref(database, `${teamBasePath}/rounds/${roundId}`);
  const snap = await get(roundRef);
  const current = snap.exists() ? snap.val() : {};
  const now = Date.now();

  await update(ref(database, teamBasePath), {
    [`rounds/${roundId}`]: {
      ...current,
      ...roundState,
      updatedAt: now,
    },
    lastSeenAt: now,
    updatedAt: now,
  });
}

async function uniqueCode(database, attempt = 0) {
  if (attempt > 20) throw new Error('No pudimos generar un código único de sesión. Probá de nuevo.');
  const code = createSessionCode();
  const snap = await get(ref(database, `pmSessions/${code}/meta`));
  if (!snap.exists()) return code;
  return uniqueCode(database, attempt + 1);
}
