import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIUrl, handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Home() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [products, setProducts] = useState([]);
    const [reviews, setReviews] = useState({});
    const [loading, setLoading] = useState({}); // Track loading state for each product
    const navigate = useNavigate();

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Logged out');
        setTimeout(() => {
            navigate('/login');
        }, 1000);
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${APIUrl}/products`, {
                headers: { Authorization: localStorage.getItem('token') },
            });
            const result = await response.json();
            setProducts(result);

            const initialReviews = {};
            result.forEach((product) => {
                initialReviews[product.id] = { review: '', rating: 1 };
            });
            setReviews(initialReviews);
        } catch (err) {
            handleError(err);
        }
    };

    const handleAddReview = async (productId) => {
        const { review, rating } = reviews[productId];

        if (!review.trim() || !rating) {
            handleError('Please provide a review and rating.');
            return;
        }

        setLoading((prev) => ({ ...prev, [productId]: true })); // Set loading for this product

        try {
            const response = await fetch(`${APIUrl}/products/${productId}/review`, {
                method: 'POST',
                headers: {
                    Authorization: localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ review, rating }),
            });

            if (response.ok) {
                handleSuccess('Review added successfully!');
                fetchProducts(); // Refresh product list with updated reviews
            } else {
                throw new Error('Failed to add review.');
            }
        } catch (err) {
            handleError(err);
        } finally {
            setLoading((prev) => ({ ...prev, [productId]: false })); // Reset loading state
        }
    };

    const handleReviewChange = (productId, field, value) => {
        setReviews((prev) => ({
            ...prev,
            [productId]: {
                ...prev[productId],
                [field]: value,
            },
        }));
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div>
            <h1>Welcome {loggedInUser}</h1>
            <button onClick={handleLogout}>Logout</button>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px' }}>
                {products.map((product) => (
                    <div
                        key={product.id}
                        style={{
                            border: '1px solid #ddd',
                            padding: '10px',
                            width: '300px',
                            textAlign: 'center',
                        }}
                    >
                        <img
                            src={product.image}
                            alt={product.name}
                            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                        />
                        <h3>{product.name}</h3>
                        <strong>
                            Average Rating:{' '}
                            {product.reviews?.length
                                ? (
                                    product.reviews.reduce((acc, curr) => acc + curr.rating, 0) /
                                    product.reviews.length
                                ).toFixed(1)
                                : 'No ratings yet'}
                        </strong>
                        <div style={{ marginTop: '10px', textAlign: 'left' }}>
                            <h4>Reviews:</h4>
                            {product.reviews?.length ? (
                                product.reviews.map((r, idx) => (
                                    <p key={idx} style={{ fontSize: '14px' }}>
                                        <strong>{r.rating}★:</strong> {r.review}
                                    </p>
                                ))
                            ) : (
                                <p>No reviews yet.</p>
                            )}
                        </div>
                        <textarea
                            placeholder="Write a review..."
                            value={reviews[product.id]?.review || ''}
                            onChange={(e) =>
                                handleReviewChange(product.id, 'review', e.target.value)
                            }
                            rows="3"
                            style={{ width: '100%', marginBottom: '10px' }}
                        />
                        <select
                            value={reviews[product.id]?.rating || 1}
                            onChange={(e) =>
                                handleReviewChange(product.id, 'rating', Number(e.target.value))
                            }
                            style={{ marginBottom: '10px', width: '100%' }}
                        >
                            {[1, 2, 3, 4, 5].map((value) => (
                                <option key={value} value={value}>
                                    {value} Star{value > 1 ? 's' : ''}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={() => handleAddReview(product.id)}
                            style={{ width: '100%' }}
                            disabled={loading[product.id]} // Disable button when loading
                        >
                            {loading[product.id] ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </div>
                ))}
            </div>
            <ToastContainer />
        </div>
    );
}

export default Home;
