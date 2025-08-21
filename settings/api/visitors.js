// api/visitors.js
import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = "contadorDB";
const collectionName = "visitors";

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
    if (cachedClient && cachedDb) {
        return { client: cachedClient, db: cachedDb };
    }

    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    try {
        await client.connect();
        const db = client.db(dbName);
        
        cachedClient = client;
        cachedDb = db;

        // Garantir que existe um documento para o contador
        const collection = db.collection(collectionName);
        const doc = await collection.findOne({});
        if (!doc) {
            await collection.insertOne({ count: 0 });
        }

        return { client, db };
    } catch (error) {
        console.error('Erro ao conectar com MongoDB:', error);
        throw error;
    }
}

export default async function handler(req, res) {
    // Configuração CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const { db } = await connectToDatabase();
        const collection = db.collection(collectionName);

        if (req.method === 'GET') {
            const doc = await collection.findOne({});
            return res.status(200).json({ count: doc ? doc.count : 0 });
        }

        if (req.method === 'POST') {
            const result = await collection.findOneAndUpdate(
                {},
                { $inc: { count: 1 } },
                { 
                    returnDocument: 'after',
                    upsert: true // Cria o documento se não existir
                }
            );
            
            return res.status(200).json({ 
                count: result.value ? result.value.count : 1 
            });
        }

        return res.status(405).json({ error: 'Método não permitido' });
    } catch (error) {
        console.error('Erro na API:', error);
        return res.status(500).json({ 
            error: 'Erro no servidor', 
            details: error.message 
        });
    }
}