let currentPage = 'home';
let currentCategory = '';

function navigate(page, category) {
  currentPage = page;
  currentCategory = category || '';

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === page);
  });

  const loading = document.getElementById('loading');
  loading.classList.remove('hidden');

  if (page === 'home') renderHome().then(() => loading.classList.add('hidden'));
  else if (page === 'products') renderProducts(currentCategory).then(() => loading.classList.add('hidden'));
}

function openModal() {
  document.getElementById('modal-overlay').classList.remove('hidden');
  document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  document.getElementById('modal').classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  updateAuthUI();
  updateCartCount();
  navigate('home');
});
