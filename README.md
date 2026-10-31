# Portfólio — Felipe Yoshida

Site pessoal estático (HTML/CSS/JS puro, sem frameworks), pronto para editar e publicar em qualquer lugar.

## Estrutura dos arquivos

```
portfolio-felipe-yoshida/
├── index.html                     → página principal
├── css/style.css                   → visual, cores, tema claro/escuro, responsividade
├── js/script.js                     → menu mobile, tema, animações, scrollspy, etc.
├── js/i18n.js                        → troca de idioma PT/EN (dicionários de texto + lógica do botão PT/EN)
├── robots.txt                        → instrução para buscadores (Google etc.) indexarem o site
├── sitemap.xml                        → mapa do site para buscadores
├── trabalhos/                          → páginas de case study de cada projeto
│   ├── projeto-01.html                  → Single Page Survey
│   ├── projeto-04.html                  → Design System (texto, sem prints — ver item 10)
│   ├── projeto-05.html                  → Time Brasil no WhatsApp (texto, sem prints — ver item 10)
│   └── projeto-06.html                  → Workflow Builder
├── cv/
│   ├── cv-fonte.html                    → fonte editável do currículo em português
│   └── cv-fonte-en.html                 → fonte editável do currículo em inglês
└── assets/
    ├── felipe-photo.jpg                 → sua foto, usada na seção "Sobre"
    ├── felipe-yoshida-cv.pdf             → currículo em PDF (PT), baixado pelo botão "Baixar CV" quando o site está em português
    ├── felipe-yoshida-cv-en.pdf           → currículo em PDF (EN), baixado quando o site está em inglês
    └── projects/
        ├── projeto-0X-card.jpg           → recorte usado nos cards da home
        └── projeto-0X-full.jpg           → case study completo (páginas do Figma), usado na página de cada projeto
```

## O que já está pronto

- Layout moderno, responsivo (funciona em celular, tablet e desktop)
- Sua foto na seção "Sobre" e as imagens reais dos 3 projetos nos cards e nas páginas de case study
- Uma página própria para cada projeto (`trabalhos/projeto-0X.html`), com o case study completo (as artes que você me mandou) exibido em tamanho grande — os cards da home linkam direto pra elas
- Alternância de tema claro/escuro (o site lembra a escolha do visitante, e respeita a preferência do sistema operacional na primeira visita)
- Menu mobile com hambúrguer — fecha ao clicar fora, ao apertar Esc, ou ao clicar num link
- Menu de navegação destaca automaticamente a seção que você está vendo (scrollspy)
- Barra de progresso de leitura no topo da página
- Botão "voltar ao topo" que aparece ao rolar a página
- Elemento visual flutuante no Hero (ilustração genérica de UX/UI, não uma imagem de projeto real), ilustração de fluxo (pesquisa → design → validação) na seção "Serviços", e ícones ilustrando cada serviço
- Fundo com gradiente animado e sutil (efeito "mesh") atrás do conteúdo, faixa rolante com suas áreas de atuação logo abaixo do Hero, e um padrão de pontos decorativo atrás da sua foto — tudo puramente visual/genérico, dá mais dinamismo sem depender de fotos ou imagens externas
- Timeline de experiência profissional (só os cargos de UX Designer) e lista de especialidades na seção "Sobre", com seus dados reais extraídos do seu LinkedIn
- Card de "UX Writing" na seção "Serviços", junto com os demais
- Seção "Figma no dia a dia" (com uma ilustração e 6 cards) destacando como você usa o Figma no processo de design — no lugar da antiga seção de depoimentos, que exigia citações reais que você ainda não tinha
- Fundo com leve variação de tom alternando entre as seções ("Serviços" e "Figma no dia a dia"), pra dar mais ritmo à rolagem
- Cards de projeto com efeito de zoom sutil na imagem ao passar o mouse
- Animações suaves em cascata ao rolar a página (desativadas automaticamente para quem tem a opção "reduzir movimento" ligada no sistema)
- Acessibilidade: link de "pular para o conteúdo" para quem navega por teclado, estados de foco visíveis, `aria-label`s nos botões e menus
- SEO e compartilhamento: tags de Open Graph/Twitter Card (o link fica bonito quando compartilhado no WhatsApp/LinkedIn), dados estruturados (JSON-LD), `robots.txt` e `sitemap.xml` (incluindo as páginas de case study)
- Botão "Baixar CV" no Hero, com um currículo em PDF pronto (`assets/felipe-yoshida-cv.pdf`) — veja o item 8 abaixo para detalhes e como editar
- Destaques do trabalho na smarters (parceria oficial com a Meta, prêmios, clientes) na experiência da seção "Sobre" e no currículo — veja o item 8
- **Botão de idioma (PT/EN)** no cabeçalho de todas as páginas: alterna todo o texto do site (incluindo meta tags de SEO e o link de download do CV, que passa a apontar pro currículo em inglês) sem recarregar a página. A escolha fica salva no navegador do visitante (`localStorage`) e o site abre em português por padrão. O texto de cada idioma fica centralizado em `js/i18n.js` — veja o item 9 abaixo para como editar
- **2 novos case studies** (`trabalhos/projeto-04.html` e `projeto-05.html`), sobre o Design System da empresa e o projeto Time Brasil (chatbot oficial do COB/Meta nos Jogos de Paris 2024) — veja o item 10 abaixo para o que revisar antes de publicar

## O que você ainda pode personalizar

1. **Seção "Sobre"** — o segundo parágrafo já está preenchido com um texto genérico sobre sua trajetória (binds.co → smarters); ajuste o tom ou detalhe mais suas especialidades e o tipo de projeto que você quer atrair (ex: produtos SaaS, fintech, e-commerce) se quiser.
   - **Experiência profissional** — logo abaixo, a linha do tempo está com seus 2 cargos de UX Designer (smarters e binds.co), extraídos do PDF do seu perfil do LinkedIn. Procure por `<!-- EXPERIÊNCIA -->` no `index.html` se quiser ajustar algum texto, adicionar uma experiência mais recente ou incluir de novo alguma das anteriores (cada uma é um `<li class="timeline-item">`).
   - **Especialidades** — logo abaixo da experiência, a lista de chips com as 5 especialidades/certificados do seu LinkedIn (UX Research — Fundamentos, Enterprise Design Thinking Practitioner, UX Research, UX & Usabilidade, User Experience Design Fundamentals). Procure por `<!-- ESPECIALIDADES -->` no `index.html` para editar, adicionar ou remover algum (cada um é um `<li class="cert-chip">`).
   - Não incluí sua formação acadêmica (pós-graduação e graduação, que também aparecem no seu PDF do LinkedIn) nem os cargos fora de UX (assistente administrativo, estagiário de gestão) — me avise se quiser que eu adicione alguma dessas informações de volta.
2. **Descrições dos projetos nas páginas de case study** — escrevi os textos de "Duração", "Função" e "Ferramenta" com base no que aparecia nas artes que você mandou; vale conferir se está tudo certo (fiz uma suposição de que os 3 projetos usaram Figma).
3. **Links de redes sociais** (no rodapé) — confira se as URLs estão corretas, especialmente a do LinkedIn, que foi montada a partir do que você tinha no Webflow (`felipe-yoshida`) e vale a pena confirmar.
4. **Cores de destaque** — para trocar a cor roxa principal (`--accent`) ou as duas cores secundárias usadas nos gradientes e ilustrações (`--accent-2`, `--accent-3`), edite essas variáveis no início de `css/style.css` (dentro de `:root` e de `[data-theme="light"]`).
5. **Domínio nas tags de SEO** — no `<head>` de `index.html` e de cada página em `trabalhos/` há um comentário "TROQUE pela URL final do site". Assim que decidir seu domínio (ex: `felipeyoshida.com`), atualize essas URLs (`canonical`, `og:url`, `og:image`) e também a linha do `Sitemap:` em `robots.txt` e as URLs em `sitemap.xml` — isso ajuda o Google a indexar o site e faz o link ficar bonito ao compartilhar.
6. **Mais projetos** — para adicionar um quarto projeto, duplique um dos arquivos em `trabalhos/`, troque o conteúdo e as imagens, e adicione um novo card em `index.html` (copie o bloco `<article class="work-card reveal">...</article>` de um dos existentes).
7. **"Figma no dia a dia"** — os 6 cards descrevem, de forma geral, como um UX/UI Designer com seu perfil costuma usar o Figma (design systems, auto layout, protótipos, Dev Mode, colaboração, FigJam). Procure por `<!-- FIGMA NO DIA A DIA -->` no `index.html` se quiser deixar mais específico (ex: citar um recurso que você usa bastante, ou um fluxo de trabalho particular seu).
8. **Currículo (`assets/felipe-yoshida-cv.pdf`)** — montei um currículo de uma página com seus dados reais do LinkedIn (contato, cargos, datas, formação, certificações, idiomas). **Importante:** como eu não tenho acesso ao seu dia a dia real em cada empresa, escrevi as atribuições de cada cargo (as listas com bullet points) com base em responsabilidades típicas de um UX Designer com o perfil que você tem no LinkedIn (Figma, Design Systems, Product Design) — são um rascunho plausível, não fatos confirmados. Antes de usar o currículo em candidaturas de verdade, revise essas listas e ajuste para o que você realmente fez em cada lugar (projetos específicos, ferramentas exatas, resultados/métricas reais que teve). Para editar: abra `cv/cv-fonte.html` num editor de texto (ou no navegador), mude o que quiser, e siga as instruções no comentário no topo do arquivo para gerar o PDF de novo a partir do Chrome (Ctrl+P → Salvar como PDF).
   - **Destaques da smarters** — tanto na seção "Sobre" do site (embaixo do cargo "smarters" na timeline) quanto no currículo, adicionei destaques sobre a empresa com base no texto que você me passou: parceria oficial com a Meta para WhatsApp, prêmios (Bots Brasil Awards, WhatsApp Flows Champion, CTWA Genius, Best-in-Class CPG Use Case) e clientes como Magalu, Visa e McDonald's. São informações sobre a empresa, não conquistas pessoais específicas suas — se quiser destacar algo que você especificamente entregou nesses projetos, me passe os detalhes e eu ajusto o texto.
9. **Textos em inglês (`js/i18n.js`)** — todo o texto do site em português e em inglês vive nesse arquivo, dentro de dois objetos (`COMMON`, compartilhado por todas as páginas, e `PAGES`, com um bloco por página: `index`, `project1` a `project5`). Cada chave tem uma versão `pt` e uma `en` lado a lado — pra editar um texto (em qualquer idioma), procure a chave correspondente nos dois objetos. Textos com tags HTML dentro (como `<br>` ou `<span>`) usam `data-i18n-html` no HTML em vez de `data-i18n`; o restante é texto puro. As imagens dos case studies 1 a 3 (os prints exportados do Figma em `assets/projects/`) continuam só em português, porque o texto está "gravado" na imagem — pra ficarem bilíngues de verdade, seria preciso recriar essas artes no Figma em inglês também.
10. **Case studies do Design System e do Time Brasil (`trabalhos/projeto-04.html` e `projeto-05.html`)** — diferente dos 3 primeiros projetos, esses dois não têm uma arte de case study pronta (print do Figma): são escritos em texto, no mesmo visual do resto do site, com cards nos cards da home usando um ícone + gradiente no lugar de uma foto. Importante revisar antes de usar numa entrevista ou candidatura:
    - **Design System**: o texto descreve, de forma qualitativa, sua participação contínua na construção do Design System de experiências conversacionais da empresa (desde novembro/2023, sem uma frente fixa). As 3 "decisões" (linguagem em comum pra fluxos de conversa, padrões de validação/recuperação de erro, documentação viva no Figma) são exemplos plausíveis do tipo de decisão que esse trabalho normalmente envolve — ajuste pra refletir decisões específicas que você realmente tomou, se quiser mais precisão.
    - **Time Brasil**: o texto usa o período que você confirmou (maio–agosto/2024), seu papel real (UX Writing e engenharia de conversas) e a estrutura de menu/informação que o chatbot oferecia (agenda, resultados, medalhas, atletas, cartão de torcedor etc.). O resultado/impacto foi mantido qualitativo, sem números — se você tiver dados reais (mesmo aproximados) de uso ou alcance, vale substituir o texto genérico por eles.
    - Em nenhum dos dois eu usei números específicos, nomes de pessoas ou citações de outros portfólios/case studies que você me mostrou como referência de estrutura — só a organização das seções (contexto → decisões → impacto) foi inspirada neles; o conteúdo é seu.
    - **Versão expandida**: as duas páginas agora têm bem mais conteúdo e elementos visuais/interativos — ilustração no hero, comparativo "antes/depois" do Design System, cards de "cenários do dia a dia"/"bastidores", um explorador de menu com abas (Time Brasil), FAQ e cards de curiosidades que viram ao clicar. Tudo isso é **representação ilustrativa** (mockups de conversa, exemplos de decisão, cenários típicos) — não são prints reais nem falas/decisões específicas documentadas, e isso está sinalizado no próprio texto das páginas (`caseFigcaption`/`caseDisclaimer`). Se você puder me mandar screenshots reais do Figma ou do chatbot, ou exemplos concretos de decisões que tomou, eu troco os mockups ilustrativos por conteúdo real.

## Como ver o site no seu computador

Basta abrir o arquivo `index.html` duas vezes (duplo clique) — ele abre direto no navegador. Não precisa instalar nada. As páginas de case study abrem normalmente a partir dos links "Ver case study" nos cards.

## Como publicar (hospedar) de graça

Como o site é só HTML/CSS/JS, qualquer um destes serviços funciona bem e é gratuito:

- **Netlify** ([netlify.com](https://netlify.com)) — o mais simples: arraste a pasta inteira do site para o "Deploy manually" no painel do Netlify e pronto, você recebe um link.
- **Vercel** ([vercel.com](https://vercel.com)) — parecido com o Netlify, ótimo se no futuro você quiser evoluir o site com mais tecnologia.
- **GitHub Pages** — se você quiser aprender a usar Git/GitHub (bom exercício já que você está estudando programação), sobe os arquivos num repositório e ativa o "Pages" nas configurações.

Em qualquer um desses, depois dá para conectar um domínio próprio (ex: felipeyoshida.com) se você comprar um, em registradores como Registro.br (domínios .com.br) ou Namecheap/GoDaddy (domínios .com).

## Próximos passos sugeridos

- Revisar as atribuições do currículo (item 8 acima) com suas informações reais antes de usar em candidaturas.
- Revisar o texto das páginas de case study — hoje elas mostram a arte completa que você já tinha; se quiser, posso reescrever o conteúdo em formato de texto real (HTML) em vez de imagem, o que também ajuda no SEO.
