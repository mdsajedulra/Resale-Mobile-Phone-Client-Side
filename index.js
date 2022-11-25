const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express');

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
const bookingCollection = client.db("popup").collection('bookingProduct')
const usersCollection = client.db("popup").collection('users')

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

    // get product by brand name
    try {
        app.get('/products/:id', async (req, res) => {
            const query = { category: req.params.id }
            const products = await productCollection.find(query).toArray();
            res.send(products)
        })
    } catch (error) {
        res.send(error)
    }


    // get product by brand name
    try {
        app.get('/myorder/', async (req, res) => {
            const email = req.query.email;
            // console.log(query)
            const orders = await bookingCollection.find({ email: email }).toArray();
            res.send(orders)
        })
    } catch (error) {
        res.send(error)
    }


    // All buyers
    try {
        app.get('/allbuyer', async (req, res) => {
            const buyer = await usersCollection.find({ "role": "buyer" }).toArray();
            res.send(buyer)
        })
    } catch (error) {
        res.send(error)
    }


    // All seller
    try {
        app.get('/allseller', async (req, res) => {
            const seller = await usersCollection.find({ "role": "seller" }).toArray();
            res.send(seller)
        })
    } catch (error) {
        res.send(error)
    }




    // delete order by user
    try {
        app.delete('/myorder/delete/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(query)
            const orders = await bookingCollection.deleteOne({ _id: ObjectId(id) })
            res.send(orders)
        })
    } catch (error) {
        res.send(error)
    }
    try {
        app.delete('/user/delete/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(query)
            const users = await usersCollection.deleteOne({ _id: ObjectId(id) })
            res.send(users)
        })
    } catch (error) {
        res.send(error)
    }
    try {
        app.delete('/myproducts/delete/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(query)
            const products = await productCollection.deleteOne({ _id: ObjectId(id) })
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

    // Post for Booking Product

    try {
        app.post('/booking', async (req, res) => {
            const bookingProduct = req.body;
            const result = await bookingCollection.insertOne(bookingProduct);
            res.send(result);
        })

    } catch (error) {
        res.send(error)
    }

    // Post for Booking Product
    try {
        app.post('/users', async (req, res) => {
            const users = req.body;
            const result = await usersCollection.insertOne(users);
            res.send(result);
        })
    } catch (error) {
        res.send(error)
    }

    // my prodcut show
    try {
        app.get('/myproduct', async (req, res) => {
            const email = req.query.email;
            const query = { sellerEmail: email };
            const result = await productCollection.find(query).toArray();
            res.send(result);
        })
    } catch (error) {
        res.send(error)
    }

}
run().catch(error => res.send(error))


app.listen(port, () => {
    console.log('POPUP Server is running on 5000')
})