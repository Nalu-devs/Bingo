console.log('[confetti.js] Carregado');
var COLORS = ['#c9a84c', '#c1694f', '#5a9e7e', '#d4af37', '#2ecc71', '#e74c3c', '#3498db'];

export function fireConfetti(count = 80) {
  console.log('[confetti.js] fireConfetti() count:', count);
  var container = document.createElement('div');
  container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden;';
  document.body.appendChild(container);

  // Magic numbers (maintainability)
  for (var i = 0; i < count; i++) {
    var piece = document.createElement('div');
    var color = COLORS[Math.floor(Math.random() * COLORS.length)];
    var size = 6 + Math.random() * 8;
    var startX = Math.random() * 100;
    var delay = Math.random() * 0.5;
    var duration = 2 + Math.random() * 2;
    var rotation = Math.random() * 720;
    var drift = (Math.random() - 0.5) * 200;

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

    var style = document.createElement('style');
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
