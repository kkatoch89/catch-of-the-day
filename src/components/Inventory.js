import React, { Component } from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase';

import AddFishForm from './AddFishForm';
import EditFishForm from './EditFishForm';
import Login from './Login';
import base, { firebaseApp } from '../base';

class Inventory extends Component {
	static propTypes = {
		fishes: PropTypes.object,
		updateFish: PropTypes.func,
		deleteFish: PropTypes.func,
		loadSampleFishes: PropTypes.func,
	};

	state = {
		uid: null,
		owner: null,
	};

	componentDidMount() {
		// To stay logged-in when refreshing when component mounts,
		// Firebase will see if we are logged-in and authenticated,
		// it will then take that user and run it through the authHandler
		// method to check if the logged-in user is the owner of the store
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				this.authHandler({ user });
			}
		});
	}

	authHandler = async (authData) => {
		// 1. Look up the current store in the firebase database
		// Using await in order to get the name of the store and not the promise
		const store = await base.fetch(this.props.storeId, { context: this });
		console.log(store);
		// 2. Claim it if there is no owner
		if (!store.owner) {
			// Save it as our own by pushing to firebase
			await base.post(`${this.props.storeId}/owner`, {
				data: authData.user.uid,
			});
		}
		// 3. Set the state of the inventory component to reflect the current user
		this.setState({
			uid: authData.user.uid, // Who is the currently logged-id user
			owner: store.owner || authData.user.uid, // Who is the owner of the store
		});

		console.log(authData);
	};

	authenticate = (provider) => {
		const authProvider = new firebase.auth[`${provider}AuthProvider`]();
		// Connecting to auth portion of firebase
		firebaseApp.auth().signInWithPopup(authProvider).then(this.authHandler);
	};

	// Making this an async method because we want to first wait to signout of Firebase
	logout = async () => {
		await firebase.auth().signOut();
		this.setState({ uid: null });
	};

	render() {
		const logout = <button onClick={this.logout}>Log Out!</button>;
		// 1. Check if they are logged-in
		if (!this.state.uid) {
			return <Login authenticate={this.authenticate} />;
		}

		// 2. Check if they are NOT the owner of the store
		if (this.state.uid !== this.state.owner) {
			return (
				<div>
					<p>Sorry you're not the owner</p>
					{logout}
				</div>
			);
		}

		// 3. They must be the owner, just render the inventory
		return (
			<div className="inventory">
				<h2>Inventory</h2>
				{logout}
				{Object.keys(this.props.fishes).map((key) => {
					return (
						<EditFishForm
							key={key}
							index={key}
							fish={this.props.fishes[key]}
							updateFish={this.props.updateFish}
							deleteFish={this.props.deleteFish}
						/>
					);
				})}
				;
				<AddFishForm addFish={this.props.addFish} />
				<button onClick={this.props.loadSampleFishes}>
					Load Sample Fishes
				</button>
			</div>
		);
	}
}

export default Inventory;
