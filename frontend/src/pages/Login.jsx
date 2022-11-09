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
			<h3>Log in</h3>

			<label>Email: </label>
			<input
				type='email'
				onChange={(e) => setEmail(e.target.value)}
				value={email}
			/>

			<label>Password: </label>
			<input
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
