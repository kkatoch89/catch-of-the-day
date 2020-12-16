import React from 'react';
import PropTypes from 'prop-types';

const login = (props) => (
	<nav className="login">
		<h2>Inventory Login</h2>
		<p>Sign in to manage your store's inventory</p>
		<button className="github" onClick={() => props.authenticate('Github')}>
			Log-in with Github
		</button>
		{/* <button className="facebook" onClick={() => props.authenticate('Facebook')}>
			Log-in with Facebook
		</button> */}
		<button className="twitter" onClick={() => props.authenticate('Twitter')}>
			Log-in with Twitter
		</button>
	</nav>
);

login.propTypes = {
	authenticate: PropTypes.func.isRequired,
};

export default login;