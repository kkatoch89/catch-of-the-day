import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import sampleFishes from '../sample-fishes';
import Fish from './Fish';
import base from '../base';

class App extends Component {
	state = {
		fishes: {},
		order: {},
	};

	static propTypes = {
		match: PropTypes.object,
	};

	componentDidMount() {
		const { params } = this.props.match;
		// First reinstate our local storage
		const localStorageRef = localStorage.getItem(params.storeId);
		// console.log(localStorageRef);
		if (localStorageRef) {
			this.setState({ order: JSON.parse(localStorageRef) });
		}
		// This ref is from Firebase, different to React ref
		this.ref = base.syncState(`${params.storeId}/fishes`, {
			context: this,
			state: 'fishes',
		});
	}

	componentDidUpdate() {
		// console.log(this.state.order);
		localStorage.setItem(
			this.props.match.params.storeId,
			JSON.stringify(this.state.order)
		);
	}

	componentWillUnmount() {
		base.removeBinding(this.ref);
	}

	addFish = (fish) => {
		const fishes = { ...this.state.fishes };
		fishes[`fish${Date.now()}`] = fish;
		this.setState({ fishes });
	};

	updateFish = (key, updatedFish) => {
		const fishes = { ...this.state.fishes };
		fishes[key] = updatedFish;
		this.setState({ fishes });
	};

	deleteFish = (key) => {
		const fishes = { ...this.state.fishes };
		// Firebase has a weird thing where if you want to delete a property,
		// you just set its value to null
		fishes[key] = null;
		this.setState({ fishes });
	};

	loadSampleFishes = () => {
		this.setState({ fishes: sampleFishes });
	};

	addToOrder = (key) => {
		const order = { ...this.state.order };
		order[key] = order[key] + 1 || 1;
		this.setState({ order });
	};

	removeFromOrder = (key) => {
		const order = { ...this.state.order };
		console.log(order);
		delete order[key];
		this.setState({ order });
	};

	render() {
		return (
			<div className="catch-of-the-day">
				<div className="menu">
					<Header tagline="Fresh Seafood Market" />
					<ul className="fishes">
						{Object.keys(this.state.fishes).map((key) => (
							<Fish
								key={key}
								details={this.state.fishes[key]}
								addToOrder={() => this.addToOrder(key)}
							/>
						))}
					</ul>
				</div>
				<Order
					fishes={this.state.fishes}
					order={this.state.order}
					removeFromOrder={this.removeFromOrder}
				/>
				<Inventory
					addFish={this.addFish}
					loadSampleFishes={this.loadSampleFishes}
					fishes={this.state.fishes}
					updateFish={this.updateFish}
					deleteFish={this.deleteFish}
					storeId={this.props.match.params.storeId}
				/>
			</div>
		);
	}
}

export default App;
