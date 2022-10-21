import { useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useNoteContext } from '../hooks/useNoteContext';
import { useAuthContext } from '../hooks/useAuthContext';

import './Modal.css';

function Modal() {
	const { note, dispatch } = useNoteContext();
	const { user } = useAuthContext();
	const ref = useRef(null);
	const [newTitle, setNewTitle] = useState(note.title);
	const [newDescription, setNewDescription] = useState(note.description);
	const [newStatus, setNewStatus] = useState(note.status);
	const [error, setError] = useState(null);
	const [emptyFields, setEmptyFields] = useState([]);

	const handleClickOverlay = (e) => {
		if (e.target === ref.current) {
			dispatch({ type: 'EDIT_STATE_TOGGLE' });
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!user) {
			return;
		}

		const newNote = {
			title: newTitle,
			description: newDescription,
			status: newStatus,
		};

		const response = await fetch(
			`${process.env.REACT_APP_BACKEND_URI}/api/notes/${note._id}`,
			{
				method: 'PATCH',
				body: JSON.stringify(newNote),
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.token}`,
				},
			}
		);

		const data = await response.json();

		if (!response.ok) {
			setError(data.error);
			setEmptyFields(data.emptyFields);
		}

		if (response.ok) {
			setError(null);
			setEmptyFields([]);
			console.log('New note updated', data);
			dispatch({ type: 'EDIT_NOTE', payload: data });
		}
	};

	const handleCancel = () => {
		dispatch({ type: 'EDIT_STATE_TOGGLE' });
	};

	return ReactDOM.createPortal(
		<div className='overlay' onClick={handleClickOverlay} ref={ref}>
			<div className='modal'>
				<h2>Edit Note</h2>
				<form className='create' onSubmit={handleSubmit}>
					<label>Note Title:</label>
					<input
						type='text'
						onChange={(e) => setNewTitle(e.target.value)}
						value={newTitle}
						className={emptyFields.includes('Title') ? 'error-input' : ''}
					/>

					<label>Description:</label>
					<textarea
						type='text'
						onChange={(e) => setNewDescription(e.target.value)}
						value={newDescription}
						className={emptyFields.includes('Description') ? 'error-input' : ''}
					/>

					<select
						value={newStatus}
						onChange={(e) => setNewStatus(e.target.value)}>
						<option value='ACTION REQUIRED'>ACTION REQUIRED</option>
						<option value='DONE'>DONE</option>
					</select>

					<button className='btn btn-primary'>Save</button>
					<button className='btn btn-neutral' onClick={handleCancel}>
						Cancel
					</button>
					{error && <div className='error-message'>{error}</div>}
				</form>
			</div>
		</div>,
		document.getElementById('modal')
	);
}
export default Modal;
