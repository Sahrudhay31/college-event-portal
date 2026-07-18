const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://munnasahrudhay_db_user:Munna%40123@cluster0.aqws1b1.mongodb.net/college_event_portal?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);
async function run() {
    try {
        await client.connect();
        console.log('✅ Connected!');
        const db = client.db('college_event_portal');
        const collections = await db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));
    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await client.close();
    }
}
run();