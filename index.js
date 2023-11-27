const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ikmm0oq.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const storyCollection = client.db("touristDB").collection("stories");
    const packageCollection = client.db("touristDB").collection("packages");
    const guideCollection = client.db("touristDB").collection("guides");
    const bookingCollection = client.db("touristDB").collection("bookings");
    const wishListCollection = client.db("touristDB").collection("wishList");

    // Read data

    app.get("/packages", async (req, res) => {
      const cursor = packageCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/packages/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await packageCollection.findOne(query)
      res.send(result);
  })

    app.get("/stories", async (req, res) => {
      const cursor = storyCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/guides", async (req, res) => {
      const cursor = guideCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/bookings", async (req, res) => {
      const email = req.query.email;
      const query = {email: email};
      const cursor = bookingCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/bookings/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await bookingCollection.findOne(query)
      res.send(result);
  });

    app.get("/wishList", async (req, res) => {
      const email = req.query.email;
      const query = {email: email};
      const cursor = wishListCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/wishList/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await wishListCollection.findOne(query)
      res.send(result);
  })

    // post data

    app.post("/bookings", async(req, res) => {
      const bookedPackage = req.body;
      const result = await bookingCollection.insertOne(bookedPackage);
      res.send(result);
    })
    app.post("/wishList", async(req, res) => {
      const wishListedPackage = req.body;
      const result = await wishListCollection.insertOne(wishListedPackage);
      res.send(result);
    });

    // delete data

    app.delete('/wishList/:id', async(req, res)=> {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await wishListCollection.deleteOne(query);
      res.send(result);
    });

    app.delete('/bookings/:id', async(req, res)=> {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await bookingCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Tourist server is running");
});

app.listen(port, () => {
  console.log(`Tourist server is running on port ${port}`);
});
