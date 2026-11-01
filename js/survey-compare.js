// ============================================
// Comparador interativo "várias páginas × página única"
// (case Single Page Survey — trabalhos/projeto-01.html)
// ============================================
// Dois mockups de celular jogáveis de verdade, lado a lado: o da esquerda
// recria o formulário antigo (uma pergunta por página, com "carregamento"
// simulado entre elas); o da direita recria a pesquisa em página única
// (cartões empilhados, avançando sozinho a cada resposta). Um placar
// acompanha cliques, telas carregadas e tempo de cada lado, e mostra um
// veredito assim que os dois forem concluídos.
//
// Texto roteirizado em PT/EN aqui mesmo (o conteúdo das telas é gerado
// dinamicamente, não dá pra cobrir só com data-i18n); o título da seção,
// as legendas do placar e o botão de recomeçar seguem via data-i18n normal
// e esta tela some/reaparece sozinha ao trocar de idioma (ver "langchange").

(function () {
  const Q = [
    {
      k: 'nps',
      type: 'scale',
      t: { pt: 'De 0 a 10, quanto você nos recomendaria?', en: 'From 0 to 10, how likely are you to recommend us?' },
      opts: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    },
    {
      k: 'emo',
      type: 'emoji',
      t: { pt: 'Como foi sua experiência hoje?', en: 'How was your experience today?' },
      opts: ['😡', '😕', '😐', '🙂', '😍'],
    },
    {
      k: 'srv',
      type: 'check',
      t: { pt: 'Quais serviços você usou?', en: 'Which services did you use?' },
      opts: {
        pt: ['Entrega', 'Suporte', 'App', 'Loja física'],
        en: ['Delivery', 'Support', 'App', 'Physical store'],
      },
    },
    {
      k: 'star',
      type: 'star',
      t: { pt: 'Que nota você dá pro atendimento?', en: 'What rating would you give the support?' },
      opts: ['1', '2', '3', '4', '5'],
    },
  ];

  const ADV_DELAY = 380; // avanço automático (página única) após responder
  const LOAD_DELAY = 650; // "carregamento" simulado (várias páginas)

  const TXT = {
    pt: {
      titleA: 'Pesquisa de satisfação',
      titleB: 'Pesquisa rápida',
      pageLabel: (n) => `Página ${n} de 4`,
      doneMeta: 'Concluído',
      countLabel: (n, total) => `${n} de ${total}`,
      questionLabel: (n) => `PERGUNTA ${n} DE 4`,
      readyLabel: 'PRONTO',
      readyText: 'Era isso. Obrigado pelo tempo!',
      sendHint: 'Quatro perguntas, nenhuma página nova.',
      sendCta: 'Enviar respostas',
      backLabel: 'Voltar',
      nextLabel: 'Avançar',
      sendLabel: 'Enviar',
      continueLabel: 'Continuar ↓',
      loadingText: 'carregando página…',
      doneTitle: 'Obrigado!',
      doneSub: 'Resposta enviada.',
      verdictStart: 'Comece por qualquer lado. Dica: o formato antigo pede um "Avançar" e uma página nova a cada pergunta.',
      verdictContinue: 'Agora responda o outro formato pra comparar.',
      verdictTie: 'Empate técnico! Você foi rápido nos dois. Mesmo assim, a página única não te fez esperar nenhuma página carregar.',
      verdictWin: (dClicks, loadsSaved, dTime) =>
        `Página única: ${dClicks} cliques, ${loadsSaved} carregamentos e ${dTime}s a menos — com as mesmas respostas.`,
    },
    en: {
      titleA: 'Satisfaction survey',
      titleB: 'Quick survey',
      pageLabel: (n) => `Page ${n} of 4`,
      doneMeta: 'Done',
      countLabel: (n, total) => `${n} of ${total}`,
      questionLabel: (n) => `QUESTION ${n} OF 4`,
      readyLabel: 'READY',
      readyText: "That's it. Thanks for your time!",
      sendHint: 'Four questions, zero new pages.',
      sendCta: 'Submit answers',
      backLabel: 'Back',
      nextLabel: 'Next',
      sendLabel: 'Submit',
      continueLabel: 'Continue ↓',
      loadingText: 'loading page…',
      doneTitle: 'Thank you!',
      doneSub: 'Response submitted.',
      verdictStart: 'Start on either side. Hint: the old format needs a "Next" click and a new page for every question.',
      verdictContinue: 'Now try the other format to compare.',
      verdictTie: "Technical tie! You were fast on both. Still, the single page never made you wait for a page to load.",
      verdictWin: (dClicks, loadsSaved, dTime) =>
        `Single page: ${dClicks} fewer clicks, ${loadsSaved} fewer loads and ${dTime}s faster — with the same answers.`,
    },
  };

  function currentLang() {
    return document.documentElement.lang === 'en' ? 'en' : 'pt';
  }
  function copy() {
    return TXT[currentLang()];
  }
  function qText(q) {
    return q.t[currentLang()];
  }
  function qOpts(q) {
    return Array.isArray(q.opts) ? q.opts : q.opts[currentLang()];
  }
  function answered(q, v) {
    return q.type === 'check' ? !!(v && v.length) : v != null;
  }
  function freshSide() {
    return { step: 0, ans: {}, clicks: 0, loads: 1, t0: null, t1: null, loading: false };
  }

  document.addEventListener('DOMContentLoaded', () => {
    const section = document.querySelector('.survey-demo');
    const phoneA = document.getElementById('svy-phone-a');
    const phoneB = document.getElementById('svy-phone-b');
    if (!section || !phoneA || !phoneB) return;

    const elClicksA = document.getElementById('svy-clicks-a');
    const elClicksB = document.getElementById('svy-clicks-b');
    const elLoadsA = document.getElementById('svy-loads-a');
    const elLoadsB = document.getElementById('svy-loads-b');
    const elTimeA = document.getElementById('svy-time-a');
    const elTimeB = document.getElementById('svy-time-b');
    const verdictEl = document.getElementById('svy-verdict');
    const resetBtn = document.getElementById('svy-reset');

    let a = freshSide();
    let b = freshSide();
    let timers = [];
    let tickId = null;

    function later(fn, ms) {
      timers.push(setTimeout(fn, ms));
    }
    function clearTimers() {
      timers.forEach(clearTimeout);
      timers = [];
    }
    function ensureTick() {
      if (tickId) return;
      tickId = setInterval(() => {
        if ((a.t0 && !a.t1) || (b.t0 && !b.t1)) {
          renderStats();
        } else {
          clearInterval(tickId);
          tickId = null;
        }
      }, 100);
    }
    function click(side) {
      side.clicks++;
      if (!side.t0) side.t0 = Date.now();
      ensureTick();
    }
    function secs(side) {
      if (!side.t0) return '—';
      const end = side.t1 || Date.now();
      return ((end - side.t0) / 1000).toFixed(1) + 's';
    }
    function setAnswer(side, q, value) {
      if (q.type === 'check') {
        const arr = side.ans[q.k] ? side.ans[q.k].slice() : [];
        const idx = arr.indexOf(value);
        if (idx >= 0) arr.splice(idx, 1);
        else arr.push(value);
        side.ans[q.k] = arr;
      } else {
        side.ans[q.k] = value;
      }
    }

    function renderStats() {
      const c = copy();
      elClicksA.textContent = String(a.clicks);
      elClicksB.textContent = String(b.clicks);
      elLoadsA.textContent = String(a.loads);
      elLoadsB.textContent = String(b.loads);
      elTimeA.textContent = secs(a);
      elTimeB.textContent = secs(b);

      const both = a.t1 && b.t1;
      let text = c.verdictStart;
      let ready = false;
      if (both) {
        const dClicks = a.clicks - b.clicks;
        const dTime = (a.t1 - a.t0 - (b.t1 - b.t0)) / 1000;
        if (dClicks > 0 || dTime > 0) {
          text = c.verdictWin(Math.max(dClicks, 0), Math.max(a.loads - 1, 0), Math.max(dTime, 0).toFixed(1));
          ready = true;
        } else {
          text = c.verdictTie;
          ready = true;
        }
      } else if (a.t1 || b.t1) {
        text = c.verdictContinue;
      }
      verdictEl.textContent = text;
      verdictEl.classList.toggle('is-ready', ready);
    }

    // ---------- Construtores de opção (compartilhados entre os dois lados) ----------

    function buildOptionsScale(q, selected, onPick) {
      const wrap = document.createElement('div');
      wrap.className = 'survey-demo-opts-scale';
      const vals = qOpts(q).concat(['']);
      vals.forEach((label) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        if (label === '') {
          btn.className = 'survey-demo-opt-scale is-blank';
          btn.disabled = true;
          btn.tabIndex = -1;
        } else {
          const on = String(selected) === label;
          btn.className = 'survey-demo-opt-scale' + (on ? ' is-on' : '');
          btn.textContent = label;
          btn.addEventListener('click', () => onPick(label));
        }
        wrap.appendChild(btn);
      });
      return wrap;
    }

    function buildOptionsEmoji(q, selected, onPick) {
      const wrap = document.createElement('div');
      wrap.className = 'survey-demo-opts-emoji';
      qOpts(q).forEach((label) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        const on = selected === label;
        btn.className = 'survey-demo-opt-emoji' + (on ? ' is-on' : '');
        btn.textContent = label;
        btn.addEventListener('click', () => onPick(label));
        wrap.appendChild(btn);
      });
      return wrap;
    }

    function buildOptionsCheck(q, selectedArr, onPick) {
      const wrap = document.createElement('div');
      wrap.className = 'survey-demo-opts-check';
      qOpts(q).forEach((label) => {
        const on = !!(selectedArr && selectedArr.includes(label));
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'survey-demo-opt-check' + (on ? ' is-on' : '');
        const box = document.createElement('span');
        box.className = 'survey-demo-opt-check-box' + (on ? ' is-on' : '');
        btn.appendChild(box);
        const span = document.createElement('span');
        span.textContent = label;
        btn.appendChild(span);
        btn.addEventListener('click', () => onPick(label));
        wrap.appendChild(btn);
      });
      return wrap;
    }

    function buildOptionsStar(q, selected, onPick) {
      const wrap = document.createElement('div');
      wrap.className = 'survey-demo-opts-star';
      qOpts(q).forEach((label, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        const on = selected != null && i <= Number(selected) - 1;
        btn.className = 'survey-demo-opt-star' + (on ? ' is-on' : '');
        btn.textContent = '★';
        btn.setAttribute('aria-label', label);
        btn.addEventListener('click', () => onPick(label));
        wrap.appendChild(btn);
      });
      return wrap;
    }

    function buildOptions(q, selected, onPick) {
      if (q.type === 'scale') return buildOptionsScale(q, selected, onPick);
      if (q.type === 'emoji') return buildOptionsEmoji(q, selected, onPick);
      if (q.type === 'check') return buildOptionsCheck(q, selected, onPick);
      return buildOptionsStar(q, selected, onPick);
    }

    function buildCard(q, idx, selected, onPick) {
      const card = document.createElement('div');
      card.className = 'survey-demo-card';
      const num = document.createElement('span');
      num.className = 'survey-demo-card-num';
      num.textContent = copy().questionLabel(idx + 1);
      const qEl = document.createElement('span');
      qEl.className = 'survey-demo-card-q';
      qEl.textContent = qText(q);
      card.appendChild(num);
      card.appendChild(qEl);
      card.appendChild(buildOptions(q, selected, onPick));
      return card;
    }

    function buildDoneBlock(overlay) {
      const wrap = document.createElement('div');
      wrap.className = 'survey-demo-done' + (overlay ? ' is-overlay' : '');
      const h = document.createElement('span');
      h.className = 'survey-demo-done-title';
      h.textContent = copy().doneTitle;
      const p = document.createElement('span');
      p.className = 'survey-demo-done-sub';
      p.textContent = copy().doneSub;
      wrap.appendChild(h);
      wrap.appendChild(p);
      return wrap;
    }

    // ---------- Lado A: várias páginas ----------

    function pickA(q, value) {
      if (a.loading) return;
      click(a);
      setAnswer(a, q, value);
      renderA();
      renderStats();
    }

    function goA(delta) {
      if (a.loading) return;
      click(a);
      a.loading = true;
      renderA();
      later(() => {
        a.loading = false;
        a.step += delta;
        if (a.step === 4) a.t1 = Date.now();
        else a.loads++;
        renderA();
        renderStats();
      }, LOAD_DELAY);
    }

    function renderA() {
      const c = copy();
      phoneA.innerHTML = '';

      const header = document.createElement('div');
      header.className = 'survey-demo-phone-header';
      const title = document.createElement('span');
      title.className = 'survey-demo-phone-title';
      title.textContent = c.titleA;
      const meta = document.createElement('span');
      meta.className = 'survey-demo-phone-meta';
      meta.textContent = a.step < 4 ? c.pageLabel(a.step + 1) : c.doneMeta;
      const row = document.createElement('div');
      row.className = 'survey-demo-phone-title-row';
      row.appendChild(title);
      row.appendChild(meta);
      header.appendChild(row);
      phoneA.appendChild(header);

      const body = document.createElement('div');
      body.className = 'survey-demo-phone-body';

      if (a.loading) {
        const loading = document.createElement('div');
        loading.className = 'survey-demo-loading';
        const box = document.createElement('div');
        box.className = 'survey-demo-loading-box';
        const txt = document.createElement('span');
        txt.className = 'survey-demo-loading-text';
        txt.textContent = c.loadingText;
        loading.appendChild(box);
        loading.appendChild(txt);
        body.appendChild(loading);
      } else if (a.step < 4) {
        const q = Q[a.step];
        body.appendChild(buildCard(q, a.step, a.ans[q.k], (val) => pickA(q, val)));
      } else {
        body.appendChild(buildDoneBlock(false));
      }
      phoneA.appendChild(body);

      if (a.step < 4) {
        const nav = document.createElement('div');
        nav.className = 'survey-demo-nav';

        const back = document.createElement('button');
        back.type = 'button';
        const backActive = a.step > 0 && !a.loading;
        back.className = 'survey-demo-nav-btn' + (backActive ? ' is-active' : '');
        back.textContent = c.backLabel;
        back.disabled = !backActive;
        back.addEventListener('click', () => goA(-1));

        const q = Q[a.step];
        const next = document.createElement('button');
        next.type = 'button';
        const nextReady = answered(q, a.ans[q.k]) && !a.loading;
        next.className = 'survey-demo-nav-btn is-primary' + (nextReady ? ' is-ready' : '');
        next.textContent = a.step === 3 ? c.sendLabel : c.nextLabel;
        next.disabled = !nextReady;
        next.addEventListener('click', () => goA(1));

        nav.appendChild(back);
        nav.appendChild(next);
        phoneA.appendChild(nav);
      }
    }

    // ---------- Lado B: página única ----------

    function pickB(q, idx, value) {
      click(b);
      setAnswer(b, q, value);
      renderB();
      renderStats();
      if (q.type !== 'check') {
        later(() => {
          if (b.step === idx) {
            b.step = idx + 1;
            renderB();
          }
        }, ADV_DELAY);
      }
    }

    function continueB(idx) {
      if (b.step !== idx) return;
      const q = Q[idx];
      if (!answered(q, b.ans[q.k])) return;
      click(b);
      b.step = idx + 1;
      renderB();
      renderStats();
    }

    function sendB() {
      if (b.step !== Q.length || b.t1) return;
      click(b);
      b.t1 = Date.now();
      renderB();
      renderStats();
    }

    function renderB() {
      const c = copy();
      phoneB.innerHTML = '';

      const header = document.createElement('div');
      header.className = 'survey-demo-phone-header';
      const row = document.createElement('div');
      row.className = 'survey-demo-phone-title-row';
      const title = document.createElement('span');
      title.className = 'survey-demo-phone-title';
      title.textContent = c.titleB;
      const meta = document.createElement('span');
      meta.className = 'survey-demo-phone-meta';
      meta.textContent = c.countLabel(Math.min(b.step, Q.length), Q.length);
      row.appendChild(title);
      row.appendChild(meta);
      header.appendChild(row);
      const track = document.createElement('div');
      track.className = 'survey-demo-progress';
      const bar = document.createElement('div');
      bar.className = 'survey-demo-progress-bar';
      bar.style.width = (Math.min(b.step, Q.length) / Q.length) * 100 + '%';
      track.appendChild(bar);
      header.appendChild(track);
      phoneB.appendChild(header);

      const bodyWrap = document.createElement('div');
      bodyWrap.className = 'survey-demo-phone-body is-stack';
      const stack = document.createElement('div');
      stack.className = 'survey-demo-stack';

      Q.forEach((q, idx) => {
        const card = buildCard(q, idx, b.ans[q.k], (val) => pickB(q, idx, val));
        card.classList.toggle('is-dim', idx !== b.step);
        if (q.type === 'check') {
          const ready = answered(q, b.ans[q.k]);
          const cont = document.createElement('button');
          cont.type = 'button';
          cont.className = 'survey-demo-continue' + (ready ? ' is-ready' : '');
          cont.textContent = c.continueLabel;
          cont.disabled = !ready;
          cont.addEventListener('click', () => continueB(idx));
          card.appendChild(cont);
        }
        stack.appendChild(card);
      });

      const finalCard = document.createElement('div');
      finalCard.className = 'survey-demo-card' + (b.step !== Q.length ? ' is-dim' : '');
      const num = document.createElement('span');
      num.className = 'survey-demo-card-num';
      num.textContent = c.readyLabel;
      const qEl = document.createElement('span');
      qEl.className = 'survey-demo-card-q';
      qEl.textContent = c.readyText;
      finalCard.appendChild(num);
      finalCard.appendChild(qEl);
      if (!b.t1) {
        const hint = document.createElement('span');
        hint.className = 'survey-demo-hint';
        hint.textContent = c.sendHint;
        finalCard.appendChild(hint);
        const send = document.createElement('button');
        send.type = 'button';
        send.className = 'survey-demo-send';
        send.textContent = c.sendCta;
        send.addEventListener('click', sendB);
        finalCard.appendChild(send);
      }
      stack.appendChild(finalCard);
      bodyWrap.appendChild(stack);

      if (b.t1) {
        bodyWrap.appendChild(buildDoneBlock(true));
      }
      phoneB.appendChild(bodyWrap);

      requestAnimationFrame(() => {
        const idx = Math.min(b.step, Q.length);
        const activeEl = stack.children[idx];
        if (activeEl) stack.style.transform = `translateY(-${activeEl.offsetTop}px)`;
      });
    }

    function resetAll() {
      clearTimers();
      if (tickId) {
        clearInterval(tickId);
        tickId = null;
      }
      a = freshSide();
      b = freshSide();
      renderA();
      renderB();
      renderStats();
    }

    if (resetBtn) resetBtn.addEventListener('click', resetAll);

    document.addEventListener('langchange', () => {
      renderA();
      renderB();
      renderStats();
    });

    renderA();
    renderB();
    renderStats();
  });
})();
