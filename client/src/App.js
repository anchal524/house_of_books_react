import React from 'react';
import { Route, Routes } from 'react-router-dom';
import BookDetails from './components/BooksDetails';
import NewAdditions from './components/NewAdditions';
import BooksList from './components/BooksList';
import Home from './components/Home';
import Library from './components/Library';
import MostPopular from './components/MostPopular';
import Navigation from './components/Navigation';
import Authentication from './components/Authentication';
import Bookshelf from './components/Bookshelf';
import ProfilePage from './components/ProfilePage';
import Checkout from './components/Checkout';
import RentedBooks from './components/RentedBooks';
import MyOrders from './components/MyOrders';
import './App.scss';
import BookSearchDetails from './components/SearchBook';
import BookGenres from './components/Genres';
import AddNewBook from './components/AddNewBook';

const App = () => {
    return (
        <div>
            <Navigation />

            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/books" element={<BooksList />} />
                <Route exact path="/books/:id" element={<BookDetails />} />
                <Route path="/auth" element={<Authentication />} />
                <Route
                    exact
                    path="/books/newAdditions"
                    element={<NewAdditions />}
                />
                <Route exact path="/library" element={<Library />} />
                <Route
                    exact
                    path="/books/mostPopular"
                    element={<MostPopular />}
                />
                <Route exact path="/users/profile" element={<ProfilePage />} />
                <Route exact path="/users/myOrders" element={<MyOrders />} />
                <Route exact path="/users/bookshelf" element={<Bookshelf />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route
                    exact
                    path="/books/addnewbook"
                    element={<AddNewBook />}
                />
                <Route
                    exact
                    path="/users/rentedbooks"
                    element={<RentedBooks />}
                />
                <Route
                    exact
                    path="/books/search/"
                    element={<BookSearchDetails />}
                />
                <Route exact path="/books/genres" element={<BookGenres />} />
            </Routes>
        </div>
    );
};

export default App;
