import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems } from '../store/selector/cartSelector';
import { addItemToCart } from '../store/actions/cartAction';
import noImage from '../assets/images/no-image.jpeg';
import { auth } from '../firebase/firebase';
import { Button } from 'react-bootstrap';
import AddToWishlist from './AddToWishlist';
import { UserContext } from '../contexts/userContext';
import { Alert, Toast } from 'react-bootstrap';
import '../styles/BookDetails.scss';

const defaultFormFields = {
    review: '',
    rating: 0,
};

const BookDetails = (props) => {
    const [toast, setToast] = useState(false);
    const [loading, setLoading] = useState(true);
    const [reviewDetails, setReviewDetails] = useState(defaultFormFields);
    const { review, rating } = reviewDetails;
    const [bookDetailsData, setBookDetailsData] = useState(undefined);
    const [postReview, setPostReview] = useState(false);
    const user = auth.currentUser;
    let { id } = useParams();
    const history = useNavigate();
    const dispatch = useDispatch();
    const cartItems = useSelector(selectCartItems);
    const [userWishlistData, setUserWishlistData] = useState([]);
    const [isInserted, setIsInserted] = useState(0);
    const { currentUser } = useContext(UserContext);
    const [error, setError] = useState('false');
    const [reviewError, setReviewError] = useState('');

    useEffect(() => {
        console.log('useEffect fired');
        async function fetchData() {
            try {
                const url = `https://houseof-books.herokuapp.com/books/${id}`;
                const { data } = await axios.get(url);
                console.log(data);
                setBookDetailsData(data);
                setLoading(false);
            } catch (e) {
                setError(true);
                console.log(e);
            }
        }
        fetchData();
    }, [id, postReview, reviewError]);

    function padTo2Digits(num) {
        return num.toString().padStart(2, '0');
    }
    function formatDate(date) {
        return [
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getDate()),
            date.getFullYear(),
        ].join('-');
    }

    function formatDateNextMonth(date) {
        return [
            padTo2Digits(date.getMonth() + 2),
            padTo2Digits(date.getDate()),
            date.getFullYear(),
        ].join('-');
    }

    const buyBook = (title, bookId, price, imageUrl) => {
        let todayDate = formatDate(new Date());
        console.log(todayDate);

        let dataBody = {
            email: user.email,
            name: title,
            price: price,
            bookId: bookId,
            imageUrl: imageUrl,
            flag: 'B',
        };
        dispatch(addItemToCart(cartItems, dataBody));
    };

    const rentBook = (title, bookId, price, imageUrl) => {
        let todayDate = formatDate(new Date());
        let endDate = formatDateNextMonth(new Date());
        console.log(todayDate);
        let dataBody = {
            email: user.email,
            name: title,
            price: isNaN(parseFloat(price)) ? 7.0 : bookDetailsData.price,
            bookId: bookId,
            imageUrl: imageUrl,
            flag: 'R',
            startDate: todayDate,
            endDate: endDate,
        };
        setToast(true);
        dispatch(addItemToCart(cartItems, dataBody));
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setReviewDetails({ ...reviewDetails, [name]: value });
    };

    const resetFormFields = () => {
        setReviewDetails(defaultFormFields);
    };
    const handleOnSubmit = async (event) => {
        event.preventDefault();

        let dataBody = {
            bookId: bookDetailsData._id,
            email: auth.currentUser.email,
            rating: rating,
            comment: review,
            username: bookDetailsData.username,
        };
        try {
            await axios
                .post('https://houseof-books.herokuapp.com/reviews/review', {
                    data: dataBody,
                })
                .then(function (response) {
                    console.log(response.data);
                    setPostReview(!postReview);
                    resetFormFields();
                    setReviewError('');
                    history(`/books/${bookDetailsData._id}`, { replace: true });
                });
        } catch (error) {
            setReviewError(error.response.data);
            return;
        }
    };

    const removeReview = (reviewId) => {
        axios
            .delete(
                `https://houseof-books.herokuapp.com/reviews/deleteReview/${reviewId}`
            )
            .then(function (response) {
                console.log(response.data);
                setPostReview(!postReview);
                setReviewError('');
                history(`/books/${bookDetailsData._id}`, { replace: true });
            });
    };

    let onClickWishlist = async (bookId, title) => {
        try {
            const url = `https://houseof-books.herokuapp.com/users/bookshelf/add`;
            const { data } = await axios.post(url, {
                email: currentUser.email,
                bookId: bookId,
                title: title,
            });
            if (data.inserted === true) setIsInserted(Number(isInserted) + 1);
        } catch (e) {
            console.log(e);
        }
    };
    let handleRemoveWishlist = async (bookId, title) => {
        try {
            const url = `https://houseof-books.herokuapp.com/users/bookshelf/remove`;
            const { data } = await axios.post(url, {
                email: currentUser.email,
                bookId: bookId,
                title: title,
            });
            if (data.deleted === true) setIsInserted(Number(isInserted) - 1);
        } catch (e) {
            console.log(e);
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = `https://houseof-books.herokuapp.com/users/profile`;
                const { data } = await axios.post(url, {
                    data: currentUser.email,
                });

                setUserWishlistData(data.wishlist);
                if (!userWishlistData.wishlist) setError(true);
                setLoading(false);
            } catch (e) {
                console.log(e);
            }
        };
        fetchData();
    }, [currentUser, isInserted]);

    const checkBook = () => {
        return userWishlistData.some((post, index) => {
            return post.bookId === bookDetailsData._id;
        });
    };

    if (loading) {
        return (
            <div>
                {isNaN(bookDetailsData) ? (
                    <h1>Error 404: Page not found</h1>
                ) : (
                    <div>
                        <h2>Loading....</h2>
                    </div>
                )}
            </div>
        );
    } else {
        return (
            <>
                {' '}
                {bookDetailsData && (
                    <div
                        className="book-details-container"
                        key={bookDetailsData._id}
                    >
                        <img
                            src={
                                bookDetailsData.url
                                    ? bookDetailsData.url
                                    : noImage
                            }
                            alt={`${bookDetailsData.title}`}
                        />
                        <span className="title">
                            Title: {bookDetailsData.title}
                        </span>
                        {user &&
                            (isNaN(parseFloat(bookDetailsData.price)) ? (
                                <Button
                                    className="button"
                                    variant="primary"
                                    onClick={() =>
                                        rentBook(
                                            bookDetailsData.title,
                                            bookDetailsData._id,
                                            bookDetailsData.price,
                                            bookDetailsData.url
                                        )
                                    }
                                >
                                    <span className="price">
                                        $
                                        {isNaN(parseInt(bookDetailsData.price))
                                            ? 7.0
                                            : bookDetailsData.price}
                                    </span>
                                    <span>Add to Cart</span>
                                </Button>
                            ) : (
                                <Button
                                    className="button"
                                    variant="primary"
                                    onClick={() =>
                                        buyBook(
                                            bookDetailsData.title,
                                            bookDetailsData._id,
                                            bookDetailsData.price,
                                            bookDetailsData.url
                                        )
                                    }
                                >
                                    <span className="price">
                                        $
                                        {isNaN(parseInt(bookDetailsData.price))
                                            ? 7.0
                                            : bookDetailsData.price}
                                    </span>
                                    <span>Add to Cart</span>
                                </Button>
                            ))}
                        {user && !checkBook() && (
                            <Button
                                className="button"
                                onClick={() =>
                                    onClickWishlist(
                                        bookDetailsData._id,
                                        bookDetailsData.title
                                    )
                                }
                                variant="danger"
                            >
                                Add To Wishlist
                            </Button>
                        )}
                        {user && checkBook() && (
                            <Button
                                className="button"
                                variant="danger"
                                onClick={() =>
                                    handleRemoveWishlist(
                                        bookDetailsData._id,
                                        bookDetailsData.title
                                    )
                                }
                            >
                                Remove from Wishlist
                            </Button>
                        )}
                        <Toast
                            onClose={() => setToast(false)}
                            show={toast}
                            delay={3000}
                            autohide
                        >
                            <Toast.Header>
                                <strong className="me-auto">Rent Info</strong>
                            </Toast.Header>
                            <Toast.Body>
                                Rented books are available only for 30 days!
                            </Toast.Body>
                        </Toast>
                        <p className="desc">
                            <span className="heading">Description: </span>
                            {bookDetailsData.description}
                        </p>
                        <span>
                            <span className="heading">Author: </span>
                            {bookDetailsData.author}
                        </span>
                        <span>
                            <span className="heading">ISBN: </span>
                            {bookDetailsData.ISBN}
                        </span>
                        <span>
                            <span className="heading">Average Rating: </span>
                            {bookDetailsData.averageRating}
                        </span>
                        <span>
                            <span className="heading">Publisher: </span>
                            {bookDetailsData.publisher}
                        </span>
                        <span>
                            <span className="heading">Number of Pages: </span>
                            {bookDetailsData &&
                            bookDetailsData.numberofPages ? (
                                <span>{bookDetailsData.numberofPages}</span>
                            ) : (
                                <span>N/A</span>
                            )}
                        </span>
                        <span>
                            <span className="heading">
                                Original Publication Year:{' '}
                            </span>
                            {bookDetailsData &&
                            bookDetailsData.originalPublicationYear ? (
                                <span>{bookDetailsData.numberofPages}</span>
                            ) : (
                                <span>N/A</span>
                            )}
                        </span>
                        <span>
                            <span className="heading">Year Published: </span>
                            {bookDetailsData &&
                            bookDetailsData.yearPublished ? (
                                <span>{bookDetailsData.yearPublished}</span>
                            ) : (
                                <span>N/A</span>
                            )}
                        </span>
                    </div>
                )}
                {auth.currentUser ? (
                    <div className="review-container">
                        <h2>Write a Review</h2>
                        {reviewError && (
                            <Alert variant="danger" className="alert-container">
                                {reviewError}
                            </Alert>
                        )}
                        <form onSubmit={handleOnSubmit}>
                            <label htmlFor="review">Review </label>
                            <textarea
                                label="Review"
                                type="text"
                                required
                                onChange={handleChange}
                                value={review ? review : ''}
                                id="review"
                                rows={3}
                                cols={30}
                                name="review"
                            />
                            <br /> <br />
                            <label htmlFor="rating">Rating </label>
                            <select
                                name="rating"
                                value={rating ? rating : 0}
                                id="rating"
                                onChange={handleChange}
                            >
                                <option value="Choose">Choose Rating</option>
                                <option value="1">1 Star</option>
                                <option value="2">2 Stars</option>
                                <option value="3">3 Stars</option>
                                <option value="4">4 Stars</option>
                                <option value="5">5 Stars</option>
                            </select>
                            <br></br> <br></br>
                            <Button type="submit" className="button">
                                Post Review
                            </Button>
                        </form>
                    </div>
                ) : null}
                <h2>Reviews</h2>
                {bookDetailsData &&
                    bookDetailsData.reviews.map((review) => {
                        const {
                            _id,
                            comment,
                            rating,
                            username,
                            dateOfReview,
                            email,
                        } = review;
                        return (
                            <div>
                                <h3>Username: {username}</h3>
                                <div>
                                    <h2>Rating: {rating}</h2>
                                    <p>
                                        {comment} <br />
                                        {dateOfReview}
                                    </p>
                                    {auth.currentUser &&
                                    auth.currentUser.email === email ? (
                                        <button
                                            className="button"
                                            onClick={() => {
                                                if (auth.currentUser) {
                                                    removeReview(_id);
                                                } else {
                                                    alert(
                                                        'You need to sign in first to buy the book'
                                                    );
                                                }
                                            }}
                                        >
                                            Delete Review
                                        </button>
                                    ) : null}
                                </div>
                            </div>
                        );
                    })}
            </>
        );
    }
};

export default BookDetails;
