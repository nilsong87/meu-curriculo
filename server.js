const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Servir arquivos estáticos

// Configuração do MongoDB
const uri = "mongodb+srv://nilsonjosesilvagomes:UiAbuNMdhSOqbLlb@cluster0.zwjhdco.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, { 
    serverApi: ServerApiVersion.v1 
});
const dbName = "contadorDB";
const collectionName = "visitors";

// Conectar ao MongoDB
let db, collection;

async function connectDB() {
    try {
        await client.connect();
        db = client.db(dbName);
        collection = db.collection(collectionName);
        
        // Garantir que existe um documento
        const doc = await collection.findOne({});
        if (!doc) {
            await collection.insertOne({ count: 0 });
        }
        
        console.log('Conectado ao MongoDB');
    } catch (error) {
        console.error('Erro ao conectar MongoDB:', error);
    }
}

// Rotas da API
app.get('/api/visitors', async (req, res) => {
    try {
        const doc = await collection.findOne({});
        res.json({ count: doc.count });
    } catch (error) {
        console.error('Erro GET:', error);
        res.status(500).json({ error: 'Erro ao buscar contador' });
    }
});

app.post('/api/visitors', async (req, res) => {
    try {
        const doc = await collection.findOneAndUpdate(
            {},
            { $inc: { count: 1 } },
            { returnDocument: 'after' }
        );
        res.json({ count: doc.value.count });
    } catch (error) {
        console.error('Erro POST:', error);
        res.status(500).json({ error: 'Erro ao incrementar contador' });
    }
});

// Servir o arquivo principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para arquivos estáticos
app.get('/settings/:type/:file', (req, res) => {
    const { type, file } = req.params;
    res.sendFile(path.join(__dirname, 'settings', type, file));
});

// Inicializar servidor
async function startServer() {
    await connectDB();
    
    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
}

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Encerrando servidor...');
    await client.close();
    process.exit(0);
});

startServer().catch(console.error);