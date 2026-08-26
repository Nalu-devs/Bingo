var STORAGE_KEY = 'bingo_products';

export function loadProducts() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    var parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

export function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export function generateId() {
  return 'p_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
}

export function formatPrice(value) {
  return 'R$ ' + value.toFixed(2).replace('.', ',');
}

export function validateProduct(product) {
  var errors = [];
  if (!product.name || !product.name.trim()) {
    errors.push({ field: 'name', message: 'Nome e obrigatorio' });
  }
  if (!product.category || !product.category.trim()) {
    errors.push({ field: 'category', message: 'Categoria e obrigatoria' });
  }
  if (typeof product.price !== 'number' || product.price <= 0) {
    errors.push({ field: 'price', message: 'Preco deve ser maior que zero' });
  }
  if (typeof product.stock !== 'number' || product.stock < 0) {
    errors.push({ field: 'stock', message: 'Estoque nao pode ser negativo' });
  }
  return errors;
}

export function getStockStatus(stock) {
  if (stock <= 0) return 'out';
  if (stock <= 5) return 'low';
  return 'ok';
}

export function filterProducts(products, options) {
  var result = products.slice();

  if (options.search) {
    var term = options.search.toLowerCase();
    result = result.filter(function (p) {
      return (p.name || '').toLowerCase().indexOf(term) > -1 ||
             (p.description || '').toLowerCase().indexOf(term) > -1;
    });
  }

  if (options.sort === 'price-asc') {
    result.sort(function (a, b) { return a.price - b.price; });
  } else if (options.sort === 'price-desc') {
    result.sort(function (a, b) { return b.price - a.price; });
  } else if (options.sort === 'stock') {
    result.sort(function (a, b) { return b.stock - a.stock; });
  }

  return result;
}

export function getCategories(products) {
  var cats = {};
  products.forEach(function (p) {
    if (p.category) cats[p.category] = true;
  });
  return Object.keys(cats).sort();
}

export function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function logError(context, error) {
  console.error(
    '[ORG:' + (context.orgId || 'unknown') +
    '][USER:' + (context.teamId || 'unknown') +
    '] ' + (context.action || 'unknown') +
    ' - ' + (error.message || error)
  );
}
