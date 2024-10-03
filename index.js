require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.bu1vbif.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    // Database collections
    const userCollection = client.db('DevCluster').collection('users');
    const studentCollection = client.db('DevCluster').collection('students');

    // Login the user
    app.post('/login', async (req, res) => {
      const data = req.body;
      console.log(data);

      try {
        const user = await userCollection.findOne(data);
        console.log(user);
        if (user) {
          res.status(200).send(user);
        }
        else {
          res.status(401).send({ message: 'User not found' })
        }
      }
      catch (error) {
        res.status(500).send(error.message);
      }
    });

    // Store student's data to the db
    app.post('/addStudent', async (req, res) => {
      const data = req.body;
      console.log(data);

      try {
        const result = await studentCollection.insertOne(data);
        res.status(200).send(result);
      }
      catch(error){
        res.status(500).send(error.message);
      }
    });

    // Get the student's data from the db
    app.get('/students', async(req, res) => {
      try{
        const result = await studentCollection.find().toArray();
        res.status(200).send(result);
      }
      catch(error) {
        res.status(500).send(error.message);
      }
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// Run the server
app.get('/', (req, res) => {
  res.send({
    message: 'The server is running'
  });
});

// Listen the server
app.listen(port, () => {
  console.log(`The server is running on port: ${port}`);
});