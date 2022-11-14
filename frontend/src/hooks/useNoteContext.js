import { NoteContext } from '../context/NoteContext';
import { useContext } from 'react';

// Custom hook to return the context of NoteContext
export const useNoteContext = () => {
	const context = useContext(NoteContext);

	if (!context) {
		throw Error('useNoteContext must be used inside an NoteContextProvider');
	}

	return context;
};
