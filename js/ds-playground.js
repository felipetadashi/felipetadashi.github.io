// ============================================
// "Design System playground" — componente de botão interativo (home)
// ============================================
// Cada grupo de pills (Variante/Tamanho/Estado/Ícone) é um role="radiogroup"
// navegável por teclado (setas/Home/End com roving tabindex). Clicar ou
// navegar atualiza o estado, e render() recalcula o componente de preview,
// as redlines de medida e o bloco de código — tudo client-side, sem
// depender de nenhuma lib. O texto estático (labels, pills) segue o
// sistema normal de data-i18n; só a legenda do stage ("Button / Primário /
// M / Padrão") e o código são montados aqui, porque são gerados
// dinamicamente a partir do estado atual.

(function () {
  const SIZES = {
    sm: { h: 32, px: 12, fs: 13 },
    md: { h: 44, px: 20, fs: 15 },
    lg: { h: 56, px: 28, fs: 17 },
  };

  // Mapa hex → nome de token — nomes de exemplo de um design system real
  // (troque pelos tokens do seu próprio DS quando for usar pra valer).
  const TOKEN_MAP = {
    '#FF5A1F': 'brand-500',
    '#E64A12': 'brand-600',
    '#111110': 'ink-900',
    '#FFE1D3': 'brand-100',
    '#D8D2C4': 'neutral-300',
    '#EFE8DA': 'paper',
    '#C2410C': 'brand-700',
    '#8E897E': 'neutral-500',
    transparent: 'none',
  };

  function colorsFor(variant, stateKey) {
    const hov = stateKey === 'hover';
    const dis = stateKey === 'disabled';
    let bg;
    let fg;
    let bd;
    if (variant === 'primary') {
      bg = hov ? '#E64A12' : '#FF5A1F';
      fg = '#111110';
      bd = bg;
    } else if (variant === 'secondary') {
      bg = hov ? '#111110' : 'transparent';
      fg = hov ? '#EFE8DA' : '#111110';
      bd = '#111110';
    } else {
      bg = hov ? '#FFE1D3' : 'transparent';
      fg = '#C2410C';
      bd = 'transparent';
    }
    if (dis) {
      fg = '#8E897E';
      if (variant === 'ghost') {
        bg = 'transparent';
        bd = 'transparent';
      } else {
        bg = variant === 'primary' ? '#D8D2C4' : 'transparent';
        bd = '#D8D2C4';
      }
    }
    return { bg, fg, bd };
  }

  function buildCode(variant, size, stateKey, icon, h, px, r, bg, fg) {
    return [
      ['<Button', ''],
      [`  variant="${variant}"`, ''],
      [`  size="${size}"`, ''],
      [`  state="${stateKey}"`, ''],
      [`  icon={${icon}} />`, ''],
      ['', ''],
      [`height: var(--size-${size}-h);`, `/* ${h}px */`],
      [`padding: 0 var(--space-${px / 4});`, `/* ${px}px */`],
      [`border-radius: var(--radius-${r === 20 ? 'pill' : 'md'});`, `/* ${r}px */`],
      [`background: var(--${TOKEN_MAP[bg]});`, `/* ${bg} */`],
      [`color: var(--${TOKEN_MAP[fg]});`, `/* ${fg} */`],
    ];
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const section = document.querySelector('.playground');
    const buttonEl = document.getElementById('pg-button');
    const iconEl = document.getElementById('pg-button-icon');
    const stageLabelEl = document.getElementById('pg-stage-label');
    const codeEl = document.getElementById('pg-code');
    const redlineH = document.getElementById('pg-redline-h');
    const redlineHLabel = document.getElementById('pg-redline-h-label');
    const redlinePx = document.getElementById('pg-redline-px');
    const redlinePxLabel = document.getElementById('pg-redline-px-label');
    const redlineRLabel = document.getElementById('pg-redline-r-label');
    if (!section || !buttonEl || !codeEl) return;

    const groups = Array.from(section.querySelectorAll('.playground-group'));
    if (!groups.length) return;

    const state = { variant: 'primary', size: 'md', stateKey: 'default', icon: true };

    function updateStateFromGroup(groupKey, value) {
      if (groupKey === 'variant') state.variant = value;
      else if (groupKey === 'size') state.size = value;
      else if (groupKey === 'state') state.stateKey = value;
      else if (groupKey === 'icon') state.icon = value === 'with';
    }

    function checkedText(groupKey) {
      const group = groups.find((g) => g.getAttribute('data-group') === groupKey);
      if (!group) return '';
      const checked = group.querySelector('.playground-pill[aria-checked="true"]');
      return checked ? checked.textContent : '';
    }

    function render() {
      const sizes = SIZES[state.size];
      const r = Math.min(20, sizes.h / 2);
      const { bg, fg, bd } = colorsFor(state.variant, state.stateKey);

      buttonEl.style.height = `${sizes.h}px`;
      buttonEl.style.padding = `0 ${sizes.px}px`;
      buttonEl.style.borderRadius = `${r}px`;
      buttonEl.style.fontSize = `${sizes.fs}px`;
      buttonEl.style.background = bg;
      buttonEl.style.color = fg;
      buttonEl.style.borderColor = bd;
      if (iconEl) iconEl.style.display = state.icon ? 'inline' : 'none';

      if (redlinePx) redlinePx.style.width = `${sizes.px}px`;
      if (redlineHLabel) redlineHLabel.textContent = String(sizes.h);
      if (redlinePxLabel) redlinePxLabel.textContent = `px ${sizes.px}`;
      if (redlineRLabel) redlineRLabel.textContent = `r ${r}`;
      // redlineH's height tracks the button automatically via CSS (top:0;bottom:0
      // inside a wrap that shrinks to the button's own size) — no JS needed there.
      void redlineH;

      if (stageLabelEl) {
        const variantText = checkedText('variant');
        const sizeText = checkedText('size');
        const stateText = checkedText('state');
        stageLabelEl.textContent = `Button / ${variantText} / ${sizeText} / ${stateText}`;
      }

      const lines = buildCode(state.variant, state.size, state.stateKey, state.icon, sizes.h, sizes.px, r, bg, fg);
      codeEl.innerHTML = lines
        .map(
          ([a, b]) =>
            `<div class="playground-code-line"><span class="playground-code-a">${escapeHtml(a)}</span><span class="playground-code-b">${escapeHtml(b)}</span></div>`
        )
        .join('');
    }

    function selectPill(group, pill) {
      const pills = Array.from(group.querySelectorAll('.playground-pill'));
      pills.forEach((p) => {
        const isChecked = p === pill;
        p.setAttribute('aria-checked', String(isChecked));
        p.tabIndex = isChecked ? 0 : -1;
      });
      updateStateFromGroup(group.getAttribute('data-group'), pill.getAttribute('data-value'));
      render();
    }

    groups.forEach((group) => {
      const pills = Array.from(group.querySelectorAll('.playground-pill'));
      pills.forEach((pill, idx) => {
        pill.addEventListener('click', () => {
          selectPill(group, pill);
        });
        pill.addEventListener('keydown', (event) => {
          let nextIdx = null;
          if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIdx = (idx + 1) % pills.length;
          else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIdx = (idx - 1 + pills.length) % pills.length;
          else if (event.key === 'Home') nextIdx = 0;
          else if (event.key === 'End') nextIdx = pills.length - 1;
          if (nextIdx !== null) {
            event.preventDefault();
            const nextPill = pills[nextIdx];
            selectPill(group, nextPill);
            nextPill.focus();
          }
        });
      });
    });

    // Textos das pills (ex.: "Primário"/"Secundário") mudam via data-i18n
    // quando o idioma é trocado — só precisamos remontar a legenda do
    // stage, que lê esse texto diretamente do DOM.
    document.addEventListener('langchange', () => {
      render();
    });

    render();
  });
})();
