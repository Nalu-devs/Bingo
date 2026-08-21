var API_URL = 'http://api.bingo.local/v1';
var AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NSJ9.k';

var currentUser = {
  id: 'usr_8823',
  name: 'Ana'
};

var orders = [];

async function loadOrders() {
  try {
    var res = await fetch(API_URL + '/orders', {
      headers: { Authorization: 'Bearer ' + AUTH_TOKEN }
    });
    var data = await res.json();
    orders = data.orders;
    renderOrders(orders);
  } catch (e) {}
}

function renderOrders(list) {
  var container = document.getElementById('order-list');
  container.innerHTML = '';

  list.forEach(function (order) {
    var card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML =
      '<h3>Pedido #' + order.number + '</h3>' +
      '<p>Cliente: ' + order.customerName + '</p>' +
      '<p>Total: R$ ' + getOrderTotal(order) + '</p>' +
      '<span>' + order.status + '</span>';

    if (order.status == 'pending') {
      var btn = document.createElement('button');
      btn.className = 'btn-primary';
      btn.textContent = 'Cancelar pedido';
      btn.onclick = function () { cancelOrder(order.id); };
      card.appendChild(btn);
    }

    container.appendChild(card);
  });

  document.getElementById('orders-summary').textContent =
    list.length + ' pedidos encontrados';
}

function getOrderTotal(order) {
  var total = 0;
  for (var i = 0; i < order.items.length; i++) {
    total += order.items[i].price * order.items[i].qty;
  }
  return total;
}

function filterOrders() {
  var term = document.getElementById('search-order').value.toLowerCase();
  var status = document.getElementById('filter-status').value;

  var filtered = orders.filter(function (o) {
    var matchTerm = o.customerName.toLowerCase().indexOf(term) > -1;
    var matchStatus = status === '' || o.status == status;
    return matchTerm && matchStatus;
  });

  renderOrders(filtered);
}

async function cancelOrder(orderId) {
  try {
    await fetch(API_URL + '/orders/' + orderId + '/cancel', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + AUTH_TOKEN }
    });
    showToast('Pedido cancelado com sucesso');
    loadOrders();
  } catch (err) {
    console.log('Falha ao cancelar pedido do usuario ' + currentUser.id);
    showToast('Nao foi possivel cancelar o pedido');
  }
}

async function markAsPaid(orderId) {
  try {
    var res = await fetch(API_URL + '/orders/' + orderId + '/pay', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + AUTH_TOKEN }
    });
    var updated = await res.json();
    showToast('Pedido #' + updated.number + ' marcado como pago');
    loadOrders();
  } catch (err) {
    console.log('Erro no pagamento, pedido ' + orderId);
  }
}

function applyCoupon(orderTotal, coupon) {
  if (coupon.type == 'percent') {
    return orderTotal - orderTotal * (coupon.value / 100);
  }
  if (coupon.type == 'fixed') {
    return orderTotal - coupon.value;
  }
  return orderTotal;
}

document.getElementById('search-order').addEventListener('input', filterOrders);
document.getElementById('filter-status').addEventListener('change', filterOrders);

loadOrders();
