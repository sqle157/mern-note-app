import { createContext, useReducer } from 'react';

export const NoteContext = createContext();

export const notesReducer = (state, action) => {
	switch (action.type) {
		case 'SET_NOTES':
			return {
				// Set the notes
				notes: action.payload,
			};
		case 'CREATE_NOTE':
			return {
				// Create new note
				notes: [action.payload, ...state.notes],
			};
		case 'DELETE_NOTE':
			return {
				// Delete the note
				notes: state.notes.filter((note) => note._id !== action.payload._id),
			};
		case 'EDIT_STATE_TOGGLE':
			return {
				...state,
				note: action.payload || null,
				edit_state: !state.edit_state,
			};
		case 'EDIT_NOTE':
			// update the note
			const newNotes = state.notes.map((note) => {
				// if note.id === payload.id
				if (note._id === action.payload._id) {
					note = { ...action.payload };

					return note;
				}

				return note;
			});

			return {
				notes: [...newNotes],
				note: null,
				edit_state: false,
			};

		default:
			return state;
	}
};

const NoteContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(notesReducer, {
		notes: null,
		note: null,
		edit_state: false,
	});

	return (
		<NoteContext.Provider value={{ ...state, dispatch }}>
			{children}
		</NoteContext.Provider>
	);
};

export default NoteContextProvider;
