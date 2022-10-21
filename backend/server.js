const path = require('path');
const dotenv = require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

// express app
const app = express();

// middleware
app.use(express.json()); // parse json data

// handle CORS issue (not needed if deploy both ends on the same server)
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-Width, Content-Type, Accept, Authorization'
	);
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

	if (req.method === 'OPTIONS') {
		return res.status(200).end();
	}

	next();
});

app.use((req, res, next) => {
	console.log(req.path, req.method);
	next();
});

// routes
app.use('/api/users', require('./routes/users'));
app.use('/api/notes', require('./routes/notes'));

// Serve frontend
if (process.env.NODE_ENV === 'production') {
	// Set build folder as static
	app.use(express.static(path.join(__dirname, '../frontend/build')));

	app.get('*', (req, res) =>
		res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
	);
} else {
	app.get('/', (req, res) => {
		res.status(200).json({ message: 'Welcome to the Note App API' });
	});
}

// connect to db
mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		// listen for requests
		app.listen(process.env.PORT, () =>
			console.log(`Connected to db & Listening on port ${process.env.PORT}`)
		);
	})
	.catch((error) => {
		console.log(error);
	});
