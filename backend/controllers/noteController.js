const mongoose = require('mongoose');
const Note = require('../models/noteModel');

/**
 * @desc    Get all notes
 * @route   GET /api/notes/
 */
const getNotes = async (req, res) => {
	const { user } = req;

	const notes = await Note.find({ user }).sort({ createdAt: -1 });

	res.status(200).json(notes);
};

/**
 * @desc    Get a single note
 * @route   GET /api/notes/:id
 */
const getNote = async (req, res) => {
	const { id } = req.params;

	// check if the id is in correct format
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ error: 'No such note' });
	}

	const note = await Note.findById(id);

	// if there's no note
	if (!note) {
		return res.status(404).json({ error: 'No such note' });
	}

	res.status(200).json(note);
};

/**
 * @desc    Create a new note
 * @route   POST /api/notes/
 */
const createNote = async (req, res) => {
	const { title, description } = req.body;

	// handle empty fields validation
	let emptyFields = [];

	if (!title) {
		emptyFields.push('Title');
	}

	if (!description) {
		emptyFields.push('Description');
	}

	if (emptyFields.length > 0) {
		return res
			.status(400)
			.json({ error: 'Please fill in all the fields', emptyFields });
	}

	// Add doc to db
	try {
		const note = await Note.create({ title, description, user: req.user });
		res.status(200).json(note);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

/**
 * @desc    Delete a note
 * @route   DELETE /api/notes/:id
 */
const deleteNote = async (req, res) => {
	const { id } = req.params;

	// check if the id is in correct format
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ error: 'No such note' });
	}

	const note = await Note.findByIdAndDelete(id);

	// If there's no note
	if (!note) {
		return res.status(404).json({ error: 'No such note' });
	}

	res.status(200).json(note);
};

/**
 * @desc    Update a note
 * @route   PATCH /api/notes/:id
 */
const updateNote = async (req, res) => {
	const { id } = req.params;

	const { title, description } = req.body;

	// handle empty fields validation
	let emptyFields = [];

	if (!title) {
		emptyFields.push('Title');
	}

	if (!description) {
		emptyFields.push('Description');
	}

	if (emptyFields.length > 0) {
		return res
			.status(400)
			.json({ error: 'Please fill in all the fields', emptyFields });
	}

	// check if the id is in correct format
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ error: 'No such note' });
	}

	const note = await Note.findByIdAndUpdate(id, req.body, { new: true });

	// if there's no note
	if (!note) {
		return res.status(404).json({ error: 'No such note' });
	}

	res.status(200).json(note);
};

module.exports = { getNotes, getNote, createNote, deleteNote, updateNote };
