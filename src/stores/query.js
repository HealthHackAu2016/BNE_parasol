const {state, struct, computed, value, array, varhash} = require('mercury');

module.exports = (app) => {

	let store = state({
		expressions: array([]),
		running: value(false),
		error: value(),
		results: varhash({}),
	});

	let url = '';

	const newExpression = () => {
		store.expressions.push(struct({
			field: value(),
			condition: value(),
			value: value()
		}));
	}

	const removeExpression = (idx) => {
		store.expressions.transaction((raw) => {
			raw.splice(idx, 1);
		});
	}

	const runQuery = () => {
		let query = store.expressions().map((expression) => {
			return {
				[expression.field]: {
					[expression.condition]: expression.value
				}
			};
		});
		store.running.set(true);
		return fetch(`${url}/api/records/query`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ $and: query })
		}).then((response) => {
			store.running.set(false);
			if (response.status !== 200) {
				store.error.set('Could not update')
			} else {
				return response.json();
			}
		}).then((records) => {
			store.results.put('records', records);
		});
	}

	return struct({
		store: store,
		methods: {
			newExpression, removeExpression, runQuery
		}
	});
}