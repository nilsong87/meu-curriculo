import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI; // Defina essa variável no painel da Vercel!
const dbName = "contadorDB";
const collectionName = "visitors";

let cachedClient = null;

async function getCollection() {
    if (!cachedClient) {
        cachedClient = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });
        await cachedClient.connect();
    }
    const db = cachedClient.db(dbName);
    const collection = db.collection(collectionName);
    // Garante que existe um documento para o contador
    const doc = await collection.findOne({});
    if (!doc) {
        await collection.insertOne({ count: 0 });
    }
    return collection;
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const collection = await getCollection();

        if (req.method === 'GET') {
            const doc = await collection.findOne({});
            return res.status(200).json({ count: doc.count });
        }

        if (req.method === 'POST') {
            const doc = await collection.findOneAndUpdate(
                {},
                { $inc: { count: 1 } },
                { returnDocument: 'after' }
            );
            return res.status(200).json({ count: doc.value.count });
        }

        res.status(405).json({ error: 'Método não permitido' });
    } catch (error) {
        res.status(500).json({ error: 'Erro no servidor', details: error.message });
    }
}