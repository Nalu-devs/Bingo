const STORAGE_KEY = 'bingo_products';

const APP_CONTEXT = {
  orgId: 'org_bingo_001',
  teamId: 'team_nalu',
};

function logError(context, error) {
  console.error(`[${context.orgId}/${context.teamId}] ${context.action}:`, error.message);
}

function loadProducts() {
  // [orgId: org_bingo_001] Leitura do catálogo de produtos no localStorage
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (err) {
    logError({ ...APP_CONTEXT, action: 'loadProducts' }, err);
    return [];
  }
}

function saveProducts(products) {
  // [orgId: org_bingo_001] Persistência do catálogo de produtos no localStorage
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (err) {
    logError({ ...APP_CONTEXT, action: 'saveProducts' }, err);
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function generateId() {
  // [orgId: org_bingo_001] Geração de identificador único para novos produtos
  try {
    return crypto.randomUUID();
  } catch (err) {
    logError({ ...APP_CONTEXT, action: 'generateId' }, err);
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  }
}

function formatPrice(value) {
  // [orgId: org_bingo_001] Formatação de preço para exibição em Real
  try {
    return `R$ ${Number(value).toFixed(2).replace('.', ',')}`;
  } catch (err) {
    logError({ ...APP_CONTEXT, action: 'formatPrice' }, err);
    return 'R$ 0,00';
  }
}

function validateProduct(data) {
  // [orgId: org_bingo_001] Validação de campos obrigatórios do produto
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
  // [orgId: org_bingo_001] Classificação do nível de estoque (out/low/ok)
  try {
    if (stock <= 0) return 'out';
    if (stock <= 5) return 'low';
    return 'ok';
  } catch (err) {
    logError({ ...APP_CONTEXT, action: 'getStockStatus' }, err);
    return 'ok';
  }
}

function filterProducts(products, { search = '', category = '', sort = 'name' } = {}) {
  // [orgId: org_bingo_001] Filtragem e ordenação do catálogo por busca, categoria e ordenação
  try {
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
  } catch (err) {
    logError({ ...APP_CONTEXT, action: 'filterProducts' }, err);
    return products;
  }
}

function getCategories(products) {
  // [orgId: org_bingo_001] Extração de categorias únicas para o filtro dinâmico
  try {
    return [...new Set(products.map(p => p.category))].sort();
  } catch (err) {
    logError({ ...APP_CONTEXT, action: 'getCategories' }, err);
    return [];
  }
}

function renderProductCard(product) {
  // [orgId: org_bingo_001] Renderização do card HTML de um produto individual
  try {
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
  } catch (err) {
    logError({ ...APP_CONTEXT, action: 'renderProductCard' }, err);
    return '';
  }
}

function renderProducts() {
  // [orgId: org_bingo_001] Renderização da lista completa de produtos filtrados
  try {
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
  } catch (err) {
    logError({ ...APP_CONTEXT, action: 'renderProducts' }, err);
  }
}

function updateCategoryFilter() {
  // [orgId: org_bingo_001] Atualização do select de filtro de categorias
  try {
    const products = loadProducts();
    const categories = getCategories(products);
    const select = document.getElementById('filter-category');
    const current = select.value;

    select.innerHTML = '<option value="">Todas categorias</option>' +
      categories.map(c => `<option value="${escapeHtml(c)}" ${c === current ? 'selected' : ''}>${escapeHtml(c)}</option>`).join('');
  } catch (err) {
    logError({ ...APP_CONTEXT, action: 'updateCategoryFilter' }, err);
  }
}

function showToast(message, type = 'success') {
  // [orgId: org_bingo_001] Exibição de notificação toast na tela
  try {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  } catch (err) {
    logError({ ...APP_CONTEXT, action: 'showToast' }, err);
  }
}

function clearForm() {
  // [orgId: org_bingo_001] Reset do formulário de cadastro/edição
  try {
    document.getElementById('product-form').reset();
    document.getElementById('edit-id').value = '';
    document.getElementById('btn-submit').textContent = 'Adicionar Produto';
    clearErrors();
  } catch (err) {
    logError({ ...APP_CONTEXT, action: 'clearForm' }, err);
  }
}

function clearErrors() {
  // [orgId: org_bingo_001] Limpeza das mensagens de erro do formulário
  try {
    document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  } catch (err) {
    logError({ ...APP_CONTEXT, action: 'clearErrors' }, err);
  }
}

function showErrors(errors) {
  // [orgId: org_bingo_001] Exibição de erros de validação nos campos do formulário
  try {
    errors.forEach(err => {
      const input = document.getElementById(err.field);
      const msgEl = document.getElementById('error-' + err.field);
      if (input) input.classList.add('error');
      if (msgEl) msgEl.textContent = err.message;
    });
  } catch (err) {
    logError({ ...APP_CONTEXT, action: 'showErrors' }, err);
  }
}

function handleSubmit(event) {
  event.preventDefault();
  // [orgId: org_bingo_001] Processamento do formulário de cadastro/edição de produto
  try {
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
  } catch (err) {
    logError({ ...APP_CONTEXT, action: 'handleSubmit' }, err);
    showToast('Erro ao salvar produto.', 'error');
  }
}

function editProduct(id) {
  // [orgId: org_bingo_001] Preenchimento do formulário para edição de produto existente
  try {
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
  } catch (err) {
    logError({ ...APP_CONTEXT, action: 'editProduct' }, err);
  }
}

function deleteProduct(id) {
  // [orgId: org_bingo_001] Exclusão de produto do catálogo com confirmação do usuário
  try {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    const products = loadProducts().filter(p => p.id !== id);
    saveProducts(products);
    updateCategoryFilter();
    renderProducts();
    showToast('Produto excluído.');
  } catch (err) {
    logError({ ...APP_CONTEXT, action: 'deleteProduct' }, err);
    showToast('Erro ao excluir produto.', 'error');
  }
}

function init() {
  // [orgId: org_bingo_001] Inicialização da aplicação e registro de event listeners
  try {
    document.getElementById('product-form').addEventListener('submit', handleSubmit);
    document.getElementById('search').addEventListener('input', renderProducts);
    document.getElementById('filter-category').addEventListener('change', renderProducts);
    document.getElementById('sort').addEventListener('change', renderProducts);

    updateCategoryFilter();
    renderProducts();
  } catch (err) {
    logError({ ...APP_CONTEXT, action: 'init' }, err);
  }
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
    logError,
  };
}
