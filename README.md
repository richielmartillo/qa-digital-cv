# Richard Marlon Balestrim · Currículo digital

Aplicação local e independente em HTML5, CSS3 e JavaScript Vanilla. A identidade combina grafite, dourado envelhecido, geometria industrial e pequenos detalhes verdes. Os elementos gráficos são originais, construídos em CSS e SVG, sem imagens ou símbolos de franquias.

## Executar localmente

Abra `index.html` no Chrome, Edge, Firefox ou outro navegador moderno. Não é necessário instalar pacotes, compilar, iniciar servidor ou se conectar à internet para consultar o conteúdo. Os links profissionais externos precisam de internet.

Clique em **Imprimir / Salvar PDF** e escolha **Salvar como PDF** no diálogo de impressão do navegador. O botão chama `window.print()`; ele não baixa o documento original. Sem JavaScript, utilize `Ctrl+P` ou a opção Imprimir do navegador.

## Estrutura

### Internacionalização — atualização de 08/11/2026

O globo no cabeçalho alterna imediatamente entre português brasileiro, espanhol argentino e inglês. O idioma padrão é `pt-BR`; a escolha fica em `localStorage`, na chave `cv-language`. O atributo `html.lang`, o título da página, a descrição, os textos e os rótulos acessíveis acompanham a seleção. Nomes de instituições, projetos e tecnologias permanecem originais. Os nomes dos idiomas no seletor usam suas próprias línguas para facilitar sua identificação.

Arquivos criados: `locales/pt-BR.json`, `locales/es-AR.json`, `locales/en.json`, `js/locales.js`, `js/i18n.js`, `tests/i18n.mjs`, `tests/sync-locales.mjs` e `tests/browser.html`. Arquivos modificados: `index.html`, `js/main.js`, `css/style.css`, `css/responsive.css`, `tests/verify.mjs` e este README. O CSS de impressão e o PDF original foram preservados.

`js/i18n.js` centraliza a aplicação de traduções. Cada `data-i18n` referencia uma chave do catálogo. O mecanismo atualiza apenas os nós de texto diretos correspondentes, preservando os filhos, as marcações e os eventos existentes. Um elemento pode ter várias chaves separadas por espaço quando contém mais de um texto direto. Atributos usam `data-i18n-aria-label` e `data-i18n-content`. O tema consulta o mesmo catálogo para atualizar o nome de sua próxima ação.

Os JSON são a fonte de manutenção. `js/locales.js` é um pacote gerado localmente, carregado por uma tag `script`: assim a página continua funcionando por `file://`, sem servidor, `fetch` ou dependências. Após corrigir uma tradução nos JSON, execute:

```powershell
node tests/sync-locales.mjs
node tests/sync-locales.mjs --check
node --test tests/verify.mjs tests/i18n.mjs
```

Para acrescentar texto, crie a mesma chave nos três JSON e associe-a a `data-i18n` no elemento que contém o texto direto em português. Prefira nomes descritivos para novas chaves. O texto inicial no HTML deve corresponder ao valor em `pt-BR.json`, inclusive pontuação; ele garante leitura sem JavaScript. Depois regenere `js/locales.js` e execute os testes. Não edite o pacote gerado diretamente. Sem JavaScript, apenas a versão portuguesa fica disponível e a impressão pode ser aberta por Ctrl+P.

Existe apenas o PDF original, sem versões confirmadas em espanhol ou inglês. **Imprimir / Salvar PDF** imprime o conteúdo do idioma ativo; o visitante escolhe salvar como PDF no diálogo do navegador. O botão não baixa um arquivo traduzido previamente. Cursos recolhidos são expandidos para impressão e restaurados depois.

#### Validação atual

Em 08/11/2026: **15 testes Node aprovados**, pacote de idiomas sincronizado e **598 verificações no Chrome headless aprovadas**. `tests/browser.html` executa os scripts reais em um iframe, valida os textos ligados às chaves nos três idiomas, PT → ES → EN → PT, persistência após recarga, rótulos acessíveis, tema após tradução, fechamento por Escape/clique externo, foco, setas, acionamento da impressão e ausência de erros durante a alternância. As medidas dos controles e do menu foram verificadas nas larguras de 320, 375, 700, 768, 1024 e 1280 px nos três idiomas. Abra esse arquivo no navegador para repetir; o resultado aparece em `SUCCESS` ou `FAIL`. O teste limpa a preferência de idioma ao terminar.

Essas medições confirmam que os controles não se sobrepõem; não substituem revisão visual completa. Ainda não foram validados com leitor de tela, outros navegadores ou dispositivos físicos. O diálogo nativo de impressão é substituído no teste por uma função que conta chamadas: a paginação e a aparência final de um PDF exportado precisam de conferência manual. A seção histórica abaixo registra as verificações anteriores e suas limitações naquela data.

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

As pastas `tmp/` e `output/`, se presentes durante a revisão, são locais e ignoradas. As imagens temporárias do documento original foram removidas depois da leitura.

## Conteúdo e fidelidade ao currículo

O PDF original de duas páginas foi extraído e revisado visualmente antes do desenvolvimento. Foram preservados os períodos **agosto/2026–atual**, **2022–atual** e **2016–2022**, as responsabilidades profissionais, a formação EBAC **em andamento**, o ensino médio completo, os idiomas e os cursos complementares.

- A experiência de QA é a atuação freelancer em projetos pontuais de crowdtesting na uTest. As experiências anteriores foram mantidas com seus cargos reais.
- Os dois projetos apresentados são os repositórios de Cypress e Postman do **Hub de Leitura**, documentados no PDF, como projetos de estudo da EBAC de 2026.
- Appium, k6, JMeter e Jenkins aparecem nas competências, sem serem apresentados como projetos ou resultados profissionais comprovados.
- Jest e testes regressivos foram omitidos porque não constam no PDF e não havia outros arquivos locais que os comprovassem.
- Não há porcentagens de proficiência, métricas de resultado, certificações ou repositórios inventados. O grafismo de código dos cards é decorativo e não representa execução ou resultados de testes.
- O LinkedIn e os dois repositórios usam os endereços documentados. O link de contato do GitHub aponta para o perfil do mesmo proprietário dos repositórios. O portfólio existente não foi modificado nem integrado à aplicação.
- Os títulos e descrições foram adaptados para leitura na web sem ampliar o escopo das experiências. A vivência Brasil–Argentina foi resumida; detalhes biográficos não necessários não foram reproduzidos.
- O conteúdo é estático. Datas e status de atuação não são atualizados automaticamente.

## Funcionalidades e arquitetura

- Sete seções com HTML semântico, títulos hierárquicos e links de âncora nativos.
- Navegação lateral no desktop e menu expansível em celulares. Escape fecha o menu e devolve o foco ao botão; escolher uma seção leva o foco ao conteúdo.
- Rolagem suave, indicador de seção ativa, retorno ao topo e animações discretas de entrada. O indicador usa a posição real das seções, com atualização limitada por `requestAnimationFrame`.
- Alternância entre tema futurista escuro e tema minimalista claro, sem persistência. O atributo `aria-pressed` informa o estado do tema minimalista.
- Efeito de terminal e ilustração de QA feitos com HTML/CSS. Não há canvas contínuo, imagens remotas, fontes remotas ou animações pesadas.
- `prefers-reduced-motion` desativa animações e rolagem suave. O JavaScript não inicia animações de entrada quando essa preferência já está ativa.
- JavaScript encapsulado em uma IIFE com funções específicas, sem variáveis globais, injeção de HTML ou módulos que exijam servidor. Os recursos estão separados entre estrutura, aparência e comportamento.
- Sem JavaScript, todas as seções permanecem visíveis, a navegação móvel fica expandida, os links funcionam e a impressão pode ser acionada pelo navegador. Controles que dependem de JavaScript permanecem ocultos.
- A impressão usa fundo branco, texto escuro, URLs legíveis, margens A4 de 15 mm e regras para reduzir cortes em experiências, cursos e projetos. O JavaScript expande os cursos antes da impressão e restaura seu estado ao terminar.

## Privacidade e segurança

- Telefone e e-mail do PDF foram excluídos de HTML, CSS, JavaScript e SVG, inclusive comentários e metadados. O contato público fica restrito a LinkedIn e GitHub.
- Não há formulários, rastreamento, cookies, bibliotecas, CDN, requisições de dados ou serviços externos. Apenas a preferência de idioma é salva no localStorage (`cv-language`); armazenamento bloqueado não impede a tradução.
- Links externos usam HTTPS, `target="_blank"` e `rel="noopener noreferrer"`. Os textos indicam a abertura de outra aba para leitores de tela.
- Elementos decorativos estão fora da árvore de acessibilidade. Há link para pular a navegação, foco visível, botões nativos, idioma `pt-BR` e indicadores que usam mais que cor.
- O PDF original não está ligado ou incorporado ao site. Sua integridade foi verificada comparando SHA-256 antes e depois do trabalho.
- O `.gitignore` não remove o PDF de um eventual versionamento: a preservação do arquivo original é intencional. Em uma publicação futura, envie **somente** `index.html`, `css/`, `js/` e `assets/`, para não disponibilizar o PDF privado ou outros arquivos locais. Nenhuma publicação foi realizada.

## Validação anterior em 02/11/2026 (histórico)

Com Node.js instalado, execute a partir desta pasta:

```powershell
node --check js/main.js
node --test tests/verify.mjs
```

**Resultado: 11 testes aprovados.** A suíte verifica:

1. Destinos de âncoras, IDs únicos e presença das sete seções.
2. Existência dos recursos locais e ausência de vínculo com o PDF original.
3. HTTPS e proteção dos links externos.
4. Ausência das APIs de injeção de HTML, rede e cookies verificadas.
5. Abertura do menu, Escape e restauração do foco.
6. Fechamento do menu ao navegar, foco na seção e troca do breakpoint.
7. Alternância de tema e estado acessível.
8. Chamada de impressão, expansão e restauração dos cursos.
9. Seção ativa e botão de retorno em diferentes posições de rolagem.
10. Comportamento com movimento reduzido e sem `IntersectionObserver`.
11. Contraste mínimo de 4,5:1 em 11 pares principais de texto/fundo dos dois temas, por cálculo de luminância WCAG.

Também foram executadas verificações locais de balanceamento de tags HTML e delimitadores CSS, busca do telefone/e-mail reais do PDF nos arquivos públicos, ausência de `mailto:`/`tel:` e comparação do hash do documento original. Todas passaram. A checagem de sintaxe JavaScript passou.

### Limitações reais

Os testes de comportamento executam o JavaScript em `node:vm` com substitutos de DOM e eventos. Eles verificam a lógica, mas **não comprovam renderização, integração real com o navegador ou ausência de erros no console do navegador**.

O controle de abas informou que o host do navegador estava indisponível. A alternativa pela interface nativa do Chrome também foi interrompida porque a automação não conseguiu determinar a URL atual com segurança. Portanto, **não foram executados testes visuais reais** nas resoluções 1920 × 1080, 1366 × 768, 768 × 1024 e 390 × 844; nem validação real por teclado, leitor de tela, JavaScript desativado, preferência de movimento ou prévia de impressão. As regras correspondentes foram implementadas e revisadas no código. Não foi gerado um PDF final da página nem verificada sua paginação.

A tentativa de checar os quatro endereços profissionais por HTTP foi bloqueada pelo ambiente de rede; a alternativa pela ferramenta de navegação também não recuperou os endereços. **Disponibilidade externa não confirmada**. Os links foram mantidos com base no documento, sem presumir que uma falha de acesso significa link inválido.

O contraste calculado cobre os principais pares de cores definidos, não todas as combinações compostas, pseudoelementos ou estados renderizados. Não foi realizada auditoria completa de conformidade WCAG 2.2 AA.

### Revisão manual pendente no navegador

| Cenário | Procedimento e resultado esperado |
| --- | --- |
| 1920 × 1080 e 1366 × 768 | Conferir hero, painel QA, trilha lateral e alinhamentos, sem sobreposição ou rolagem horizontal. |
| 768 × 1024 | Conferir reorganização de colunas, leitura dos cards e navegação lateral. |
| 390 × 844 | Abrir menu, navegar, fechar com Escape, conferir os dois temas e ausência de cortes horizontais. |
| Teclado | Usar Tab, Shift+Tab, Enter, Espaço e Escape. Conferir link de salto, foco visível, resumo expansível e retorno ao topo. |
| Leitor de tela | Conferir landmarks, títulos, nomes de links, seção ativa e estado dos botões. |
| Movimento reduzido | Ativar a preferência no sistema, recarregar e conferir que não há animações nem rolagem suave. |
| Sem JavaScript | Desativar para a página, recarregar e conferir conteúdo, navegação expandida e Ctrl+P. |
| Impressão | Fechar os cursos, clicar em Baixar currículo, escolher A4 e verificar todos os cursos, URLs, margens e quebras. Cancelar e conferir que os cursos voltam ao estado anterior. |
| Console e rede | Conferir ausência de erros e requisições externas durante a leitura; abrir cada link profissional. |

## Melhorias futuras

Priorizar a revisão visual e de impressão pendente em navegadores reais, seguida de auditoria com leitor de tela. Incluir novos projetos ou tecnologias somente com evidências e URLs fornecidas. Atualizar manualmente datas, cursos e formação conforme a evolução profissional. Qualquer publicação ou integração externa deve ser solicitada separadamente.

Nenhum commit ou push foi realizado. Nenhum outro repositório foi alterado.
