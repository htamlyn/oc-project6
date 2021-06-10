const express = require('express');
const mongoose = require('mongoose');

const Sauce = require('./models/sauce');
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

const app = express();

mongoose.connect('mongodb://localhost:27017/sauceApp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Successfully connected to MongoDb')
    })
    .catch((error) => {
        console.log('Error connecting to MongoDb')
        console.error(error)
    });

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);



app.get('/api/sauces/:id', async (req, res) => {
    const { id } = req.params;
    await Sauce.findById(id).then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
    console.log("can't find that sauce");
});

app.post('/api/sauces', async (req, res) => {
    const newSauce = new Sauce(req.body);
    await newSauce.save().then(
        () => {
            res.status(201)
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
});


// app.use((req, res) => {
//     res.json({ message: 'Your request was successful!' });
// });

module.exports = app;