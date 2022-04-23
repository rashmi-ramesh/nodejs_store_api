require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();
const errorHandlerMiddleware = require('./middleware/error-handler');
const notFound = require('./middleware/not-found');
const connectDB = require('./db/connect')
const productsRouter = require('./routes/products')

//parse json
app.use(express.json());

//routes
app.get('/', (req, res) => {
    res.send('<h1>Store API</h1><a href="/api/v1/products">products route</a>')
})

app.use('/api/v1/products',productsRouter)

//not found
app.use(notFound)

//custom error handler
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000;

const start = async() => {
    try {
        await connectDB(process.env.MONGO_URI) //return promise so we use async-await
        app.listen(port, ()=>{
            console.log(`server is listening to port ${port}`);
        })
    } catch (error) {
        console.log(error);
    }
}

start();
