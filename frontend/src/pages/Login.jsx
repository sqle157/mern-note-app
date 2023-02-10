import { useState } from 'react';
import { useAuthRequest } from '../hooks/useAuthRequest';
// CSS
import './AuthForm.css';

function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { sendAuthRequest, error, isLoading } = useAuthRequest();

	const handleLogin = async (e) => {
		e.preventDefault();

		await sendAuthRequest(email, password, 'login');
	};

	return (
		<form className='auth-form' onSubmit={handleLogin}>
			<h2>Log in</h2>

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
				Log in
			</button>
			{error && <div className='error-message'>{error}</div>}
		</form>
	);
}
export default Login;
