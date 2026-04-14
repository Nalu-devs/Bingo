document.addEventListener('DOMContentLoaded', function() {
  const navbar = document.querySelector('.navbar');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navLinksItems = document.querySelectorAll('.nav-links a');
  const themeToggle = document.getElementById('themeToggle');
  
  createParticles();

  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  themeToggle.addEventListener('click', function() {
    const html = document.documentElement;
    const icon = themeToggle.querySelector('i');
    
    if (html.getAttribute('data-theme') === 'light') {
      html.setAttribute('data-theme', 'dark');
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
      localStorage.setItem('theme', 'dark');
    } else {
      html.setAttribute('data-theme', 'light');
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
      localStorage.setItem('theme', 'light');
    }
  });

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    const icon = themeToggle.querySelector('i');
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
  }

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
        if (entry.target.id === 'sobre') {
          animateCounters();
        }
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

function createParticles() {
  const container = document.getElementById('particles');
  const colors = ['#6366f1', '#ec4899', '#8b5cf6', '#06b6d4'];
  const particleCount = 30;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    const size = Math.random() * 6 + 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;
    
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.backgroundColor = color;
    particle.style.left = left + '%';
    particle.style.top = top + '%';
    particle.style.animationDuration = duration + 's';
    particle.style.animationDelay = delay + 's';
    
    container.appendChild(particle);
  }
}

function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  const speed = 200;
  
  counters.forEach(function(counter) {
    const target = +counter.getAttribute('data-target');
    const increment = target / speed;
    
    let current = 0;
    const updateCounter = function() {
      current += increment;
      if (current < target) {
        counter.textContent = Math.ceil(current) + '+';
        setTimeout(updateCounter, 20);
      } else {
        counter.textContent = target + '+';
      }
    };
    
    if (!counter.classList.contains('animated')) {
      counter.classList.add('animated');
      updateCounter();
    }
  });
}

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
