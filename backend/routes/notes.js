const express = require('express');
const {
	getNotes,
	getNote,
	createNote,
	deleteNote,
	updateNote,
} = require('../controllers/noteController');

const requireAuth = require('../middleware/authMiddleware');

const router = express.Router();

// require auth for all routes
router.use(requireAuth);

// GET all notes & POST a new note
router.get('/', getNotes).post('/', createNote);

// GET a single note & DELETE a note & UPDATE a note
router
	.get('/:id', getNote)
	.delete('/:id', deleteNote)
	.patch('/:id', updateNote);

module.exports = router;
