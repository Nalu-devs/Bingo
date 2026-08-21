const STORAGE_KEY = 'bingo_products';

function loadProducts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function generateId() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function formatPrice(value) {
  return `R$ ${Number(value).toFixed(2).replace('.', ',')}`;
}

function validateProduct(data) {
  const errors = [];

  if (!data.name || !data.name.trim()) {
    errors.push({ field: 'name', message: 'Nome é obrigatório.' });
  }
  if (!data.category || !data.category.trim()) {
    errors.push({ field: 'category', message: 'Categoria é obrigatória.' });
  }
  if (data.price === '' || data.price === null || data.price === undefined) {
    errors.push({ field: 'price', message: 'Preço é obrigatório.' });
  } else if (Number(data.price) < 0) {
    errors.push({ field: 'price', message: 'Preço não pode ser negativo.' });
  }
  if (data.stock === '' || data.stock === null || data.stock === undefined) {
    errors.push({ field: 'stock', message: 'Estoque é obrigatório.' });
  } else if (Number(data.stock) < 0) {
    errors.push({ field: 'stock', message: 'Estoque não pode ser negativo.' });
  }

  return errors;
}

function getStockStatus(stock) {
  if (stock <= 0) return 'out';
  if (stock <= 5) return 'low';
  return 'ok';
}

function filterProducts(products, { search = '', category = '', sort = 'name' } = {}) {
  let result = [...products];

  if (search) {
    const term = search.toLowerCase();
    result = result.filter(
      p => p.name.toLowerCase().includes(term) || (p.description || '').toLowerCase().includes(term)
    );
  }

  if (category) {
    result = result.filter(p => p.category === category);
  }

  switch (sort) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'stock':
      result.sort((a, b) => b.stock - a.stock);
      break;
    default:
      result.sort((a, b) => a.name.localeCompare(b.name));
  }

  return result;
}

function getCategories(products) {
  return [...new Set(products.map(p => p.category))].sort();
}

function renderProductCard(product) {
  const status = getStockStatus(product.stock);
  const statusClass = status === 'out' ? 'out-of-stock' : status === 'low' ? 'low-stock' : '';

  return `
    <div class="product-card ${statusClass}" data-id="${product.id}">
      <div class="product-name">${escapeHtml(product.name)}</div>
      <div class="product-category">${escapeHtml(product.category)}</div>
      <div class="product-description">${escapeHtml(product.description) || 'Sem descrição'}</div>
      <div class="product-footer">
        <div class="product-price">${formatPrice(product.price)}</div>
        <div class="product-stock ${status}">${product.stock} em estoque</div>
      </div>
      <div class="product-actions">
        <button class="btn-edit" onclick="app.editProduct('${product.id}')">Editar</button>
        <button class="btn-danger" onclick="app.deleteProduct('${product.id}')">Excluir</button>
      </div>
    </div>`;
}

function renderProducts() {
  const products = loadProducts();
  const search = document.getElementById('search').value;
  const category = document.getElementById('filter-category').value;
  const sort = document.getElementById('sort').value;

  const filtered = filterProducts(products, { search, category, sort });

  document.getElementById('product-count').textContent =
    `${filtered.length} produto${filtered.length !== 1 ? 's' : ''} encontrado${filtered.length !== 1 ? 's' : ''}`;

  if (filtered.length === 0) {
    document.getElementById('product-list').innerHTML =
      '<div class="empty-state"><div class="icon">📦</div>Nenhum produto encontrado.</div>';
    return;
  }

  document.getElementById('product-list').innerHTML =
    '<div class="product-grid">' + filtered.map(renderProductCard).join('') + '</div>';
}

function updateCategoryFilter() {
  const products = loadProducts();
  const categories = getCategories(products);
  const select = document.getElementById('filter-category');
  const current = select.value;

  select.innerHTML = '<option value="">Todas categorias</option>' +
    categories.map(c => `<option value="${escapeHtml(c)}" ${c === current ? 'selected' : ''}>${escapeHtml(c)}</option>`).join('');
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function clearForm() {
  document.getElementById('product-form').reset();
  document.getElementById('edit-id').value = '';
  document.getElementById('btn-submit').textContent = 'Adicionar Produto';
  clearErrors();
}

function clearErrors() {
  document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
  document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
}

function showErrors(errors) {
  errors.forEach(err => {
    const input = document.getElementById(err.field);
    const msgEl = document.getElementById('error-' + err.field);
    if (input) input.classList.add('error');
    if (msgEl) msgEl.textContent = err.message;
  });
}

function handleSubmit(event) {
  event.preventDefault();
  clearErrors();

  const data = {
    name: document.getElementById('name').value,
    category: document.getElementById('category').value,
    price: document.getElementById('price').value,
    stock: document.getElementById('stock').value,
    description: document.getElementById('description').value,
  };

  const errors = validateProduct(data);
  if (errors.length > 0) {
    showErrors(errors);
    return;
  }

  data.price = Number(data.price);
  data.stock = Number(data.stock);

  const products = loadProducts();
  const editId = document.getElementById('edit-id').value;

  if (editId) {
    const idx = products.findIndex(p => p.id === editId);
    if (idx !== -1) {
      products[idx] = { ...products[idx], ...data };
    }
    showToast('Produto atualizado!');
  } else {
    products.push({
      id: generateId(),
      ...data,
      createdAt: new Date().toISOString(),
    });
    showToast('Produto adicionado!');
  }

  saveProducts(products);
  clearForm();
  updateCategoryFilter();
  renderProducts();
}

function editProduct(id) {
  const products = loadProducts();
  const product = products.find(p => p.id === id);
  if (!product) return;

  document.getElementById('name').value = product.name;
  document.getElementById('category').value = product.category;
  document.getElementById('price').value = product.price;
  document.getElementById('stock').value = product.stock;
  document.getElementById('description').value = product.description || '';
  document.getElementById('edit-id').value = product.id;
  document.getElementById('btn-submit').textContent = 'Salvar Alterações';

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteProduct(id) {
  if (!confirm('Tem certeza que deseja excluir este produto?')) return;

  const products = loadProducts().filter(p => p.id !== id);
  saveProducts(products);
  updateCategoryFilter();
  renderProducts();
  showToast('Produto excluído.');
}

function init() {
  document.getElementById('product-form').addEventListener('submit', handleSubmit);
  document.getElementById('search').addEventListener('input', renderProducts);
  document.getElementById('filter-category').addEventListener('change', renderProducts);
  document.getElementById('sort').addEventListener('change', renderProducts);

  updateCategoryFilter();
  renderProducts();
}

const app = { editProduct, deleteProduct };

if (typeof document !== 'undefined' && document !== null) {
  document.addEventListener('DOMContentLoaded', init);
}

if (typeof module !== 'undefined') {
  module.exports = {
    loadProducts,
    saveProducts,
    generateId,
    formatPrice,
    validateProduct,
    getStockStatus,
    filterProducts,
    getCategories,
    escapeHtml,
  };
}
