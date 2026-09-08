// ============================================
// Felipe Yoshida — Portfolio interactions
// ============================================

// Marca que o JS carregou: só a partir daqui o CSS aplica a animação de
// entrada (.reveal). Sem isso, se o script falhar ao carregar, o conteúdo
// continua visível normalmente.
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {

  /* Ano no rodapé */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Tema claro/escuro, com preferência salva */
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    root.setAttribute('data-theme', 'light');
  }

  themeToggle?.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  /* Menu mobile */
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');

  const closeMobileMenu = ({ focusToggle = false } = {}) => {
    mainNav?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    if (focusToggle) menuToggle?.focus();
  };

  menuToggle?.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => closeMobileMenu());
  });

  /* Fecha o menu mobile ao pressionar Esc ou ao clicar fora dele */
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mainNav?.classList.contains('is-open')) {
      closeMobileMenu({ focusToggle: true });
    }
  });

  document.addEventListener('click', (event) => {
    if (!mainNav?.classList.contains('is-open')) return;
    const clickedInsideNav = mainNav.contains(event.target);
    const clickedToggle = menuToggle?.contains(event.target);
    if (!clickedInsideNav && !clickedToggle) closeMobileMenu();
  });

  /* Destaca no menu a seção que está sendo visualizada (scrollspy) */
  const navLinks = Array.from(mainNav?.querySelectorAll('a[href^="#"]') || []);
  const sections = navLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const link = navLinks.find(a => a.getAttribute('href') === `#${entry.target.id}`);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach(a => a.classList.remove('active'));
          link.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(section => spyObserver.observe(section));
  }

  /* Botão "voltar ao topo" */
  const backToTop = document.getElementById('back-to-top');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (backToTop) {
    backToTop.hidden = false;
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('is-shown', window.scrollY > 600);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* Animações de entrada ao rolar a página, em cascata dentro de cada grid */
  const revealEls = document.querySelectorAll('.reveal');

  document.querySelectorAll('.services-grid, .work-grid, .figma-grid, .timeline, .cert-list').forEach(grid => {
    Array.from(grid.children).forEach((child, i) => {
      child.style.setProperty('--stagger-i', i);
    });
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* Barra de progresso de leitura no topo da página */
  const scrollProgress = document.getElementById('scroll-progress');
  if (scrollProgress) {
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      scrollProgress.style.width = `${pct}%`;
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();
  }

});
