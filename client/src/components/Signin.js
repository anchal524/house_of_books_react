import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    NativeSignIn,
    signInWithGooglePopup,
    auth,
} from '../firebase/firebase';
import FormInput from './FormInput';
import Button from './Button';
import '../styles/Signin.scss';

const defaultFormFields = {
    email: '',
    password: '',
};

const Signin = () => {
    const [formFields, setFormFields] = useState(defaultFormFields);
    const { email, password } = formFields;
    const history = useNavigate();

    const SignInWithGoogle = async () => {
        await signInWithGooglePopup();
        const user = auth.currentUser;

        const url = `https://houseof-books.herokuapp.com/users/profile`;
        const { data } = await axios.post(url, { data: user.email });

        if (data === null) {
            let dataBody = { email: user.email, flag: 'G' };
            axios
                .post('https://houseof-books.herokuapp.com/users/signup', {
                    data: dataBody,
                })
                .then(function (response) {
                    console.log(response.data);
                    history('/users/profile', { replace: true });
                });
        } else {
            history('/', { replace: true });
        }
    };

    const resetFormFields = () => {
        setFormFields(defaultFormFields);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormFields({ ...formFields, [name]: value });
    };

    const handleOnSubmit = async (event) => {
        event.preventDefault();

        let dataBody = {
            email: email,
            password: password,
        };
        try {
            await axios
                .post('https://houseof-books.herokuapp.com/users/login', {
                    data: dataBody,
                })
                .then(function (response) {
                    console.log(response.data);
                    history('/', { replace: true });
                });
        } catch (error) {
            alert(error.response.data);
            return;
        }

        try {
            await NativeSignIn(email, password);
            resetFormFields();
        } catch (error) {
            if (
                error.code === 'auth/user-not-found' ||
                error.code === 'auth/wrong-password'
            ) {
                alert('Invalid email or password');
            }
            console.log('Error signing in', error);
        }
        history('/', { replace: true });
    };

    return (
        <div className="sign-up-container">
            <h1>Already have an account?</h1>
            <span>Sign in with your email and password.</span>
            <form onSubmit={handleOnSubmit}>
                <FormInput
                    label="Email"
                    type="email"
                    required
                    onChange={handleChange}
                    value={email}
                    name="email-signin"
                />
                <FormInput
                    label="Password"
                    type="password"
                    required
                    onChange={handleChange}
                    value={password}
                    name="password-signin"
                />
                <div className="buttons-container">
                    <Button type="submit">Sign In</Button>
                    <Button
                        type="button"
                        buttonType="google"
                        onClick={SignInWithGoogle}
                    >
                        Google sign in
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Signin;
