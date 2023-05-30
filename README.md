# house-of-books

We believe that books are necessary for a healthy culture. We want to create a platform where all book lovers can get hooked on the thrill of reading, discover new writers and books. Our mission is also to support independent authors. So with this in mind we created our website - House of Books. Our website is a one-stop-destination for all the reading enthusiasts, booksellers and authors.

# Setup Guide

# SERVER

## Installing dependencies

Go to the server folder

`cd server`

Run the following command

```
npm install
```

After getting all the dependencies installed, please run the following commands:

MAC machine

```
brew install graphicsmagick
brew install ghostscript
```

Windows machine

## Running instructions:

```
npm start
```

# Endpoints

Access the product at:
http://localhost:4000/

# CLIENT

Now , go to the client folder

`cd client`

Run the following command

```
npm install
```

## .Env File for Firebase:

Please add the .env.local file in the code under client folder for Firebase integration with the code(We are providing the .env file in our zip code which might be hidden if you are viewing it via file viewer. Please make sure to unhide the hidden files according to your operating system).

## Running instructions:

```
npm start
```

# Endpoints

Access the product at:
http://localhost:3000/

View all the available books in our inventory which you can buy :
http://localhost:3000/books

View all the newly added books:
http://localhost:3000/books/newAdditions

View the most popular books:
http://localhost:3000/books/mostPopular

View books by your favourite genre:
http://localhost:3000/books/genres

View all the books that are available for rent:
http://localhost:3000/library

View all your rented books that are due to be returned:
http://localhost:3000/users/rentedbooks

View your profile at:
http://localhost:3000/users/profile

View your previous orders at:
http://localhost:3000/users/myOrders

You can view details of a book by clicking on that particular book

Search any book at:
http://localhost:3000/books/search

View the books in your wishlist:
http://localhost:3000/users/bookshelf

You can checkout the order:
http://localhost:3000/checkout
