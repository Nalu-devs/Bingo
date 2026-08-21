const assert = require('assert');

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value; },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
global.localStorage = localStorageMock;

const documentMock = {
  createElement: () => ({}),
};
global.document = Object.assign(documentMock, {
  addEventListener: () => {},
  getElementById: () => ({ innerHTML: '', value: '', textContent: '', addEventListener: () => {}, classList: { add: () => {}, remove: () => {} } }),
  querySelectorAll: () => [],
  querySelector: () => ({ classList: { add: () => {}, remove: () => {} } }),
  createElement: documentMock.createElement,
});

const {
  loadProducts,
  saveProducts,
  generateId,
  formatPrice,
  validateProduct,
  getStockStatus,
  filterProducts,
  getCategories,
  escapeHtml,
} = require('../app.js');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  \x1b[32m✓\x1b[0m ${name}`);
  } (err) {
    failed++;
    console.log(`  \x1b[31m✗\x1b[0m ${name}`);
    console.log(`    \x1b[31m${err.message}\x1b[0m`);
  }
}

console.log('\n📦 Testes de Produtos\n');

// --- generateId ---
console.log('ID:');
test('generateId retorna string', () => {
  assert.strictEqual(typeof generateId(), 'string');
});
test('generateId retorna IDs únicos', () => {
  const ids = new Set(Array.from({ length: 100 }, () => generateId()));
  assert.strictEqual(ids.size, 100);
});

// --- formatPrice ---
console.log('\nPreço:');
test('formatPrice formata corretamente', () => {
  assert.strictEqual(formatPrice(10), 'R$ 10,00');
});
test('formatPrice com decimais', () => {
  assert.strictEqual(formatPrice(19.9), 'R$ 19,90');
});
test('formatPrice com valor inteiro grande', () => {
  assert.strictEqual(formatPrice(1000), 'R$ 1000,00');
});
test('formatPrice com zero', () => {
  assert.strictEqual(formatPrice(0), 'R$ 0,00');
});

// --- validateProduct ---
console.log('\nValidação:');
test('produto válido não retorna erros', () => {
  const errors = validateProduct({ name: 'Camisa', category: 'Roupa', price: 49.9, stock: 10, description: '' });
  assert.strictEqual(errors.length, 0);
});
test('nome obrigatório', () => {
  const errors = validateProduct({ name: '', category: 'Roupa', price: 10, stock: 5 });
  assert.ok(errors.some(e => e.field === 'name'));
});
test('categoria obrigatória', () => {
  const errors = validateProduct({ name: 'Camisa', category: '', price: 10, stock: 5 });
  assert.ok(errors.some(e => e.field === 'category'));
});
test('preço obrigatório', () => {
  const errors = validateProduct({ name: 'Camisa', category: 'Roupa', price: '', stock: 5 });
  assert.ok(errors.some(e => e.field === 'price'));
});
test('preço não pode ser negativo', () => {
  const errors = validateProduct({ name: 'Camisa', category: 'Roupa', price: -5, stock: 5 });
  assert.ok(errors.some(e => e.field === 'price'));
});
test('estoque obrigatório', () => {
  const errors = validateProduct({ name: 'Camisa', category: 'Roupa', price: 10, stock: '' });
  assert.ok(errors.some(e => e.field === 'stock'));
});
test('estoque não pode ser negativo', () => {
  const errors = validateProduct({ name: 'Camisa', category: 'Roupa', price: 10, stock: -3 });
  assert.ok(errors.some(e => e.field === 'stock'));
});
test('múltiplos erros de uma vez', () => {
  const errors = validateProduct({ name: '', category: '', price: '', stock: '' });
  assert.strictEqual(errors.length, 4);
});

// --- getStockStatus ---
console.log('\nStatus de Estoque:');
test('estoque zero = out', () => {
  assert.strictEqual(getStockStatus(0), 'out');
});
test('estoque negativo = out', () => {
  assert.strictEqual(getStockStatus(-1), 'out');
});
test('estoque baixo (1-5) = low', () => {
  assert.strictEqual(getStockStatus(3), 'low');
});
test('estoque 5 = low', () => {
  assert.strictEqual(getStockStatus(5), 'low');
});
test('estoque alto (>5) = ok', () => {
  assert.strictEqual(getStockStatus(10), 'ok');
});

// --- filterProducts ---
console.log('\nFiltros:');
const sampleProducts = [
  { id: '1', name: 'Camisa Azul', category: 'Roupas', price: 59.9, stock: 20, description: 'Camisa confortável' },
  { id: '2', name: 'Tênis Nike', category: 'Calçados', price: 299.9, stock: 8, description: 'Tênis esportivo' },
  { id: '3', name: 'Calça Jeans', category: 'Roupas', price: 89.9, stock: 0, description: 'Calça clássica' },
  { id: '4', name: 'Boné Preto', category: 'Acessórios', price: 29.9, stock: 50, description: 'Boné simples' },
];

test('filtro por busca no nome', () => {
  const result = filterProducts(sampleProducts, { search: 'nike' });
  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].name, 'Tênis Nike');
});
test('filtro por busca na descrição', () => {
  const result = filterProducts(sampleProducts, { search: 'clássica' });
  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].name, 'Calça Jeans');
});
test('filtro por categoria', () => {
  const result = filterProducts(sampleProducts, { category: 'Roupas' });
  assert.strictEqual(result.length, 2);
});
test('filtro combina busca + categoria', () => {
  const result = filterProducts(sampleProducts, { search: 'cam', category: 'Roupas' });
  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].name, 'Camisa Azul');
});
test('ordenação por nome (padrão)', () => {
  const result = filterProducts(sampleProducts, { sort: 'name' });
  assert.strictEqual(result[0].name, 'Boné Preto');
  assert.strictEqual(result[1].name, 'Calça Jeans');
});
test('ordenação por preço crescente', () => {
  const result = filterProducts(sampleProducts, { sort: 'price-asc' });
  assert.strictEqual(result[0].name, 'Boné Preto');
  assert.strictEqual(result[result.length - 1].name, 'Tênis Nike');
});
test('ordenação por preço decrescente', () => {
  const result = filterProducts(sampleProducts, { sort: 'price-desc' });
  assert.strictEqual(result[0].name, 'Tênis Nike');
});
test('ordenação por estoque', () => {
  const result = filterProducts(sampleProducts, { sort: 'stock' });
  assert.strictEqual(result[0].name, 'Boné Preto');
});
test('busca vazia retorna todos', () => {
  const result = filterProducts(sampleProducts, { search: '' });
  assert.strictEqual(result.length, 4);
});
test('busca com description undefined não quebra', () => {
  const noDesc = [{ id: '9', name: 'Item', category: 'X', price: 1, stock: 1 }];
  const result = filterProducts(noDesc, { search: 'item' });
  assert.strictEqual(result.length, 1);
});

// --- getCategories ---
console.log('\nCategorias:');
test('retorna categorias únicas e ordenadas', () => {
  const cats = getCategories(sampleProducts);
  assert.deepStrictEqual(cats, ['Acessórios', 'Calçados', 'Roupas']);
});
test('array vazio retorna vazio', () => {
  assert.deepStrictEqual(getCategories([]), []);
});

// --- localStorage ---
console.log('\nPersistência:');
test('saveProducts e loadProducts funciona', () => {
  const data = [{ id: '1', name: 'Teste' }];
  saveProducts(data);
  const loaded = loadProducts();
  assert.deepStrictEqual(loaded, data);
});
test('loadProducts retorna [] quando vazio', () => {
  localStorageMock.clear();
  assert.deepStrictEqual(loadProducts(), []);
});
test('loadProducts retorna [] com JSON inválido', () => {
  localStorageMock.setItem('bingo_products', '{invalid');
  assert.deepStrictEqual(loadProducts(), []);
});

// --- escapeHtml ---
console.log('\nXSS / escapeHtml:');
test('escapeHtml escapa < e >', () => {
  assert.strictEqual(escapeHtml('<script>alert(1)</script>'), '&lt;script&gt;alert(1)&lt;/script&gt;');
});
test('escapeHtml escapa aspas', () => {
  assert.strictEqual(escapeHtml('a"b'), 'a&quot;b');
});
test('escapeHtml escapa &', () => {
  assert.strictEqual(escapeHtml('a&b'), 'a&amp;b');
});
test('escapeHtml retorna string vazia para null/undefined', () => {
  assert.strictEqual(escapeHtml(null), '');
  assert.strictEqual(escapeHtml(undefined), '');
});
test('escapeHtml retorna texto normal sem alteração', () => {
  assert.strictEqual(escapeHtml('Camisa Azul'), 'Camisa Azul');
});

// --- Resumo ---
console.log(`\n\x1b[1mResultado: ${passed} passou, ${failed} falhou\x1b[0m\n`);
process.exit(failed > 0 ? 1 : 0);
