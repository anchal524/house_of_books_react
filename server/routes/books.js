const express = require('express');
const router = express.Router();
const booksData = require('../data/books');
const { ObjectId } = require('mongodb');

const ErrorCode = {
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
};

function validateStringParams(param, paramName) {
    if (!param) {
        throwError(ErrorCode.BAD_REQUEST, `Error: No ${paramName} entered.`);
    } else if (typeof param !== 'string') {
        throwError(
            ErrorCode.BAD_REQUEST,
            `Error: Argument ${param} entered is not a string ${paramName}.`
        );
    } else if (param.length === 0) {
        throwError(ErrorCode.BAD_REQUEST, `Error: No ${paramName} entered.`);
    } else if (!param.trim()) {
        throwError(
            ErrorCode.BAD_REQUEST,
            `Error: Empty spaces entered to ${paramName}.`
        );
    }
}

function validateEmail(email) {
    const emailRegex = /^\S+@[a-zA-Z]+\.[a-zA-Z]+$/;
    if (!emailRegex.test(email)) throw 'Given email id is invalid';
}
function validateNumberParams(param, paramName) {
    if (param < 0) {
        throwError(ErrorCode.BAD_REQUEST, `Error: No ${paramName} entered.`);
    }
    if (typeof param === 'number' || !isNaN(param)) {
        if (Number.isInteger(param)) {
            return true;
        } else {
            return true;
        }
    } else {
        throwError(
            ErrorCode.BAD_REQUEST,
            `Error: Argument ${param} passed is not a numeric ${paramName}.`
        );
    }
}
function validateWebsite(websiteLink) {
    const validLink = /^http(s)/;
    websiteLink = websiteLink.trim().toLowerCase();
    if (!websiteLink.match(validLink)) {
        throwError(
            ErrorCode.BAD_REQUEST,
            `Error:  ${websiteLink} is not a valid web site link.`
        );
    }
}

router.get('/', async (req, res) => {
    try {
        let books = await booksData.getAll();
        res.status(200).json(books);
        return books;
    } catch (e) {
        res.status(500).json({ error: e.message });
        return e.message;
    }
});

router.get('/newAdditions', async (req, res) => {
    try {
        let books = await booksData.getNewAddition();
        res.status(200).json(books);
        return books;
    } catch (e) {
        res.status(500).json({ error: e });
        return e.message;
    }
});

router.get('/mostPopular', async (req, res) => {
    try {
        let books = await booksData.getMostPopular();
        res.status(200).json(books);
        return books;
    } catch (e) {
        res.status(500).json({ error: e });
        return e.message;
    }
});

router.get('/search/:searchTerm', async (req, res) => {
    try {
        validateStringParams(req.params.searchTerm, 'searchTerm');
        req.params.searchTerm = req.params.searchTerm.trim();
    } catch (e) {
        res.status(400).json({ error: e });
        return;
    }
    try {
        let books = await booksData.searchBooks(req.params.searchTerm);
        res.status(200).json(books);
        return books;
    } catch (e) {
        res.status(404).json({ error: e });
        return e.message;
    }
});

router.get('/:id', async (req, res) => {
    try {
        validateStringParams(req.params.id, 'Id');
        req.params.id = req.params.id.trim();
        if (!ObjectId.isValid(req.params.id)) {
            throw `Id passed in must be a Buffer or string of 12 bytes or a string of 24 hex characters`;
        }
    } catch (e) {
        res.status(400).json({ error: e });
        return;
    }
    try {
        let books = await booksData.getById(req.params.id);
        res.status(200).json(books);
        return books;
    } catch (e) {
        res.status(404).json({ error: e });
        return e.message;
    }
});
router.post('/addnewbook', async (request, response) => {
    try {
        const {
            ISBN,
            title,
            url,
            description,
            author,
            binding,
            genre,
            numberofPages,
            price,
            publisher,
        } = request.body.data;

        const validateISBN = isArgumentString(ISBN, 'ISBN');
        const validatetitle = isArgumentString(title, 'title');
        const validateurl = isArgumentString(url, 'url');
        const validatedescription = isArgumentString(
            description,
            'description'
        );
        const validateauthor = isArgumentString(author, 'author');
        const validatebinding = isArgumentString(binding, 'binding');
        const validategenre = isArgumentString(genre, 'genre');
        const validatenumberofPages = isArgumentString(
            numberofPages,
            'numberofPages'
        );

        const validateprice = isArgumentString(price, 'price');
        const validatepublisher = isArgumentString(publisher, 'publisher');

        const averageRating = 0;
        reviews = [];
        count = 0;
        console.log(' add route validations passed');

        let books = await booksData.addNewBook(
            validateISBN,
            validateurl,
            validatedescription,
            validateauthor,
            averageRating,
            validatebinding,
            validategenre,
            parseInt(validatenumberofPages),
            parseFloat(validateprice),
            validatepublisher,
            validatetitle,
            count
        );

        if (!books) {
            throwError(
                ErrorCode.INTERNAL_SERVER_ERROR,
                `Error: Could not Add Book.`
            );
        }

        response.json(books);
    } catch (error) {
        console.log(error);
        response.status(error.code || ErrorCode.INTERNAL_SERVER_ERROR).send({
            serverResponse: error.message || 'Internal server error.',
        });
    }
});

router.post('/purchase', async (req, res) => {
    let bookToBePurchased = req.body.data;
    try {
        if (Object.keys(req.body.data).length === 0) {
            throw `No data provided for buying book`;
        }
        validateEmail(bookToBePurchased.email);
        validateStringParams(bookToBePurchased.bookId, 'bookId');
        if (!ObjectId.isValid(bookToBePurchased.bookId)) {
            throw `Error : Id passed in must be a Buffer or string of 12 bytes or a string of 24 hex characters`;
        }
        validateNumberParams(bookToBePurchased.quantity, 'quantity');
        validateNumberParams(bookToBePurchased.totalPrice, 'totalPrice');
    } catch (e) {
        console.log(e);
        res.status(400).json({ error: e });
        return;
    }
    try {
        const currentDate = new Date();
        const dateOfPurchase =
            currentDate.getMonth() +
            1 +
            '/' +
            currentDate.getDate() +
            '/' +
            currentDate.getFullYear();

        let books = await booksData.buyBook(
            bookToBePurchased.email,
            bookToBePurchased.bookId,
            bookToBePurchased.quantity,
            bookToBePurchased.totalPrice,
            dateOfPurchase.trim()
        );
        res.status(200).json(books);
        return books;
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Book could not be bought' });
        return e.message;
    }
});

// router.get("/genres", async (request, response) => {
//     try {
//         restrictRequestQuery(request, response);

//         if (Object.keys(request.body).length !== 0) {
//             throwError(
//                 ErrorCode.BAD_REQUEST,
//                 "Error: Doesn't require fields to be passed."
//             );
//         }
//     } catch (error) {
//         response.status(error.code || ErrorCode.INTERNAL_SERVER_ERROR).send({
//             serverResponse: error.message || "Internal server error.",
//         });
//     }
// });

router.get('/genres/:genre', async (req, res) => {
    try {
        validateStringParams(req.params.genre, 'genre');
        req.params.genre = req.params.genre.trim();
    } catch (e) {
        res.status(400).json({ error: e });
        return;
    }
    try {
        let books = await booksData.getBooksByGenre(req.params.genre);
        res.status(200).json(books);
        return books;
    } catch (e) {
        res.status(404).json({ error: e });
        return e.message;
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
const isArgumentString = (str, variableName) => {
    if (typeof str !== 'string') {
        throwError(
            ErrorCode.BAD_REQUEST,
            `Invalid argument passed for ${
                variableName || 'provided variable'
            }. Expected string.`
        );
    } else if ((str && !str.trim()) || str.length < 1) {
        throwError(
            ErrorCode.BAD_REQUEST,
            `Empty string passed for ${variableName || 'provided variable'}.`
        );
    }
    return str.trim();
};
// const isStringEmpty = (str, variableName) => {
//     if (!str.trim() || str.length < 1) {
//         throwError(
//             ErrorCode.BAD_REQUEST,
//             `Empty string passed for ${variableName || 'provided variable'}.`
//         );
//     }
// };

module.exports = router;
