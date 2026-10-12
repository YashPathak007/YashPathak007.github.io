(() => {
  const root = document.documentElement;
  const body = document.body;
  root.classList.add('js');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const revealItems = [...document.querySelectorAll('.reveal')];

  revealItems.forEach((item, index) => {
    const requestedDelay = Number(item.dataset.revealDelay || 0);
    const delay = requestedDelay ? requestedDelay * 105 : Math.min(index * 42, 250);
    item.style.setProperty('--reveal-delay', `${delay}ms`);
  });

  if (!reducedMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -9% 0px', threshold: 0.08 });

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const progress = document.getElementById('scroll-progress');
  let ticking = false;
  const updateScrollProgress = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;
    if (progress) progress.style.height = `${ratio * 100}%`;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollProgress);
      ticking = true;
    }
  }, { passive: true });
  updateScrollProgress();

  const instrument = document.querySelector('[data-tilt]');
  if (instrument && !reducedMotion && finePointer) {
    const hero = document.querySelector('.hero');
    hero?.addEventListener('pointermove', (event) => {
      const bounds = hero.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
      root.style.setProperty('--pointer-x', `${x * 1.35}px`);
      root.style.setProperty('--pointer-y', `${y * 1.35}px`);
    });
    hero?.addEventListener('pointerleave', () => {
      root.style.setProperty('--pointer-x', '0px');
      root.style.setProperty('--pointer-y', '0px');
    });
  }

  const mapNodes = [...document.querySelectorAll('[data-node]')];
  const readoutIndex = document.getElementById('readout-index');
  const readoutState = document.getElementById('readout-state');
  const readoutName = document.getElementById('readout-name');
  const readoutRoute = document.getElementById('readout-route');
  const readoutDetail = document.getElementById('readout-detail');
  const readoutLink = document.getElementById('readout-link');

  const mapCopy = {
    breachwatch: {
      index: 'ACTIVE THREAD / 01', state: 'AUDITABLE', name: 'BreachWatch', route: 'telemetry → rule → decision', detail: 'A security operations workspace that turns noisy telemetry into a decision trail.', link: '#breachwatch'
    },
    cipherlink: {
      index: 'ACTIVE THREAD / 02', state: 'PRIVATE', name: 'CipherLink', route: 'byte → encrypt → choose', detail: 'A private exchange that makes sharing policy visible before a link exists.', link: '#cipherlink'
    },
    frametrace: {
      index: 'ACTIVE THREAD / 03', state: 'BOUNDED', name: 'FrameTrace', route: 'file → signal → report', detail: 'A media evidence lab that separates measured signals from a confidence claim.', link: '#frametrace'
    }
  };

  const activateMapNode = (node) => {
    const copy = mapCopy[node.dataset.node];
    if (!copy) return;
    mapNodes.forEach((candidate) => candidate.setAttribute('aria-pressed', String(candidate === node)));
    if (readoutIndex) readoutIndex.textContent = copy.index;
    if (readoutState) readoutState.textContent = copy.state;
    if (readoutName) readoutName.textContent = copy.name;
    if (readoutRoute) readoutRoute.textContent = copy.route;
    if (readoutDetail) readoutDetail.textContent = copy.detail;
    if (readoutLink) {
      readoutLink.href = copy.link;
      readoutLink.innerHTML = `Inspect artifact <span aria-hidden="true">↘</span>`;
    }
  };

  mapNodes.forEach((node) => node.addEventListener('click', () => activateMapNode(node)));

  if (finePointer && !reducedMotion) {
    const cursorRing = document.querySelector('.cursor-ring');
    const cursorDot = document.querySelector('.cursor-dot');
    let cursorFrame = 0;
    let mouseX = -100;
    let mouseY = -100;
    let ringX = mouseX;
    let ringY = mouseY;
    const renderCursor = () => {
      ringX += (mouseX - ringX) * 0.14;
      ringY += (mouseY - ringY) * 0.14;
      if (cursorRing) cursorRing.style.transform = `translate3d(${ringX - 17}px, ${ringY - 17}px, 0)`;
      if (cursorDot) cursorDot.style.transform = `translate3d(${mouseX - 2}px, ${mouseY - 2}px, 0)`;
      cursorFrame = window.requestAnimationFrame(renderCursor);
    };
    window.addEventListener('pointermove', (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      body.classList.add('has-pointer');
    }, { passive: true });
    document.querySelectorAll('a, button').forEach((interactive) => {
      interactive.addEventListener('pointerenter', () => body.classList.add('is-hovering'));
      interactive.addEventListener('pointerleave', () => body.classList.remove('is-hovering'));
    });
    window.addEventListener('blur', () => body.classList.remove('has-pointer', 'is-hovering'));
    renderCursor();
    window.addEventListener('beforeunload', () => window.cancelAnimationFrame(cursorFrame), { once: true });
  }

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
