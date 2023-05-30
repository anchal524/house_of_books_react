import React, { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems } from '../store/selector/cartSelector';
import { addItemToCart } from '../store/actions/cartAction';
import { UserContext } from '../contexts/userContext';
import { auth } from '../firebase/firebase';
import axios from 'axios';
import AddToWishlist from './AddToWishlist';
import { Link, useParams } from 'react-router-dom';
import noImage from '../assets/images/no-image.jpeg';
import { Button } from 'react-bootstrap';
import '../styles/NewAdditions.scss';

const NewAdditions = (props) => {
    const [loading, setLoading] = useState(true);
    const [bookDetailsData, setBookDetailsData] = useState(undefined);
    const [error, setError] = useState(false);
    const { currentUser } = useContext(UserContext);
    const dispatch = useDispatch();
    const cartItems = useSelector(selectCartItems);
    const user = auth.currentUser;
    const [userWishlistData, setUserWishlistData] = useState([]);
    const [isInserted, setIsInserted] = useState(0);
    let { id } = useParams();
    useEffect(() => {
        console.log('useEffect fired');
        async function fetchData() {
            try {
                const url = `https://houseof-books.herokuapp.com/books/newAdditions`;
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
    }, [id, currentUser]);
    let onClickWishlist = async (bookId, title) => {
        try {
            // console.log(bookId);
            const url = `https://houseof-books.herokuapp.com/users/bookshelf/add`;
            const { data } = await axios.post(url, {
                email: currentUser.email,
                bookId: bookId,
                title: title,
            });
            // console.log(data);
            if (data.inserted === true) setIsInserted(Number(isInserted) + 1);
            // setLoading(false);
        } catch (e) {
            console.log(e);
        }
    };
    let handleRemoveWishlist = async (bookId, title) => {
        try {
            // console.log('inside remove onclick');
            const url = `https://houseof-books.herokuapp.com/users/bookshelf/remove`;
            const { data } = await axios.post(url, {
                email: currentUser.email,
                bookId: bookId,
                title: title,
            });
            // console.log(data);
            if (data.deleted === true) setIsInserted(Number(isInserted) - 1);
        } catch (e) {
            console.log(e);
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                // console.log(bookId);.
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

    const buyBook = (title, bookId, price, imageUrl) => {
        price = parseFloat(price);
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

    const checkBook = (id) => {
        return userWishlistData.some((post, index) => {
            return post.bookId === id;
        });
    };

    if (loading) {
        return (
            <div>
                {isNaN(bookDetailsData) ? (
                    <p>
                        <h1>Error 404: Page not found</h1>
                    </p>
                ) : (
                    <div>
                        <h2>Loading....</h2>
                    </div>
                )}
            </div>
        );
    } else {
        return (
            <div className="new-additions-container">
                {bookDetailsData &&
                    bookDetailsData.map(({ _id, url, title, price }) => (
                        <div className="new-additions-card-container" key={_id}>
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

export default NewAdditions;
