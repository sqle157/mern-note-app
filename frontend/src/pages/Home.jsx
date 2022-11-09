import { useEffect } from 'react';
import { useNoteContext } from '../hooks/useNoteContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { useFetch } from '../hooks/useFetch';
// components
import Note from '../components/Note';
import NoteForm from '../components/NoteForm';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

// css
import './Home.css';

function Home() {
	const { notes, edit_state, dispatch } = useNoteContext();
	const { isLoading, sendFetchRequest } = useFetch();
	const { user } = useAuthContext();

	useEffect(() => {
		const fetchNotes = async () => {
			const data = await sendFetchRequest('/api/notes', 'GET', null, {
				Authorization: `Bearer ${user.token}`,
			});

			if (data) {
				dispatch({ type: 'SET_NOTES', payload: data });
			}
		};

		if (user) {
			fetchNotes();
		}
	}, [dispatch, sendFetchRequest, user]);

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
