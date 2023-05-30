import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FormInput from './FormInput';
import Button from './Button';
import { UserContext } from '../contexts/userContext';
import { getAuth, updateEmail } from 'firebase/auth';
import { Alert, Toast } from 'react-bootstrap';
import '../styles/Signup.scss';
import { auth } from '../firebase/firebase';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
    const [userData, setUserData] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const history = useNavigate();
    const [oldUsername, setOldUsername] = useState(undefined);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);

    const { currentUser } = useContext(UserContext);
    const auth = getAuth();

    useEffect(() => {
        async function fetchData() {
            try {
                const url = `https://houseof-books.herokuapp.com/users/profile`;
                const { data } = await axios.post(url, {
                    data: currentUser.email,
                });
                console.log(data);
                setUserData(data);
                setOldUsername(data.username);
                setLoading(false);
            } catch (e) {
                setError(true);
            }
        }
        fetchData();
    }, [currentUser]);

    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit) {
        }
    }, [formErrors]);

    const validate = (values) => {
        const errors = {};
        const nameRegex = /[^a-zA-Z]/;
        const emailRegex = /^\S+@[a-zA-Z]+\.[a-zA-Z]+$/;
        const phoneRegex = /^\d{10}$/im;
        const zipRegex = /(^\d{5}$)|(^\d{5}-\d{4}$)/;

        console.log(values.firstName);
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

    const handleChange = (event) => {
        const { name, value } = event.target;

        setUserData({ ...userData, [name]: value });
    };

    const handleOnSubmit = async (event) => {
        event.preventDefault();
        const {
            password,
            confirmPassword,
            firstName,
            lastName,
            email,
            phoneNumber,
            username,
            address,
            city,
            state,
            zip,
        } = event.target.elements;
        setFormErrors(validate(userData));
        setIsSubmit(true);

        if (password.value !== confirmPassword.value) {
            alert('Passwords do not match');
            return;
        }

        let dataBody = {
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            oldEmail: currentUser.email,
            phoneNumber: phoneNumber.value,
            username: username.value,
            oldUsername: oldUsername,
            password: password.value,
            address: address.value,
            city: city.value,
            state: state.value,
            zip: zip.value,
        };

        await updateEmail(auth.currentUser, email.value);

        axios
            .put('https://houseof-books.herokuapp.com/users/profile/', {
                data: dataBody,
            })
            .then(function (response) {
                console.log(response.data);
                // setUserData(response.data);
                history('/', { replace: true });
            });
    };

    if (loading) {
        if (error) {
            return (
                <div>
                    <h2>No User found, Please sign in</h2>
                </div>
            );
        } else if (!auth.currentUser) {
            return (
                <div>
                    <h2>Please sign in to view the profile page</h2>
                </div>
            );
        } else {
            return (
                <div>
                    <h2>Loading....</h2>
                </div>
            );
        }
    } else {
        return (
            <div className="sign-up-container">
                <Link to="/books/addnewbook">
                    <Button href="/books/addnewbook">Add New Book</Button>{' '}
                </Link>
                <h1>Profile Page</h1>
                {userData && userData.image ? (
                    <img alt="profile picture" src={userData.image} />
                ) : (
                    <img alt="profile picture" src="/defaultDp.png" />
                )}
                <form onSubmit={handleOnSubmit}>
                    <FormInput
                        label="First Name"
                        type="text"
                        required
                        onChange={handleChange}
                        value={userData.firstName ? userData.firstName : ''}
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
                        value={userData.lastName ? userData.lastName : ''}
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
                        value={userData.email ? userData.email : ''}
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
                        value={userData.phoneNumber ? userData.phoneNumber : ''}
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
                        value={userData.username ? userData.username : ''}
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
                        value={userData.password ? userData.password : ''}
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
                        value={
                            userData.confirmPassword
                                ? userData.confirmPassword
                                : ''
                        }
                        name="confirmPassword"
                    />
                    {formErrors.ConfirmPassword && (
                        <Alert variant="danger">
                            {formErrors.ConfirmPassword}
                        </Alert>
                    )}
                    <FormInput
                        label="Address"
                        type="text"
                        required
                        onChange={handleChange}
                        value={userData.address ? userData.address : ''}
                        name="address"
                    />
                    <FormInput
                        label="City"
                        type="text"
                        required
                        onChange={handleChange}
                        value={userData.city ? userData.city : ''}
                        name="city"
                    />
                    <label>State</label>
                    <select
                        className="form-input-label"
                        onChange={handleChange}
                        value={userData.state ? userData.state : ''}
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
                        value={userData.zip ? userData.zip : ''}
                        name="zip"
                    />
                    {formErrors.zip && (
                        <Alert variant="danger">{formErrors.zip}</Alert>
                    )}
                    <Button type="submit">Update</Button>
                </form>
            </div>
        );
    }
};

export default ProfilePage;
