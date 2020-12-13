import React, { Component } from 'react';

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
	componentDidMount() {
		const { params } = this.props.match;
		// Firest reinstate our local storage
		const localStorageRef = localStorage.getItem(params.storeId);
		console.log(localStorageRef);
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
		console.log(this.state.order);
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
	loadSampleFishes = () => {
		this.setState({ fishes: sampleFishes });
	};
	addToOrder = (key) => {
		const order = this.state.order;
		order[key] = order[key] + 1 || 1;
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
				<Order {...this.state} />
				<Inventory
					addFish={this.addFish}
					loadSampleFishes={this.loadSampleFishes}
				/>
			</div>
		);
	}
}

export default App;
