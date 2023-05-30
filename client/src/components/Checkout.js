import { useContext, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { UserContext } from '../contexts/userContext';
import { Link, useNavigate } from 'react-router-dom';
import { clearCart } from '../store/actions/cartAction';
import { Alert } from 'react-bootstrap';
import axios from 'axios';

import {
    selectCartItems,
    selectCartTotal,
} from '../store/selector/cartSelector';

import CheckoutItem from './CheckoutItem';
import Button from './Button';

import '../styles/Checkout.scss';

const Checkout = () => {
    const [visible, setVisible] = useState(false);
    const { currentUser } = useContext(UserContext);
    const cartItems = useSelector(selectCartItems);
    console.log('Cart Items:', cartItems);
    const cartTotal = useSelector(selectCartTotal);
    const dispatch = useDispatch();
    const navigate = useNavigate();

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

    const handlePurchase = () => {
        let url = '';
        try {
            cartItems.map((cartItem) => {
                console.log('CART ITEM:', cartItems);
                if (cartItem.flag === 'B') {
                    url = 'https://houseof-books.herokuapp.com/books/purchase';
                } else {
                    url = 'https://houseof-books.herokuapp.com/library';
                }
                axios
                    .post(url, {
                        data: cartItem,
                    })
                    .then(function (response) {
                        console.log(response.data);
                        // navigate('/', { replace: true });
                    });
            });
        } catch (error) {
            console.log(error);
        }
        setVisible(true);
        window.setTimeout(() => {
            setVisible(false);
        }, 2000);
        dispatch(clearCart([]));
    };

    return (
        <div className="checkout-container">
            <div className="checkout-header">
                <div className="header-block">
                    <span>Product</span>
                </div>
                <div className="header-block">
                    <span>Description</span>
                </div>
                <div className="header-block">
                    <span>Quantity</span>
                </div>
                <div className="header-block">
                    <span>Price</span>
                </div>
                <div className="header-block">
                    <span>Remove</span>
                </div>
                <div className="header-block">
                    <span>Purchase Option</span>
                </div>
            </div>
            {cartItems.map((cartItem) => (
                <CheckoutItem key={cartItem.bookId} cartItem={cartItem} />
            ))}
            <span className="total">Total: ${cartTotal.toFixed(2)}</span>
            {currentUser ? (
                cartItems.length ? (
                    <Button onClick={handlePurchase}>Purchase items</Button>
                ) : null
            ) : (
                <p className="signin-redirect-container">
                    Please{' '}
                    <Link className="signin-link" to="/auth">
                        Sign in
                    </Link>{' '}
                    to purchase items
                </p>
            )}
            {visible && (
                <Alert variant="success" isOpen={visible}>
                    Purchase successful!
                </Alert>
            )}
        </div>
    );
};

export default Checkout;
