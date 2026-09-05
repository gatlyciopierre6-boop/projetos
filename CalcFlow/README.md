# CalcFlow

Calculadora web moderna, responsiva e instalável, desenvolvida com **HTML**, **CSS** e **JavaScript puro**. O CalcFlow oferece operações básicas e avançadas em uma interface rápida, elegante e intuitiva.

> **Fast • Elegant • Smart**

## Demonstração

- **Repositório:** [gatlyciopierre6-boop/projetos](https://github.com/gatlyciopierre6-boop/projetos/tree/main/CalcFlow)
- **Hospedagem local:** siga as instruções abaixo para executar o projeto no seu computador.

## Funcionalidades

- Operações básicas de adição, subtração, multiplicação e divisão.
- Porcentagem, raiz quadrada e potência.
- Parser matemático seguro, sem uso de `eval()`.
- Histórico de até 20 cálculos com persistência em `localStorage`.
- Tema claro e escuro com preferência salva no navegador.
- Suporte ao teclado, incluindo números, operadores, Enter e Backspace.
- Layout responsivo para computadores, tablets e celulares.
- Manifesto e favicon personalizados para uso como aplicação web instalável.

## Tecnologias

- HTML5
- CSS3, incluindo CSS Grid, Flexbox e variáveis de tema
- JavaScript ES6+
- Web Storage API (`localStorage`)
- Web App Manifest

## Estrutura do projeto

```text
CalcFlow/
├── index.html       # Estrutura da aplicação
├── script.js        # Cálculos, histórico, temas e teclado
├── style.css        # Layout, temas e responsividade
├── manifest.json    # Configuração da aplicação instalável
├── .gitignore       # Arquivos ignorados pelo Git
└── README.md        # Documentação do projeto
```

## Executar localmente

O projeto não exige instalação de dependências. Para evitar limitações de segurança ao abrir arquivos diretamente, recomenda-se iniciar um servidor HTTP local.

### Python

Na pasta `CalcFlow`, execute:

```bash
python3 -m http.server 5500
```

Depois, abra [http://localhost:5500](http://localhost:5500) no navegador.

### Node.js

Se preferir usar Node.js, execute:

```bash
npx serve . -l 5500
```

Em seguida, acesse [http://localhost:5500](http://localhost:5500).

Para encerrar o servidor, pressione `Ctrl+C` no terminal.

## Como usar

1. Digite os números pelos botões ou pelo teclado.
2. Selecione um operador e conclua a expressão com `=` ou `Enter`.
3. Use `C` para limpar, `⌫` para apagar o último caractere e o botão de tema para alternar entre os modos claro e escuro.
4. Clique em um item do histórico para reutilizar o resultado.

## Autor

Desenvolvido por **John Pierre**.

## Licença

Este projeto é destinado a fins educacionais e de portfólio.
