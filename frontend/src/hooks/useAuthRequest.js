import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { useNoteContext } from './useNoteContext';

// Custom hook to handle the request of login/logout/signup
export const useAuthRequest = () => {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(null);
	const { dispatch } = useAuthContext();
	const { dispatch: noteDispatch } = useNoteContext();

	// handle login request
	const sendAuthRequest = async (email, password, auth) => {
		setIsLoading(true);
		setError(null);

		// fetch the response
		const response = await fetch(`/api/users/${auth}`, {
			method: 'POST',
			body: JSON.stringify({ email, password }),
			headers: {
				'Content-Type': 'application/json',
			},
		});

		// take the data
		const data = await response.json();

		if (!response.ok) {
			setIsLoading(false);
			setError(data.error);
		}

		if (response.ok) {
			// save the user to localStorage
			localStorage.setItem('user', JSON.stringify(data));

			// update auth context
			dispatch({ type: 'USER_LOGIN', payload: data });

			setIsLoading(false);
		}
	};

	const logout = () => {
		// remove user from localStorage
		localStorage.removeItem('user');

		// remove user from context
		dispatch({ type: 'USER_LOGOUT' });

		// clear previous user's notes
		noteDispatch({ type: 'SET_NOTES', payload: null });
	};

	return { sendAuthRequest, logout, error, isLoading };
};
