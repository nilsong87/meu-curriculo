const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// CORS manual para garantir funcionamento
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.sendStatus(200);
});

// Configuração do MongoDB
const uri = "mongodb+srv://nilsonjosesilvagomes:UiAbuNMdhSOqbLlb@cluster0.zwjhdco.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });
const dbName = "contadorDB";
const collectionName = "visitors";

// Função para conectar e garantir o documento do contador
async function getCollection() {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    // Garante que existe um documento para o contador
    const doc = await collection.findOne({});
    if (!doc) {
        await collection.insertOne({ count: 0 });
    }
    return collection;
}

// GET: retorna o contador
app.get('/api/visitors', async (req, res) => {
    try {
        const collection = await getCollection();
        const doc = await collection.findOne({});
        res.json({ count: doc.count });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar contador' });
    }
});

// POST: incrementa o contador
app.post('/api/visitors', async (req, res) => {
    try {
        const collection = await getCollection();
        const doc = await collection.findOneAndUpdate(
            {},
            { $inc: { count: 1 } },
            { returnDocument: 'after' }
        );
        res.json({ count: doc.value.count });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao incrementar contador' });
    }
});

app.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}`);
});
