import { createContext, useReducer } from 'react';

export const AuthContext = createContext();

// Authentication Reducer
export const authReducer = (state, action) => {
	switch (action.type) {
		case 'USER_LOGIN':
			return {
				user: action.payload,
			};
		case 'USER_LOGOUT':
			return {
				user: null,
			};
		default:
			return state;
	}
};

const AuthContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(authReducer, {
		user: JSON.parse(localStorage.getItem('user')) || null,
	});

	console.log('AuthContext state: ', state);

	return (
		<AuthContext.Provider value={{ ...state, dispatch }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContextProvider;
