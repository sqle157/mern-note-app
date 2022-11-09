const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const requireAuth = async (req, res, next) => {
	// verify user is authenticated
	const { authorization } = req.headers;

	if (!authorization) {
		return res.status(401).json({ error: 'Authorization token required' });
	}

	// get the token == 'Bearer TOKEN'
	const token = authorization.split(' ')[1];

	try {
		// verify token
		const { id } = jwt.verify(token, process.env.JWT_SECRET);

		// Get the user
		req.user = await User.findById(id).select('_id');

		next();
	} catch (error) {
		console.log(error);
		res.status(401).json({ error: 'Not Authorized' });
	}
};

module.exports = requireAuth;
