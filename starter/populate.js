//to add data to the mongoDB database from products.json

require('dotenv').config();
const connectDB = require('./db/connect');
const Product = require('./models/product');
const jsonProducts = require('./products.json');

const start =  async() => {
    try {
        await connectDB(process.env.MONGO_URI);
        await Product.deleteMany(); //delete whatever is there b4 starting (optional step)
        await Product.create(jsonProducts);
        //to stop the above code - exit process
        process.exit(0); 
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

start();