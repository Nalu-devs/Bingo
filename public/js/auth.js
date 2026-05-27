function showLogin() {
  document.getElementById('modal-title').textContent = 'Entrar';
  document.getElementById('modal-body').innerHTML = `
    <form id="auth-form" onsubmit="login(event)">
      <div id="form-error" class="form-error hidden"></div>
      <div class="form-group">
        <label>Email</label>
        <input type="email" id="login-email" required placeholder="seu@email.com">
      </div>
      <div class="form-group">
        <label>Senha</label>
        <input type="password" id="login-password" required placeholder="Sua senha">
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%">Entrar</button>
      <p style="text-align:center;margin-top:1rem;font-size:0.875rem;color:var(--gray-500)">
        Não tem conta? <a href="#" onclick="showRegister();return false" style="color:var(--primary)">Cadastre-se</a>
      </p>
    </form>
  `;
  openModal();
}

function showRegister() {
  document.getElementById('modal-title').textContent = 'Cadastrar';
  document.getElementById('modal-body').innerHTML = `
    <form id="auth-form" onsubmit="register(event)">
      <div id="form-error" class="form-error hidden"></div>
      <div class="form-group">
        <label>Nome</label>
        <input type="text" id="reg-name" required placeholder="Seu nome">
      </div>
      <div class="form-group">
        <label>Email</label>
        <input type="email" id="reg-email" required placeholder="seu@email.com">
      </div>
      <div class="form-group">
        <label>Senha</label>
        <input type="password" id="reg-password" required placeholder="Sua senha">
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%">Cadastrar</button>
      <p style="text-align:center;margin-top:1rem;font-size:0.875rem;color:var(--gray-500)">
        Já tem conta? <a href="#" onclick="showLogin();return false" style="color:var(--primary)">Entre</a>
      </p>
    </form>
  `;
  openModal();
}

async function login(event) {
  event.preventDefault();
  console.log('[auth.js] Submetendo login');
  const errorEl = document.getElementById('form-error');

  try {
    const user = await api('/auth/login', {
      method: 'POST',
      body: {
        email: document.getElementById('login-email').value,
        password: document.getElementById('login-password').value,
      },
    });
    console.log('[auth.js] Login OK, usuário:', user);
    setUser(user.id, user.name, user.email);
    closeModal();
    updateAuthUI();
    navigate('home');
  } catch (err) {
    console.log('[auth.js] Login falhou:', err.message);
    errorEl.textContent = err.message;
    errorEl.classList.remove('hidden');
  }
}

async function register(event) {
  event.preventDefault();
  console.log('[auth.js] Submetendo registro');
  const errorEl = document.getElementById('form-error');

  try {
    const user = await api('/auth/register', {
      method: 'POST',
      body: {
        name: document.getElementById('reg-name').value,
        email: document.getElementById('reg-email').value,
        password: document.getElementById('reg-password').value,
      },
    });
    console.log('[auth.js] Registro OK, usuário:', user);
    setUser(user.id, user.name, user.email);
    closeModal();
    updateAuthUI();
    navigate('home');
  } catch (err) {
    console.log('[auth.js] Registro falhou:', err.message);
    errorEl.textContent = err.message;
    errorEl.classList.remove('hidden');
  }
}

function logout() {
  console.log('[auth.js] Fazendo logout');
  clearUser();
  updateAuthUI();
  navigate('home');
}

function updateAuthUI() {
  console.log('[auth.js] Atualizando UI de autenticação. Logado:', isLoggedIn());
  const authSection = document.getElementById('auth-section');
  const userSection = document.getElementById('user-section');
  const userName = document.getElementById('user-name');

  if (isLoggedIn()) {
    authSection.classList.add('hidden');
    userSection.classList.remove('hidden');
    userName.textContent = `Olá, ${getUserName()}`;
  } else {
    authSection.classList.remove('hidden');
    userSection.classList.add('hidden');
  }
}
