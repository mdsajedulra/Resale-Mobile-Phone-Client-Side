const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()
//middle ware
app.use(cors())
app.use(express.json())

const port = process.env.PORT || 5000; // middleware

// for local server
const uri = "mongodb://0.0.0.0:27017";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const categoryCollection = client.db("popup").collection("category");
const productCollection = client.db("popup").collection("product");

app.get('/', (req, res) => {
    res.send('POPUP Server is running');
})


async function run() {
    try {
        app.get('/categories', async (req, res) => {
            const categories = await categoryCollection.find({}).toArray();
            res.send(categories)
        })
    } catch (error) {
        res.send(error)
    }


    try {
        app.get('/products/:id', async (req, res) => {
            const query = { category: req.params.id }
            const products = await productCollection.find(query).toArray();
            res.send(products)
        })
    } catch (error) {
        res.send(error)
    }

    try {
        app.post('/addproduct', async (req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product);
            res.send(result)
        })
    } catch (error) {
        res.send(error);
    }


}
run().catch(error => res.send(error))


app.listen(port, () => {
    console.log('POPUP Server is running on 5000')
})