const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    review: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
});

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    reviews: { type: [reviewSchema], default: [] }, // Set reviews as an array
});

const ProductModel = mongoose.model('Product', productSchema);

module.exports = ProductModel;
