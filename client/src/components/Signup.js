import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { createNativeUser } from '../firebase/firebase';
import FormInput from './FormInput';
import Button from './Button';
import { UserContext } from '../contexts/userContext';
import { Alert, Toast } from 'react-bootstrap';
import '../styles/Signup.scss';

const defaultFormFields = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    username: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    state: '',
    zip: '',
};

const Signup = () => {
    const [formFields, setFormFields] = useState(defaultFormFields);
    const {
        firstName,
        lastName,
        email,
        phoneNumber,
        username,
        password,
        confirmPassword,
        address,
        city,
        state,
        zip,
    } = formFields;

    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);

    const { setCurrentUser } = useContext(UserContext);
    const history = useNavigate();

    useEffect(() => {
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

    const validate = (values) => {
        const errors = {};
        const nameRegex = /[^a-zA-Z]/;
        const emailRegex = /^\S+@[a-zA-Z]+\.[a-zA-Z]+$/;
        const phoneRegex = /^\d{10}$/im;
        const zipRegex = /(^\d{5}$)|(^\d{5}-\d{4}$)/;

        if (nameRegex.test(values.firstName)) {
            errors.firstName = 'First name should contain only letters';
        }
        if (nameRegex.test(values.lastName)) {
            errors.lastName = 'Last name should contain only letters';
        }
        if (!emailRegex.test(values.email)) {
            errors.email = 'Given email id is invalid';
        }
        if (values.password.length < 6) {
            errors.password = 'Password should not be less than 6 characters';
        }
        if (values.confirmPassword.length < 6) {
            errors.confirmPassword =
                'Confirm Password should not be less than 6 characters';
        }
        if (values.username.length < 4) {
            errors.username = 'Username should not be less than 4 characters';
        }
        if (!phoneRegex.test(values.phoneNumber)) {
            errors.phoneNumber = 'Please enter phone number in correct format';
        }
        if (!zipRegex.test(values.zip)) {
            errors.zip = 'Please enter zip code in correct format';
        }
        return errors;
    };

    const handleOnSubmit = async (event) => {
        event.preventDefault();
        setFormErrors(validate(formFields));
        setIsSubmit(true);

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        let dataBody = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber,
            username: username,
            password: password,
            address: address,
            city: city,
            state: state,
            zip: zip,
        };
        try {
            await axios
                .post('https://houseof-books.herokuapp.com/users/signup', {
                    data: dataBody,
                })
                .then(function (response) {
                    console.log(response.data);
                    history('/', { replace: true });
                });
        } catch (error) {
            // alert(error.response.data);
            return;
        }

        try {
            const { user } = await createNativeUser(email, password);
            setCurrentUser(user);
            resetFormFields();
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                alert('Cannot create user, email already exists');
            } else {
                console.log('Error creating user', error);
            }
        }
    };

    return (
        <div className="sign-up-container">
            <h1>Don't have an account?</h1>
            <span>Sign up with your email and password</span>
            <form onSubmit={handleOnSubmit}>
                <FormInput
                    label="First Name"
                    type="text"
                    required
                    onChange={handleChange}
                    value={firstName}
                    name="firstName"
                />
                {formErrors.firstName && (
                    <Alert variant="danger">{formErrors.firstName}</Alert>
                )}
                <FormInput
                    label="Last Name"
                    type="text"
                    required
                    onChange={handleChange}
                    value={lastName}
                    name="lastName"
                />
                {formErrors.lastName && (
                    <Alert variant="danger">{formErrors.lastName}</Alert>
                )}
                <FormInput
                    label="Email"
                    type="email"
                    required
                    onChange={handleChange}
                    value={email}
                    name="email"
                />
                {formErrors.email && (
                    <Alert variant="danger">{formErrors.email}</Alert>
                )}
                <FormInput
                    label="Phone Number"
                    type="text"
                    required
                    onChange={handleChange}
                    value={phoneNumber}
                    name="phoneNumber"
                />
                {formErrors.phoneNumber && (
                    <Alert variant="danger">{formErrors.phoneNumber}</Alert>
                )}
                <FormInput
                    label="Username"
                    type="text"
                    required
                    onChange={handleChange}
                    value={username}
                    name="username"
                />
                {formErrors.username && (
                    <Alert variant="danger">{formErrors.username}</Alert>
                )}
                <FormInput
                    label="Password"
                    type="password"
                    required
                    onChange={handleChange}
                    value={password}
                    name="password"
                />
                {formErrors.password && (
                    <Alert variant="danger">{formErrors.password}</Alert>
                )}
                <FormInput
                    label="Confirm Password"
                    type="password"
                    required
                    onChange={handleChange}
                    value={confirmPassword}
                    name="confirmPassword"
                />
                {formErrors.ConfirmPassword && (
                    <Alert variant="danger">{formErrors.ConfirmPassword}</Alert>
                )}
                <FormInput
                    label="Address"
                    type="text"
                    required
                    onChange={handleChange}
                    value={address}
                    name="address"
                />
                <FormInput
                    label="City"
                    type="text"
                    required
                    onChange={handleChange}
                    value={city}
                    name="city"
                />
                <label>State</label>
                <select
                    className="form-input-label"
                    onChange={handleChange}
                    value={state}
                    name="state"
                >
                    <option value="">Choose State</option>
                    <option value="AL">Alabama</option>
                    <option value="AK">Alaska</option>
                    <option value="AZ">Arizona</option>
                    <option value="AR">Arkansas</option>
                    <option value="CA">California</option>
                    <option value="CO">Colorado</option>
                    <option value="CT">Connecticut</option>
                    <option value="DE">Delaware</option>
                    <option value="DC">District Of Columbia</option>
                    <option value="FL">Florida</option>
                    <option value="GA">Georgia</option>
                    <option value="HI">Hawaii</option>
                    <option value="ID">Idaho</option>
                    <option value="IL">Illinois</option>
                    <option value="IN">Indiana</option>
                    <option value="IA">Iowa</option>
                    <option value="KS">Kansas</option>
                    <option value="KY">Kentucky</option>
                    <option value="LA">Louisiana</option>
                    <option value="ME">Maine</option>
                    <option value="MD">Maryland</option>
                    <option value="MA">Massachusetts</option>
                    <option value="MI">Michigan</option>
                    <option value="MN">Minnesota</option>
                    <option value="MS">Mississippi</option>
                    <option value="MO">Missouri</option>
                    <option value="MT">Montana</option>
                    <option value="NE">Nebraska</option>
                    <option value="NV">Nevada</option>
                    <option value="NH">New Hampshire</option>
                    <option value="NJ">New Jersey</option>
                    <option value="NM">New Mexico</option>
                    <option value="NY">New York</option>
                    <option value="NC">North Carolina</option>
                    <option value="ND">North Dakota</option>
                    <option value="OH">Ohio</option>
                    <option value="OK">Oklahoma</option>
                    <option value="OR">Oregon</option>
                    <option value="PA">Pennsylvania</option>
                    <option value="RI">Rhode Island</option>
                    <option value="SC">South Carolina</option>
                    <option value="SD">South Dakota</option>
                    <option value="TN">Tennessee</option>
                    <option value="TX">Texas</option>
                    <option value="UT">Utah</option>
                    <option value="VT">Vermont</option>
                    <option value="VA">Virginia</option>
                    <option value="WA">Washington</option>
                    <option value="WV">West Virginia</option>
                    <option value="WI">Wisconsin</option>
                    <option value="WY">Wyoming</option>
                </select>
                <FormInput
                    label="Zip"
                    type="text"
                    required
                    onChange={handleChange}
                    value={zip}
                    name="zip"
                />
                {formErrors.zip && (
                    <Alert variant="danger">{formErrors.zip}</Alert>
                )}
                <Button type="submit">Sign Up</Button>
            </form>
        </div>
    );
};

export default Signup;
