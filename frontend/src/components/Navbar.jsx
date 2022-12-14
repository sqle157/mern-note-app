import { Link } from 'react-router-dom';
import { useAuthRequest } from '../hooks/useAuthRequest';
import { useAuthContext } from '../hooks/useAuthContext';
// CSS
import './Navbar.css';

function Navbar() {
	const { logout } = useAuthRequest();
	const { user } = useAuthContext();

	// Handle logout event
	const handleLogout = () => {
		logout();
	};

	return (
		<header>
			<div className='container navbar'>
				<Link to='/'>
					<h1 className='app-title'>SimpleNote</h1>
				</Link>

				<nav className='nav'>
					{user && (
						<div>
							<span>{user.email}</span>
							<button className='btn-logout' onClick={handleLogout}>
								Log out
							</button>
						</div>
					)}
					{!user && (
						<div>
							<Link to='/login'>Login</Link>
							<Link to='/signup'>Signup</Link>
						</div>
					)}
				</nav>
			</div>
		</header>
	);
}
export default Navbar;
