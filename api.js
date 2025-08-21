// api.js - API simples em memória
let visitCount = 0;

async function handleVisitorsAPI() {
    return {
        async GET() {
            return { count: visitCount };
        },
        async POST() {
            visitCount++;
            return { count: visitCount };
        }
    };
}

// Função para substituir a API externa
async function incrementVisitorCount() {
    try {
        const api = await handleVisitorsAPI();
        const result = await api.POST();
        document.getElementById('counter').textContent = result.count.toLocaleString();
    } catch (error) {
        console.error('Erro no contador:', error);
        fallbackCounter();
    }
}

function fallbackCounter() {
    const counter = document.getElementById('counter');
    if (counter && !sessionStorage.getItem('visitCounted')) {
        const baseCount = Math.floor(Math.random() * 100) + 1000;
        counter.textContent = baseCount.toLocaleString();
        sessionStorage.setItem('visitCounted', 'true');
    }
}