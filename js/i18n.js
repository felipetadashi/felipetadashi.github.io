// ============================================
// Felipe Yoshida — Portfolio language toggle (PT/EN)
// ============================================
// How it works: elements carry a data-i18n="key" (plain text), a
// data-i18n-html="key" (innerHTML, for text that needs inline tags like
// <span>/<br>), or a data-i18n-aria="key" / data-i18n-alt="key" attribute.
// applyLanguage(lang) looks up each key in COMMON + the current page's
// dictionary (set via <body data-page="...">) and updates the DOM, the
// <html lang>, relevant <meta> tags, and persists the choice.

(function () {
  const COMMON = {
    pt: {
      mainNavAria: 'Navegação principal',
      navAbout: 'Sobre',
      navServices: 'Serviços',
      navWork: 'Trabalhos',
      navContact: 'Contato',
      skipLink: 'Pular para o conteúdo',
      themeToggleLabel: 'Alternar tema claro/escuro',
      menuToggleLabel: 'Abrir menu',
      langToggleLabel: 'Escolher idioma',
      footerNavAria: 'Navegação do rodapé',
      footerRole: 'UX Designer',
      footerRights: 'Todos os direitos reservados.',
      backToTopLabel: 'Voltar ao topo',
      caseBackLink: '← Voltar aos trabalhos',
      contactSub: 'Entre em contato 👋',
      caseContactHeading: 'Gostou deste projeto?',
      cvLabel: 'Baixar CV',
    },
    en: {
      mainNavAria: 'Main navigation',
      navAbout: 'About',
      navServices: 'Services',
      navWork: 'Work',
      navContact: 'Contact',
      skipLink: 'Skip to content',
      themeToggleLabel: 'Toggle light/dark theme',
      menuToggleLabel: 'Open menu',
      langToggleLabel: 'Choose language',
      footerNavAria: 'Footer navigation',
      footerRole: 'UX Designer',
      footerRights: 'All rights reserved.',
      backToTopLabel: 'Back to top',
      caseBackLink: '← Back to work',
      contactSub: 'Get in touch 👋',
      caseContactHeading: 'Liked this project?',
      cvLabel: 'Download CV',
    },
  };

  const PAGES = {
    index: {
      pt: {
        metaTitle: 'Felipe Yoshida — UX Designer',
        metaDescription: 'Felipe Yoshida, UX Designer em São Paulo. Design de produto, pesquisa de usuário e UI focados em resolver problemas reais.',
        availableBadge: 'Disponível para novos projetos',
        heroTitle: 'Olá, sou <span class="highlight">Felipe Yoshida</span>.<br>Crio experiências digitais intuitivas e centradas em pessoas.',
        heroSub: 'Como UX Designer, uso dados, empatia e criatividade para transformar problemas complexos em produtos simples de usar — do primeiro esboço à interface final.',
        ctaStart: 'Iniciar um projeto',
        ctaWork: 'Ver trabalhos',
        heroLocation: 'São Paulo, Brasil',
        marqueeProto: 'Prototipação',
        aboutHeading: 'Sobre mim',
        aboutPhotoAlt: 'Retrato de Felipe Yoshida sorrindo',
        aboutText: 'Sou designer de São Paulo, Brasil. Meu objetivo é ser a ponte entre usuários e empresas, melhorando a experiência de produtos e serviços digitais através de pesquisa, empatia e decisões orientadas por dados.<br><br>Nos últimos anos venho atuando como UX Designer em times de produto digital — passando pela binds.co e hoje na smarters — unindo pesquisa, arquitetura de informação e design de interface para transformar problemas complexos em soluções simples e centradas em quem usa.',
        factBasedLabel: 'Baseado em',
        factFocusLabel: 'Foco',
        factAvailLabel: 'Disponibilidade',
        factAvailValue: 'Projetos & freelas',
        experienceTitle: 'Experiência profissional',
        exp1Period: 'Novembro de 2023 — Atual',
        exp1Desc: 'smarters — UX, UX Writing e UI Design para agentes inteligentes em canais conversacionais (WhatsApp)',
        exp1H1: 'Parceiros oficiais da Meta para WhatsApp',
        exp1H2: 'Pioneiros e líderes de reconhecimento no Bots Brasil Awards',
        exp1H3: 'Destaque global Meta: WhatsApp Flows Champion, CTWA Genius e Best-in-Class CPG Use Case',
        exp1H4: "Projetos para marcas como Magalu, Visa e McDonald's",
        exp2Period: 'Setembro de 2022 — Outubro de 2023',
        exp2Desc: 'binds.co — São Paulo, Brasil',
        specialtiesTitle: 'Especialidades',
        cert1: 'UX Research — Fundamentos',
        cert4: 'UX & Usabilidade',
        servicesHeading: 'Serviços',
        servicesLede: 'Do primeiro insight de pesquisa até a interface validada com quem usa.',
        service1Title: 'Design de Produto',
        service1Desc: 'Do conceito ao fluxo final, estruturando produtos digitais que fazem sentido para quem usa.',
        service2Desc: 'Entrevistas, testes de usabilidade e análise de dados para embasar decisões de design.',
        service3Desc: 'Arquitetura de informação, wireframes e fluxos pensados para reduzir fricção.',
        service4Desc: 'Microcopy, mensagens de erro e textos de interface claros, que guiam o usuário e reforçam a voz do produto.',
        service5Desc: 'Interfaces consistentes, acessíveis e com identidade visual própria.',
        service6Desc: 'Sites e landing pages responsivos, rápidos e alinhados à marca.',
        workHeading: 'Trabalhos selecionados',
        workLede: 'Procuro construir designs inclusivos e acessíveis que resolvam problemas reais.',
        work1Desc: 'Como trocar formulários de feedback em múltiplas páginas por uma pesquisa em página única, mais rápida e intuitiva para o cliente responder.',
        work2Title: 'Dashboard Financeiro',
        work2Desc: 'Um dashboard que organiza métricas financeiras essenciais numa visão clara e acionável, para decisões mais rápidas e informadas.',
        work3Desc: 'Redesenho do menu lateral de um produto digital para tornar a navegação mais fluida, acessível e fácil de configurar.',
        workLinkLabel: 'Ver case study →',
        dribbbleLink: 'Ver todos os projetos no Dribbble',
        figmaHeading: 'Figma no dia a dia',
        figmaLede: 'Da ideia ao handoff, o Figma é minha ferramenta central em todas as etapas do processo de design.',
        figma1Title: 'Design systems & componentes',
        figma1Desc: 'Construo e mantenho bibliotecas de componentes com variants e auto layout, garantindo consistência entre telas e produtos.',
        figma2Desc: 'Uso auto layout pra criar interfaces responsivas e fáceis de manter, sem precisar redesenhar cada estado manualmente.',
        figma3Title: 'Protótipos interativos',
        figma3Desc: 'Transformo wireframes em protótipos navegáveis, com transições e micro-interações, pra validar fluxos antes do desenvolvimento.',
        figma4Desc: 'Entrego specs, tokens e medidas prontas direto do Figma, facilitando a implementação do time de engenharia.',
        figma5Title: 'Colaboração em tempo real',
        figma5Desc: 'Trabalho em arquivos compartilhados com PMs, devs e outros designers, com comentários e revisões direto na peça.',
        figma6Desc: 'Uso o FigJam pra facilitar brainstorms, mapas de fluxo e dinâmicas de research em conjunto com o time.',
        contactHeading: 'Tem uma ideia?<br>Posso ajudá-lo a começar.',
        cvHref: 'assets/felipe-yoshida-cv.pdf',
      },
      en: {
        metaTitle: 'Felipe Yoshida — UX Designer',
        metaDescription: 'Felipe Yoshida, UX Designer in São Paulo. Product design, user research and UI focused on solving real problems.',
        availableBadge: 'Available for new projects',
        heroTitle: "Hi, I'm <span class=\"highlight\">Felipe Yoshida</span>.<br>I craft intuitive, people-centered digital experiences.",
        heroSub: 'As a UX Designer, I use data, empathy and creativity to turn complex problems into products that are simple to use — from the first sketch to the final interface.',
        ctaStart: 'Start a project',
        ctaWork: 'See my work',
        heroLocation: 'São Paulo, Brazil',
        marqueeProto: 'Prototyping',
        aboutHeading: 'About me',
        aboutPhotoAlt: 'Portrait of Felipe Yoshida smiling',
        aboutText: "I'm a designer based in São Paulo, Brazil. My goal is to be the bridge between users and companies, improving the experience of digital products and services through research, empathy and data-informed decisions.<br><br>Over the past few years I've been working as a UX Designer on digital product teams — at binds.co and now at smarters — bringing together research, information architecture and interface design to turn complex problems into simple, user-centered solutions.",
        factBasedLabel: 'Based in',
        factFocusLabel: 'Focus',
        factAvailLabel: 'Availability',
        factAvailValue: 'Projects & freelance',
        experienceTitle: 'Professional experience',
        exp1Period: 'November 2023 — Present',
        exp1Desc: 'smarters — UX, UX Writing and UI Design for intelligent agents on conversational channels (WhatsApp)',
        exp1H1: 'Official Meta partner for WhatsApp',
        exp1H2: 'Pioneers and award-winning leaders at the Bots Brasil Awards',
        exp1H3: 'Global Meta recognition: WhatsApp Flows Champion, CTWA Genius and Best-in-Class CPG Use Case',
        exp1H4: "Projects for brands like Magalu, Visa and McDonald's",
        exp2Period: 'September 2022 — October 2023',
        exp2Desc: 'binds.co — São Paulo, Brazil',
        specialtiesTitle: 'Specialties',
        cert1: 'UX Research — Fundamentals',
        cert4: 'UX & Usability',
        servicesHeading: 'Services',
        servicesLede: 'From the first research insight to an interface validated with real users.',
        service1Title: 'Product Design',
        service1Desc: 'From concept to final flow, structuring digital products that make sense for the people who use them.',
        service2Desc: 'Interviews, usability testing and data analysis to inform design decisions.',
        service3Desc: 'Information architecture, wireframes and flows designed to reduce friction.',
        service4Desc: "Microcopy, error messages and clear interface copy that guide the user and reinforce the product's voice.",
        service5Desc: 'Consistent, accessible interfaces with their own visual identity.',
        service6Desc: 'Responsive, fast landing pages and websites aligned with the brand.',
        workHeading: 'Selected work',
        workLede: 'I aim to build inclusive, accessible designs that solve real problems.',
        work1Desc: "Turning a multi-page feedback form into a single-page survey that's faster and more intuitive for customers to fill out.",
        work2Title: 'Financial Dashboard',
        work2Desc: 'A dashboard that organizes essential financial metrics into a clear, actionable view for faster, more informed decisions.',
        work3Desc: "Redesigning a digital product's sidebar menu to make navigation more fluid, accessible and easier to configure.",
        workLinkLabel: 'View case study →',
        dribbbleLink: 'See all projects on Dribbble',
        figmaHeading: 'Figma in daily work',
        figmaLede: 'From idea to handoff, Figma is my central tool through every stage of the design process.',
        figma1Title: 'Design systems & components',
        figma1Desc: 'I build and maintain component libraries with variants and auto layout, ensuring consistency across screens and products.',
        figma2Desc: 'I use auto layout to create responsive interfaces that are easy to maintain, without redesigning every state manually.',
        figma3Title: 'Interactive prototypes',
        figma3Desc: 'I turn wireframes into clickable prototypes, with transitions and micro-interactions, to validate flows before development.',
        figma4Desc: 'I deliver specs, tokens and measurements straight from Figma, making implementation easier for the engineering team.',
        figma5Title: 'Real-time collaboration',
        figma5Desc: 'I work in shared files with PMs, developers and other designers, with comments and reviews directly on the design.',
        figma6Desc: 'I use FigJam to facilitate brainstorms, flow maps and research sessions together with the team.',
        contactHeading: "Have an idea?<br>I can help you get started.",
        cvHref: 'assets/felipe-yoshida-cv-en.pdf',
      },
    },

    project1: {
      pt: {
        metaTitle: 'Single Page Survey — Case study — Felipe Yoshida',
        metaDescription: 'Case study: como um formulário de pesquisa em múltiplas páginas virou uma experiência fluida em página única. Projeto de UX Design por Felipe Yoshida.',
        caseEyebrow: 'Case study',
        caseTitle: 'Single Page Survey',
        caseHeroSub: 'Como trocar formulários de feedback em múltiplas páginas por uma pesquisa em página única, reduzindo a fricção e aumentando a taxa de resposta dos clientes.',
        factDurationLabel: 'Duração',
        factDurationValue: 'Janeiro/23 – Fevereiro/23 (1 mês)',
        factRoleLabel: 'Função',
        factToolLabel: 'Ferramenta',
        caseImageAlt: 'Páginas do case study do projeto Single Page Survey, mostrando visão geral, wireframes de baixa fidelidade, telas de alta fidelidade e guia de estilo.',
      },
      en: {
        metaTitle: 'Single Page Survey — Case study — Felipe Yoshida',
        metaDescription: 'Case study: how a multi-page feedback form became a smooth single-page survey experience. UX Design project by Felipe Yoshida.',
        caseEyebrow: 'Case study',
        caseTitle: 'Single Page Survey',
        caseHeroSub: 'Turning a multi-page feedback form into a single-page survey, reducing friction and increasing the customer response rate.',
        factDurationLabel: 'Duration',
        factDurationValue: 'Jan/23 – Feb/23 (1 month)',
        factRoleLabel: 'Role',
        factToolLabel: 'Tool',
        caseImageAlt: 'Single Page Survey case study pages, showing overview, low-fidelity wireframes, high-fidelity screens and style guide.',
      },
    },

    project2: {
      pt: {
        metaTitle: 'Dashboard Financeiro — Case study — Felipe Yoshida',
        metaDescription: 'Case study: um dashboard financeiro que organiza métricas essenciais numa visão clara e acionável. Projeto de UX Design por Felipe Yoshida.',
        caseEyebrow: 'Case study',
        caseTitle: 'Dashboard Financeiro',
        caseHeroSub: 'Um dashboard financeiro altamente funcional e intuitivo, criado para dar clareza sobre métricas essenciais e apoiar decisões mais rápidas, para usuários com diferentes níveis de familiaridade com finanças.',
        factDurationLabel: 'Duração',
        factDurationValue: 'Setembro/23 – Outubro/23 (1 mês)',
        factRoleLabel: 'Função',
        factToolLabel: 'Ferramenta',
        caseImageAlt: 'Páginas do case study do Dashboard Financeiro, mostrando visão geral, wireframes de baixa fidelidade, telas de alta fidelidade e guia de estilo.',
      },
      en: {
        metaTitle: 'Financial Dashboard — Case study — Felipe Yoshida',
        metaDescription: 'Case study: a financial dashboard that organizes essential metrics into a clear, actionable view. UX Design project by Felipe Yoshida.',
        caseEyebrow: 'Case study',
        caseTitle: 'Financial Dashboard',
        caseHeroSub: 'A highly functional, intuitive financial dashboard built to bring clarity to essential metrics and support faster decisions, for users with different levels of familiarity with finance.',
        factDurationLabel: 'Duration',
        factDurationValue: 'Sep/23 – Oct/23 (1 month)',
        factRoleLabel: 'Role',
        factToolLabel: 'Tool',
        caseImageAlt: 'Financial Dashboard case study pages, showing overview, low-fidelity wireframes, high-fidelity screens and style guide.',
      },
    },

    project3: {
      pt: {
        metaTitle: 'Sidebar Menu — Case study — Felipe Yoshida',
        metaDescription: 'Case study: redesenho do menu lateral de um produto digital para tornar a navegação mais fluida e acessível. Projeto de UX Design por Felipe Yoshida.',
        caseEyebrow: 'Case study',
        caseTitle: 'Sidebar Menu',
        caseHeroSub: 'Redesenho do menu lateral de um produto digital, um passo importante para melhorar a navegação e a usabilidade do sistema — facilitando o acesso às funcionalidades principais com uma experiência mais fluida.',
        factDurationLabel: 'Duração',
        factDurationValue: '1 mês',
        factRoleLabel: 'Função',
        factPlatformsLabel: 'Plataformas',
        caseImageAlt: 'Páginas do case study do Sidebar Menu, mostrando pesquisa com stakeholders e usuários, prototipagem de baixa e alta fidelidade, e telas finais de design visual.',
      },
      en: {
        metaTitle: 'Sidebar Menu — Case study — Felipe Yoshida',
        metaDescription: "Case study: redesigning a digital product's sidebar menu to make navigation more fluid and accessible. UX Design project by Felipe Yoshida.",
        caseEyebrow: 'Case study',
        caseTitle: 'Sidebar Menu',
        caseHeroSub: "Redesigning a digital product's sidebar menu, an important step toward improving the system's navigation and usability — making it easier to access key features with a more fluid experience.",
        factDurationLabel: 'Duration',
        factDurationValue: '1 month',
        factRoleLabel: 'Role',
        factPlatformsLabel: 'Platforms',
        caseImageAlt: 'Sidebar Menu case study pages, showing research with stakeholders and users, low- and high-fidelity prototyping, and final visual design screens.',
      },
    },
  };

  function getDict(lang) {
    const page = document.body.getAttribute('data-page');
    return Object.assign({}, COMMON[lang], (PAGES[page] && PAGES[page][lang]) || {});
  }

  function applyLanguage(lang) {
    if (lang !== 'pt' && lang !== 'en') lang = 'pt';
    const dict = getDict(lang);

    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] != null) el.textContent = dict[key];
    });

    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.getAttribute('data-i18n-html');
      if (dict[key] != null) el.innerHTML = dict[key];
    });

    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      const key = el.getAttribute('data-i18n-aria');
      if (dict[key] != null) el.setAttribute('aria-label', dict[key]);
    });

    document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
      const key = el.getAttribute('data-i18n-alt');
      if (dict[key] != null) el.setAttribute('alt', dict[key]);
    });

    // CV download link: swap both the label (handled by data-i18n above)
    // and the href to the matching-language PDF.
    const cvLink = document.getElementById('cv-download-link');
    if (cvLink && dict.cvHref) cvLink.setAttribute('href', dict.cvHref);

    // Head metadata, so the tab title/description and social-share
    // previews match whichever language is currently selected.
    if (dict.metaTitle) document.title = dict.metaTitle;
    const metaMap = {
      'meta[name="description"]': dict.metaDescription,
      'meta[property="og:title"]': dict.metaTitle,
      'meta[property="og:description"]': dict.metaDescription,
      'meta[name="twitter:title"]': dict.metaTitle,
      'meta[name="twitter:description"]': dict.metaDescription,
    };
    Object.keys(metaMap).forEach((selector) => {
      const el = document.querySelector(selector);
      if (el && metaMap[selector] != null) el.setAttribute('content', metaMap[selector]);
    });
    const ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale) ogLocale.setAttribute('content', lang === 'pt' ? 'pt_BR' : 'en_US');

    document.querySelectorAll('.lang-toggle button').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-lang') === lang));
    });

    try {
      localStorage.setItem('lang', lang);
    } catch (e) {
      /* localStorage unavailable (private mode, etc.) — language just won't persist */
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    let savedLang = 'pt';
    try {
      savedLang = localStorage.getItem('lang') || 'pt';
    } catch (e) {
      /* ignore */
    }
    applyLanguage(savedLang);

    document.querySelectorAll('.lang-toggle button').forEach((btn) => {
      btn.addEventListener('click', () => applyLanguage(btn.getAttribute('data-lang')));
    });
  });

  window.applyLanguage = applyLanguage;
})();
