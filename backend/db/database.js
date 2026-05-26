import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, 'data.json');

const defaultData = {
  users: [],
  products: [],
  cart_items: [],
  orders: [],
  order_items: [],
  nextId: { users: 1, products: 1, cart_items: 1, orders: 1, order_items: 1 },
};

let data = null;

function load() {
  if (!data) {
    try {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      data = JSON.parse(raw);
    } catch {
      data = JSON.parse(JSON.stringify(defaultData));
      save();
    }
  }
  return data;
}

function save() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export function getDb() {
  return { load, save };
}

export function getNextId(table) {
  const db = load();
  const id = db.nextId[table];
  db.nextId[table]++;
  save();
  return id;
}

export function insert(table, record) {
  const db = load();
  const id = getNextId(table);
  record.id = id;
  db[table].push(record);
  save();
  return record;
}

export function update(table, id, changes) {
  const db = load();
  const idx = db[table].findIndex(r => r.id === id);
  if (idx === -1) return null;
  db[table][idx] = { ...db[table][idx], ...changes };
  save();
  return db[table][idx];
}

export function remove(table, id) {
  const db = load();
  const idx = db[table].findIndex(r => r.id === id);
  if (idx === -1) return false;
  db[table].splice(idx, 1);
  save();
  return true;
}

export function query(table, filterFn) {
  const db = load();
  const items = db[table];
  return filterFn ? items.filter(filterFn) : [...items];
}

export function findOne(table, filterFn) {
  const db = load();
  return db[table].find(filterFn) || null;
}

export function seedProducts() {
  const db = load();
  if (db.products.length > 0) return;

  const products = [
    { name: 'Camiseta Básica', description: 'Camiseta 100% algodão, confortável e durável.', price: 49.90, category: 'Roupas', stock: 50, image: '/images/camiseta.jpg' },
    { name: 'Tênis Esportivo', description: 'Tênis leve e resistente para corrida.', price: 199.90, category: 'Calçados', stock: 30, image: '/images/tenis.jpg' },
    { name: 'Fone Bluetooth', description: 'Fone sem fio com cancelamento de ruído.', price: 149.90, category: 'Eletrônicos', stock: 25, image: '/images/fone.jpg' },
    { name: 'Mochila Executiva', description: 'Mochila com compartimento para notebook.', price: 129.90, category: 'Acessórios', stock: 20, image: '/images/mochila.jpg' },
    { name: 'Smartwatch', description: 'Relógio inteligente com monitor cardíaco.', price: 299.90, category: 'Eletrônicos', stock: 15, image: '/images/smartwatch.jpg' },
    { name: 'Jaqueta Jeans', description: 'Jaqueta jeans clássica, tamanho único.', price: 179.90, category: 'Roupas', stock: 35, image: '/images/jaqueta.jpg' },
    { name: 'Óculos de Sol', description: 'Óculos polarizado com proteção UV.', price: 89.90, category: 'Acessórios', stock: 40, image: '/images/oculos.jpg' },
    { name: 'Bolsa de Couro', description: 'Bolsa feminina em couro legítimo.', price: 249.90, category: 'Acessórios', stock: 12, image: '/images/bolsa.jpg' },
  ];

  for (const p of products) insert('products', p);
  console.log('Produtos seedados com sucesso!');
}
