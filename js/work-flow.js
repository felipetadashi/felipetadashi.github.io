// ============================================
// Trabalhos "Conecte os cases" — diagrama arrastável (2a)
// ============================================
// Nó de perfil (fixo, não é um case) ligado aos 4 nós de case por setas,
// com a mesma mecânica de arraste/reescala de hero-flow.js. Clicar (ou
// focar + Enter/Espaço) em um nó de case marca ele como ativo e atualiza
// o painel de preview ao lado — imagem, categoria, descrição e o link
// real pro case, igual ao que já existe no .work-grid estático abaixo
// (que continua sendo a navegação principal/acessível; esta seção some
// em telas estreitas, ver @media em style.css).

(function () {
  const STAGE_W = 1200;
  const STAGE_H = 460;
  const NODE_W = 260;
  const NODE_H = 92;
  const BOUND_X = STAGE_W - NODE_W; // 940
  const BOUND_Y = STAGE_H - NODE_H; // 368
  const MOBILE_BREAKPOINT = 860;

  // índice 0 = nó de perfil; 1-4 = cases, na mesma ordem do .work-grid.
  const NODES = [
    { x: 40, y: 192 },
    { x: 840, y: 16 },
    { x: 840, y: 133 },
    { x: 840, y: 251 },
    { x: 840, y: 368 },
  ];
  const EDGES = [[0, 1], [0, 2], [0, 3], [0, 4]];

  const CASE_META = {
    1: { href: 'trabalhos/projeto-01.html', img: 'assets/projects/projeto-01-card.jpg' },
    2: { href: 'trabalhos/projeto-04.html', img: 'assets/projects/projeto-04-card.jpg' },
    3: { href: 'trabalhos/projeto-05.html', img: 'assets/projects/projeto-05-card.jpg' },
    4: { href: 'trabalhos/projeto-06.html', img: 'assets/projects/projeto-06-card.jpg' },
  };

  // Cópia local das strings do painel de preview (conteúdo gerado via JS,
  // não data-i18n) — mesmo texto já usado no .work-grid estático, pra não
  // divergir. Mesmo padrão de survey-compare.js / workflow-builder.js.
  const TXT = {
    pt: {
      linkLabel: 'Ver case study →',
      cases: {
        1: {
          cat: 'UX Research · Formulários',
          title: 'Single Page Survey',
          desc: 'Como trocar formulários de feedback em múltiplas páginas por uma pesquisa em página única, mais rápida e intuitiva para o cliente responder.',
        },
        2: {
          cat: 'Design Systems · Conversacional',
          title: 'Design System',
          desc: 'Minha contribuição contínua para o Design System de experiências conversacionais da empresa — construído do zero com o time e usado no dia a dia.',
        },
        3: {
          cat: 'UX Writing · Conversacional',
          title: 'Time Brasil no WhatsApp',
          desc: 'UX Writing e engenharia de conversas para o chatbot oficial do COB e da Meta nos Jogos de Paris 2024.',
        },
        4: {
          cat: 'Product Design · Automação conversacional',
          title: 'Workflow Builder',
          desc: 'Painel pra gerenciar jornadas, workflows, intenções e variáveis de automações no WhatsApp — da biblioteca de assets até a publicação segura em produção.',
        },
      },
    },
    en: {
      linkLabel: 'View case study →',
      cases: {
        1: {
          cat: 'UX Research · Forms',
          title: 'Single Page Survey',
          desc: "Turning a multi-page feedback form into a single-page survey that's faster and more intuitive for customers to fill out.",
        },
        2: {
          cat: 'Design Systems · Conversational',
          title: 'Design System',
          desc: "My ongoing contribution to the company's Design System for conversational experiences — built from scratch with the team and used day to day.",
        },
        3: {
          cat: 'UX Writing · Conversational',
          title: 'Time Brasil on WhatsApp',
          desc: 'UX writing and conversation engineering for the official COB and Meta chatbot at the Paris 2024 Games.',
        },
        4: {
          cat: 'Product Design · Conversational automation',
          title: 'Workflow Builder',
          desc: 'A panel for managing journeys, workflows, intents and variables for WhatsApp automations — from the asset library to safely publishing to production.',
        },
      },
    },
  };

  function currentLang() {
    return document.documentElement.lang === 'en' ? 'en' : 'pt';
  }
  function copy() {
    return TXT[currentLang()];
  }

  let activeCase = 1;

  function renderPreview() {
    const el = document.getElementById('wflow-preview');
    if (!el) return;
    const c = copy().cases[activeCase];
    const meta = CASE_META[activeCase];
    if (!c || !meta) return;
    el.innerHTML = '';

    const thumb = document.createElement('div');
    thumb.className = 'wflow-preview-thumb';
    thumb.style.backgroundImage = `url('${meta.img}')`;
    thumb.setAttribute('aria-hidden', 'true');

    const cat = document.createElement('span');
    cat.className = 'wflow-preview-cat';
    cat.textContent = c.cat;

    const title = document.createElement('h4');
    title.className = 'wflow-preview-title';
    title.textContent = c.title;

    const desc = document.createElement('p');
    desc.className = 'wflow-preview-desc';
    desc.textContent = c.desc;

    const link = document.createElement('a');
    link.className = 'wflow-preview-link';
    link.href = meta.href;
    link.textContent = copy().linkLabel;

    el.append(thumb, cat, title, desc, link);
  }

  function setActive(caseIdx, nodeEls) {
    if (!CASE_META[caseIdx]) return;
    activeCase = caseIdx;
    nodeEls.forEach((el) => {
      const isThis = Number(el.dataset.case) === caseIdx;
      el.classList.toggle('is-active', isThis);
      if (el.getAttribute('role') === 'button') el.setAttribute('aria-pressed', String(isThis));
    });
    renderPreview();
  }

  document.addEventListener('DOMContentLoaded', () => {
    const scaler = document.getElementById('wflow-scaler');
    const stage = document.getElementById('wflow-stage');
    if (!scaler || !stage) return;

    const nodeEls = Array.from(stage.querySelectorAll('.wflow-node'));
    const edgeEls = Array.from(stage.querySelectorAll('.wflow-edges path'));
    const state = NODES.map((n) => ({ ...n }));

    function placeNode(i) {
      nodeEls[i].style.left = state[i].x + 'px';
      nodeEls[i].style.top = state[i].y + 'px';
    }
    function edgePath(a, b) {
      const x1 = a.x + NODE_W;
      const y1 = a.y + NODE_H / 2;
      const x2 = b.x;
      const y2 = b.y + NODE_H / 2;
      const c = Math.max(60, Math.abs(x2 - x1) / 2);
      return `M${x1} ${y1} C${x1 + c} ${y1}, ${x2 - c} ${y2}, ${x2} ${y2}`;
    }
    function redrawEdges() {
      EDGES.forEach(([a, b], i) => {
        if (edgeEls[i]) edgeEls[i].setAttribute('d', edgePath(state[a], state[b]));
      });
    }
    state.forEach((_, i) => placeNode(i));
    redrawEdges();
    setActive(1, nodeEls);

    /* ---------- Escala responsiva (só acima do breakpoint mobile) ---------- */
    function isMobileLayout() {
      return window.innerWidth <= MOBILE_BREAKPOINT;
    }
    function rescale() {
      if (isMobileLayout()) {
        stage.style.transform = '';
        scaler.style.height = '';
        return;
      }
      const w = scaler.clientWidth;
      const scale = Math.min(1, w / STAGE_W);
      stage.style.transform = `scale(${scale})`;
      scaler.style.height = Math.round(STAGE_H * scale) + 'px';
    }
    rescale();
    window.addEventListener('resize', rescale);

    /* ---------- Arrastar nós (mouse + touch via Pointer Events) ---------- */
    let drag = null;

    function currentScale() {
      const rect = stage.getBoundingClientRect();
      return rect.width / STAGE_W || 1;
    }

    nodeEls.forEach((el, i) => {
      const caseIdx = Number(el.dataset.case);

      el.addEventListener('pointerdown', (e) => {
        if (isMobileLayout()) return;
        if (caseIdx > 0) setActive(caseIdx, nodeEls);
        el.setPointerCapture(e.pointerId);
        drag = { i, pointerId: e.pointerId, startX: e.clientX, startY: e.clientY, origX: state[i].x, origY: state[i].y };
        el.classList.add('is-dragging');
        e.preventDefault();
      });

      if (el.getAttribute('role') === 'button') {
        el.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            setActive(caseIdx, nodeEls);
          }
        });
      }
    });

    window.addEventListener('pointermove', (e) => {
      if (!drag || drag.pointerId !== e.pointerId) return;
      const scale = currentScale();
      const dx = (e.clientX - drag.startX) / scale;
      const dy = (e.clientY - drag.startY) / scale;
      state[drag.i].x = Math.max(0, Math.min(BOUND_X, drag.origX + dx));
      state[drag.i].y = Math.max(0, Math.min(BOUND_Y, drag.origY + dy));
      placeNode(drag.i);
      redrawEdges();
    });

    function endDrag(e) {
      if (!drag || (e && e.pointerId !== undefined && e.pointerId !== drag.pointerId)) return;
      nodeEls[drag.i].classList.remove('is-dragging');
      drag = null;
    }
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);

    document.addEventListener('langchange', renderPreview);
  });
})();
