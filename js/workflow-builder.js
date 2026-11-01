// ============================================
// Pipeline de publicação jogável (case Workflow Builder — trabalhos/projeto-06.html)
// ============================================
// Recria em miniatura o pipeline de 3 passos descrito no case (Destino →
// Pendências → Rollout, ver "Decisão 1" na página): clicar em "Publicar"
// valida cada passo em sequência; na primeira tentativa, o passo
// "Pendências" sempre encontra um bloqueio (igual ao exemplo real de
// anexo com URL inválida citado no case) e trava a publicação até a
// pessoa clicar em "Resolver". Um log no estilo console acumula cada
// evento, e um badge de ambiente muda de "rascunho" pra "produção" quando
// o pipeline termina com sucesso.
//
// Texto roteirizado em PT/EN aqui mesmo (conteúdo gerado dinamicamente);
// o título da seção, a introdução e o botão de recomeçar seguem via
// data-i18n normal (ver "langchange" no fim do arquivo).

(function () {
  const STEP_MS = 650;

  const STEPS = [
    { k: { pt: 'PASSO 1 · DESTINO', en: 'STEP 1 · TARGET' }, t: { pt: 'QA Externo selecionado', en: 'QA External selected' } },
    {
      k: { pt: 'PASSO 2 · PENDÊNCIAS', en: 'STEP 2 · BLOCKERS' },
      t: { pt: '1 bloqueio encontrado', en: '1 blocker found' },
      tFixed: { pt: 'Nenhum bloqueio restante', en: 'No blockers left' },
    },
    { k: { pt: 'PASSO 3 · ROLLOUT', en: 'STEP 3 · ROLLOUT' }, t: { pt: 'Imediato · todas as sessões', en: 'Immediate · all sessions' } },
  ];

  const TXT = {
    pt: {
      publish: 'Publicar',
      checking: 'Validando…',
      live: 'Publicado ✓',
      statusDraft: 'Pipeline pronto pra validação.',
      statusChecking: 'Validando cada passo do pipeline…',
      statusError: 'Bloqueio impediu a publicação. Nada foi pro ar.',
      statusLive: 'Publicado em QA Externo, sem bloqueios.',
      envDraft: 'rascunho · v8',
      envLive: 'QA Externo · v8',
      fix: 'Resolver',
      logStart: '> publicar "Lembrete de pagamento" → QA Externo',
      logStep1: '✓ Destino: QA Externo selecionado',
      logStep2Error: "✕ Pendências: anexo \"Comprovante de pagamento\" com URL inválida — publicação bloqueada",
      logFixed: '~ bloqueio resolvido: URL do anexo atualizada',
      logStep2Ok: '✓ Pendências: nenhum bloqueio restante',
      logStep3: '✓ Rollout: imediato, todas as sessões',
      logDone: '✓ publicado em QA Externo · 0 bloqueios',
    },
    en: {
      publish: 'Publish',
      checking: 'Validating…',
      live: 'Published ✓',
      statusDraft: 'Pipeline ready for validation.',
      statusChecking: 'Validating every step of the pipeline…',
      statusError: 'A blocker stopped the publish. Nothing went live.',
      statusLive: 'Published to QA External, no blockers.',
      envDraft: 'draft · v8',
      envLive: 'QA External · v8',
      fix: 'Fix it',
      logStart: '> publish "Payment reminder" → QA External',
      logStep1: '✓ Target: QA External selected',
      logStep2Error: '✕ Blockers: attachment "Payment receipt" has an invalid URL — publish blocked',
      logFixed: '~ blocker resolved: attachment URL updated',
      logStep2Ok: '✓ Blockers: none left',
      logStep3: '✓ Rollout: immediate, all sessions',
      logDone: '✓ published to QA External · 0 blockers',
    },
  };

  function currentLang() {
    return document.documentElement.lang === 'en' ? 'en' : 'pt';
  }
  function copy() {
    return TXT[currentLang()];
  }
  function fresh() {
    return { phase: 'draft', stepStatus: [0, 0, 0], fixed: false, log: [] };
  }

  document.addEventListener('DOMContentLoaded', () => {
    const stepsEl = document.getElementById('wf-steps');
    const logEl = document.getElementById('wf-log');
    const publishBtn = document.getElementById('wf-publish');
    const statusEl = document.getElementById('wf-status');
    const envEl = document.getElementById('wf-env');
    const resetBtn = document.getElementById('wf-reset');
    if (!stepsEl || !logEl || !publishBtn) return;

    let state = fresh();
    let timers = [];

    function later(fn, ms) {
      timers.push(setTimeout(fn, ms));
    }
    function clearTimers() {
      timers.forEach(clearTimeout);
      timers = [];
    }

    function statusClass(s) {
      return s === 1 ? 'is-checking' : s === 2 ? 'is-success' : s === 3 ? 'is-error' : '';
    }
    function badgeContent(s) {
      return s === 1 ? '…' : s === 2 ? '✓' : s === 3 ? '!' : '';
    }

    function renderSteps() {
      const c = copy();
      const lang = currentLang();
      stepsEl.innerHTML = '';
      STEPS.forEach((step, i) => {
        if (i > 0) {
          const connector = document.createElement('div');
          connector.className = 'wf-demo-connector' + (state.stepStatus[i - 1] === 2 ? ' is-done' : '');
          stepsEl.appendChild(connector);
        }
        const card = document.createElement('div');
        const cls = statusClass(state.stepStatus[i]);
        card.className = 'wf-demo-step-card' + (cls ? ' ' + cls : '');

        const k = document.createElement('span');
        k.className = 'wf-demo-step-k';
        k.textContent = step.k[lang];
        card.appendChild(k);

        const t = document.createElement('span');
        t.className = 'wf-demo-step-t';
        t.textContent = i === 1 && state.fixed ? step.tFixed[lang] : step.t[lang];
        card.appendChild(t);

        if (state.stepStatus[i] > 0) {
          const badge = document.createElement('span');
          badge.className = 'wf-demo-step-badge ' + statusClass(state.stepStatus[i]);
          badge.textContent = badgeContent(state.stepStatus[i]);
          card.appendChild(badge);
        }

        if (i === 1 && state.phase === 'error') {
          const fixBtn = document.createElement('button');
          fixBtn.type = 'button';
          fixBtn.className = 'wf-demo-fix';
          fixBtn.textContent = c.fix;
          fixBtn.addEventListener('click', fixBlocker);
          card.appendChild(fixBtn);
        }

        stepsEl.appendChild(card);
      });
    }

    function renderLog() {
      logEl.innerHTML = '';
      state.log.slice(-7).forEach((line) => {
        const row = document.createElement('div');
        row.className = 'wf-demo-log-line';
        row.style.color = line[0] === '✓' ? '#3DDC84' : line[0] === '✕' ? '#FF5A1F' : line[0] === '~' ? '#B9B5AB' : '#8E897E';
        row.textContent = line;
        logEl.appendChild(row);
      });
    }

    function renderActions() {
      const c = copy();
      publishBtn.classList.remove('is-busy', 'is-live');
      if (state.phase === 'checking') {
        publishBtn.textContent = c.checking;
        publishBtn.classList.add('is-busy');
      } else if (state.phase === 'live') {
        publishBtn.textContent = c.live;
        publishBtn.classList.add('is-live');
      } else {
        publishBtn.textContent = c.publish;
      }
      statusEl.textContent = { draft: c.statusDraft, checking: c.statusChecking, error: c.statusError, live: c.statusLive }[state.phase];

      const live = state.phase === 'live';
      envEl.innerHTML = '';
      envEl.classList.toggle('is-live', live);
      const dot = document.createElement('span');
      dot.className = 'wf-demo-env-dot' + (live ? ' is-live' : '');
      envEl.appendChild(dot);
      envEl.appendChild(document.createTextNode(live ? c.envLive : c.envDraft));
    }

    function render() {
      renderSteps();
      renderLog();
      renderActions();
    }

    function publish() {
      const c = copy();
      if (state.phase === 'checking' || state.phase === 'live') return;
      clearTimers();
      state.stepStatus = [0, 0, 0];
      state.phase = 'checking';
      state.log.push(c.logStart);
      render();

      later(() => {
        state.stepStatus[0] = 1;
        render();
      }, 0);
      later(() => {
        state.stepStatus[0] = 2;
        state.log.push(c.logStep1);
        render();
      }, STEP_MS);

      later(() => {
        state.stepStatus[1] = 1;
        render();
      }, STEP_MS * 1.2);

      later(() => {
        if (!state.fixed) {
          state.stepStatus[1] = 3;
          state.phase = 'error';
          state.log.push(c.logStep2Error);
          render();
          return;
        }
        state.stepStatus[1] = 2;
        state.log.push(c.logStep2Ok);
        render();

        later(() => {
          state.stepStatus[2] = 1;
          render();
        }, STEP_MS * 0.4);
        later(() => {
          state.stepStatus[2] = 2;
          state.phase = 'live';
          state.log.push(c.logStep3, c.logDone);
          render();
        }, STEP_MS * 1.4);
      }, STEP_MS * 2.2);
    }

    function fixBlocker() {
      const c = copy();
      clearTimers();
      state.fixed = true;
      state.stepStatus[1] = 0;
      state.phase = 'draft';
      state.log.push(c.logFixed);
      render();
    }

    function resetAll() {
      clearTimers();
      state = fresh();
      render();
    }

    publishBtn.addEventListener('click', publish);
    if (resetBtn) resetBtn.addEventListener('click', resetAll);
    document.addEventListener('langchange', render);

    render();
  });
})();
