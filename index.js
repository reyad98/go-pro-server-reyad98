const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json())
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.71ji5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
   try {
      await client.connect();
      const database = client.db('homeservices');
      const servicesCollection = database.collection('services')
      const servicesCollection2 = database.collection('allservices')
      const servicesCollection3 = database.collection('orderdetails')
      const userCollection = database.collection('users');
      //get api
      app.get('/services', async (req, res) => {
         const cursor = servicesCollection.find({});
         const services = await cursor.toArray()
         res.send(services);
      })
      //get single services

      app.get('/services/:id', async (req, res) => {
         const id = req.params.id;
         const query = { _id: ObjectId(id) };
         const service = await servicesCollection.findOne(query);
         res.json(service);
      })
      //post api
      app.post('/services', async (req, res) => {
         const service = req.body;
         console.log('hit the post api', service);

         const result = await servicesCollection.insertOne(service);
         console.log(result);
         res.json(result);
      })
      //////////
      app.get('/allservices/:id', async (req, res) => {
         const id = req.params.id;
         const query = { _id: ObjectId(id) };
         const allservices = await servicesCollection2.findOne(query);
         res.send(allservices)
      })
      ///////////
      //all data show
      app.get('/allservices', async (req, res) => {
         const cursor = servicesCollection2.find({});
         const allservices = await cursor.toArray()
         res.send(allservices)
      })
      //post api
      app.post('/allservices', async (req, res) => {
         const allservice = req.body;
         console.log('hit the post api', allservice);

         const result = await servicesCollection2.insertOne(allservice);
         console.log(result);
         res.json(result);
      })

      // order Details
      ////////////
      app.get('/orderdetails/:id', async (req, res) => {
         const id = req.params.id;
         const query = { _id: ObjectId(id) };
         const allservices = await servicesCollection3.findOne(query);
         res.send(allservices)
      })
      ////////////
      app.get('/orderdetails', async (req, res) => {
         const email = req.query.email;
         const query = { email: email }
         const cursor = servicesCollection3.find(query);
         const allservices = await cursor.toArray()
         res.send(allservices);
      })
      ///////****** */
      app.get('/orderdetails', async (req, res) => {
         const cursor = servicesCollection3.find({});
         const allservices = await cursor.toArray()
         res.send(allservices)
      })
      ///////****** */

      app.post('/orderdetails', async (req, res) => {
         const allservice = req.body;
         console.log('hit the post api ok', allservice);
         const result = await servicesCollection3.insertOne(allservice);
         res.json(result);
      });


      //delet order

      app.delete('/orderdetails/:id', async (req, res) => {
         const id = req.params.id;
         const query = { _id: ObjectId(id) };
         const result = await servicesCollection3.deleteOne(query);
         res.json(result);
         console.log(id);
      })

      //admin check
      app.get('/users/:email', async (req, res) => {
         const email = req.params.email;
         const query = { email: email };
         const user = await userCollection.findOne(query);
         let isAdmin = false;
         if (user?.role === 'admin') {
            isAdmin = true;
         }
         res.json({ admin: isAdmin });
      })


      //code for set users
      app.post('/users', async (req, res) => {
         const user = req.body;
         const result = await userCollection.insertOne(user);
         console.log(result);
         res.json(result);
      });

      app.put('/users', async (req, res) => {
         const user = req.body;
         const filter = { email: user.email };
         const options = { upsert: true };
         const updateDoc = { $set: user };
         const result = await userCollection.updateOne(filter, updateDoc, options);
         res.json(result);
      });

      app.put('/users/admin', async (req, res) => {
         const user = req.body;
         const filter = { email: user.email };
         const updateDoc = { $set: { role: 'admin' } };
         const result = await userCollection.updateOne(filter, updateDoc);
         res.json(result);
      })




   }
   finally {

   }
}
run().catch(console.dir);

app.get('/', (req, res) => {
   res.send('Hello action heroku!')
})

app.get('/hello', (req, res) => {
   res.send('hhhhh');
})

app.listen(port, () => {
   console.log(`Example app listening at y ${port}`)
})
//ok