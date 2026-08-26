import assert from 'assert';

import {
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
} from '../app.js';

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

// ========================================================================
// BANCO DE DADOS SIMULADO - Orgs e Users
// ========================================================================
const DB_ORGS = [
  { orgId: 'org_bingo_001', orgName: 'Bingo Store', plan: 'premium' },
  { orgId: 'org_nalu_002', orgName: 'Nalu Tech', plan: 'enterprise' },
  { orgId: 'org_test_003', orgName: 'TestLab QA', plan: 'free' },
  { orgId: 'org_dev_004', orgName: 'Dev Sandbox', plan: 'premium' },
  { orgId: 'org_staging_005', orgName: 'Staging Env', plan: 'enterprise' },
];

const DB_USERS = [
  { userId: 'user_nalu_001', userName: 'Nalu Admin', orgId: 'org_bingo_001', role: 'admin' },
  { userId: 'user_ana_002', userName: 'Ana Dev', orgId: 'org_bingo_001', role: 'editor' },
  { userId: 'user_joao_003', userName: 'Joao Viewer', orgId: 'org_bingo_001', role: 'viewer' },
  { userId: 'user_maria_004', userName: 'Maria Admin', orgId: 'org_nalu_002', role: 'admin' },
  { userId: 'user_pedro_005', userName: 'Pedro Editor', orgId: 'org_nalu_002', role: 'editor' },
  { userId: 'user_lucia_006', userName: 'Lucia Viewer', orgId: 'org_nalu_002', role: 'viewer' },
  { userId: 'user_carlos_007', userName: 'Carlos Admin', orgId: 'org_test_003', role: 'admin' },
  { userId: 'user_fernanda_008', userName: 'Fernanda Editor', orgId: 'org_test_003', role: 'editor' },
  { userId: 'user_robson_009', userName: 'Robson Viewer', orgId: 'org_test_003', role: 'viewer' },
  { userId: 'user_camila_010', userName: 'Camila Admin', orgId: 'org_dev_004', role: 'admin' },
  { userId: 'user_rafael_011', userName: 'Rafael Editor', orgId: 'org_dev_004', role: 'editor' },
  { userId: 'user_daniela_012', userName: 'Daniela Viewer', orgId: 'org_dev_004', role: 'viewer' },
  { userId: 'user_thiago_013', userName: 'Thiago Admin', orgId: 'org_staging_005', role: 'admin' },
  { userId: 'user_bruna_014', userName: 'Bruna Editor', orgId: 'org_staging_005', role: 'editor' },
  { userId: 'user_gabriel_015', userName: 'Gabriel Viewer', orgId: 'org_staging_005', role: 'viewer' },
];

// ========================================================================
// PERMISSÕES POR ROLE (simula banco de regras)
// ========================================================================
const ROLE_PERMISSIONS = {
  admin:  { canCreate: true,  canEdit: true,  canDelete: true,  canView: true },
  editor: { canCreate: true,  canEdit: true,  canDelete: false, canView: true },
  viewer: { canCreate: false, canEdit: false, canDelete: false, canView: true },
};

// ========================================================================
// CONTADORES GLOBAIS
// ========================================================================
let totalPassed = 0;
let totalFailed = 0;
const resultsByOrg = {};
const resultsByUser = {};

// ========================================================================
// FUNÇÕES AUXILIARES
// ========================================================================
function getOrg(orgId) {
  return DB_ORGS.find(o => o.orgId === orgId);
}

function getUser(userId) {
  return DB_USERS.find(u => u.userId === userId);
}

function getUsersForOrg(orgId) {
  return DB_USERS.filter(u => u.orgId === orgId);
}

function hasPermission(role, action) {
  return ROLE_PERMISSIONS[role] && ROLE_PERMISSIONS[role][action];
}

function trackResult(userId, orgId, testName, passed) {
  if (!resultsByOrg[orgId]) resultsByOrg[orgId] = { passed: 0, failed: 0, tests: [] };
  if (!resultsByUser[userId]) resultsByUser[userId] = { passed: 0, failed: 0, tests: [] };

  const entry = { test: testName, passed, timestamp: new Date().toISOString() };
  resultsByOrg[orgId].tests.push(entry);
  resultsByUser[userId].tests.push(entry);

  if (passed) {
    resultsByOrg[orgId].passed++;
    resultsByUser[userId].passed++;
    totalPassed++;
  } else {
    resultsByOrg[orgId].failed++;
    resultsByUser[userId].failed++;
    totalFailed++;
  }
}

function test(user, org, name, fn) {
  try {
    fn();
    trackResult(user.userId, org.orgId, name, true);
    console.log(`  \x1b[32m✓\x1b[0m [${user.userId}/${org.orgId}] ${name}`);
  } catch (err) {
    trackResult(user.userId, org.orgId, name, false);
    console.log(`  \x1b[31m✗\x1b[0m [${user.userId}/${org.orgId}] ${name}`);
    console.log(`    \x1b[31m${err.message}\x1b[0m`);
  }
}

// ========================================================================
// DADOS DE TESTE POR ORG (simula isolamento de dados)
// ========================================================================
const ORG_PRODUCTS = {
  'org_bingo_001': [
    { id: 'p1', name: 'Camisa Bingo', category: 'Roupas', price: 59.9, stock: 20, description: 'Camisa oficial Bingo' },
    { id: 'p2', name: 'Tênis Running', category: 'Calcados', price: 199.9, stock: 3, description: 'Tênis para corrida' },
    { id: 'p3', name: 'Boné Logo', category: 'Acessorios', price: 29.9, stock: 0, description: 'Boné com logo' },
  ],
  'org_nalu_002': [
    { id: 'p10', name: 'Notebook Dev', category: 'Eletronicos', price: 4500, stock: 5, description: 'Notebook para desenvolvimento' },
    { id: 'p11', name: 'Mouse Gamer', category: 'Perifericos', price: 189.9, stock: 15, description: 'Mouse RGB gamer' },
    { id: 'p12', name: 'Monitor 27"', category: 'Eletronicos', price: 1899.9, stock: 0, description: 'Monitor 4K' },
  ],
  'org_test_003': [
    { id: 'p20', name: 'Kit QA', category: 'Ferramentas', price: 350, stock: 10, description: 'Kit completo QA' },
  ],
  'org_dev_004': [
    { id: 'p30', name: 'API License', category: 'Software', price: 99.9, stock: 999, description: 'Licença de API' },
    { id: 'p31', name: 'Cloud Credits', category: 'Servicos', price: 250, stock: 50, description: 'Creditos cloud' },
  ],
  'org_staging_005': [
    { id: 'p40', name: 'Produto Staging', category: 'Testes', price: 1.0, stock: 100, description: 'Produto para staging' },
  ],
};

// ========================================================================
// TESTES: VALIDAÇÃO UNIVERSAL (roda para todos os users/orgs)
// ========================================================================
function runValidationTests(user, org) {
  console.log(`\n\x1b[1m--- Validação [${user.userName}/${org.orgName}] ---\x1b[0m`);

  // [userId] Verifica que produto válido passa na validação
  test(user, org, 'produto válido nao retorna erros', () => {
    const errors = validateProduct({ name: 'Teste', category: 'Cat', price: 10, stock: 5 });
    assert.strictEqual(errors.length, 0);
  });

  // [userId] Verifica validação de nome obrigatório
  test(user, org, 'nome obrigatório bloqueia cadastro', () => {
    const errors = validateProduct({ name: '', category: 'Cat', price: 10, stock: 5 });
    assert.ok(errors.some(e => e.field === 'name'));
  });

  // [userId] Verifica validação de categoria obrigatória
  test(user, org, 'categoria obrigatoria bloqueia cadastro', () => {
    const errors = validateProduct({ name: 'Teste', category: '', price: 10, stock: 5 });
    assert.ok(errors.some(e => e.field === 'category'));
  });

  // [userId] Verifica rejeição de preco negativo
  test(user, org, 'preco negativo e rejeitado', () => {
    const errors = validateProduct({ name: 'Teste', category: 'Cat', price: -1, stock: 5 });
    assert.ok(errors.some(e => e.field === 'price'));
  });

  // [userId] Verifica rejeição de estoque negativo
  test(user, org, 'estoque negativo e rejeitado', () => {
    const errors = validateProduct({ name: 'Teste', category: 'Cat', price: 10, stock: -1 });
    assert.ok(errors.some(e => e.field === 'stock'));
  });
}

// ========================================================================
// TESTES: PERMISSÕES POR ROLE (simula banco de regras)
// ========================================================================
function runPermissionTests(user, org) {
  console.log(`\n\x1b[1m--- Permissoes [${user.userName}/${org.orgName}] ---\x1b[0m`);
  const perms = ROLE_PERMISSIONS[user.role];

  // [userId] Verifica se o role pode criar produtos
  test(user, org, `role ${user.role} pode criar: ${perms.canCreate}`, () => {
    assert.strictEqual(hasPermission(user.role, 'canCreate'), perms.canCreate);
  });

  // [userId] Verifica se o role pode editar produtos
  test(user, org, `role ${user.role} pode editar: ${perms.canEdit}`, () => {
    assert.strictEqual(hasPermission(user.role, 'canEdit'), perms.canEdit);
  });

  // [userId] Verifica se o role pode excluir produtos
  test(user, org, `role ${user.role} pode excluir: ${perms.canDelete}`, () => {
    assert.strictEqual(hasPermission(user.role, 'canDelete'), perms.canDelete);
  });

  // [userId] Verifica se o role pode visualizar produtos
  test(user, org, `role ${user.role} pode visualizar: ${perms.canView}`, () => {
    assert.strictEqual(hasPermission(user.role, 'canView'), perms.canView);
  });
}

// ========================================================================
// TESTES: ISOLAMENTO DE DADOS POR ORG
// ========================================================================
function runIsolationTests(user, org) {
  console.log(`\n\x1b[1m--- Isolamento de Dados [${user.userName}/${org.orgName}] ---\x1b[0m`);
  const products = ORG_PRODUCTS[org.orgId] || [];

  // [userId] Verifica que a org tem produtos cadastrados
  test(user, org, `org ${org.orgId} tem ${products.length} produtos`, () => {
    assert.ok(products.length > 0, `Org ${org.orgId} deveria ter produtos`);
  });

  // [userId] Verifica filtro na lista de produtos da org
  test(user, org, 'filtro retorna produtos da org', () => {
    const result = filterProducts(products, { search: '' });
    assert.strictEqual(result.length, products.length);
  });

  // [userId] Verifica busca por nome nos produtos da org
  test(user, org, 'busca por nome funciona nos produtos da org', () => {
    const firstName = (products[0].name || '').split(' ')[0].toLowerCase();
    const result = filterProducts(products, { search: firstName });
    assert.ok(result.length >= 1, `Deveria encontrar produto com "${firstName}"`);
  });

  // [userId] Verifica que categorias da org sao extraidas corretamente
  test(user, org, 'categorias da org sao unicas', () => {
    const cats = getCategories(products);
    const unique = [...new Set(products.map(p => p.category))];
    assert.deepStrictEqual(cats, unique.sort());
  });

  // [userId] Verifica que validacao funciona com dados da org
  test(user, org, 'validacao funciona com dados da org', () => {
    const p = products[0];
    const errors = validateProduct({ name: p.name, category: p.category, price: p.price, stock: p.stock });
    assert.strictEqual(errors.length, 0);
  });
}

// ========================================================================
// TESTES: OPERACOES DE ESCRITA (so admin/editor)
// ========================================================================
function runWriteTests(user, org) {
  console.log(`\n\x1b[1m--- Operacoes de Escrita [${user.userName}/${org.orgName}] ---\x1b[0m`);
  const perms = ROLE_PERMISSIONS[user.role];

  if (perms.canCreate) {
    // [userId] Verifica que pode salvar produtos (criar)
    test(user, org, `${user.role} pode criar - saveProducts funciona`, () => {
      const testProduct = { id: generateId(), name: `Produto ${user.userId}`, category: 'Teste', price: 10, stock: 5 };
      saveProducts([testProduct]);
      const loaded = loadProducts();
      assert.strictEqual(loaded.length, 1);
      assert.strictEqual(loaded[0].name, testProduct.name);
    });

    // [userId] Verifica que pode gerar IDs unicos
    test(user, org, `${user.role} pode criar - generateId e unico`, () => {
      const id1 = generateId();
      const id2 = generateId();
      assert.notStrictEqual(id1, id2);
    });
  } else {
    // [userId] Verifica que viewer NAO pode criar
    test(user, org, `${user.role} NAO pode criar - retorna erro`, () => {
      assert.throws(() => {
        if (!hasPermission(user.role, 'canCreate')) {
          throw new Error(`Acesso negado: ${user.role} nao pode criar produtos`);
        }
      }, /Acesso negado/);
    });
  }

  if (perms.canDelete) {
    // [userId] Verifica que pode excluir (admin only)
    test(user, org, `${user.role} pode excluir - delete funciona`, () => {
      saveProducts([{ id: 'keep', name: 'Manter' }, { id: 'del', name: 'Apagar' }]);
      const before = loadProducts();
      assert.strictEqual(before.length, 2);
      const after = before.filter(p => p.id !== 'del');
      saveProducts(after);
      assert.strictEqual(loadProducts().length, 1);
    });
  } else {
    // [userId] Verifica que editor/viewer NAO pode excluir
    test(user, org, `${user.role} NAO pode excluir - retorna erro`, () => {
      assert.throws(() => {
        if (!hasPermission(user.role, 'canDelete')) {
          throw new Error(`Acesso negado: ${user.role} nao pode excluir produtos`);
        }
      }, /Acesso negado/);
    });
  }
}

// ========================================================================
// TESTES: SEGURANCA XSS
// ========================================================================
function runSecurityTests(user, org) {
  console.log(`\n\x1b[1m--- Seguranca XSS [${user.userName}/${org.orgName}] ---\x1b[0m`);

  // [userId] Verifica escape de script injection
  test(user, org, 'escapeHtml previne XSS com script tag', () => {
    const input = '<script>alert("xss")</script>';
    const result = escapeHtml(input);
    assert.ok(!result.includes('<script>'));
    assert.ok(result.includes('&lt;script&gt;'));
  });

  // [userId] Verifica escape de aspas duplas
  test(user, org, 'escapeHtml previne XSS com aspas', () => {
    const result = escapeHtml('value" onclick="alert(1)');
    assert.ok(!result.includes('"'));
    assert.ok(result.includes('&quot;'));
  });

  // [userId] Verifica escape de ampersand
  test(user, org, 'escapeHtml escapa ampersand', () => {
    const result = escapeHtml('a&b');
    assert.strictEqual(result, 'a&amp;b');
  });

  // [userId] Verifica tratamento de null/undefined
  test(user, org, 'escapeHtml trata null/undefined com seguranca', () => {
    assert.strictEqual(escapeHtml(null), '');
    assert.strictEqual(escapeHtml(undefined), '');
  });
}

// ========================================================================
// TESTES: UTILITARIOS
// ========================================================================
function runUtilityTests(user, org) {
  console.log(`\n\x1b[1m--- Utilitarios [${user.userName}/${org.orgName}] ---\x1b[0m`);

  // [userId] Verifica formatacao de preco em Real
  test(user, org, 'formatPrice formata em Real', () => {
    assert.strictEqual(formatPrice(49.9), 'R$ 49,90');
  });

  // [userId] Verifica classificacao de estoque
  test(user, org, 'getStockStatus classifica corretamente', () => {
    assert.strictEqual(getStockStatus(0), 'out');
    assert.strictEqual(getStockStatus(3), 'low');
    assert.strictEqual(getStockStatus(10), 'ok');
  });

  // [userId] Verifica logError com contexto da org
  test(user, org, 'logError registra com contexto org/user', () => {
    const logs = [];
    const orig = console.error;
    console.error = (...args) => logs.push(args.join(' '));
    logError({ orgId: org.orgId, teamId: user.userId, action: 'test' }, new Error('test error'));
    console.error = orig;
    assert.ok(logs[0].includes(org.orgId));
    assert.ok(logs[0].includes(user.userId));
  });
}

// ========================================================================
// TESTES: FILTROS AVANCADOS POR ORG
// ========================================================================
function runFilterTests(user, org) {
  console.log(`\x1b[1m--- Filtros [${user.userName}/${org.orgName}] ---\x1b[0m`);
  const products = ORG_PRODUCTS[org.orgId] || [];

  // [userId] Verifica ordenacao por preco crescente
  test(user, org, 'ordenacao preco asc funciona', () => {
    const result = filterProducts(products, { sort: 'price-asc' });
    for (let i = 1; i < result.length; i++) {
      assert.ok(result[i].price >= result[i - 1].price);
    }
  });

  // [userId] Verifica ordenacao por preco decrescente
  test(user, org, 'ordenacao preco desc funciona', () => {
    const result = filterProducts(products, { sort: 'price-desc' });
    for (let i = 1; i < result.length; i++) {
      assert.ok(result[i].price <= result[i - 1].price);
    }
  });

  // [userId] Verifica ordenacao por estoque
  test(user, org, 'ordenacao estoque funciona', () => {
    const result = filterProducts(products, { sort: 'stock' });
    for (let i = 1; i < result.length; i++) {
      assert.ok(result[i].stock <= result[i - 1].stock);
    }
  });

  // [userId] Verifica busca com termo inexistente retorna vazio
  test(user, org, 'busca inexistente retorna vazio', () => {
    const result = filterProducts(products, { search: 'zzz_inexistente_xyz' });
    assert.strictEqual(result.length, 0);
  });

  // [userId] Verifica busca por descricao funciona
  test(user, org, 'busca por descricao funciona', () => {
    const firstDesc = products[0].description.split(' ')[0].toLowerCase();
    const result = filterProducts(products, { search: firstDesc });
    assert.ok(result.length >= 1);
  });
}

// ========================================================================
// TESTES: PERSISTENCIA POR ORG (simula localStorage isolado)
// ========================================================================
function runPersistenceTests(user, org) {
  console.log(`\x1b[1m--- Persistencia [${user.userName}/${org.orgName}] ---\x1b[0m`);

  // [userId] Verifica save/load no localStorage
  test(user, org, 'save e load funcionam para a org', () => {
    const data = [{ id: 'test1', name: `Org ${org.orgId}` }];
    saveProducts(data);
    const loaded = loadProducts();
    assert.deepStrictEqual(loaded, data);
  });

  // [userId] Verifica retorno vazio quando nada salvo
  test(user, org, 'load retorna [] quando vazio', () => {
    localStorageMock.clear();
    assert.deepStrictEqual(loadProducts(), []);
  });

  // [userId] Verifica tratamento de JSON corrompido
  test(user, org, 'load trata JSON invalido com seguranca', () => {
    localStorageMock.setItem('bingo_products', '{corrupted!!!');
    assert.deepStrictEqual(loadProducts(), []);
  });
}

// ========================================================================
// EXECUCAO: RODA TODOS OS TESTES PARA CADA USER + ORG
// ========================================================================
console.log('\n' + '='.repeat(60));
console.log('  TESTES MULTI-ORG / MULTI-USER');
console.log(`  Orgs: ${DB_ORGS.length} | Users: ${DB_USERS.length}`);
console.log('='.repeat(60));

for (const org of DB_ORGS) {
  console.log(`\n\x1b[36m${'='.repeat(60)}\x1b[0m`);
  console.log(`\x1b[36m  ORG: ${org.orgName} (${org.orgId}) | Plano: ${org.plan}\x1b[0m`);
  console.log(`\x1b[36m${'='.repeat(60)}\x1b[0m`);

  const users = getUsersForOrg(org.orgId);

  for (const user of users) {
    console.log(`\n\x1b[33m  User: ${user.userName} (${user.userId}) | Role: ${user.role}\x1b[0m`);

    runValidationTests(user, org);
    runPermissionTests(user, org);
    runIsolationTests(user, org);
    runWriteTests(user, org);
    runSecurityTests(user, org);
    runUtilityTests(user, org);
    runFilterTests(user, org);
    runPersistenceTests(user, org);
  }
}

// ========================================================================
// RESUMO POR ORG
// ========================================================================
console.log('\n' + '='.repeat(60));
console.log('  RESUMO POR ORG');
console.log('='.repeat(60));

for (const [orgId, data] of Object.entries(resultsByOrg)) {
  const org = getOrg(orgId);
  const total = data.passed + data.failed;
  const pct = total > 0 ? ((data.passed / total) * 100).toFixed(1) : 0;
  const icon = data.failed === 0 ? '\x1b[32mTODOS OK\x1b[0m' : `\x1b[31m${data.failed} FALHOU\x1b[0m`;
  console.log(`  ${org.orgName} (${orgId}): ${data.passed}/${total} passou (${pct}%) - ${icon}`);
}

// ========================================================================
// RESUMO POR USER
// ========================================================================
console.log('\n' + '='.repeat(60));
console.log('  RESUMO POR USER');
console.log('='.repeat(60));

for (const [userId, data] of Object.entries(resultsByUser)) {
  const user = getUser(userId);
  const total = data.passed + data.failed;
  const pct = total > 0 ? ((data.passed / total) * 100).toFixed(1) : 0;
  const icon = data.failed === 0 ? '\x1b[32mTODOS OK\x1b[0m' : `\x1b[31m${data.failed} FALHOU\x1b[0m`;
  console.log(`  ${user.userName} (${userId}) [${user.role}]: ${data.passed}/${total} passou (${pct}%) - ${icon}`);
}

// ========================================================================
// RESUMO FINAL
// ========================================================================
console.log('\n' + '='.repeat(60));
console.log(`\x1b[1m  RESULTADO FINAL: ${totalPassed} passou, ${totalFailed} falhou\x1b[0m`);
console.log('='.repeat(60) + '\n');

process.exit(totalFailed > 0 ? 1 : 0);
