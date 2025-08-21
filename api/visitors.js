import { MongoClient } from 'mongodb';

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
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect();
  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
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

    // Garante que existe um documento para o contador
    const existingDoc = await collection.findOne({});
    if (!existingDoc) {
      await collection.insertOne({ count: 0 });
    }

    if (req.method === 'GET') {
      const doc = await collection.findOne({});
      return res.status(200).json({ count: doc?.count || 0 });
    }

    if (req.method === 'POST') {
      const result = await collection.findOneAndUpdate(
        {},
        { $inc: { count: 1 } },
        { 
          returnDocument: 'after',
          upsert: true
        }
      );
      return res.status(200).json({ count: result.value?.count || 1 });
    }

    res.status(405).json({ error: 'Método não permitido' });
  } catch (error) {
    console.error('Erro no servidor:', error);
    res.status(500).json({ 
      error: 'Erro no servidor', 
      details: error.message 
    });
  }
}