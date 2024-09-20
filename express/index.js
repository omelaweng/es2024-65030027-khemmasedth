const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// MongoDB connection
const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Define a schema and model for students
const StudentSchema = new mongoose.Schema({
  studentCode: String,
  firstName: String,
  lastName: String,
  telNumber: String
});
const Student = mongoose.model('Student', StudentSchema);

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// API endpoint to get all students
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// API endpoint to create a new student
app.post('/api/students', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// API endpoint to update a student
app.put('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) return res.status(404).send('Student not found');
    res.json(student);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// API endpoint to delete a student
app.delete('/api/students/:id', async (req, res) => {
  try {
    const result = await Student.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).send('Student not found');
    res.json({ message: 'Student deleted' });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Serve the index.html file from the public directory
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});


