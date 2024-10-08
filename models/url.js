const mongoose = require('mongoose');

// Connect to the database
connectDB().catch(err => console.error(err));

// Define the URL schema
const url = new mongoose.Schema({
    original: String,
    short: Number,
});

// Create a model from the schema
const URL = mongoose.model('URL', url);

// Export the model
module.exports = URL;

async function connectDB() {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

