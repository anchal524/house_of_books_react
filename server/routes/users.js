const express = require('express');
const router = express.Router();
const userData = require('../data/users');
const { ObjectId } = require('mongodb');
const imageData = require('../graphics');

stateList = [
  'AL',
  'AK',
  'AZ',
  'AR',
  'CA',
  'CO',
  'CT',
  'DE',
  'DC',
  'FL',
  'GA',
  'HI',
  'ID',
  'IL',
  'IN',
  'IA',
  'KS',
  'KY',
  'LA',
  'ME',
  'MD',
  'MA',
  'MI',
  'MN',
  'MS',
  'MO',
  'MT',
  'NE',
  'NV',
  'NH',
  'NJ',
  'NM',
  'NY',
  'NC',
  'ND',
  'OH',
  'OK',
  'OR',
  'PA',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VT',
  'VA',
  'WA',
  'WV',
  'WI',
  'WY',
];

function checkIsString(s) {
  if (typeof s !== 'string') throw 'Given input is invalid';
  if (s.length < 1) throw 'Given input is empty';
  if (s.trim().length === 0) throw 'Given input is all white spaces';
}

function checkIsName(s) {
  if (/[^a-zA-Z]/.test(s)) throw 'Given input is not only letters';
}

function checkIsPassword(s) {
  if (s.length < 6) throw 'Given password size is less than 8';
}

function checkIsEmail(s) {
  if (!/^\S+@[a-zA-Z]+\.[a-zA-Z]+$/.test(s)) throw 'Given email id is invalid';
}

function checkIsUsername(s) {
  if (s.length < 4) throw 'Given username size is less than 4';
}

router.get('/rentedbooks/:email', async (req, res) => {
  try {
    checkIsString(req.params.email);
    checkIsEmail(req.params.email);
    req.params.email = req.params.email.trim();
    if (!req.params.email) throw 'must provide user email';
  } catch (e) {
    res.status(400).send(String(e));
    return;
  }
  try {
    req.params.email = req.params.email.trim();
    let rentedBooks = await userData.getRentedBooks(req.params.email);
    console.log(rentedBooks);
    res.status(200).json(rentedBooks);
  } catch (e) {
    res.status(500).send(String(e));
    return;
  }
});

router.post('/profile', async (req, res) => {
  // error check
  try {
    if (!req.body.data) throw 'must provide email Id';
    checkIsEmail(req.body.data);
  } catch (e) {
    return res.status(400).send(String(e));
  }
  try {
    res.status(200).json(await userData.getUser(req.body.data));
  } catch (e) {
    console.log(e);
    res.status(500).send(String(e));
  }
});

router.post('/myorders', async (req, res) => {
  // error check
  try {
    if (!req.body.data) throw 'must provide email Id';
    checkIsEmail(req.body.data);
  } catch (e) {
    return res.status(400).send(String(e));
  }
  req.body.data = req.body.data.toLowerCase().trim();
  try {
    const myOrders = await userData.myOrders(req.body.data);
    res.status(200).json(myOrders);
  } catch (e) {
    return res.status(400).send(String(e));
  }
});

router.post('/signup', async (req, res) => {
  let {
    firstName,
    lastName,
    email,
    phoneNumber,
    username,
    password,
    address,
    city,
    state,
    zip,
    flag,
  } = req.body.data;

  if (flag === 'G') {
    if (!email) {
      return res.status(400).send('You must provide email for google sign in.');
    }
    email = email.toLowerCase().trim();
    try {
      checkIsEmail(email);
    } catch (e) {
      return res.status(400).send(String(e));
    }
  } else {
    if (
      !(
        firstName &&
        lastName &&
        email &&
        phoneNumber &&
        username &&
        password &&
        address &&
        city &&
        state &&
        zip
      )
    ) {
      return res.status(400).send('You must provide all values.');
    }

    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.toLowerCase().trim();
    username = username.toLowerCase().trim();
    password = password.trim();
    phoneNumber = phoneNumber.trim();
    address = address.trim();
    city = city.trim();
    state = state.trim();
    zip = zip.trim();

    try {
      checkIsString(firstName);
      checkIsString(lastName);
      checkIsString(email);
      checkIsString(username);
      checkIsString(password);
      checkIsString(address);
      checkIsString(city);
      checkIsString(state);
      checkIsString(zip);

      checkIsName(firstName);
      checkIsName(lastName);

      checkIsEmail(email);
      checkIsUsername(username);
      checkIsPassword(password);
    } catch (e) {
      return res.status(400).send(String(e));
    }
  }

  try {
    if (flag !== 'G') {
      let initials = firstName[0] + lastName[0];
      console.log(initials);
      let image = imageData.createImage(initials, email);
    } else {
      let initials = email[0] + email[1];
      console.log(initials);
      let image = imageData.createImage(initials, email);
    }
    const newUser = await userData.createUser(
      firstName,
      lastName,
      email,
      phoneNumber,
      username,
      password,
      address,
      city,
      state,
      zip,
      flag,
      '/' + email + '.png'
    );
    res.status(200).json(newUser);
  } catch (e) {
    return res.status(500).send(String(e));
  }
});

router.post('/login', async (req, res) => {
  let { email, password } = req.body.data;

  if (!(email && password))
    return res.status(400).send('You must provide all values.');

  email = email.toLowerCase().trim();

  try {
    checkIsEmail(email);
    checkIsString(password);

    checkIsPassword(password);
  } catch (e) {
    return res.status(400).send(String(e));
  }

  try {
    let auth = await userData.checkUser(email, password);
    if (auth.authenticated) res.status(200).json(auth);
    else res.status(401).send('Invalid username or password');
  } catch (e) {
    console.log(e);
    return res.status(400).json({ error: e });
  }
});

// router.delete("/delete/:id", async (req, res) => {
//   if (!req.params.id) {
//     res.status(400).json({ error: "You must supply a user Id" });
//     return;
//   }

//   try {
//     const deleteData = await userData.deleteUser(req.params.id);
//     res.redirect("/users/logout");
//   } catch (error) {
//     res.status(404).json({ message: "Data not found " });
//     return;
//   }
// });

router.put('/profile', async (req, res) => {
  let {
    firstName,
    lastName,
    email,
    oldEmail,
    phoneNumber,
    username,
    oldUsername,
    password,
    address,
    city,
    state,
    zip,
  } = req.body.data;

  try {
    if (!firstName) throw 'Must provide the first name';
    if (!lastName) throw 'Must provide the last name';
    if (!email) throw 'Must provide the email';

    if (!username) throw 'Must provide the username';
    if (!password) throw 'Must provide the password';
    if (!phoneNumber) throw 'Must provide the phone number';
    if (!address) throw 'Must provide the address';
    if (!city) throw 'Must provide the city';
    if (!state) throw 'Must provide the state';
    if (!zip) throw 'Must provide the zip';

    checkIsString(firstName);
    checkIsString(lastName);
    checkIsString(email);
    checkIsString(username);
    checkIsString(password);

    checkIsString(address);
    checkIsString(city);
    checkIsString(state);
    checkIsString(zip);

    checkIsName(firstName);
    checkIsName(lastName);

    checkIsEmail(email);

    checkIsUsername(username);
    checkIsPassword(password);
  } catch (e) {
    return res.status(400).send(String(e));
  }

  try {
    let initials = firstName[0] + lastName[0];
    console.log(initials);
    let image = imageData.createImage(initials, email);
    updatedUser = await userData.updateUser(
      firstName,
      lastName,
      email,
      oldEmail,
      phoneNumber,
      username,
      oldUsername,
      password,
      address,
      city,
      state,
      zip,
      '/' + email + '.png'
    );
    res.status(200).json(updatedUser);
  } catch (e) {
    console.log(e);
    res.status(500).send(String(e));
  }
});

module.exports = router;
