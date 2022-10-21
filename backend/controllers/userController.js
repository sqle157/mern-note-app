const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

/**
 * @desc     Signup a new user
 * @route    POST /api/users/signup
 * @access   PUBLIC
 */
const signupUser = async (req, res) => {
	const { email, password } = req.body;

	// Validation
	if (!email || !password) {
		return res.status(400).json({ error: 'Please include all fields' });
	}

	if (!validator.isEmail(email)) {
		return res.status(400).json({ error: 'Email not valid' });
	}

	if (!validator.isStrongPassword(password)) {
		return res.status(400).json({
			error:
				'Password not strong enough (need combination of uppercase, symbol, number and string)',
		});
	}

	// Find if user already exists
	const existingUser = await User.findOne({ email });

	if (existingUser) {
		return res.status(400).json({ error: 'User already exists' });
	}

	// Hash password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	// Create user
	try {
		const user = await User.create({
			email,
			password: hashedPassword,
		});
		res.status(200).json({ email, token: generateToken(user._id) });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

/**
 * @desc     Login user
 * @route    POST /api/users/login
 * @access   PUBLIC
 */
const loginUser = async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({ error: 'Please include all fields' });
	}

	// Find user to login
	const user = await User.findOne({ email });

	if (!user) {
		return res.status(400).json({ error: 'Incorrect email' });
	}

	if (!(await bcrypt.compare(password, user.password))) {
		return res.status(400).json({ error: 'Incorrect password' });
	}

	res.status(200).json({ email, token: generateToken(user._id) });
};

// Generate token
const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: '3d',
	});
};

module.exports = { signupUser, loginUser };
