// ============================================
// "Conversa ao vivo" — chat simulado do case Time Brasil (home)
// ============================================
// Substitui a antiga faixa de prints. Roda uma conversa roteirizada sozinha
// (autoplay), e os 5 princípios de UX Writing listados ao lado acendem
// conforme a mensagem do bot em cena. Clicar numa opção de resposta rápida
// passa pro modo manual; o botão no topo do telefone liga/desliga o
// autoplay e reinicia a conversa. Texto roteirizado em PT/EN aqui mesmo
// (não dá pra usar só data-i18n porque o conteúdo é gerado dinamicamente);
// o resto do bloco (título, legenda, princípios) segue via data-i18n normal
// e só precisa ser lido de novo quando js/i18n.js dispara "langchange".

(function () {
  // Caminho seguido no autoplay: start → quiz → errado (mostra a correção
  // gentil, princípio 05) → agenda → sim → start (loop), passando pelos 5
  // princípios ao longo do ciclo.
  const AUTO_PATH = { start: 'quiz', quiz: 'errado', errado: 'agenda', agenda: 'sim', sim: 'start' };
  const MAX_MESSAGES = 6;
  const TYPING_DELAY_FIRST = 300; // antes da 1ª msg do bot num nó sem bolha de usuário
  const TYPING_DELAY_AFTER_USER = 500; // antes da 1ª msg do bot, quando entrou bolha de usuário
  const TYPING_DURATION = 1000;
  const GAP_AFTER_MESSAGE = 350;
  const AUTO_ADVANCE_DELAY = 2600;

  // opt: [label, próximoNó, éReinício] — éReinício evita empurrar uma
  // bolha de usuário e limpa a conversa (equivalente ao antigo "Recomeçar").
  const SCRIPT = {
    pt: {
      status: { online: 'online', typing: 'digitando…' },
      toggleOn: 'reprodução automática · clique para pausar',
      toggleOff: 'modo manual · clique para auto',
      flow: {
        start: {
          bot: [
            ['Oi! Eu sou o assistente oficial do Time Brasil em Paris 2024 🇧🇷', 'id'],
            ['Por onde você quer começar?', 'opt'],
          ],
          opts: [
            ['📅 Agenda e resultados', 'agenda'],
            ['🏃 Perfil de atleta', 'atleta'],
            ['🧠 Quiz', 'quiz'],
          ],
        },
        agenda: {
          bot: [['Hoje tem 12 brasileiros na disputa. Quer um alerta 15 min antes de cada prova? ⏰', 'ant']],
          opts: [['Sim, quero!', 'sim'], ['Agora não', 'nao']],
        },
        atleta: {
          bot: [['Me diz a modalidade que eu te mostro quem compete hoje 👇', 'opt']],
          opts: [['🤸 Ginástica', 'mod'], ['🛹 Skate', 'mod']],
        },
        mod: {
          bot: [['Separei quem compete hoje nessa modalidade. Quer alerta antes das provas? ⏰', 'ant']],
          opts: [['Sim, quero!', 'sim'], ['Agora não', 'nao']],
        },
        quiz: {
          bot: [['Pergunta 1/5: em que ano o Brasil ganhou seu primeiro ouro olímpico?', 'opt']],
          opts: [['1984', 'errado'], ['1920', 'certo']],
        },
        certo: {
          bot: [['Isso! 1920, no tiro esportivo 🎯 Bora pra agenda de hoje?', 'conf']],
          opts: [['Ver agenda', 'agenda'], ['Recomeçar', 'start', true]],
        },
        errado: {
          bot: [['Quase! Foi em 1920, no tiro esportivo 🎯 A próxima você acerta.', 'err']],
          opts: [['Ver agenda', 'agenda'], ['Recomeçar', 'start', true]],
        },
        sim: {
          bot: [['Pronto ✅ Te aviso antes de cada prova. Pra parar, é só mandar SAIR.', 'conf']],
          opts: [['Recomeçar', 'start', true]],
        },
        nao: {
          bot: [['Tranquilo! Se mudar de ideia, é só digitar ALERTA 😉', 'conf']],
          opts: [['Recomeçar', 'start', true]],
        },
      },
    },
    en: {
      status: { online: 'online', typing: 'typing…' },
      toggleOn: 'autoplay on · click to pause',
      toggleOff: 'manual mode · click for autoplay',
      flow: {
        start: {
          bot: [
            ["Hi! I'm Time Brasil's official assistant for Paris 2024 🇧🇷", 'id'],
            ['Where would you like to start?', 'opt'],
          ],
          opts: [
            ['📅 Schedule & results', 'agenda'],
            ['🏃 Athlete profiles', 'atleta'],
            ['🧠 Quiz', 'quiz'],
          ],
        },
        agenda: {
          bot: [["12 Brazilians are competing today. Want an alert 15 min before each event? ⏰", 'ant']],
          opts: [['Yes, please!', 'sim'], ['Not now', 'nao']],
        },
        atleta: {
          bot: [["Tell me the sport and I'll show you who's competing today 👇", 'opt']],
          opts: [['🤸 Gymnastics', 'mod'], ['🛹 Skateboarding', 'mod']],
        },
        mod: {
          bot: [["Here's who's competing today in that sport. Want an alert before each event? ⏰", 'ant']],
          opts: [['Yes, please!', 'sim'], ['Not now', 'nao']],
        },
        quiz: {
          bot: [['Question 1/5: what year did Brazil win its first Olympic gold?', 'opt']],
          opts: [['1984', 'errado'], ['1920', 'certo']],
        },
        certo: {
          bot: [["Right! 1920, in shooting 🎯 Want today's schedule?", 'conf']],
          opts: [['See schedule', 'agenda'], ['Start over', 'start', true]],
        },
        errado: {
          bot: [["Close! It was 1920, in shooting 🎯 You'll get the next one.", 'err']],
          opts: [['See schedule', 'agenda'], ['Start over', 'start', true]],
        },
        sim: {
          bot: [["Done ✅ I'll alert you before each event. To stop, just send STOP.", 'conf']],
          opts: [['Start over', 'start', true]],
        },
        nao: {
          bot: [['No worries! If you change your mind, just type ALERT 😉', 'conf']],
          opts: [['Start over', 'start', true]],
        },
      },
    },
  };

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const section = document.querySelector('.live-chat');
    const messagesEl = document.getElementById('chat-messages');
    const optionsEl = document.getElementById('chat-options');
    const statusEl = document.getElementById('chat-status');
    const toggleBtn = document.getElementById('chat-auto-toggle');
    if (!section || !messagesEl || !optionsEl) return;

    const toggleDot = toggleBtn ? toggleBtn.querySelector('.live-chat-toggle-dot') : null;
    const toggleLabel = toggleBtn ? toggleBtn.querySelector('.live-chat-toggle-label') : null;
    const principleEls = Array.from(document.querySelectorAll('.live-chat-principle'));

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let timers = [];
    let runToken = 0;
    let inViewport = true;
    let pendingAdvance = null;

    const state = {
      messages: [],
      typing: false,
      options: [],
      node: 'start',
      auto: !prefersReducedMotion,
    };

    function schedule(fn, ms) {
      const id = setTimeout(fn, ms);
      timers.push(id);
      return id;
    }
    function clearTimers() {
      timers.forEach(clearTimeout);
      timers = [];
    }
    function currentLang() {
      return document.documentElement.lang === 'en' ? 'en' : 'pt';
    }
    function currentCopy() {
      return SCRIPT[currentLang()];
    }

    function renderMessages() {
      const items = state.messages.slice(-MAX_MESSAGES);
      let html = items
        .map((m) => `<div class="live-chat-bubble ${m.isBot ? 'is-bot' : 'is-user'}">${escapeHtml(m.text)}</div>`)
        .join('');
      if (state.typing) {
        html += '<div class="live-chat-bubble is-bot is-typing" aria-hidden="true"><span></span><span></span><span></span></div>';
      }
      messagesEl.innerHTML = html;
    }

    function renderOptions() {
      optionsEl.innerHTML = '';
      state.options.forEach((o) => {
        const [label, nextKey, isRestart] = o;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'live-chat-option';
        btn.textContent = label;
        btn.addEventListener('click', () => {
          state.auto = false;
          renderToggle();
          play(nextKey, isRestart ? null : label);
        });
        optionsEl.appendChild(btn);
      });
    }

    function renderToggle() {
      if (!toggleBtn) return;
      toggleBtn.setAttribute('aria-pressed', String(state.auto));
      const copy = currentCopy();
      if (toggleLabel) toggleLabel.textContent = state.auto ? copy.toggleOn : copy.toggleOff;
      if (toggleDot) toggleDot.classList.toggle('is-on', state.auto);
    }

    function highlightNote(note) {
      principleEls.forEach((el) => {
        el.classList.toggle('is-active', el.getAttribute('data-tag') === note);
      });
    }

    function setTyping(on) {
      state.typing = on;
      if (statusEl) statusEl.textContent = on ? currentCopy().status.typing : currentCopy().status.online;
      renderMessages();
    }

    function pushMessage(text, isBot, note) {
      state.messages.push({ text, isBot });
      if (isBot && note) highlightNote(note);
      renderMessages();
    }

    function play(key, userText) {
      clearTimers();
      const runId = ++runToken;
      const flow = currentCopy().flow;
      const f = flow[key];
      if (!f) return;

      if (key === 'start' && !userText) state.messages = [];
      if (userText) pushMessage(userText, false);
      state.options = [];
      state.node = key;
      renderOptions();
      renderMessages();

      let t = userText ? TYPING_DELAY_AFTER_USER : TYPING_DELAY_FIRST;
      f.bot.forEach(([text, note]) => {
        schedule(() => {
          if (runId === runToken) setTyping(true);
        }, t);
        t += TYPING_DURATION;
        schedule(() => {
          if (runId !== runToken) return;
          state.typing = false;
          pushMessage(text, true, note);
          if (statusEl) statusEl.textContent = currentCopy().status.online;
        }, t);
        t += GAP_AFTER_MESSAGE;
      });

      schedule(() => {
        if (runId !== runToken) return;
        state.options = f.opts;
        renderOptions();
        if (state.auto) {
          const nextKey = AUTO_PATH[key];
          const opt = f.opts.find((o) => o[1] === nextKey) || f.opts[0];
          const advance = () => {
            if (runId === runToken) play(opt[1], opt[2] ? null : opt[0]);
          };
          if (inViewport) {
            schedule(advance, AUTO_ADVANCE_DELAY);
          } else {
            pendingAdvance = advance;
          }
        }
      }, t);
    }

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        state.auto = !state.auto;
        renderToggle();
        if (state.auto) play('start');
      });
    }

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            inViewport = entry.isIntersecting;
            if (inViewport && pendingAdvance) {
              const fn = pendingAdvance;
              pendingAdvance = null;
              schedule(fn, 500);
            }
          });
        },
        { threshold: 0.2 }
      );
      io.observe(section);
    }

    // O conteúdo da conversa é gerado via JS (não dá pra cobrir só com
    // data-i18n), então reinicia do zero no idioma novo quando o toggle
    // PT/EN é usado — ver o CustomEvent disparado em js/i18n.js.
    document.addEventListener('langchange', () => {
      renderToggle();
      play('start');
    });

    renderToggle();
    play('start');
  });
})();
