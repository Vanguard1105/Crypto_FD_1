import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/crypto_tracker';
const MONGODB_DB = process.env.MONGODB_DB || 'crypto_tracker';

let cachedClient: MongoClient | null = null;

export async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  const client = await MongoClient.connect(MONGODB_URI);
  cachedClient = client;
  return client;
}

export async function saveTimeSeriesData(period: string, data: any[]) {
  try {
    const client = await connectToDatabase();
    const db = client.db(MONGODB_DB);
    const collection = db.collection('time_series_data');

    // Update or insert the data for the specific period
    await collection.updateOne(
      { period },
      {
        $set: {
          data,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );
  } catch (error) {
    console.error('Error saving time series data:', error);
  }
}

export async function getTimeSeriesData(period: string) {
  try {
    const client = await connectToDatabase();
    const db = client.db(MONGODB_DB);
    const collection = db.collection('time_series_data');

    const result = await collection.findOne({ period });
    return result?.data || [];
  } catch (error) {
    console.error('Error getting time series data:', error);
    return [];
  }
}