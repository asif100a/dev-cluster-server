require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: [
    'https://dev-cluster-6dba5.web.app',
    'https://dev-cluster-self.vercel.app',
    'http://localhost:5173',
  ],
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    });

    // Get specific data
    app.get('/students/:id', async(req, res) => {
      const id = req.params.id;
      console.log(id);

      const query = {_id: new ObjectId(id)};
      const result = await studentCollection.findOne(query);
      res.send(result);
    });

    // Update the data
    app.put('/editStudent/:id', async(req, res) => {
      const id = req.params.id;
      console.log(id);
      const data = req.body;
      console.log(data);

      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true};
      const updatedDoc = {
        $set: {
          firstName: data.firstNameEdit,
          middleName: data.middleNameEdit, 
          lastName: data.lastNameEdit, 
          image: data.imageEdit, 
          class: data.classEdit, 
          division: data.divisionEdit, 
          rollNumber: data.rollNumberEdit, 
          city: data.cityEdit, 
          landmark: data.landmarkEdit, 
          addressLine1: data.addressLine1Edit, 
          addressLine2: data.addressLine2Edit, 
          pincode: data.pincodeEdit
        }
      };
      const result = await studentCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    // Delete the Student data
    app.delete('/deleteStudents/:id', async(req, res) => {
      const id = req.params.id;
      console.log(id);

      const filter = {_id: new ObjectId(id)};
      const result = await studentCollection.deleteOne(filter);
      res.send(result);
    });

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