const mongoCollections = require('../config/mongoCollection');
const users = mongoCollections.users;
var validator = require('validator');
const { ObjectId } = require('mongodb');

const ErrorCode = {
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
};

async function getBookshelfBooks(email) {
    try {
        const validatedEmail = validateEmail(email);
        const userCollection = await users();
        let checkUser = await userCollection.findOne({
            email: validatedEmail,
        });
        if (checkUser === null)
            throwError(ErrorCode.NOT_FOUND, 'Error: No user with that email.');

        return checkUser.wishlist;
    } catch (error) {
        throwCatchError(error);
    }
}

async function addBooktoBookshelf(bookId, email, title) {
    try {
        const validatedEmail = validateEmail(email);
        const validatedBookId = validateObjectId(bookId);
        const validatedTitle = validateTitle(title);

        const userCollection = await users();
        let checkUser = await userCollection.findOne({
            email: validatedEmail,
        });

        if (checkUser === null)
            throwError(ErrorCode.NOT_FOUND, 'Error: No user with that email.');

        if (checkUser.wishlist != undefined) {
            for (let book of checkUser.wishlist) {
                if (book.bookId.equals(validatedBookId)) {
                    throwError(
                        ErrorCode.BAD_REQUEST,
                        'Error: Book Already in wishList'
                    );
                    return;
                }
            }
        }

        const wishlistArrUpdate = await userCollection.updateOne(
            { email: validatedEmail },
            {
                $push: {
                    wishlist: {
                        bookId: validatedBookId,
                        title: validatedTitle,
                    },
                },
            }
        );

        if (
            !wishlistArrUpdate.matchedCount &&
            !wishlistArrUpdate.modifiedCount
        ) {
            throwError(
                ErrorCode.NOT_FOUND,
                `Error:Could not add to user wishlist.`
            );
        }
        return { inserted: true };
    } catch (error) {
        throwCatchError(error);
    }
}
async function removeFromBookshelf(bookId, email, title) {
    try {
        const validatedEmail = validateEmail(email);
        const validatedBookId = validateObjectId(bookId);
        const validatedTitle = validateTitle(title);

        const userCollection = await users();
        let checkUser = await userCollection.findOne({
            email: validatedEmail,
        });
        // console.log(checkUser.wishlist);
        // console.log('////////////////////');
        if (checkUser === null)
            throwError(ErrorCode.NOT_FOUND, 'Error: No user with that email.');

        for (let book of checkUser.wishlist) {
            // console.log(book);
            if (book.bookId.equals(validatedBookId)) {
                const wishlistArrUpdate = await userCollection.updateOne(
                    { email: email },
                    {
                        $pull: {
                            wishlist: {
                                bookId: validatedBookId,
                                title: validatedTitle,
                            },
                        },
                    }
                );
                if (
                    !wishlistArrUpdate.matchedCount &&
                    !wishlistArrUpdate.modifiedCount
                ) {
                    throw `Could not remove from user wishlist.`;
                }
                return { deleted: true };
            }
        }
    } catch (error) {
        throwCatchError(error);
    }
}
const throwError = (code = 404, message = 'Not found') => {
    throw { code, message };
};

const throwCatchError = (error) => {
    if (error.code && error.message) {
        throwError(error.code, error.message);
    }

    throwError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        'Error: Internal server error.'
    );
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
module.exports = { getBookshelfBooks, addBooktoBookshelf, removeFromBookshelf };
