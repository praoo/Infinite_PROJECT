const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../Middlewares/Auth');

// Mock database (you might want to replace this with an actual database)
const products = [
    {
        id: 1,
        name: "Restaurant-1",
        image: "https://media.istockphoto.com/id/1428594094/photo/empty-coffee-shop-interior-with-wooden-tables-coffee-maker-pastries-and-pendant-lights.jpg?s=612x612&w=0&k=20&c=dMqeYCJDs3BeBP_jv93qHRISDt-54895SPoVc6_oJt4=",
        reviews: [],
    },
    {
        id: 2,
        name: "Restaurant-2",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_Je2Yd1cTW1WEUi_sF3ZnvV0QK2q4XKcqDA&s",
        reviews: [],
    },
    {
        id: 3,
        name: "Restaurant-3",
        image: "https://content.jdmagicbox.com/comp/kanpur/v9/0512px512.x512.161019160451.b4v9/catalogue/shukla-fast-food-kidwai-nagar-kanpur-fast-food-rbum3eibo9.jpg",
        reviews: [],
    },
    {
        id: 4,
        name: "Book Shop",
        image: "https://content.jdmagicbox.com/comp/kanpur/y8/0512px512.x512.100926183649.l9y8/catalogue/anuj-pustak-sansar-govind-nagar-kanpur-book-shops-297tzow.jpg",
        reviews: [],
    },
    {
        id: 5,
        name: "Grocery Shop",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyo4kPjPIxHwfpRwck9He7a7eHuJ3_1Tzhyg&s",
        reviews: [],
    },
    {
        id: 6,
        name: "Mobile Shop",
        image: "https://content.jdmagicbox.com/comp/kanpur/dc/0512px512.x512.1220265020n9z5q5.dc/catalogue/mobile-wala-govind-nagar-kanpur-mobile-phone-dealers-3h73cwn0ks.jpg",
        reviews: [],
    },
    // Add more products as needed
];

// GET all products
router.get('/', ensureAuthenticated, (req, res) => {
    res.status(200).json(products);
});

// POST a review for a product
router.post('/:id/review', ensureAuthenticated, (req, res) => {
    const productId = parseInt(req.params.id, 10);
    const { review, rating } = req.body;

    if (!review || !rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Invalid review or rating. Rating should be between 1 and 5.' });
    }

    const product = products.find((p) => p.id === productId);
    if (!product) {
        return res.status(404).json({ error: 'Product not found.' });
    }

    const newReview = {
        review,
        rating,
        user: req.user?.username || 'Anonymous', // Assuming `req.user` contains the logged-in user's info
    };

    product.reviews.push(newReview);

    res.status(201).json({ message: 'Review added successfully!', product });
});

module.exports = router;
