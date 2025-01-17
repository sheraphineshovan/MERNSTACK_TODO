// setting up libraries 
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');


const app = express(); //creating express application
app.use(cors()); //  enabling cors
app.use(express.json()); // to parse(interpreting and converting) incoming requests to json format

// Database connection // connecting to MongoDB 

// usenewurlparser: tells the mongoose to use  new url parser instead of deprecated one becoz it gives better compatibility with MongoDB 3.6 and above
// useunifiedtopology: enables the new unified topology layer in the mongodb driver, provides consistent way to manage connections to database
// to indicate whether the connection is made or not
mongoose.connect('mongodb+srv://admin:%23shovan%402002@cluster0.xg4te.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Database connection failed:', err));


// User schema

//to define the structure of the data within the collection 
// type: defines which type it should be 
// required: defines whether it is required or not
// unique: defines whether it should be unique or not

const userSchema = new mongoose.Schema({
    usernameOrEmail: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Todo schema

// enum: this restricts the value to be one of them mentioned in the list 
// type: mongoose.Schema.Types.ObjectId - that the value must be an object id of the user in the collection
//ref: indicates that it  reference the user model
const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    matrix: { 
        type: String, 
        enum: ['Urgent & Important', 'Urgent but Not Important', 'Not Urgent but Important', 'Not Urgent & Not Important'], 
        required: true   
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const User = mongoose.model('User', userSchema);
const Todo = mongoose.model('Todo', todoSchema);

// Sign-Up route
app.post('/signup', async (req, res) => {
    const { usernameOrEmail, password } = req.body;

    try {
        const existingUser = await User.findOne({ usernameOrEmail });
        if (existingUser) {
            return res.status(400).send({ message: 'User already exists. Try logging in.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ usernameOrEmail, password: hashedPassword });
        await newUser.save();
        res.status(201).send({ message: 'Signup successful' });
    } catch (error) {
        res.status(400).send({ message: 'Signup failed', error: error.message });
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { usernameOrEmail, password } = req.body;

    try {
        const user = await User.findOne({ usernameOrEmail });
        if (!user) return res.status(404).send({ message: 'User not found' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).send({ message: 'Invalid password' });

        res.status(200).send({ message: 'Login successful', userId: user._id });
    } catch (error) {
        res.status(500).send({ message: 'Login failed', error: error.message });
    }
});

// Create a new todo
app.post('/todo', async (req, res) => {
    const { title, description, dueDate, matrix, userId } = req.body;

    if (!title || !description || !dueDate || !matrix || !userId) {
        return res.status(400).send({ message: 'All fields are required.' });
    }

    try {
        const todo = new Todo({ title, description, dueDate, matrix, userId });
        await todo.save();
        res.status(201).send(todo);
    } catch (error) {
        res.status(400).send({ message: 'Error adding todo', error: error.message });
    }
});

// Get todos for a user
app.get('/todo/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const todos = await Todo.find({ userId }).sort({ dueDate: 1 }); // Sort by due date
        res.status(200).send(todos);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching todos', error: error.message });
    }
});

// Update a todo
app.put('/todo/:id', async (req, res) => {
    const { title, description, dueDate, matrix } = req.body;

    if (!title || !description || !dueDate || !matrix) {
        return res.status(400).send({ message: 'All fields are required.' });
    }

    try {
        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            { title, description, dueDate, matrix },
            { new: true }
        );
        if (!updatedTodo) return res.status(404).send({ message: 'Todo not found' });
        res.status(200).send(updatedTodo);
    } catch (error) {
        res.status(400).send({ message: 'Error updating todo', error: error.message });
    }
});

// Delete a todo
app.delete('/todo/:id', async (req, res) => {
    try {
        const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
        if (!deletedTodo) return res.status(404).send({ message: 'Todo not found' });
        res.status(204).send();
    } catch (error) {
        res.status(400).send({ message: 'Error deleting todo', error: error.message });
    }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
