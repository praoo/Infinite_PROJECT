const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');

const ProductModel = require('./Models/product');
const Products = [
    {
        name: "Restaurant-1",
        image: "https://media.istockphoto.com/id/1428594094/photo/empty-coffee-shop-interior-with-wooden-tables-coffee-maker-pastries-and-pendant-lights.jpg?s=612x612&w=0&k=20&c=dMqeYCJDs3BeBP_jv93qHRISDt-54895SPoVc6_oJt4=",
        reviews: [],
    },
    {
        name: "Restaurant-2",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_Je2Yd1cTW1WEUi_sF3ZnvV0QK2q4XKcqDA&s",
        reviews: [],
    },
    {
        name: "Restaurant-3",
        image: "https://content.jdmagicbox.com/comp/kanpur/v9/0512px512.x512.161019160451.b4v9/catalogue/shukla-fast-food-kidwai-nagar-kanpur-fast-food-rbum3eibo9.jpg",
        reviews: [],
    },
    {
        name: "Book Shop",
        image: "https://content.jdmagicbox.com/comp/kanpur/y8/0512px512.x512.100926183649.l9y8/catalogue/anuj-pustak-sansar-govind-nagar-kanpur-book-shops-297tzow.jpg",
        reviews: [],
    },
    {
        name: "Grocery Shop",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyo4kPjPIxHwfpRwck9He7a7eHuJ3_1Tzhyg&s",
        reviews: [],
    },
    {
        name: "Mobile Shop",
        image: "https://content.jdmagicbox.com/comp/kanpur/dc/0512px512.x512.1220265020n9z5q5.dc/catalogue/mobile-wala-govind-nagar-kanpur-mobile-phone-dealers-3h73cwn0ks.jpg",
        reviews: [],
    },
];



// const insertProducts = async () => {
//     try {
//         const result = await ProductModel.insertMany(Products);
//         console.log('Products inserted successfully:', result);
//     } catch (err) {
//         console.error('Error inserting products:', err);
//     } finally {
//         mongoose.connection.close(); // Close the connection when done
//     }
// };

// insertProducts();


require('dotenv').config();
require('./Models/db'); // Connect to MongoDB

const PORT = process.env.PORT || 8080;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Health check
app.get('/ping', (req, res) => {
    res.send('PONG');
});


// Routes
app.use('/auth', AuthRouter);
app.use('/products', ProductRouter); // Use ProductRouter.router explicitly


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
