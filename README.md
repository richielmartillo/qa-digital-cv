# Currículo digital — Richard Marlon Balestrim

Currículo em HTML5, CSS3 e JavaScript puro. Navegação lateral com sete seções, temas futurista e minimalista e versões pt-BR, es-AR e en. Sem frameworks, fontes remotas ou dependências de produção.

## Fonte oficial e conteúdo

As duas páginas de `Richard Balestrim (Atualizado).docx.pdf` foram lidas e conferidas visualmente em 10/11/2026. O documento é a fonte das informações profissionais. A interface organiza o conteúdo sem acrescentar experiências, certificações ou resultados.

Preserva objetivo de Analista de Qualidade de Software; resumo; tecnologias; formação EBAC em andamento; ensino médio; uTest (agosto/2026–atual), Anthor (2022–atual) e Senado argentino (2016–2022); projetos Hub de Leitura; oito cursos complementares; idiomas e vivência internacional. Telefone `44 999430660` e e-mail `richardbalestrim8@gmail.com` estão visíveis e acionáveis. Os links dos projetos e do portfólio seguem o documento. O PDF mostra o endereço GitHub do portfólio, mas sua anotação aponta ao GitHub Pages: ambos foram preservados na navegação e no contato.

## Download oficial

**Baixar currículo** é um link HTML com `download`, para `assets/cv/Richard_Marlon_Balestrim_CV.pdf`. Funciona sem JavaScript. O caminho relativo atende abertura local e hospedagem na subpasta `/qa-digital-cv/` do GitHub Pages.

O mesmo PDF original em português é disponibilizado em todos os idiomas; o aviso visível e a descrição acessível deixam isso explícito. Não há geração de PDF nem chamada a `window.print()`. A impressão manual do navegador continua disponível como função nativa, separada do download oficial.

O original da raiz foi preservado. A cópia tem os mesmos 141.413 bytes. SHA-256 de ambos:

<<<<<<< HEAD


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




=======
```text
55aeac1f9e297b7415038956cc07b06bde70345ba00f92853a2b759736e02788
```

Identidade dos bytes preserva as duas páginas, fontes, espaçamentos, colunas, conteúdo e links. Nenhuma conversão ou edição do PDF foi feita.

O atributo `download` solicita salvamento em contexto de mesma origem. Preferências do navegador, visualizadores e políticas de dispositivos podem abrir uma prévia; nesse caso, o visitante pode salvar o próprio arquivo pelo visualizador. O download efetivamente salvo pelo diálogo nativo não foi automatizado; o teste verifica atributo, URL, resposta HTTP, tipo PDF e hash dos bytes servidos.

## Interface e idiomas

Preto e grafite, dourado metálico, verde discreto, painéis técnicos, geometria e iluminação moderada. Elementos feitos em CSS, sem imagens, personagens ou logotipos de franquias. Textos profissionais com leitura ampliada; contatos quebram linha em telas estreitas. Conteúdo permanece acessível sem animações e o modo minimalista desativa a animação de entrada.

Os catálogos em `locales/` têm chaves equivalentes. `js/locales.js` é a versão embutida gerada para permitir uso também por `file://`, sem fetch. O seletor atualiza textos, descrições acessíveis e atributo `lang`, mantém o tema e grava `cv-language` no localStorage. Armazenamento bloqueado não impede a tradução; nesse caso a preferência não persiste.

Após editar catálogos:

```powershell
node tests/sync-locales.mjs
```

## Executar e testar

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

Abra `http://127.0.0.1:8765/` para revisar ou `http://127.0.0.1:8765/tests/browser.html` para as verificações no navegador.

```powershell
node --test tests/verify.mjs tests/i18n.mjs tests/official-cv.mjs
node tests/sync-locales.mjs --check
node --check js/main.js
node --check js/i18n.js
git diff --check
```

Resultados em 10/11/2026:

- 18 testes Node aprovados: estrutura, recursos, navegação, teclado, temas, i18n, persistência, fatos profissionais, download, caminhos GitHub Pages e SHA-256.
- 652 verificações aprovadas no Chrome headless: cobertura de textos nos três idiomas, recarga da preferência, menus, foco, temas, controles sem sobreposição e ausência de rolagem horizontal em 320, 375, 700, 768, 1024 e 1280 px; resposta HTTP e integridade do PDF; nenhum erro JavaScript capturado durante as interações.
- Revisão visual do desktop em 1440 × 1000 e viewport mobile de 390 × 844. Imagens locais em `tmp/`, fora do versionamento.
- Catálogos sincronizados, sintaxe JavaScript e diff sem erros.

Os testes de conteúdo verificam fatos selecionados e integridade, complementados pela revisão manual das duas páginas; não são um validador semântico automático de traduções. Testes de contraste cobrem as principais combinações, não substituem uma auditoria completa de acessibilidade.

## Arquivos desta atualização

Modificados: `index.html`, `css/style.css`, `css/responsive.css`, `js/main.js`, `js/i18n.js`, `js/locales.js`, os três catálogos em `locales/`, `tests/verify.mjs`, `tests/i18n.mjs`, `tests/browser.html`, `.gitignore` e `README.md`.

Criados: `assets/cv/Richard_Marlon_Balestrim_CV.pdf` e `tests/official-cv.mjs`.

## Revisão antes do commit

1. Confira conteúdo e traduções, principalmente cargos, períodos e contatos.
2. Navegue por teclado e teste ambos os temas e os três idiomas.
3. Clique em Baixar currículo, salve e abra o arquivo: devem aparecer as duas páginas originais em português. Compare os hashes com `Get-FileHash -Algorithm SHA256`.
4. Faça revisão em Safari/iOS e Android reais, Firefox, zoom de 200% e leitor de tela. Esses ambientes não foram testados aqui.
5. Revise `git diff` e `git status`, incluindo o novo PDF em assets, antes de decidir pelo commit.

Nenhum commit, push, deploy ou alteração da configuração do GitHub Pages foi realizado. A compatibilidade de caminho foi testada localmente; a hospedagem pública ainda deve ser conferida após a publicação pelo responsável.
>>>>>>> d44ba21 (feat: atualizar curriculo digital com design futurista e PDF oficial)
