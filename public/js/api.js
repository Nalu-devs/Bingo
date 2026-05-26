const API_BASE = '/api';

async function api(path, options = {}) {
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };

  if (getUserId()) {
    config.headers['X-User-Id'] = getUserId();
  }

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  const res = await fetch(`${API_BASE}${path}`, config);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Erro na requisição');
  }

  return data;
}

function getUserId() {
  return localStorage.getItem('user_id');
}

function getUserName() {
  return localStorage.getItem('user_name');
}

function setUser(id, name, email) {
  localStorage.setItem('user_id', id);
  localStorage.setItem('user_name', name);
  localStorage.setItem('user_email', email);
}

function clearUser() {
  localStorage.removeItem('user_id');
  localStorage.removeItem('user_name');
  localStorage.removeItem('user_email');
}

function isLoggedIn() {
  return !!getUserId();
}
