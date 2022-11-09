import { useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useNoteContext } from '../hooks/useNoteContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { useFetch } from '../hooks/useFetch';
// CSS
import './Modal.css';

function Modal() {
	const { note, dispatch } = useNoteContext();
	const { user } = useAuthContext();
	const ref = useRef(null);
	const [newNoteData, setNewNoteData] = useState({
		title: note.title,
		description: note.description,
		status: note.status,
	});
	const { error, emptyFields, sendFetchRequest } = useFetch();

	const { title, description, status } = newNoteData;

	const handleClickOverlay = (e) => {
		if (e.target === ref.current) {
			dispatch({ type: 'EDIT_STATE_TOGGLE' });
		}
	};

	const handleChange = (e) => {
		const name = e.target.name;

		setNewNoteData((prevData) => {
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
			`/api/notes/${note._id}`,
			'PATCH',
			JSON.stringify(newNoteData),
			{
				'Content-Type': 'application/json',
				Authorization: `Bearer ${user.token}`,
			}
		);

		if (data) {
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
						className={
							emptyFields.includes('Description') ? 'error-input' : ''
						}></textarea>

					<select value={status} name='status' onChange={handleChange}>
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
