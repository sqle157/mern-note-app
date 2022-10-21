import { useState } from 'react';
import { useNoteContext } from '../hooks/useNoteContext';
import { useAuthContext } from '../hooks/useAuthContext';

// css
import './NoteForm.css';

function NoteForm() {
	const { dispatch } = useNoteContext();
	const { user } = useAuthContext();
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [status, setStatus] = useState('');
	const [error, setError] = useState(null);
	const [emptyFields, setEmptyFields] = useState([]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!user) {
			setError('You must be logged in!');
			return;
		}

		const note = { title, description, status };

		const response = await fetch(`/api/notes`, {
			method: 'POST',
			body: JSON.stringify(note),
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${user.token}`,
			},
		});

		const data = await response.json();

		console.log(data);

		if (!response.ok) {
			setError(data.error);
			setEmptyFields(data.emptyFields);
		}

		if (response.ok) {
			setTitle('');
			setDescription('');
			setStatus('');
			setError(null);
			setEmptyFields([]);
			console.log('New note added', data);
			dispatch({ type: 'CREATE_NOTE', payload: data });
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<h3>Add a New Note</h3>
			<label>Note Title:</label>
			<input
				type='text'
				onChange={(e) => setTitle(e.target.value)}
				value={title}
				className={emptyFields.includes('Title') ? 'error-input' : ''}
			/>

			<label>Description:</label>
			<textarea
				type='text'
				onChange={(e) => setDescription(e.target.value)}
				value={description}
				className={emptyFields.includes('Description') ? 'error-input' : ''}
			/>

			<button className='btn btn-primary'>Add Note</button>
			{error && <div className='error-message'>{error}</div>}
		</form>
	);
}
export default NoteForm;
