const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// MongoDB Connection URL and Database Name
const url = 'mongodb+srv://admin:cQYKlyRCbZZX7PBp@anshuman.l4xvw.mongodb.net/';
const dbName = 'eventDB';

// Global variable to store the database connection
let db;

// Connect to MongoDB
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB');
    db = client.db(dbName);
  })
  .catch(error => console.error('Could not connect to MongoDB', error));

// API Endpoints

// GET /api/v3/app/events - Get all events or paginated events
app.get('/api/v3/app/events', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  try {
    const events = await db.collection('events')
      .find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/v3/app/events/:id - Get a single event by ID
app.get('/api/v3/app/events/:id', async (req, res) => {
  try {
    const event = await db.collection('events').findOne({ _id: new ObjectId(req.params.id) });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/v3/app/events - Create a new event
app.post('/api/v3/app/events', async (req, res) => {
  const event = req.body; // Directly using req.body without schema constraints
  
  try {
    const result = await db.collection('events').insertOne(event);
    res.status(201).json({ ...event, _id: result.insertedId });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/v3/app/events/:id - Update an event by ID
app.put('/api/v3/app/events/:id', async (req, res) => {
  const updates = req.body; // Allow dynamic data structure

  try {
    const result = await db.collection('events').findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: updates },
      { returnDocument: 'after' }
    );
    
    if (!result.value) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json(result.value);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/v3/app/events/:id - Delete an event by ID
app.delete('/api/v3/app/events/:id', async (req, res) => {
  try {
    const result = await db.collection('events').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
