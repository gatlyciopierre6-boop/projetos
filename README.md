# Meus Projetos

Repositório que reúne projetos independentes, ferramentas e aplicações desenvolvidas para estudo, portfólio e resolução de problemas reais.

## Projetos

### CalcFlow

Calculadora web responsiva desenvolvida com **HTML**, **CSS** e **JavaScript puro**.

**Recursos principais:**

- Operações básicas, porcentagem, raiz quadrada e potência.
- Parser seguro de expressões, sem uso de `eval()`.
- Histórico de cálculos salvo no navegador com `localStorage`.
- Tema claro e escuro com persistência.
- Suporte ao teclado.
- Manifesto PWA e layout responsivo.

| Item | Link |
|---|---|
| Código-fonte | [Abrir pasta CalcFlow](./CalcFlow) |
| README do projeto | [Ler documentação](./CalcFlow/README.md) |
| Arquivo principal | [Abrir index.html](./CalcFlow/index.html) |

## Executar o CalcFlow localmente

Acesse a pasta do projeto no terminal e inicie um servidor HTTP local:

```bash
git clone https://github.com/gatlyciopierre6-boop/projetos.git
cd projetos/CalcFlow
python3 -m http.server 5500
```

Depois, abra [http://localhost:5500](http://localhost:5500) no navegador.

Também é possível usar Node.js:

```bash
npx serve . -l 5500
```

O CalcFlow é uma aplicação estática e não precisa instalar dependências para funcionar.

## Status

Em constante evolução. Novos projetos serão adicionados ao repositório.

## Autor

Desenvolvido por **John Pierre**.
