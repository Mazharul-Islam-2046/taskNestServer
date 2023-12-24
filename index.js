const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.userNameDB}:${process.env.password}@cluster0.ypipc9x.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});


async function run() {
    try {


        const taskCollection = client.db("taskNest").collection("tasks");





        // Get Tasks

        app.get("/tasks/:email/:status", async (req, res) => {
            const email = req.params.email;
            const status = req.params.status
            const query = { user_email: email, status: status };
            const result = await taskCollection.find(query).toArray();
            res.send(result);
          });



        //   Post tasks

        app.post("/tasks", async (req, res) => {
            const task = req.body;
            const result = await taskCollection.insertOne(task);
            res.send(result);
          });





        // Delete Task
        app.delete("/deleteTask/:id", async (req, res) => {
            const id = req.params.id;
            const query = {
              _id: new ObjectId(id),
            };
            const result = await taskCollection.deleteOne(query);
            console.log(result);
            res.send(result);
            console.log("res send");
          });  




        //   Upadate Tasks Status
        app.patch('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const status = req.body.status;
            const filter = { _id: new ObjectId(id) };
            const updatedDoc = {
              $set: {
                status: status
              }
            }
            const result = await taskCollection.updateOne(filter, updatedDoc);
            res.send(result);
          }) 

























      // Connect the client to the server	(optional starting in v4.7)
    //   await client.connect();
      // Send a ping to confirm a successful connection
    //   await client.db("admin").command({ ping: 1 });
    //   console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
    //   await client.close();
    }
  }
  run().catch(console.dir);







app.get('/', (req, res) => {
    res.send('server is running')
  })

app.listen(port, () => {
    console.log(`Task Nest ${port}`);
  });