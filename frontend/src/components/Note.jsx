import { useNoteContext } from '../hooks/useNoteContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { useFetch } from '../hooks/useFetch';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
// Icons
import { IconContext } from 'react-icons';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
// CSS
import './Note.css';

function Note({ note }) {
	const { dispatch } = useNoteContext();
	const { user } = useAuthContext();
	const { sendFetchRequest } = useFetch();

	// Handle delete
	const handleDeleteClick = async () => {
		if (!user) {
			return;
		}

		const data = await sendFetchRequest(
			`/api/notes/${note._id}`,
			'DELETE',
			null,
			{
				Authorization: `Bearer ${user.token}`,
			}
		);

		if (data) {
			dispatch({ type: 'DELETE_NOTE', payload: data });
		}
	};

	// Handle toggle edit state
	const handleEditClick = () => {
		dispatch({ type: 'EDIT_STATE_TOGGLE', payload: note });
	};

	return (
		<div className='note-details'>
			<h4 className={`${note.status === 'DONE' ? 'primary' : 'neutral'}`}>
				{note.title}
			</h4>
			<p>
				<strong>Description: </strong>
				{note.description}
			</p>
			<p>
				<strong>Status: </strong>
				<span
					className={`${
						note.status === 'DONE' ? 'primary' : 'neutral'
					} uppercase fw-600`}>
					{note.status}
				</span>
			</p>
			<p>
				{formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
			</p>
			<span className='delete-icon icon' onClick={handleDeleteClick}>
				<IconContext.Provider value={{ size: 20 }}>
					<FaTrashAlt />
				</IconContext.Provider>
			</span>
			<span className='edit-icon icon ' onClick={handleEditClick}>
				<IconContext.Provider value={{ size: 20 }}>
					<FaEdit />
				</IconContext.Provider>
			</span>
		</div>
	);
}
export default Note;
