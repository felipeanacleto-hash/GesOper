// Sistema de navegação aprimorado
class NavigationSystem {
  constructor() {
    this.init();
  }

  init() {
    this.setupMenuToggle();
    this.setupActiveStates();
    this.setupSmoothScrolling();
    this.setupKeyboardNavigation();
  }

  setupMenuToggle() {
    const menuButtons = document.querySelectorAll('.menu-button[data-submenu]');
    
    menuButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleSubmenu(button.dataset.submenu);
      });
    });
  }

  toggleSubmenu(submenuId) {
    const submenu = document.getElementById(submenuId);
    const button = document.querySelector(`[data-submenu="${submenuId}"]`);
    const arrow = button.querySelector('.arrow');
    
    if (!submenu) return;

    const isOpen = submenu.classList.contains('show');
    
    // Fechar outros submenus
    document.querySelectorAll('.submenu.show').forEach(menu => {
      if (menu.id !== submenuId) {
        menu.classList.remove('show');
        const otherButton = document.querySelector(`[data-submenu="${menu.id}"]`);
        if (otherButton) {
          otherButton.classList.remove('active');
          const otherArrow = otherButton.querySelector('.arrow');
          if (otherArrow) otherArrow.classList.remove('rotated');
        }
      }
    });

    // Toggle do submenu atual
    if (isOpen) {
      submenu.classList.remove('show');
      button.classList.remove('active');
      if (arrow) arrow.classList.remove('rotated');
    } else {
      submenu.classList.add('show');
      button.classList.add('active');
      if (arrow) arrow.classList.add('rotated');
    }
  }

  setupActiveStates() {
    const currentPath = window.location.pathname;
    const menuLinks = document.querySelectorAll('.submenu a, .menu-button a');
    
    menuLinks.forEach(link => {
      const linkPath = new URL(link.href).pathname;
      if (currentPath.includes(linkPath) && linkPath !== '/') {
        link.classList.add('active');
        
        // Se for um link de submenu, abrir o submenu pai
        const submenu = link.closest('.submenu');
        if (submenu) {
          submenu.classList.add('show');
          const button = document.querySelector(`[data-submenu="${submenu.id}"]`);
          if (button) {
            button.classList.add('active');
            const arrow = button.querySelector('.arrow');
            if (arrow) arrow.classList.add('rotated');
          }
        }
      }
    });
  }

  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // ESC para fechar submenus
      if (e.key === 'Escape') {
        document.querySelectorAll('.submenu.show').forEach(submenu => {
          submenu.classList.remove('show');
          const button = document.querySelector(`[data-submenu="${submenu.id}"]`);
          if (button) {
            button.classList.remove('active');
            const arrow = button.querySelector('.arrow');
            if (arrow) arrow.classList.remove('rotated');
          }
        });
      }
    });
  }
}

// Utilitários
const Utils = {
  // Debounce para otimizar eventos
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Animação de fade in para elementos
  fadeIn(element, duration = 300) {
    element.style.opacity = 0;
    element.style.display = 'block';
    
    const start = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      
      element.style.opacity = progress;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  },

  // Loading state
  setLoading(element, isLoading) {
    if (isLoading) {
      element.classList.add('loading');
    } else {
      element.classList.remove('loading');
    }
  }
};

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  new NavigationSystem();
  
  // Adicionar animação de entrada aos cards
  const cards = document.querySelectorAll('.content-card');
  cards.forEach((card, index) => {
    setTimeout(() => {
      Utils.fadeIn(card, 400);
    }, index * 100);
  });
});

// Exportar para uso global
window.NavigationSystem = NavigationSystem;
window.Utils = Utils;