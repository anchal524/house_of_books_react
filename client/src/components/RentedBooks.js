import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import noImage from '../assets/images/no-image.jpeg';
import { auth } from '../firebase/firebase';

const RentedBooks = (props) => {
    const [loading, setLoading] = useState(true);
    const [bookDetailsData, setBookDetailsData] = useState(undefined);
    const user = auth.currentUser;
    useEffect(() => {
        console.log('useEffect fired');
        async function fetchData() {
            try {
                const url = `https://houseof-books.herokuapp.com/users/rentedbooks/${user.email}`;
                console.log(url);
                const { data } = await axios.get(url);
                console.log('data', data);
                setBookDetailsData(data);
                setLoading(false);
            } catch (e) {
                console.log(e);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div>
                {isNaN(bookDetailsData) ? (
                    <div>
                        <h1>Error 404: Page not found</h1>
                    </div>
                ) : (
                    <div>
                        <h2>Loading....</h2>
                    </div>
                )}
            </div>
        );
    } else if (bookDetailsData && bookDetailsData.length === 0) {
        return (
            <div>
                <h2>No books found in the Rented book list</h2>
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

export default RentedBooks;
