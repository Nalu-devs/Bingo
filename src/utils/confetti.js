console.log('[confetti.js] Carregado');
const COLORS = ['#c9a84c', '#c1694f', '#5a9e7e', '#d4af37', '#2ecc71', '#e74c3c', '#3498db'];

export function fireConfetti(count = 80) {
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden;';
  document.body.appendChild(container);

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const size = 6 + Math.random() * 8;
    const startX = Math.random() * 100;
    const delay = Math.random() * 0.5;
    const duration = 2 + Math.random() * 2;
    const rotation = Math.random() * 720;
    const drift = (Math.random() - 0.5) * 200;

    piece.style.cssText = `
      position:absolute;
      left:${startX}%;
      top:-20px;
      width:${size}px;
      height:${size * 0.6}px;
      background:${color};
      border-radius:2px;
      opacity:0;
      animation:confetti-fall ${duration}s ease-in ${delay}s forwards;
      transform:rotate(0deg);
    `;

    const style = document.createElement('style');
    if (!document.getElementById('confetti-keyframes')) {
      style.id = 'confetti-keyframes';
      style.textContent = `
        @keyframes confetti-fall {
          0% { opacity:1; transform:translateY(0) rotate(0deg); }
          100% { opacity:0; transform:translateY(100vh) rotate(${rotation}deg) translateX(${drift}px); }
        }
      `;
      document.head.appendChild(style);
    }

    container.appendChild(piece);
  }

  setTimeout(() => container.remove(), 5000);
}
