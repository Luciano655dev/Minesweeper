let linhas, colunas, bombas, matriz, tabela;

function gerarMatriz(l, c) {
    matriz = []
    for (let i = 0; i < l; i++) {
        matriz[i] = new Array(c).fill(0)
        // Gera a matriz (matriz = array bidimensional)
    }
}

function gerarTabela(l, c) {
    gerarMatriz(l, c) 

    let str = "";
    for (let i = 0; i < l; i++) {
        str += "<tr>";
        for (let j = 0; j < c; j++) {
            str += "<td class='blocked'></td>";
        }
        str += "</tr>";
    }
    tabela.innerHTML = str;
    // Gera a tabela com as casas bloqueadas
}

function gerarBombas() {
    for (let i = 0; i < bombas;) {
        let linha = Math.floor((Math.random() * linhas))
        let coluna = Math.floor((Math.random() * colunas))
        if (matriz[linha][coluna] === 0) {
            matriz[linha][coluna] = -1;
            i++;
        }
    }
    // Coloca as bombas em locais aleatórios
}

function gerarNumero(l, c) {
    let count = 0;
    for (let i = l - 1; i <= l + 1; i++) {
        for (let j = c - 1; j <= c + 1; j++) {
            if (i >= 0 && i < linhas && j >= 0 && j < colunas) {
                if (matriz[i][j] === -1) {
                    count++
                }
            }
        }
    }
    matriz[l][c] = count
}
function gerarNumeros() {
    for (let i = 0; i < linhas; i++) {
        for (let j = 0; j < colunas; j++) {
            if (matriz[i][j] !== -1) {
                gerarNumero(i, j);
            }
        }
    }
}
// As duas funções acima geram os números de acordo com a quantidade de bombas ao redor

function bandeira(event) {
    let cell = event.target;
    if (cell.className === "blocked") {
        cell.className = "flag";
        cell.innerHTML = "&#128681;";//&#9873;
    } else if (cell.className === "flag") {
        cell.className = "blocked";
        cell.innerHTML = "";
    }
    return false;
    // Coloca a bandeira
}

function init() {
    tabela = document.getElementById("tabela")
    tabela.oncontextmenu = bandeira
    tabela.onclick = verificar
    let diff = document.getElementById("dificuldade")

    switch (parseInt(diff.value)) {
        case 0:
            linhas = 9
            colunas = 9
            bombas = 10
            break
        case 1:
            linhas = 16
            colunas = 16
            bombas = 40
            break
        default:
            linhas = 16
            colunas = 30
            bombas = 99
            break
    }
    // Pega a dificuldade
    
    gerarTabela(linhas, colunas)
    gerarBombas()
    gerarNumeros()
}

function limparCelulas(l, c) {
    for (let i = l - 1; i <= l + 1; i++) {
        for (let j = c - 1; j <= c + 1; j++) {
            if (i >= 0 && i < linhas && j >= 0 && j < colunas) {
                let cell = tabela.rows[i].cells[j];
                if (cell.className !== "blank") {
                    switch (matriz[i][j]) {
                        case -1:
                            break;
                        case 0:
                            cell.innerHTML = "";
                            cell.className = "blank";
                            limparCelulas(i, j);
                            break;
                        default:
                            cell.innerHTML = matriz[i][j];
                            cell.className = "n" + matriz[i][j];
                    }
                }
            }
        }
    }
    // Limpa as casas ao redor do número
}

function mostrarBombas() {
    for (let i = 0; i < linhas; i++) {
        for (let j = 0; j < colunas; j++) {
            if (matriz[i][j] === -1) {
                let cell = tabela.rows[i].cells[j];
                cell.innerHTML = "&#128163;";
                cell.className = "blank";
            }
        }
    }
    // Mostra as bombas no final do jogo
}

function verificar(event) {
    let cell = event.target
    if (cell.className == "flag") return

    let linha = cell.parentNode.rowIndex
    let coluna = cell.cellIndex
    switch (matriz[linha][coluna]) {
        case -1:
            mostrarBombas()
            cell.style.backgroundColor = "red"
            tabela.onclick = undefined
            tabela.oncontextmenu = undefined

            document.getElementById("dificuldade").disabled = true
            let resTimer = document.querySelector('.resTimer')
            resTimer.innerHTML = "Restarting in 3"
            setTimeout(()=>{ resTimer.innerHTML = "Restarting in 2"; return }, 1000)
            setTimeout(()=>{ resTimer.innerHTML = "Restarting in 1"; return }, 2000)
            setTimeout(()=>{ resTimer.innerHTML = ''; document.getElementById("dificuldade").disabled = false; init() }, 3000)
            break
        case 0:
            limparCelulas(linha, coluna)
            break
        default:
            cell.innerHTML = matriz[linha][coluna]
            cell.className = "n" + matriz[linha][coluna]
    }
    fimDeJogo()
}

function fimDeJogo() {
    let cells = document.querySelectorAll(".blocked, .flag")
    if (cells.length === bombas) {
        mostrarBombas()
        tabela.onclick = null
        tabela.oncontextmenu = null
        alert("Você venceu!")
    }
    // Termian o jogo com vitória ou derrota
}

function registerEvents() {
    init()
    let diff = document.getElementById("dificuldade")
    diff.onchange = init
    // Muda a dificuldade em tempo real e inciia o jogo
}

onload = registerEvents;