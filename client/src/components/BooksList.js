import React, { useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems } from '../store/selector/cartSelector';
import { addItemToCart } from '../store/actions/cartAction';
import { UserContext } from '../contexts/userContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import noImage from '../assets/images/no-image.jpeg';
import { auth } from '../firebase/firebase';
import { Button } from 'react-bootstrap';
import '../styles/BookList.scss';

const BookList = () => {
    const [loading, setLoading] = useState(true);
    const [bookDetailsData, setBookDetailsData] = useState(undefined);
    const [error, setError] = useState(false);
    const { currentUser } = useContext(UserContext);
    const user = auth.currentUser;
    const [userWishlistData, setUserWishlistData] = useState([]);
    const [isInserted, setIsInserted] = useState(0);

    useEffect(() => {
        async function fetchData() {
            try {
                const url = `https://houseof-books.herokuapp.com/books`;
                const { data } = await axios.get(url);
                setBookDetailsData(data);
                setLoading(false);
            } catch (e) {
                setError(true);
                console.log(e);
            }
        }
        fetchData();
    }, [currentUser]);

    const dispatch = useDispatch();
    const cartItems = useSelector(selectCartItems);

    const buyBook = (title, bookId, price, imageUrl) => {
        let dataBody = {
            email: user.email,
            name: title,
            bookId: bookId,
            price: isNaN(parseInt(price)) ? 7.0 : price,
            imageUrl: imageUrl,
            flag: 'B',
        };
        dispatch(addItemToCart(cartItems, dataBody));
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
                //

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
        if (error) {
            return (
                <div>
                    <h2>No books are present in the list</h2>
                </div>
            );
        } else {
            return (
                <div>
                    <h2>Loading....</h2>
                </div>
            );
        }
    } else if (bookDetailsData && bookDetailsData.length === 0) {
        return (
            <div>
                <h2>No books found in the list</h2>
            </div>
        );
    } else {
        return (
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
                                    variant="primary"
                                    className="button"
                                    onClick={() =>
                                        buyBook(title, _id, price, url)
                                    }
                                >
                                    <span className="price">
                                        ${isNaN(parseInt(price)) ? 7.0 : price}
                                    </span>
                                    <span>Add to Cart</span>
                                </Button>
                            )}
                            {user && !checkBook(_id) && (
                                <Button
                                    className="button"
                                    onClick={() => onClickWishlist(_id, title)}
                                    variant="danger"
                                >
                                    Add To Wishlist
                                </Button>
                            )}
                            {user && checkBook(_id) && (
                                <Button
                                    className="button"
                                    variant="danger"
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
        );
    }
};
export default BookList;
