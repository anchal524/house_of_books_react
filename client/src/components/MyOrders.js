import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/userContext';
import noImage from '../assets/images/no-image.jpeg';
import '../styles/MyOrders.scss';

const MyOrders = () => {
    const [loading, setLoading] = useState(true);
    const [bookDetailsData, setBookDetailsData] = useState(undefined);
    const [error, setError] = useState(false);

    const { currentUser } = useContext(UserContext);

    useEffect(() => {
        console.log('useEffect fired');
        async function fetchData() {
            try {
                console.log('Before axios call');
                const url = `https://houseof-books.herokuapp.com/users/myorders`;
                const { data } = await axios.post(url, {
                    data: currentUser.email,
                });
                console.log(data);
                setBookDetailsData(data);
                setLoading(false);
            } catch (e) {
                setError(true);
                console.log(e);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        if (error) {
            return (
                <div>
                    <h2>No orders found</h2>
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
                <h2>No orders found in the order history</h2>
            </div>
        );
    } else {
        return (
            <div className="books-container">
                {bookDetailsData &&
                    bookDetailsData.map(
                        ({
                            _id,
                            url,
                            title,
                            totalPrice,
                            quantity,
                            dateOfPurchase,
                            startDate,
                            endDate,
                        }) => (
                            <div className="book-card-container" key={_id}>
                                <Link to={`/books/${_id}`}>
                                    <img
                                        src={url ? url : noImage}
                                        alt={`${title}`}
                                    />
                                </Link>
                                <span className="title">{title}</span>
                                <span>
                                    {totalPrice ? (
                                        <span className="heading">
                                            Total Price: {totalPrice}
                                        </span>
                                    ) : (
                                        <span className="price-container">
                                            <span className="rented">
                                                Rented Book
                                            </span>
                                            <span className="heading">
                                                Total Price: $7.00
                                            </span>
                                        </span>
                                    )}
                                </span>
                                <span>
                                    <span className="heading">Quantity: </span>
                                    {quantity ? (
                                        <span>{quantity}</span>
                                    ) : (
                                        <span>1</span>
                                    )}
                                </span>
                                <span>
                                    {dateOfPurchase ? (
                                        <span>
                                            <span className="heading">
                                                Date of Purchase:{' '}
                                            </span>
                                            <span>{dateOfPurchase}</span>
                                        </span>
                                    ) : (
                                        <span>
                                            <span className="heading">
                                                Rented Date:{' '}
                                            </span>
                                            <span>{startDate}</span>
                                        </span>
                                    )}
                                </span>
                                <span>
                                    <span className="heading">End Date: </span>
                                    {endDate ? (
                                        <span>{endDate}</span>
                                    ) : (
                                        <span>N/A</span>
                                    )}
                                </span>
                            </div>
                        )
                    )}
            </div>
        );
    }
};

export default MyOrders;
