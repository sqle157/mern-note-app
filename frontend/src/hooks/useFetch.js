import { useState, useCallback } from 'react';

// Custom hooks to handle fetch request for notes
export const useFetch = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [emptyFields, setEmptyFields] = useState([]);

	// Handle fetch request
	const sendFetchRequest = useCallback(
		async (url, method = 'GET', body = null, headers = {}) => {
			setIsLoading(true);
			setError(null);
			setEmptyFields([]);

			try {
				const response = await fetch(url, { method, body, headers });
				const data = await response.json();

				if (!response.ok) {
					if (data.emptyFields) {
						// if there's an emptyfields list
						setEmptyFields(data.emptyFields);
					}
					throw new Error(data.error);
				}

				setIsLoading(false);

				return data;
			} catch (error) {
				// set the error
				setError(error.message);
				setIsLoading(false);
			}
		},
		[]
	);

	return { isLoading, error, emptyFields, sendFetchRequest };
};
