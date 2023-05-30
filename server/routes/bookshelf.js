const express = require('express');
const router = express.Router();
const bookShelfData = require('../data/bookshelf');
const booksData = require('../data/books');
var validator = require('validator');
const { ObjectId } = require('mongodb');
const ErrorCode = {
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
};
router.post('/', async (request, response) => {
    try {
        const resultArray = [];
        const userEmail = request.body.email;
        const validatedEmail = validateEmail(userEmail);

        let bookShelf = await bookShelfData.getBookshelfBooks(validatedEmail);
        if (!bookShelf) {
            throwError(
                ErrorCode.INTERNAL_SERVER_ERROR,
                'Error: Could not find books in wishlist '
            );
        }
        for (let element of bookShelf) {
            try {
                let books = await booksData.getById(element.bookId.toString());
                // console.log(books);
                resultArray.push(books);
            } catch (error) {
                console.log(error);
            }
        }
        // resultArray.push(
        //     bookShelf.forEach(async (element) => {
        //         try {
        //             let books = await booksData.getById(
        //                 element.bookId.toString()
        //             );
        //             console.log(books);
        //         } catch (error) {
        //             console.log(error);
        //         }
        //     })
        // );

        // console.log('before getbyid');
        // console.log(resultArray);
        response.json(resultArray);
    } catch (error) {
        response.status(error.code || ErrorCode.INTERNAL_SERVER_ERROR).send({
            serverResponse: error.message || 'Internal server error.',
        });
    }
});
router.post('/add', async (request, response) => {
    try {
        const userEmail = request.body.email;
        const bookId = request.body.bookId;
        const title = request.body.title;

        // console.log(userEmail);
        const validatedEmail = validateEmail(userEmail);
        const validatedBookId = validateObjectId(bookId);
        const validatedTitle = validateTitle(title);

        let bookShelf = await bookShelfData.addBooktoBookshelf(
            validatedBookId,
            validatedEmail,
            validatedTitle
        );
        if (!bookShelf.inserted) {
            throwError(
                ErrorCode.INTERNAL_SERVER_ERROR,
                'Error: Could not add to wishlist '
            );
        }
        // console.log(bookShelf);
        // console.log('add to wishlist clicked');
        response.json({ inserted: true });
    } catch (error) {
        response.status(error.code || ErrorCode.INTERNAL_SERVER_ERROR).send({
            serverResponse: error.message || 'Internal server error.',
        });
    }
});
router.post('/remove', async (request, response) => {
    try {
        const userEmail = request.body.email;
        const bookId = request.body.bookId;
        const title = request.body.title;

        // console.log(userEmail);
        const validatedEmail = validateEmail(userEmail);
        const validatedBookId = validateObjectId(bookId);
        const validatedTitle = validateTitle(title);

        let bookShelf = await bookShelfData.removeFromBookshelf(
            validatedBookId,
            validatedEmail,
            validatedTitle
        );
        if (!bookShelf.deleted) {
            throwError(
                ErrorCode.INTERNAL_SERVER_ERROR,
                'Error: Could not delete from wishlist '
            );
        }
        // console.log(bookShelf, 'remove from wishlist clicked');

        response.json({ deleted: true });
    } catch (error) {
        response.status(error.code || ErrorCode.INTERNAL_SERVER_ERROR).send({
            serverResponse: error.message || 'Internal server error.',
        });
    }
});
const throwError = (code = 404, message = 'Not found') => {
    throw { code, message };
};
const restrictRequestQuery = (request, response) => {
    if (Object.keys(request.query).length > 0) {
        throw { code: 400, message: 'Request query not allowed.' };
    }
};

////////////////////////////////////////////////// Error Checking Functions
const validateEmail = (email) => {
    isArgumentString(email, 'Email');
    isStringEmpty(email, 'Email');
    email = email.trim();
    if (!validator.isEmail(email)) {
        throwError(ErrorCode.BAD_REQUEST, 'Invalid Email provided');
    }
    return email.trim();
};
const isArgumentString = (str, variableName) => {
    if (typeof str !== 'string') {
        throwError(
            ErrorCode.BAD_REQUEST,
            `Invalid argument passed for ${
                variableName || 'provided variable'
            }. Expected string.`
        );
    }
};
const isStringEmpty = (str, variableName) => {
    if (!str.trim() || str.length < 1) {
        throwError(
            ErrorCode.BAD_REQUEST,
            `Empty string passed for ${variableName || 'provided variable'}.`
        );
    }
};
const validateObjectId = (id) => {
    //should match 24 length Hex string
    const objectIdRegex = /^[a-fA-F0-9]{24}$/;

    if (!ObjectId.isValid(id) || !objectIdRegex.test(id)) {
        throwError(ErrorCode.BAD_REQUEST, ' id is not a valid ObjectId.');
    }

    return ObjectId(id);
};
const checkspace = (string, variableName) => {
    let checkspace = /(\s)/g;
    if (checkspace.test(string))
        throwError(
            ErrorCode.BAD_REQUEST,
            ` Invalid argument passed, spaces not allowed `
        );
};
const validateTitle = (title) => {
    isArgumentString(title, 'title');
    isStringEmpty(title, 'title');
    title = title.trim();
    let validnameregex = /[a-zA-Z]/g;
    if (!validnameregex.test(title)) {
        throwError(
            ErrorCode.BAD_REQUEST,
            'Invalid title. Expected alphabets only'
        );
    }
    return title.trim();
};
/////////////////////////////////////////////////////////////////////////////////
module.exports = router;
