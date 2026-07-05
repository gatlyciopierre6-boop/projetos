/**
 * CalcFlow — Fast • Elegant • Smart
 * 
 * CalcFlow é uma aplicação web moderna desenvolvida com HTML, CSS e JavaScript,
 * oferecendo uma interface elegante, responsiva e intuitiva para cálculos rápidos e eficientes.
 * 
 * Funcionalidades:
 * - Operações básicas: +, -, ×, ÷
 * - Operações avançadas: %, √ (raiz quadrada), x² (potência)
 * - Histórico de cálculos com LocalStorage
 * - Tema claro/escuro com persistência
 * - Suporte completo a teclado
 * - Display de expressão e resultado
 * - Tratamento de erros robusto
 * 
 * @author Jhon Wensky Pierre
 * @version 3.0
 * @project CalcFlow
 */

// ===== Referências DOM =====
const display = document.getElementById('display');
const expression = document.getElementById('expression');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const themeToggle = document.getElementById('themeToggle');

// ===== Estado =====
let currentExpression = '';
let lastResult = null;
let isNewCalculation = false;
let history = [];

// ===== Inicialização =====
window.addEventListener('load', function () {
    loadTheme();
    loadHistory();
    display.value = '0';
});

// ===== Funções Principais =====

/**
 * Adiciona um número ao display
 * @param {string} num - O número a ser adicionado
 */
function appendNumber(num) {
    if (isNewCalculation) {
        display.value = '';
        expression.textContent = '';
        isNewCalculation = false;
    }

    // Evita múltiplos pontos decimais no mesmo número
    if (num === '.') {
        const parts = currentExpression.split(/[\+\-\*\/]/);
        const lastPart = parts[parts.length - 1];
        if (lastPart.includes('.')) {
            return;
        }
    }

    // Se o display mostra "0" ou "Erro", substitui pelo número
    if (display.value === '0' || display.value === 'Erro' || display.value === 'Infinity') {
        display.value = num;
        currentExpression = num;
    } else {
        display.value += num;
        currentExpression += num;
    }
}

/**
 * Adiciona um operador matemático ao display
 * @param {string} operator - O operador (+, -, *, /, **)
 */
function appendOperator(operator) {
    isNewCalculation = false;

    // Se o display está vazio ou mostra erro, não faz nada
    if (display.value === '' || display.value === 'Erro') {
        return;
    }

    const displaySymbol = getDisplaySymbol(operator);

    // Se o último caractere é um operador, substitui
    const lastChar = currentExpression[currentExpression.length - 1];
    if (['+', '-', '*', '/'].includes(lastChar)) {
        currentExpression = currentExpression.slice(0, -1) + operator;
        // Atualiza a expressão visual
        const visualExpr = formatExpression(currentExpression);
        expression.textContent = visualExpr;
        display.value = displaySymbol;
        isNewCalculation = true; // Próximo número substitui o display
        return;
    }

    // Se o último caractere já é o mesmo operador, não faz nada
    if (currentExpression.endsWith(operator)) {
        return;
    }

    currentExpression += operator;
    const visualExpr = formatExpression(currentExpression);
    expression.textContent = visualExpr;
    display.value = displaySymbol;
    isNewCalculation = true; // Próximo número substitui o display
}

/**
 * Calcula o resultado da expressão usando uma abordagem segura (sem eval)
 */
function calculate() {
    if (currentExpression === '' || display.value === 'Erro') {
        return;
    }

    try {
        const sanitized = sanitizeExpression(currentExpression);
        const result = safeCalculate(sanitized);

        if (result === null || !isFinite(result) || isNaN(result)) {
            display.value = 'Erro';
            expression.textContent = '';
            currentExpression = '';
            return;
        }

        // Formata o resultado (remove trailing zeros desnecessários)
        const formattedResult = parseFloat(result.toPrecision(12));
        const expressionStr = formatExpression(currentExpression);

        // Salva no histórico
        addToHistory(expressionStr, formattedResult);

        // Atualiza o display
        expression.textContent = expressionStr + ' =';
        display.value = formattedResult.toString();
        currentExpression = formattedResult.toString();
        lastResult = formattedResult;
        isNewCalculation = true;

        // Efeito visual de sucesso
        display.classList.add('flash');
        setTimeout(() => display.classList.remove('flash'), 400);

    } catch (error) {
        display.value = 'Erro';
        expression.textContent = '';
        currentExpression = '';
        console.error('Erro no cálculo:', error);
    }
}

/**
 * Calcula de forma segura usando parse manual (sem eval)
 * Suporta: números, operadores básicos (+, -, *, /), parênteses
 */
function safeCalculate(expr) {
    // Remove espaços
    expr = expr.replace(/\s/g, '');
    
    // Substitui ** por ^ para facilitar
    expr = expr.replace(/\*\*/g, '^');
    
    return parseExpression(expr);
}

/**
 * Parser recursivo descente para avaliação segura de expressões
 * Suporta: +, -, *, /, ^ (potência), parênteses, números decimais
 */
function parseExpression(str) {
    let pos = 0;
    
    function parseTerm() {
        let result = parsePower();
        while (pos < str.length && (str[pos] === '+' || str[pos] === '-')) {
            const op = str[pos];
            pos++;
            const right = parsePower();
            if (op === '+') result += right;
            else result -= right;
        }
        return result;
    }
    
    function parsePower() {
        let result = parseFactor();
        while (pos < str.length && str[pos] === '^') {
            pos++;
            const right = parseFactor();
            result = Math.pow(result, right);
        }
        return result;
    }
    
    function parseFactor() {
        let result = parseUnary();
        while (pos < str.length && (str[pos] === '*' || str[pos] === '/')) {
            const op = str[pos];
            pos++;
            const right = parseUnary();
            if (op === '*') result *= right;
            else result /= right;
        }
        return result;
    }
    
    function parseUnary() {
        if (pos < str.length && (str[pos] === '+' || str[pos] === '-')) {
            const op = str[pos];
            pos++;
            const val = parsePrimary();
            return op === '-' ? -val : val;
        }
        return parsePrimary();
    }
    
    function parsePrimary() {
        // Parênteses
        if (pos < str.length && str[pos] === '(') {
            pos++; // pula '('
            const result = parseTerm();
            pos++; // pula ')'
            return result;
        }
        
        // Número (inteiro ou decimal)
        if (pos < str.length && (str[pos].match(/[0-9]/) || str[pos] === '.')) {
            let numStr = '';
            while (pos < str.length && (str[pos].match(/[0-9]/) || str[pos] === '.')) {
                numStr += str[pos];
                pos++;
            }
            return parseFloat(numStr);
        }
        
        throw new Error('Caractere inesperado');
    }
    
    const result = parseTerm();
    return result;
}

/**
 * Sanitiza a expressão para garantir que só contenha caracteres válidos
 */
function sanitizeExpression(expr) {
    // Remove tudo que não seja número, operador, ponto ou parêntese
    return expr.replace(/[^0-9+\-*/.^()]/g, '');
}

/**
 * Formata a expressão para exibição visual amigável
 */
function formatExpression(expr) {
    return expr
        .replace(/\*\*/g, '²')
        .replace(/\*/g, ' × ')
        .replace(/\//g, ' ÷ ')
        .replace(/\+/g, ' + ')
        .replace(/\-/g, ' − ')
        .trim();
}

/**
 * Retorna o símbolo visual para um operador
 */
function getDisplaySymbol(op) {
    const symbols = {
        '+': '+',
        '-': '−',
        '*': '×',
        '/': '÷',
        '**': '²'
    };
    return symbols[op] || op;
}

/**
 * Limpa o display e o estado
 */
function clearDisplay() {
    display.value = '0';
    expression.textContent = '';
    currentExpression = '';
    lastResult = null;
    isNewCalculation = false;
    display.classList.remove('error');
}

/**
 * Remove o último caractere do display
 */
function deleteLastChar() {
    if (display.value === 'Erro') {
        clearDisplay();
        return;
    }

    if (currentExpression.length > 1) {
        currentExpression = currentExpression.slice(0, -1);
        display.value = currentExpression.split(/[\+\-\*\/]/).pop() || '0';
        
        // Atualiza expressão visual
        if (currentExpression) {
            expression.textContent = formatExpression(currentExpression);
        }
    } else {
        clearDisplay();
    }
}

/**
 * Calcula a porcentagem do valor atual
 */
function percentage() {
    try {
        const value = parseFloat(currentExpression);
        if (isNaN(value)) return;
        const result = value / 100;
        expression.textContent = value + ' % =';
        display.value = result.toString();
        currentExpression = result.toString();
        isNewCalculation = true;
    } catch (e) {
        display.value = 'Erro';
    }
}

/**
 * Calcula a raiz quadrada do valor atual
 */
function squareRoot() {
    try {
        const value = parseFloat(currentExpression);
        if (isNaN(value) || value < 0) {
            display.value = 'Erro';
            return;
        }
        const result = Math.sqrt(value);
        const formattedResult = parseFloat(result.toPrecision(12));
        expression.textContent = '√' + value + ' =';
        display.value = formattedResult.toString();
        currentExpression = formattedResult.toString();
        isNewCalculation = true;
    } catch (e) {
        display.value = 'Erro';
    }
}

// ===== Histórico =====

/**
 * Adiciona um cálculo ao histórico
 */
function addToHistory(exprStr, result) {
    const item = { expression: exprStr, result: result, time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) };
    history.unshift(item);
    
    // Limita o histórico a 20 itens
    if (history.length > 20) {
        history.pop();
    }
    
    saveHistory();
    renderHistory();
}

/**
 * Renderiza o histórico na tela
 */
function renderHistory() {
    if (history.length === 0) {
        historyList.innerHTML = '<p class="history-empty">Nenhum cálculo realizado ainda</p>';
        clearHistoryBtn.style.display = 'none';
        return;
    }

    clearHistoryBtn.style.display = 'block';
    historyList.innerHTML = history.map(item => `
        <div class="history-item" onclick="loadFromHistory('${item.result}')">
            <div class="hist-expression">${item.expression} =</div>
            <div class="hist-result">${item.result}</div>
        </div>
    `).join('');
}

/**
 * Carrega um resultado do histórico para o display
 */
function loadFromHistory(value) {
    display.value = value;
    currentExpression = value;
    isNewCalculation = false;
}

/**
 * Limpa o histórico
 */
function clearHistory() {
    history = [];
    saveHistory();
    renderHistory();
}

/**
 * Salva o histórico no LocalStorage
 */
function saveHistory() {
    try {
        localStorage.setItem('calc_history', JSON.stringify(history));
    } catch (e) {
        // Silencioso se LocalStorage não estiver disponível
    }
}

/**
 * Carrega o histórico do LocalStorage
 */
function loadHistory() {
    try {
        const stored = localStorage.getItem('calc_history');
        if (stored) {
            history = JSON.parse(stored);
            renderHistory();
        }
    } catch (e) {
        history = [];
    }
}

// ===== Tema =====

/**
 * Alterna entre tema claro e escuro
 */
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Atualiza ícone
    const icon = themeToggle.querySelector('.theme-icon');
    icon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    
    localStorage.setItem('calc_theme', newTheme);
}

/**
 * Carrega o tema salvo
 */
function loadTheme() {
    const saved = localStorage.getItem('calc_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', theme);
    const icon = themeToggle.querySelector('.theme-icon');
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

themeToggle.addEventListener('click', toggleTheme);

// ===== Teclado =====

document.addEventListener('keydown', function (event) {
    const key = event.key;

    // Números (0-9)
    if (key >= '0' && key <= '9') {
        appendNumber(key);
    }

    // Operadores
    if (key === '+' || key === '-' || key === '*' || key === '/') {
        event.preventDefault();
        appendOperator(key);
    }

    // Ponto decimal
    if (key === '.' || key === ',') {
        event.preventDefault();
        appendNumber('.');
    }

    // Enter para calcular
    if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    }

    // Backspace para deletar
    if (key === 'Backspace') {
        event.preventDefault();
        deleteLastChar();
    }

    // Escape para limpar
    if (key === 'Escape') {
        clearDisplay();
    }

    // % para porcentagem
    if (key === '%') {
        event.preventDefault();
        percentage();
    }
});

// ===== Detecção de tema do sistema =====
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!localStorage.getItem('calc_theme')) {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        const icon = themeToggle.querySelector('.theme-icon');
        icon.textContent = e.matches ? '☀️' : '🌙';
    }
});
