# Revisão de privacidade — 12/11/2026

## Alterações

Removidos do HTML os links de e-mail e celular, inclusive seus textos visíveis. Removidos os rótulos sem uso dos três catálogos de tradução e do catálogo JavaScript gerado. LinkedIn, GitHub e portfólio foram preservados. Nenhuma alteração em CSS, experiências, competências, formação ou projetos.

Os testes que exigiam contatos no HTML foram atualizados; verificações de privacidade cobrem os recursos da interface e o DOM após a troca de idioma.

## Exposição que permanece

- Os cinco PDFs versionados contêm e-mail e telefone no texto: o documento original na raiz e os quatro arquivos em `assets/cv/` (incluindo a versão sem sufixo de idioma). Todos foram comparados com HEAD por SHA-256 e permanecem intactos. Os três downloads por idioma continuam disponíveis.
- Não foram encontrados esses contatos nos metadados convencionais nem nas URLs de anotações dos cinco PDFs. Isso não significa que os documentos estejam anonimizados: o texto contém os dados.
- `scripts/generate-cv.py` e `tests/test_pdfs.py` ainda contêm os valores pessoais usados na geração e validação dos documentos oficiais. Esses arquivos são consultáveis no repositório público e podem ser servidos se incluídos na publicação estática. Foram preservados para manter o comportamento dos documentos oficiais.
- Não foram encontrados endereços de e-mail, o número pessoal ou links `mailto:`/`tel:` em HTML, CSS, JavaScript ou catálogos de tradução da interface após a alteração. O HTML inclui seus metadados nessa verificação.
- O histórico Git conserva versões anteriores com os contatos. Caches, indexadores, cópias e downloads anteriores podem conservá-los; esta alteração não os elimina.
- Nome, localização e outros dados biográficos permanecem conforme o escopo solicitado.

Remover os contatos da interface reduz a exposição direta, mas os PDFs públicos continuam permitindo sua consulta. Uma revisão dos PDFs e de seus arquivos de geração exige autorização separada. Reescrita do histórico também exige avaliação própria.

## Validação local

Executar na raiz deste repositório:

```powershell
node --test tests/verify.mjs tests/i18n.mjs tests/download.mjs tests/official-cv.mjs tests/privacy.mjs
node tests/sync-locales.mjs --check
python -m unittest discover -s tests -p 'test_*.py'
```

Para integração em Chromium, iniciar `python -m http.server 8765 --bind 127.0.0.1` e executar `node tests/run-browser.mjs` em outro terminal. O teste verifica traduções, responsividade de 320 a 1280 pixels, menus, temas, ausência de contatos no DOM e downloads nos três idiomas.

O trabalho foi feito em uma cópia local de `qa-digital-cv` dentro do workspace `qa-portfolio`, pois o repositório inicialmente aberto era o portfólio. Nenhum commit, push ou publicação foi realizado; o site publicado não foi atualizado por este trabalho.
