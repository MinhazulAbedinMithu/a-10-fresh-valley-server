const express = require('express');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectID = require('mongodb').ObjectID;


const app = express();
const port = 5000;
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.onh2u.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
client.connect(err => {
  const productsCollection = client.db("fresh-valley").collection("products");
  const ordersCollection = client.db("fresh-valley").collection("orders");

  app.post('/addProduct', (req, res) => {
    const product = req.body;
    productsCollection.insertOne(product)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })
  app.post('/orderByCustomer',(req, res)=>{
    const orderInfo = req.body;
    ordersCollection.insertOne(orderInfo)
    .then( result => {
      console.log(result);
      res.send(result.insertedCount > 0)
    })
  })

  app.get('/getOrderByCustomer',(req, res)=>{
    ordersCollection.find(req.query)
    .toArray((err, documents)=>{
      res.send(documents);
    })
  })

  app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    productsCollection.deleteOne({_id: ObjectID(id)})
    .then((result) => {
      res.send(result.deletedCount > 0);
    })
  })

  app.get('/products', (req, res) => {
    productsCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  app.get('/singleProduct/:id', (req, res) => {
    const id = ObjectID(req.params.id)
    productsCollection.find({
        _id: id
      })
      .toArray((err, documents) => {
        res.send(documents)
      })
  })




});

app.listen(port);