# Handoff: Header de portfólio — "Fluxo vivo" (1c)

## Overview
Hero/header interativo para portfólio de UX designer + front-end. Um diagrama de fluxo (7 nós, 8 conexões) representa o processo de trabalho "Pesquisa → Deploy"; o visitante pode arrastar os nós e as curvas se redesenham em tempo real. Headline grande no canto inferior esquerdo.

## About the Design Files
O arquivo neste pacote (`Portfolio Header 1c.dc.html`) é uma **referência de design em HTML** — mostra aparência e comportamento, não é código de produção. A tarefa é **recriar o design no ambiente do site existente** (React, Next, Astro, Vue, etc.) usando os padrões do projeto. Se não houver framework, use HTML + JS vanilla ou React.

## Fidelity
**High-fidelity.** Cores, tipografia, espaçamentos e interação são finais. Recriar pixel-perfect.

## Layout
- Artboard de referência: **1280 × 760**, `position: relative; overflow: hidden; background: #111110`.
- No site: largura 100% do viewport, altura ~ `min(100vh, 760px)` (mín. 640). Coordenadas dos nós estão em px no artboard 1280×760 — converter para % (x/1280, y/760) ou escalar o artboard inteiro com `transform: scale()` mantendo proporção.
- Fundo: grid de pontos — `radial-gradient(#2E2E2A 1.2px, transparent 1.2px)`, `background-size: 24px 24px`.

### Camadas (de baixo para cima)
1. Grid de pontos (inset 0).
2. SVG 1280×760 com as conexões (`pointer-events: none`).
3. Nós (absolutos, arrastáveis).
4. Top bar — left 64, top 36:
   - "lia moreno" — Bricolage Grotesque 22px / 700, letter-spacing -0.02em, #EEECE6
   - bolinha 8px #3DDC84 piscando (animação `blink` 1.6s ease-in-out infinite: opacity 1 → .25 em 50%)
   - "disponível para projetos" — JetBrains Mono 13px #B9B5AB
   - gap 14px
5. Headline — left 64, bottom 64, `pointer-events: none`, gap 24px:
   - "Do insight" / "ao deploy." (2ª linha #FF5A1F) — Bricolage Grotesque 124px / 800, line-height 0.88, letter-spacing -0.045em, #EEECE6
   - Subtexto: "UX design × engenharia front-end. Eu conecto pesquisa, interface e código num único fluxo — arraste e veja." — JetBrains Mono 14px, line-height 1.6, #B9B5AB, max-width 520px
6. Rodapé — right 64, bottom 40: "flow.json · 7 nós · 8 conexões" — JetBrains Mono 12px #6B675E.

## Nós
Card 176 × 72, padding 12px 14px, radius 10px, border 1px, flex column space-between, `box-shadow: 0 10px 30px -10px rgba(0,0,0,.6)`, cursor grab. Hover: border-color #FF5A1F.
- Label: JetBrains Mono 11px (#8E897E)
- Título: Bricolage Grotesque 20px / 600, letter-spacing -0.01em (#EEECE6)
- Portas: círculos 8px nas laterais (left/right -5px, top 31px), fundo #111110, borda 1.5px #6B675E
- Padrão: bg #1B1B19, borda #34332F
- Destaque (Deploy): bg e borda #FF5A1F, textos #111110

| # | label | título | x | y |
|---|---|---|---|---|
| 0 | 01 / descobrir | Pesquisa | 470 | 120 |
| 1 | 02 / definir | Personas | 720 | 70 |
| 2 | 03 / estruturar | Wireframe | 720 | 250 |
| 3 | 04 / validar | Protótipo | 980 | 150 |
| 4 | 05 / medir | Teste | 1010 | 340 |
| 5 | 06 / construir | Código | 760 | 440 |
| 6 | 07 / lançar | Deploy (destaque) | 1040 | 560 |

## Conexões
Pares (origem → destino): [0,1] [0,2] [1,3] [2,3] [3,4] [2,5] [4,6] [5,6].
Curva bezier da porta direita da origem à porta esquerda do destino:
```js
x1 = a.x + 176; y1 = a.y + 36; x2 = b.x; y2 = b.y + 36;
c = Math.max(70, Math.abs(x2 - x1) / 2);
d = `M${x1} ${y1} C${x1+c} ${y1}, ${x2-c} ${y2}, ${x2} ${y2}`;
```
- Estáticas: stroke #4A4843, 1.5px.
- Animadas (índices 4, 6, 7 → Protótipo→Teste, Teste→Deploy, Código→Deploy): stroke #FF5A1F, 1.5px, `stroke-dasharray: 4 6`, animação `dash` 1s linear infinite (`to { stroke-dashoffset: -20 }`).

## Interactions & Behavior
- **Arrastar nó:** mousedown no nó inicia drag; mousemove/mouseup no `window`. Nova posição = origem + delta do cursor × fator de escala (`el.offsetWidth / el.getBoundingClientRect().width`, para funcionar com o artboard escalado). Limitar x ∈ [0, 1104], y ∈ [0, 688]. `preventDefault` no mousedown; `user-select: none` no container.
- Curvas recalculadas a cada movimento.
- Sugerido para produção: suporte a touch/pointer events (`pointerdown` + `setPointerCapture`), cursor `grabbing` durante drag, respeitar `prefers-reduced-motion` (pausar `dash` e `blink`).
- Mobile (< 768px): reduzir headline (~64px), esconder ou reorganizar nós em coluna/rolagem horizontal.

## State
`nodes: {x, y}[]` (7 itens) e `drag: {i, startX, startY, origX, origY} | null`.

## Design Tokens
- Cores: #111110 (fundo), #1B1B19 (card), #34332F (borda card), #2E2E2A (pontos), #4A4843 (conexão), #6B675E / #8E897E / #B9B5AB (textos secundários), #EEECE6 (texto), #FF5A1F (acento), #3DDC84 (status online)
- Fontes (Google Fonts): **Bricolage Grotesque** (opsz 12..96, wght 400..800) e **JetBrains Mono** (400, 500)
- Radius: 10px (nós)

## Assets
Nenhuma imagem. Somente fontes do Google Fonts.

## Files
- `Portfolio Header 1c.dc.html` — referência (abra no navegador).
- Copy de exemplo ("lia moreno", textos) deve ser substituída pelos dados reais.
