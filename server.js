   // server.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

// Initialize express app
const app = express();

// Middleware to parse the request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Path to the JSON file where user data will be stored
const userDataPath = path.join(__dirname, 'users.json');

// Function to read and parse user data from the JSON file
const getUserData = () => {
    try {
        const fileData = fs.readFileSync(userDataPath, 'utf8');
        return JSON.parse(fileData);
    } catch (err) {
        return [];
    }
};

// Function to save user data to the file
const saveUserData = (data) => {
    const users = getUserData();
    users.push(data);
    fs.writeFileSync(userDataPath, JSON.stringify(users, null, 2));
    console.log('User data saved successfully!');
};

// Function to check if a user already exists by email
const userExists = (email) => {
    const users = getUserData();
    return users.some(user => user.email === email);
};

// Function to find a user by email and password
const findUser = (email, password) => {
    const users = getUserData();
    return users.find(user => user.email === email && user.password === password);
};

// Serve the signup form (your HTML file)
app.get('/sign_up_page.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'sign_up_page.html'));
});

app.get('/images/logo.png', (req, res) => {
    res.sendFile(path.join(__dirname, 'images/logo.png'));
});

// Serve the login page
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});


// Serve the index page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve the home page
app.get('/home.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html')); 
});

//server the Chat file
app.get('/chat.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'chat.html')); 
});

app.use(express.static(__dirname)); // This line serves all static files in the same directory

// Route to serve the specific image
app.get('/back-chat.jpg', (req, res) => {
    res.sendFile(path.join(__dirname, 'back-chat.jpg'));
});



// Handle form submission for signup
app.post('/signup', (req, res) => {
    const newUser = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    };

    // Check if the email already exists
    if (userExists(newUser.email)) {
        // If the email exists, redirect to login page
        res.status(409).send('User already exists. Redirecting to <a href="login.html">Login page</a>.');
    } else {
        // Save user data to file
        saveUserData(newUser);
        res.send('User signed up successfully and data saved to file!');
    }
});

// Handle form submission for login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = findUser(email, password);

    if (user) {
        // If user is found, redirect to main index file
        res.redirect('home.html'); // Replace with your actual index page
    } else {
        // If user not found, redirect to signup page
        res.status(401).send('Invalid credentials.');
        res.redirect('/login.html')
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server started on http://localhost:3000/');
});
