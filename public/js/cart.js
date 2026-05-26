async function showCart() {
  if (!isLoggedIn()) {
    showLogin();
    return;
  }

  document.getElementById('modal-title').textContent = 'Carrinho';
  document.getElementById('modal-body').innerHTML = '<div class="loading">Carregando...</div>';
  openModal();

  try {
    const items = await api('/cart');
    renderCart(items);
  } catch (err) {
    document.getElementById('modal-body').innerHTML =
      `<div class="empty-state"><h3>Erro</h3><p>${err.message}</p></div>`;
  }
}

function renderCart(items) {
  const body = document.getElementById('modal-body');

  if (items.length === 0) {
    body.innerHTML = `
      <div class="empty-state">
        <h3>Carrinho vazio</h3>
        <p>Adicione produtos ao carrinho</p>
      </div>
    `;
    return;
  }

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  body.innerHTML = `
    <div id="cart-items">
      ${items.map(item => `
        <div class="cart-item" data-id="${item.product_id}">
          <div class="cart-item-image">${getProductEmoji(item.name)}</div>
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">R$ ${item.price.toFixed(2)}</div>
          </div>
          <div class="cart-item-actions">
            <button class="qty-btn" onclick="updateCartQty(${item.product_id}, -1)">−</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn" onclick="updateCartQty(${item.product_id}, 1)">+</button>
            <button class="btn btn-danger" style="padding:0.25rem 0.5rem;font-size:0.75rem" onclick="removeFromCart(${item.product_id})">Remover</button>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="cart-total">
      <span>Total</span>
      <span>R$ ${total.toFixed(2)}</span>
    </div>
    <button class="btn btn-primary" style="width:100%" onclick="checkout()">Finalizar Pedido</button>
  `;
}

async function updateCartQty(productId, delta) {
  const itemEl = document.querySelector(`.cart-item[data-id="${productId}"]`);
  const qtyEl = itemEl?.querySelector('.qty-value');
  if (!qtyEl) return;

  const newQty = parseInt(qtyEl.textContent) + delta;
  if (newQty < 1) return;

  try {
    await api(`/cart/${productId}`, {
      method: 'PUT',
      body: { quantity: newQty },
    });
    const items = await api('/cart');
    renderCart(items);
    updateCartCount();
  } catch (err) {
    alert(err.message);
  }
}

async function removeFromCart(productId) {
  try {
    await api(`/cart/${productId}`, { method: 'DELETE' });
    const items = await api('/cart');
    renderCart(items);
    updateCartCount();
  } catch (err) {
    alert(err.message);
  }
}

async function checkout() {
  try {
    const result = await api('/orders/checkout', { method: 'POST' });
    closeModal();
    alert(`Pedido #${result.order_id} realizado com sucesso! Total: R$ ${result.total.toFixed(2)}`);
    updateCartCount();
  } catch (err) {
    alert(err.message);
  }
}

async function addToCart(productId) {
  if (!isLoggedIn()) {
    showLogin();
    return;
  }

  try {
    await api('/cart', {
      method: 'POST',
      body: { product_id: productId, quantity: 1 },
    });
    updateCartCount();
    showCart();
  } catch (err) {
    alert(err.message);
  }
}

async function updateCartCount() {
  const countEl = document.getElementById('cart-count');
  if (!isLoggedIn()) {
    countEl.textContent = '0';
    return;
  }
  try {
    const items = await api('/cart');
    const total = items.reduce((s, i) => s + i.quantity, 0);
    countEl.textContent = total;
  } catch {
    countEl.textContent = '0';
  }
}
