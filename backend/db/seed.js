import { getDb } from './database.js';

export function seedProducts() {
  const db = getDb();
  const count = db.prepare('SELECT COUNT(*) as count FROM products').get();

  if (count.count > 0) return;

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

  const stmt = db.prepare(
    'INSERT INTO products (name, description, price, category, stock, image) VALUES (@name, @description, @price, @category, @stock, @image)'
  );

  const insertMany = db.transaction((items) => {
    for (const item of items) stmt.run(item);
  });

  insertMany(products);
  console.log('Produtos inseridos com sucesso!');
}
