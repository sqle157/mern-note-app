import { useEffect, useState } from 'react';
import { useNoteContext } from '../hooks/useNoteContext';
import { useAuthContext } from '../hooks/useAuthContext';
// components
import Note from '../components/Note';
import NoteForm from '../components/NoteForm';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

// css
import './Home.css';

function Home() {
	const { notes, edit_state, dispatch } = useNoteContext();
	const [isLoading, setIsLoading] = useState(false);
	const { user } = useAuthContext();

	useEffect(() => {
		setIsLoading(true);
		const fetchNotes = async () => {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URI}/api/notes`,
				{
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				}
			);
			const data = await response.json(); // parse json, return array of notes

			if (response.ok) {
				dispatch({ type: 'SET_NOTES', payload: data });
			}

			setIsLoading(false);
		};

		if (user) {
			fetchNotes();
		}
	}, [dispatch, user]);

	if (isLoading) {
		return <LoadingSpinner asOverlay />;
	}

	return (
		<>
			<div className='home'>
				<div className='notes'>
					{notes && notes.map((note) => <Note key={note._id} note={note} />)}
				</div>
				<NoteForm />
			</div>
			{edit_state && <Modal />}
		</>
	);
}
export default Home;
