# Currículo digital — Richard Marlon Balestrim

HTML5, CSS3 e JavaScript puro, com interface futurista, modo minimalista, navegação lateral e idiomas pt-BR, es-AR e en. Sem frameworks ou dependências de produção. Esta atualização altera somente documentos, seleção de download, textos de ajuda e testes; preserva o conteúdo profissional e o visual do site.

## Downloads por idioma

| Idioma selecionado | Arquivo em `assets/cv/` | Documento |
| --- | --- | --- |
| pt-BR | `Richard_Marlon_Balestrim_CV_PT.pdf` | Original EBAC em português, bytes preservados |
| es-AR | `Richard_Marlon_Balestrim_CV_ES.pdf` | Tradução completa para espanhol argentino |
| en | `Richard_Marlon_Balestrim_CV_EN.pdf` | Tradução completa para inglês profissional |

Os três documentos estão disponíveis localmente no repositório. Os PDFs traduzidos foram gerados a partir do conteúdo integral das duas páginas do original, sem acrescentar experiências, competências ou certificações. São traduções produzidas para este projeto, não documentos emitidos pela EBAC.

Ambas as traduções preservam Arial, corpo de 10 pontos, títulos em cinza, identidade e contatos em duas colunas, marcadores, links, ordem das seções e divisão em duas páginas. O cabeçalho de projetos permanece no fim da primeira página e o conteúdo continua na segunda, como no original. São A4 (595,28 × 841,89 pt); o arquivo original tem dimensões arredondadas de 596 × 842 pt e não foi alterado. A quebra de linhas e os espaçamentos menores se ajustam às traduções.

O original da raiz e a cópia PT são idênticos. SHA-256:

```text
55aeac1f9e297b7415038956cc07b06bde70345ba00f92853a2b759736e02788
```

O antigo `assets/cv/Richard_Marlon_Balestrim_CV.pdf` também foi preservado para compatibilidade com links anteriores. A interface agora utiliza os nomes com sufixos PT, ES e EN.

## Seleção e tratamento de falhas

`js/download.js` contém o mapa explícito de idiomas e caminhos relativos. A troca de idioma existente em `js/i18n.js` chama `CVDownload.setLanguage`, atualizando `href`, nome de download e `hreflang`. A persistência em localStorage, navegação e temas continuam funcionando.

Em HTTP/HTTPS, o clique busca o arquivo do idioma selecionado, verifica o status da resposta e a assinatura `%PDF-`, e disponibiliza exatamente os bytes recebidos usando uma URL de Blob. Não há geração ou tradução no navegador, impressão ou substituição silenciosa por português. Os textos auxiliares informam o idioma correspondente.

Arquivo ausente (404), resposta HTML, arquivo vazio, falha de rede ou limite de 15 segundos exibem um aviso no idioma selecionado. Trocar de idioma cancela a operação anterior; cliques repetidos durante a mesma requisição não criam downloads duplicados.

Por `file://`, o link nativo aponta para o documento correspondente, pois navegadores restringem fetch entre arquivos locais. Nesse modo não é possível detectar programaticamente a ausência do arquivo e apresentar o aviso personalizado. Use um servidor local para validar todos os comportamentos. Sem JavaScript, o conteúdo e o download padrão permanecem em português.

Todos os caminhos são relativos e resolvem sob `/qa-digital-cv/` no GitHub Pages. Não houve alteração de configuração de hospedagem, publicação, commit ou push.

## Traduções e geração reproduzível

- `documents/translations/cv.json`: conteúdo integral dos PDFs ES/EN, separado dos textos da interface.
- `scripts/generate-cv.py`: geração em ReportLab com limites de conteúdo por bloco e cópia binária do original para PT.
- `locales/*.json`: textos da interface; `js/locales.js` é seu catálogo embutido.

Para gerar os documentos, são necessários Python, ReportLab e as fontes Arial regular, negrito, itálico e negrito-itálico. O script usa `C:/Windows/Fonts` ou a pasta indicada por `CV_FONT_DIR`; não distribui os arquivos TTF. A geração falha se o hash da fonte oficial mudar ou se algum bloco exceder seu espaço reservado.

```powershell
python scripts/generate-cv.py
node tests/sync-locales.mjs
```

Depois de alterar traduções ou gerar PDFs, revise visualmente as duas páginas de cada documento. Testes de texto não substituem essa revisão. Não substitua o PDF português por uma reconstrução.

## Executar e testar

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

Abra `http://127.0.0.1:8765/` para revisar e `http://127.0.0.1:8765/tests/browser.html` para os testes de navegador.

```powershell
node --test tests/verify.mjs tests/i18n.mjs tests/official-cv.mjs tests/download.mjs
python -m unittest discover -s tests -p 'test_*.py'
# Com o servidor local iniciado e Chrome instalado:
node tests/run-browser.mjs
node tests/sync-locales.mjs --check
node --check js/download.js
node --check js/i18n.js
git diff --check
```

Os testes Python usam PyMuPDF (`pymupdf`) e `pypdf`; não são dependências do site. O runner de navegador utiliza Node com WebSocket nativo (Node 22+) e Chrome instalado; aceita `CHROME_BIN` e `CV_BASE_URL`. Executa em tempo real, salva evidências em uma pasta própria de `tmp/` e encerra sua instância de Chrome.

Resultados desta atualização:

- **24 testes Node aprovados:** três downloads e seus bytes, nomes, caminhos GitHub Pages, erros e indisponibilidade sem fallback, cancelamento, cliques repetidos, modo file, hash do original, navegação, temas, teclado, catálogos e persistência.
- **5 testes Python aprovados:** parser estrito, três documentos válidos de duas páginas A4, hash original, todo o conteúdo traduzido presente, contatos, tecnologias, links, organização por página, fontes Arial incorporadas e limites do texto.
- **698 verificações no Chrome aprovadas:** traduções, persistência, menus, temas, downloads por clique em desktop e mobile, bytes recebidos e mensagem de indisponibilidade. Layout sem sobreposição de controles ou rolagem horizontal em 320, 375, 700, 768, 1024 e 1280 px. Nenhum erro JavaScript capturado nas interações.
- **6 downloads nativos salvos pelo Chrome headless:** PT, ES e EN em viewports de 1280 e 375 px. Cada arquivo salvo foi comparado por SHA-256 com seu PDF correspondente no projeto.
- As quatro páginas traduzidas foram renderizadas e revisadas visualmente. Os PNGs de revisão ficam em `tmp/pdfs/`, fora do versionamento.

A página `tests/browser.html` captura a ação final de salvamento para conferir o Blob. O runner `tests/run-browser.mjs` também realiza seis downloads nativos sem essa interceptação, verificando os arquivos efetivamente gravados. A confirmação interativa do diálogo do sistema operacional não é automatizada. Dependendo das preferências do navegador, especialmente em dispositivos móveis, o PDF pode abrir em um visualizador que permite salvar ou compartilhar o mesmo arquivo.

## Arquivos desta atualização

Criados: os três PDFs com sufixos PT/ES/EN; `documents/translations/cv.json`; `scripts/generate-cv.py`; `js/download.js`; `tests/download.mjs`; `tests/test_pdfs.py`; `tests/run-browser.mjs`.

Modificados: `index.html`; `js/i18n.js`; `js/locales.js`; os três catálogos em `locales/`; `tests/browser.html`; `tests/i18n.mjs`; `tests/official-cv.mjs`; `tests/verify.mjs`; `README.md`.

## Revisão antes do commit

1. Selecione cada idioma e baixe seu PDF. Confira as duas páginas, contatos, cargos, períodos e links.
2. Compare a cópia PT com o original usando `Get-FileHash -Algorithm SHA256`.
3. Revise as traduções ES/EN e, se alterar o JSON, gere novamente e revise todas as páginas.
4. Confira em Safari/iOS e Android físicos, Firefox e leitor de tela; esses ambientes não foram testados aqui.
5. Revise `git diff` e `git status`. Inclua os três novos PDFs e `js/download.js` na publicação futura.

Esta atualização é local. A nova versão só ficará disponível no GitHub Pages após o commit/push e a publicação feitos pelo responsável. A URL pública não foi alterada nem validada nesta atualização local.
