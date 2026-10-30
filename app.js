const API_URL="https://copa-chat-backend-2.onrender.com";
// Banco de perguntas rápidas em destaque
const bancoPerguntas = [
    {
        id: 1,
        pergunta: "Qual seleção tem mais títulos da Copa do Mundo?",
        resposta: "O Brasil é a única seleção pentacampeã mundial, tendo vencido as edições de 1958, 1962, 1970, 1994 e 2002."
    },
    {
        id: 2,
        pergunta: "Quem é o maior artilheiro em uma única edição da Copa?",
        resposta: "Just Fontaine (França), que marcou 13 gols na Copa do Mundo de 1958 na Suécia."
    },
    {
        id: 3,
        pergunta: "Quem marcou os gols da final da Copa de 2002?",
        resposta: "Ronaldo Fenômeno marcou os dois gols da vitória do Brasil por 2 a 0 contra a Alemanha na final em Yokohama."
    },
    {
        id: 4,
        pergunta: "Qual seleção venceu a primeira Copa do Mundo em 1930?",
        resposta: "O Uruguai venceu a primeira Copa do Mundo em 1930, derrotando a Argentina por 4 a 2 na final em Montevidéu."
    }
];

document.addEventListener("DOMContentLoaded", () => {
    carregarPerguntasDestaque();
});

function carregarPerguntasDestaque() {
    const container = document.getElementById("listaPerguntas");
    if (!container) return;
    container.innerHTML = "";

    bancoPerguntas.forEach(item => {
        const card = document.createElement("div");
        card.className = "item-pergunta";
        card.innerHTML = `<h4><i class="fa-regular fa-circle-question"></i> ${item.pergunta}</h4>`;
        card.onclick = () => exibirRespostaPronta(item);
        container.appendChild(card);
    });
}

function exibirRespostaPronta(item) {
    document.getElementById("campoPergunta").value = item.pergunta;
    document.getElementById("tituloPergunta").innerText = item.pergunta;
    document.getElementById("textoResposta").innerText = item.resposta;
    
    document.getElementById("painelResposta").classList.remove("hidden");
    document.getElementById("painelResposta").scrollIntoView({ behavior: 'smooth' });
}

// Função que consome o Backend em Python (localhost:5000)
async function buscarResposta() {
    const campo = document.getElementById("campoPergunta");
    const termo = campo.value.trim();
    if (!termo) return;

    const loading = document.getElementById("loading");
    const painel = document.getElementById("painelResposta");

    painel.classList.add("hidden");
    loading.classList.remove("hidden");

    try {
        const response = await fetch(API_URL+"/api/perguntar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ pergunta: termo })
        });

        if (!response.ok) {
            throw new Error(`Erro no servidor: status ${response.status}`);
        }

        const data = await response.json();
        
        document.getElementById("tituloPergunta").innerText = termo;
        document.getElementById("textoResposta").innerText = data.resposta;

    } catch (error) {
        console.error("Erro ao comunicar com o backend Python:", error);
        document.getElementById("tituloPergunta").innerText = "Erro de Conexão";
        document.getElementById("textoResposta").innerText = "Não foi possível conectar ao servidor backend em "+API_URL+". Certifique-se de que o app.py está rodando.";
    } finally {
        loading.classList.add("hidden");
        painel.classList.remove("hidden");
        painel.scrollIntoView({ behavior: 'smooth' });
    }
}