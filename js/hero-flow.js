// ============================================
// Hero "Fluxo vivo" — diagrama de processo arrastável (header 1c)
// ============================================
// Artboard fixo de 1280x760 (mesmas coordenadas do handoff de design).
// Em telas largas, a seção inteira é escalada via transform: scale() pra
// caber na largura disponível sem nunca distorcer a proporção nem crescer
// além do tamanho original. Abaixo de 860px o CSS troca pra uma pilha
// estática simples (ver @media em style.css) e este script não tenta mexer
// em posição/escala.

(function () {
  const STAGE_W = 1280;
  const STAGE_H = 760;
  const NODE_W = 176;
  const NODE_H = 72;
  const BOUND_X = STAGE_W - NODE_W; // 1104
  const BOUND_Y = STAGE_H - NODE_H; // 688
  const MOBILE_BREAKPOINT = 860;

  // Posições iniciais dos 7 nós (x, y do canto superior-esquerdo do card),
  // exatamente como especificado no handoff.
  const NODES = [
    { x: 470, y: 120 },
    { x: 720, y: 70 },
    { x: 720, y: 250 },
    { x: 980, y: 150 },
    { x: 1010, y: 340 },
    { x: 760, y: 440 },
    { x: 1040, y: 560 },
  ];

  // Pares [origem, destino]; os índices 4, 6 e 7 são as conexões "vivas"
  // (tracejado laranja animado) — o resto é estático.
  const EDGES = [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [2, 5], [4, 6], [5, 6]];

  function edgePath(a, b) {
    const x1 = a.x + NODE_W;
    const y1 = a.y + NODE_H / 2;
    const x2 = b.x;
    const y2 = b.y + NODE_H / 2;
    const c = Math.max(70, Math.abs(x2 - x1) / 2);
    return `M${x1} ${y1} C${x1 + c} ${y1}, ${x2 - c} ${y2}, ${x2} ${y2}`;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const scaler = document.getElementById('flow-scaler');
    const stage = document.getElementById('flow-stage');
    if (!scaler || !stage) return;

    const nodeEls = Array.from(stage.querySelectorAll('.flow-node'));
    const edgeEls = Array.from(stage.querySelectorAll('.flow-edges path'));
    const state = NODES.map((n) => ({ ...n }));

    function placeNode(i) {
      nodeEls[i].style.left = state[i].x + 'px';
      nodeEls[i].style.top = state[i].y + 'px';
    }
    function redrawEdges() {
      EDGES.forEach(([a, b], i) => {
        if (edgeEls[i]) edgeEls[i].setAttribute('d', edgePath(state[a], state[b]));
      });
    }
    state.forEach((_, i) => placeNode(i));
    redrawEdges();

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
      el.addEventListener('pointerdown', (e) => {
        if (isMobileLayout()) return; // nós ficam ocultos nessa largura
        el.setPointerCapture(e.pointerId);
        drag = { i, pointerId: e.pointerId, startX: e.clientX, startY: e.clientY, origX: state[i].x, origY: state[i].y };
        el.classList.add('is-dragging');
        e.preventDefault();
      });
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
  });
})();
