document.addEventListener('DOMContentLoaded', function() {
  const navbar = document.querySelector('.navbar');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navLinksItems = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  menuToggle.addEventListener('click', function() {
    navLinks.classList.toggle('active');
    const icon = menuToggle.querySelector('i');
    if (navLinks.classList.contains('active')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times');
    } else {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  });

  navLinksItems.forEach(function(link) {
    link.addEventListener('click', function() {
      navLinks.classList.remove('active');
      const icon = menuToggle.querySelector('i');
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    });
  });

  const sections = document.querySelectorAll('section');
  const observerOptions = {
    threshold: 0.3
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  sections.forEach(function(section) {
    section.classList.add('fade-in-section');
    observer.observe(section);
  });

  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(function(card, index) {
    card.style.animationDelay = (index * 0.1) + 's';
  });
});

function enviarEmail(event) {
  event.preventDefault();
  
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const mensagem = document.getElementById('mensagem').value;
  
  const mailtoLink = 'mailto:seuemail@exemplo.com?subject=Contato do portfólio - ' + encodeURIComponent(nome) + '&body=' + encodeURIComponent('Nome: ' + nome + '\nEmail: ' + email + '\n\nMensagem:\n' + mensagem);
  
  window.location.href = mailtoLink;
  
  alert('Obrigado pela mensagem! Em breve entrarei em contato.');
  
  event.target.reset();
}

window.addEventListener('scroll', function() {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.style.backgroundPositionY = (scrolled * 0.5) + 'px';
  }
});

document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});
