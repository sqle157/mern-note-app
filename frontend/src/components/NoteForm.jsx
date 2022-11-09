import { useState } from 'react';
import { useNoteContext } from '../hooks/useNoteContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { useFetch } from '../hooks/useFetch';
// CSS
import './NoteForm.css';

function NoteForm() {
	const { dispatch } = useNoteContext();
	const { user } = useAuthContext();
	const [noteData, setNoteData] = useState({
		title: '',
		description: '',
	});
	const { error, emptyFields, sendFetchRequest } = useFetch();

	const { title, description } = noteData;

	const handleChange = (e) => {
		const name = e.target.name;

		setNoteData((prevData) => {
			return {
				...prevData,
				[name]: e.target.value,
			};
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!user) {
			return;
		}

		const data = await sendFetchRequest(
			'/api/notes',
			'POST',
			JSON.stringify(noteData),
			{
				'Content-Type': 'application/json',
				Authorization: `Bearer ${user.token}`,
			}
		);

		if (data) {
			setNoteData({
				title: '',
				description: '',
			});
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
				name='title'
				onChange={handleChange}
				value={title}
				className={emptyFields.includes('Title') ? 'error-input' : ''}
			/>

			<label>Description:</label>
			<textarea
				type='text'
				name='description'
				onChange={handleChange}
				value={description}
				className={emptyFields.includes('Description') ? 'error-input' : ''}
			/>

			<button className='btn btn-primary'>Add Note</button>
			{error && <div className='error-message'>{error}</div>}
		</form>
	);
}
export default NoteForm;
