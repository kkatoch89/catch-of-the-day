import React, { Component } from 'react';

import { getFunName } from '../helpers';

class StorePicker extends Component {
	myInput = React.createRef();

	goToStore = (e) => {
		e.preventDefault();
		// this.props.push('/store/myInput.current.value');
		const storeName = this.myInput.current.value;

		this.props.history.push(`/store/${storeName}`);
	};
	render() {
		return (
			<>
				<form className="store-selector" onSubmit={this.goToStore}>
					<h2>Please Enter A Store</h2>
					<input
						type="text"
						required
						placeholder="Store Name"
						defaultValue={getFunName()}
						ref={this.myInput}
					/>
					<button type="submit">Visit Store →</button>
				</form>
			</>
		);
	}
}

export default StorePicker;
