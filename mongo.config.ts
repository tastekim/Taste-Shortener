import { MongoClient, Db } from 'mongodb';

let conn: null | Db = null;

export async function connectToDatabase() {
    if(conn !== null) {
        return conn;
    }
    // Connect to our MongoDB database hosted on MongoDB Atlas
    const client = await MongoClient.connect(`${process.env.MONGODB_URI}`);

    // Specify which database we want to use
    const db = await client.db(`${process.env.DB_NAME}`);
    conn = db
    return db;
}