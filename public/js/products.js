async function renderHome() {
  console.log('[products.js] renderHome()');
  const content = document.getElementById('page-content');

  content.innerHTML = `
    <div class="hero">
      <h1>Bem-vindo à Minha Loja</h1>
      <p>Os melhores produtos com os melhores preços</p>
      <button class="btn btn-primary" onclick="navigate('products')">Ver Produtos</button>
    </div>
    <h2 class="section-title">Categorias</h2>
    <div class="categories" id="categories-list">
      <div class="loading">Carregando...</div>
    </div>
    <h2 class="section-title">Produtos em Destaque</h2>
    <div class="products-grid" id="featured-products">
      <div class="loading">Carregando...</div>
    </div>
  `;

  try {
    const [categories, products] = await Promise.all([
      api('/products/categories'),
      api('/products'),
    ]);
    console.log('[products.js] Categorias carregadas:', categories);
    console.log('[products.js] Produtos carregados:', products.length);

    document.getElementById('categories-list').innerHTML = categories.map(cat => `
      <div class="category-card" onclick="navigate('products', '${cat}')">
        <h3>${cat}</h3>
        <span>${products.filter(p => p.category === cat).length} produtos</span>
      </div>
    `).join('');

    document.getElementById('featured-products').innerHTML =
      products.slice(0, 4).map(p => renderProductCard(p)).join('');
  } catch (err) {
    console.log('[products.js] Erro ao renderizar home:', err.message);
    content.innerHTML = `<div class="empty-state"><h3>Erro</h3><p>${err.message}</p></div>`;
  }
}

async function renderProducts(category) {
  console.log('[products.js] renderProducts() - category:', category);
  const content = document.getElementById('page-content');

  content.innerHTML = `
    <div class="search-bar">
      <input type="text" id="search-input" placeholder="Buscar produtos..." oninput="searchProducts()">
    </div>
    <div class="filter-bar" id="filter-bar">
      <button class="filter-btn active" onclick="filterProducts('')">Todos</button>
    </div>
    <div class="products-grid" id="products-list">
      <div class="loading">Carregando...</div>
    </div>
  `;

  try {
    const [categories, products] = await Promise.all([
      api('/products/categories'),
      category ? api(`/products?category=${encodeURIComponent(category)}`) : api('/products'),
    ]);
    console.log('[products.js] Produtos filtrados:', products.length);

    document.getElementById('filter-bar').innerHTML =
      `<button class="filter-btn ${!category ? 'active' : ''}" onclick="filterProducts('')">Todos</button>` +
      categories.map(cat =>
        `<button class="filter-btn ${cat === category ? 'active' : ''}" onclick="filterProducts('${cat}')">${cat}</button>`
      ).join('');

    document.getElementById('products-list').innerHTML =
      products.length
        ? products.map(p => renderProductCard(p)).join('')
        : '<div class="empty-state"><h3>Nenhum produto encontrado</h3></div>';
  } catch (err) {
    console.log('[products.js] Erro ao renderizar produtos:', err.message);
    content.innerHTML = `<div class="empty-state"><h3>Erro</h3><p>${err.message}</p></div>`;
  }
}

function renderProductCard(product) {
  console.log('[products.js] renderProductCard() -', product.name, 'R$', product.price, 'estoque:', product.stock);
  return `
    <div class="product-card">
      <div class="product-image">${getProductEmoji(product.name)}</div>
      <div class="product-info">
        <div class="product-name">${product.name}</div>
        <div class="product-description">${product.description}</div>
        <div class="product-footer">
          <span class="product-price">R$ ${product.price.toFixed(2)}</span>
          <span class="product-stock">${product.stock > 0 ? `${product.stock} em estoque` : 'Indisponível'}</span>
        </div>
        <button class="btn btn-primary" style="width:100%;margin-top:0.75rem"
          ${product.stock < 1 ? 'disabled' : `onclick="addToCart(${product.id})"`}>
          ${product.stock < 1 ? 'Indisponível' : 'Adicionar ao Carrinho'}
        </button>
      </div>
    </div>
  `;
}

function getProductEmoji(name) {
  const emojis = {
    camiseta: '👕',
    tênis: '👟',
    'fone': '🎧',
    mochila: '🎒',
    smartwatch: '⌚',
    jaqueta: '🧥',
    'óculos': '👓',
    bolsa: '👛',
  };
  const key = Object.keys(emojis).find(k => name.toLowerCase().includes(k));
  const emoji = key ? emojis[key] : '📦';
  console.log('[products.js] getProductEmoji() -', name, '=>', emoji);
  return emoji;
}

function filterProducts(category) {
  console.log('[products.js] Filtrando por categoria:', category);
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent === (category || 'Todos'));
  });
  renderProducts(category);
}

async function searchProducts() {
  const query = document.getElementById('search-input').value;
  console.log('[products.js] searchProducts:', query);
  const list = document.getElementById('products-list');

  try {
    const products = query
      ? await api(`/products?search=${encodeURIComponent(query)}`)
      : await api('/products');

    list.innerHTML = products.length
      ? products.map(p => renderProductCard(p)).join('')
      : '<div class="empty-state"><h3>Nenhum produto encontrado</h3></div>';
  } catch {
    console.log('[products.js] Erro na busca (ignorado)');
  }
}
