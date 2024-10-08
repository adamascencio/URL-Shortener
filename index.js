require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/public', express.static(`${process.cwd()}/public`));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to the database'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

// Define the URL schema
const urlSchema = new mongoose.Schema({
  original: String
});

// Assign a unique id for each url
urlSchema.plugin(AutoIncrement, { inc_field: 'id' });

// Create a model from the schema
const URL = mongoose.model('URL', urlSchema);

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/shorturl/:shortUrl', async (req, res) => {
  const urlID = req.params.shortUrl;
  try {
    const doc = await URL.findOne({ id: urlID });
    console.log(doc)
    res.redirect(doc.original);
  } catch (error) {
    res.json({ error: "url not found" })
  }
});

app.post('/api/shorturl', async (req, res) => {
  const url = req.body.url;
  const urlRegex = /^(http|https):\/\/[^ "]+$/;

  if (!urlRegex.test(url)) {
    return res.json({ error: 'invalid url' });
  }

  try {
    const newUrl = new URL({
      original: url
    });
    await newUrl.save();
    res.json({
      original_url: newUrl.original,
      short_url: newUrl.id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
