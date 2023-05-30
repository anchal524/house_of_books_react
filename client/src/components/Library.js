import React, { useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems } from '../store/selector/cartSelector';
import { addItemToCart } from '../store/actions/cartAction';
import { UserContext } from '../contexts/userContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import noImage from '../assets/images/no-image.jpeg';
import { auth } from '../firebase/firebase';
import { Alert } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import '../styles/Library.scss';

const Library = (props) => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [bookDetailsData, setBookDetailsData] = useState(undefined);
    const { currentUser } = useContext(UserContext);
    const user = auth.currentUser;
    const [userWishlistData, setUserWishlistData] = useState([]);
    const [isInserted, setIsInserted] = useState(0);

    useEffect(() => {
        console.log('useEffect fired');
        async function fetchData() {
            try {
                const url = `https://houseof-books.herokuapp.com/library`;
                const { data } = await axios.get(url);
                console.log(data);
                setBookDetailsData(data);
                setLoading(false);
            } catch (e) {
                console.log(e);
            }
        }
        fetchData();
    }, [currentUser]);

    function padTo2Digits(num) {
        return num.toString().padStart(2, '0');
    }

    function formatDate(date) {
        return [
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getDate()),
            date.getFullYear(),
        ].join('/');
    }
    function formatDateNextMonth(date) {
        return [
            padTo2Digits(date.getMonth() + 2),
            padTo2Digits(date.getDate()),
            date.getFullYear(),
        ].join('/');
    }

    const dispatch = useDispatch();
    const cartItems = useSelector(selectCartItems);

    const rentBook = (title, bookId, price, imageUrl) => {
        let todayDate = formatDate(new Date());
        let endDate = formatDateNextMonth(new Date());
        console.log(todayDate);
        let dataBody = {
            email: user.email,
            name: title,
            bookId: bookId,
            price: 7.0,
            imageUrl: imageUrl,
            startDate: todayDate,
            endDate: endDate,
            flag: 'R',
        };
        dispatch(addItemToCart(cartItems, dataBody));
    };

    let onClickWishlist = async (bookId, title) => {
        try {
            // console.log(bookId);
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

    const checkBook = (id) => {
        return userWishlistData.some((post, index) => {
            return post.bookId === id;
        });
    };

    if (loading) {
        return (
            <div>
                {isNaN(bookDetailsData) ? (
                    <div>
                        <h2>No books are present in the Library</h2>
                    </div>
                ) : (
                    <div>
                        <h2>Loading....</h2>
                    </div>
                )}
            </div>
        );
    } else {
        return (
            <div className="main-container">
                <Alert variant="primary">
                    These books can only be rented. Rented books are available
                    only for 30 days
                </Alert>
                <div className="books-container">
                    {bookDetailsData &&
                        bookDetailsData.map(({ _id, url, title, price }) => (
                            <div className="book-card-container" key={_id}>
                                <Link to={`/books/${_id}`}>
                                    <img
                                        src={url ? url : noImage}
                                        alt={`${title}`}
                                    />
                                </Link>
                                <span className="title">{title}</span>
                                {user && (
                                    <Button
                                        className="button"
                                        variant="primary"
                                        onClick={() =>
                                            rentBook(title, _id, price, url)
                                        }
                                    >
                                        <span className="price">
                                            $
                                            {isNaN(parseInt(price))
                                                ? 7.0
                                                : price}
                                        </span>
                                        <span>Add to Cart</span>
                                    </Button>
                                )}
                                {user && !checkBook(_id) && (
                                    <Button
                                        className="button"
                                        onClick={() =>
                                            onClickWishlist(_id, title)
                                        }
                                        variant="danger"
                                    >
                                        Add To Wishlist
                                    </Button>
                                )}
                                {user && checkBook(_id) && (
                                    <Button
                                        className="button"
                                        variant="contained"
                                        color="error"
                                        onClick={() =>
                                            handleRemoveWishlist(_id, title)
                                        }
                                    >
                                        Remove from Wishlist
                                    </Button>
                                )}
                            </div>
                        ))}
                </div>
            </div>
        );
    }
};

export default Library;
