import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import FormInput from './FormInput';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import '../styles/Signup.scss';
import { UserContext } from '../contexts/userContext';
import { Alert, Toast } from 'react-bootstrap';
import { auth } from '../firebase/firebase';
import { Navigate } from 'react-router-dom';

const defaultFormFields = {
    ISBN: '',
    title: '',
    url: '',
    description: '',
    author: '',
    averageRating: '',
    binding: '',
    genre: '',
    numberofPages: '',
    originalPublicationYear: '',
    price: '',
    publisher: '',
    yearPublished: '',
    reviews: [],
    count: '',
};

export default function AddNewBook() {
    const [formFields, setFormFields] = useState(defaultFormFields);
    const {
        ISBN,
        title,
        url,
        description,
        author,
        // averageRating,
        binding,
        genre,
        numberofPages,
        originalPublicationYear,
        price,
        publisher,
        yearPublished,
        // reviews,
        // count,
    } = formFields;
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);

    const { currentUser } = useContext(UserContext);
    // const auth = getAuth();
    const user = auth.currentUser;
    const navigate = useNavigate();

    useEffect(() => {
        console.log('Form errors are ', formErrors);
        if (Object.keys(formErrors).length === 0 && isSubmit) {
        }
    }, [formErrors]);

    const resetFormFields = () => {
        setFormFields(defaultFormFields);
    };
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormFields({ ...formFields, [name]: value });
    };

    const isArgumentString = (values) => {
        let errors = {};
        const webRegex = /^http(s)/;
        console.log('Values are ', values);
        if (!webRegex.test(values.url)) {
            errors.url = `Invalid Image Url passed`;
        }

        if (parseInt(values.numberofPages) < 0) {
            errors.numberofPages = `Pages cannot be less than 0`;
        }
        if (parseFloat(values.price) < 0) {
            errors.price = `Price cannot be less than 0`;
        }
        if (
            parseInt(values.originalPublicationYear) > 2022 &&
            parseInt(values.originalPublicationYear) < 2000
        ) {
            errors.originalPublicationYear = `Year cannot be greater than current year`;
        }
        if (
            parseInt(values.yearPublished) > 2022 &&
            parseInt(values.yearPublished) < 2000
        ) {
            errors.yearPublished = `Year cannot be greater than current year`;
        }
        return errors;
    };

    const handleOnSubmit = async (event) => {
        event.preventDefault();
        console.log('Before function call');
        setFormErrors(isArgumentString(formFields));
        console.log('After function call');

        setIsSubmit(true);

        if (Object.keys(formErrors).length === 0) {
            let dataBody = {
                ISBN: formFields.ISBN,
                title: formFields.title,
                url: formFields.url,
                description: formFields.description,
                author: formFields.author,
                // averageRating: 0,
                binding: formFields.binding,
                genre: formFields.genre,
                numberofPages: formFields.numberofPages,
                price: formFields.price,
                publisher: formFields.publisher,
                // reviews: [],
                // count: 0,
            };
            axios
                .post('https://houseof-books.herokuapp.com/books/addNewBook', {
                    data: dataBody,
                })
                .then(function (response) {
                    console.log(response.data);
                    navigate('/books', { replace: true });
                });
        }
    };
    if (user) {
        return (
            <div style={{ textAlign: 'center' }}>
                <div className="text-center">
                    <h1>AddNewBook</h1>
                </div>
                <div style={{ justifyContent: 'center' }}>
                    <form onSubmit={handleOnSubmit} style={{ width: '30%' }}>
                        <FormInput
                            label="Title"
                            type="text"
                            required
                            onChange={handleChange}
                            value={title}
                            name="title"
                        />
                        <FormInput
                            label="ISBN"
                            type="text"
                            onChange={handleChange}
                            value={ISBN}
                            name="ISBN"
                        />
                        {formErrors.url && (
                            <Alert variant="danger">{formErrors.url}</Alert>
                        )}
                        <FormInput
                            label="Image URL"
                            type="text"
                            required
                            onChange={handleChange}
                            value={url}
                            name="url"
                        />
                        <FormInput
                            label="Author"
                            type="text"
                            required
                            onChange={handleChange}
                            value={author}
                            name="author"
                        />
                        <FormInput
                            label="Description"
                            type="text"
                            required
                            onChange={handleChange}
                            value={description}
                            name="description"
                        />

                        <FormInput
                            label="Genre"
                            type="text"
                            required
                            onChange={handleChange}
                            value={genre}
                            name="genre"
                        />
                        <FormInput
                            label="Paperback/HardCover"
                            type="text"
                            required
                            onChange={handleChange}
                            value={binding}
                            name="binding"
                        />
                        {formErrors.numberofPages && (
                            <Alert variant="danger">
                                {formErrors.numberofPages}
                            </Alert>
                        )}
                        <FormInput
                            label="Pages"
                            type="number"
                            required
                            onChange={handleChange}
                            value={numberofPages}
                            name="numberofPages"
                        />
                        {formErrors.price && (
                            <Alert variant="danger">{formErrors.price}</Alert>
                        )}
                        <FormInput
                            label="Price"
                            type="number"
                            required
                            onChange={handleChange}
                            value={price}
                            name="price"
                        />
                        <FormInput
                            label="Publisher"
                            type="text"
                            required
                            onChange={handleChange}
                            value={publisher}
                            name="publisher"
                        />

                        <Button type="submit">Submit</Button>
                    </form>
                </div>
            </div>
        );
    } else {
        return (
            <div>
                <h1>User Need To be Signed Up</h1>
            </div>
        );
    }
}
