import { useState } from 'react';
import { useAuthRequest } from '../hooks/useAuthRequest';
// CSS
import './AuthForm.css';

function Signup() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { sendAuthRequest, isLoading, error } = useAuthRequest();

	const handleSignup = async (e) => {
		e.preventDefault();

		await sendAuthRequest(email, password, 'signup');
	};

	return (
		<form className='auth-form' onSubmit={handleSignup}>
			<h2>Sign up</h2>

			<label htmlFor='email'>Email: </label>
			<input
				id='email'
				type='email'
				onChange={(e) => setEmail(e.target.value)}
				value={email}
			/>

			<label htmlFor='password'>Password: </label>
			<input
				id='password'
				type='password'
				onChange={(e) => setPassword(e.target.value)}
				value={password}
			/>

			<button disabled={isLoading} className='btn btn-primary'>
				Sign up
			</button>
			{error && <div className='error-message'>{error}</div>}
		</form>
	);
}
export default Signup;
