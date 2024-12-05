const express = require('express');
const router = express.Router();
const ProductModel = require('../Models/Product'); // Import the Product model
const ensureAuthenticated = require('../Middlewares/Auth'); // Middleware for authentication

// Add a review to a product
router.post('/:productId/review', ensureAuthenticated, async (req, res) => {
    const { productId } = req.params;
    const { review, rating } = req.body;
    const userId = req.user._id;

    if (!review || !rating) {
        return res.status(400).json({ message: 'Review and rating are required.' });
    }

    try {
        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        // Check if the user has already reviewed the product
        const existingReview = product.reviews.find(
            (rev) => rev.userId.toString() === userId.toString()
        );

        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this product.' });
        }

        // Add the review
        product.reviews.push({ userId, review, rating });
        await product.save();

        return res.status(200).json({ message: 'Review added successfully.', product });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

module.exports = router;
