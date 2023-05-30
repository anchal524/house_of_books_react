import React, { useContext } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/userContext';
import { signOutUser } from '../firebase/firebase';
import { useSelector } from 'react-redux';
import CartIcon from './CartIcon';
import CartDropdown from './CartDropdown';
import { selectIsCartOpen } from '../store/selector/cartSelector';
import { ReactComponent as OpenBookLogo } from '../assets/images/openbook.svg';
import '../styles/Navigation.scss';

const Navigation = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const isCartOpen = useSelector(selectIsCartOpen);
  // console.log(currentUser);
  const history = useNavigate();

  const signOutHandler = async () => {
    await signOutUser();
    setCurrentUser(null);
    history('/', { replace: true });
  };

  return (
    <>
      <div>
        <div className='app-name-container'>
          <Link className='logo-container' to='/'>
            <OpenBookLogo className='logo' />{' '}
            <span className='logo-name'>HOUSE OF BOOKS</span>
          </Link>
        </div>
      </div>

      <div className='navigation'>
        <div className='nav-links-container'>
          <Link className='nav-link' to='/books/search'>
            SEARCH
          </Link>
          <Link className='nav-link' to='/books'>
            BOOKS
          </Link>
          <Link className='nav-link' to='/books/newAdditions'>
            NEW ADDITIONS
          </Link>
          <Link className='nav-link' to='/books/genres'>
            BOOKS BY GENRE
          </Link>
          <Link className='nav-link' to='/library'>
            LIBRARY
          </Link>
          <Link className='nav-link' to='/books/mostPopular'>
            POPULAR BOOKS
          </Link>
          {/* <Link className="nav-link" to="/books/recents">
                            RECENTLY VIEWED
                        </Link> */}
          {currentUser ? (
            <Link className='nav-link' to='/users/bookshelf'>
              BOOKSHELF
            </Link>
          ) : null}
          {currentUser ? (
            <Link className='nav-link' to='/users/profile'>
              PROFILE
            </Link>
          ) : null}
          {currentUser ? (
            <Link className='nav-link' to='/users/myOrders'>
              MY ORDERS
            </Link>
          ) : null}
          {currentUser ? (
            <Link className='nav-link' to='/users/rentedbooks'>
              RENTED BOOKS
            </Link>
          ) : null}
          {currentUser ? (
            <span className='nav-link' onClick={signOutHandler}>
              SIGN OUT
            </span>
          ) : (
            <Link className='nav-link' to='/auth'>
              SIGN IN
            </Link>
          )}
          <CartIcon />
        </div>
        {isCartOpen && <CartDropdown />}
      </div>
      <Outlet />
    </>
  );
};

export default Navigation;
