const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../Middlewares/Auth');
const ProductModel = require('../Models/product');

// Initial products data
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


// GET all products
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const products = await ProductModel.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products.' });
    }
});

// POST a review for a product
router.post('/:productId/review', async (req, res) => {
    const { productId } = req.params;
    const { review, rating } = req.body;

    if (!review || !rating) {
        return res.status(400).json({ message: 'Review and rating are required.' });
    }

    try {
        const product = await ProductModel.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        product.reviews.push({ review, rating });
        const updatedProduct = await product.save();

        res.status(200).json({ updatedProduct });
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// Export both router and utility function
module.exports = router;
 