# Richard Marlon Balestrim · Currículo digital

Aplicação local e independente em HTML5, CSS3 e JavaScript Vanilla. A identidade combina grafite, dourado envelhecido, geometria industrial e pequenos detalhes verdes. Os elementos gráficos são originais, construídos em CSS e SVG, sem imagens ou símbolos de franquias.

## Executar localmente

Abra `index.html` no Chrome, Edge, Firefox ou outro navegador moderno. Não é necessário instalar pacotes, compilar, iniciar servidor ou se conectar à internet para consultar o conteúdo. Os links profissionais externos precisam de internet.

Clique em **Imprimir / Salvar PDF** e escolha **Salvar como PDF** no diálogo de impressão do navegador. O botão chama `window.print()`; ele não baixa o documento original. Sem JavaScript, utilize `Ctrl+P` ou a opção Imprimir do navegador.

## Estrutura

### Internacionalização — atualização de 08/11/2026

O globo no cabeçalho alterna imediatamente entre português brasileiro, espanhol argentino e inglês. O idioma padrão é `pt-BR`; a escolha fica em `localStorage`, na chave `cv-language`. O atributo `html.lang`, o título da página, a descrição, os textos e os rótulos acessíveis acompanham a seleção. Nomes de instituições, projetos e tecnologias permanecem originais. Os nomes dos idiomas no seletor usam suas próprias línguas para facilitar sua identificação.

Arquivos criados: `locales/pt-BR.json`, `locales/es-AR.json`, `locales/en.json`, `js/locales.js`, `js/i18n.js`, `tests/i18n.mjs`, `tests/sync-locales.mjs` e `tests/browser.html`. Arquivos modificados: `index.html`, `js/main.js`, `css/style.css`, `css/responsive.css`, `tests/verify.mjs` e este README. O CSS de impressão e o PDF original foram preservados.



#### Validação atual

```text
07-gerenciamento-cv/
├── index.html
├── css/
│   ├── style.css          # Identidade visual, componentes e temas
│   ├── responsive.css     # Adaptações de layout
│   └── print.css          # Versão limpa para A4
├── js/
│   └── main.js            # Interações e melhoria progressiva
├── assets/
│   └── favicon.svg        # Marca vetorial original
├── tests/
│   └── verify.mjs         # Verificações sem dependências
├── README.md
├── .gitignore
└── Richard Balestrim (Atualizado).docx.pdf  # Original preservado
```




