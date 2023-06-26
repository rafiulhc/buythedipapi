const express = require('express');
const app = express();
const { MongoClient } = require("mongodb");
require('dotenv').config()
app.use(express.json());

app.post('/orders', async (req, res) => {
    let { time, amount, buyPrice, targetPrice } = req.body;
    const newOrder = { time, amount, buyPrice, targetPrice };
    try {
        const client = await MongoClient.connect(
            `mongodb+srv://${process.env.MONGODB_ORDERS_USER}:${process.env.MONGODB_ORDERS_PASSWORD}@bedrock.ydco1gh.mongodb.net/`
          );

          const db = client.db("bedrock");
          const collection = db.collection(process.env.MONGODB_COLLECTION_ORDERS);


          await collection.insertOne( newOrder, (err, result) => {
            client.close();
            if (err) {
              return res.status(500).json({ message: "Orders Error from API", err });
            }
            return res.status(200).json({ message: "Orders Added to MongoDB database collection", result });
          });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });


app.get('/orders', async (req, res) => {

    try {
        const client = await MongoClient.connect(
            `mongodb+srv://${process.env.MONGODB_ORDERS_USER}:${process.env.MONGODB_ORDERS_PASSWORD}@bedrock.ydco1gh.mongodb.net/`
          );

          const db = client.db("bedrock");
          const collection = db.collection(process.env.MONGODB_COLLECTION_ORDERS);


          const orders = await collection
                .find({}).toArray()

            return res.status(200).json({ message: 'Retrieved orders data', orders })
            } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred' });
            }
  });

  // Start the server
  const port = 3001;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });