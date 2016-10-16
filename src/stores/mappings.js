const {state, struct, computed, value, array, varhash} = require('mercury');
const handlers = require('../handlers');

module.exports = (app) => {

	let store = state({
		updating: value(false),
		error: value(null),
		data: array([]),
		//
		validating: value(false),
		validation: varhash({}),

		// updates
		selectedType: value(),
		updating: value(false),
		updateError: value()

	});

	let url = '';

	const refresh = () => {
		store.updating.set(true);
		fetch(`${url}/api/mappings`).then((response) => {
			store.updating.set(false);
			if (response.status !== 200) {
				error.set('Error');
			} else {
				return response.json();
			}
		}).then((data) => {
			store.data.set(data);
		});
	};

	const validate = () => {
		store.validating.set(true);
		fetch(`${url}/api/validate`).then((response) => {
			store.validating.set(false);
			if (response.status !== 200) {
				error.set('Error');
			} else {
				return response.json();
			}
		}).then((data) => {
			store.validation.set(data);
		});
	};

	const applyRules = () => {
		store.validating.set(true);
		fetch(`${url}/api/import`).then((response) => {
			store.validating.set(false);
			if (response.status !== 200) {
				error.set('Error');
			} else {
				return response.json();
			}
		}).then((data) => {
			store.validation.set(data);
		});
	};

	const update = (mapping) => {
		let handler = handlers[mapping.type];
		let data = handler.validate(mapping);
		store.updating.set(true);
		return fetch(`${url}/api/mappings/${mapping.name}`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(mapping)
		}).then((response) => {
			store.updating.set(false);
			if (response.status !== 200) {
				updateError.set('Could not update')
			} else {
				refresh();
				return response.json();
			}
		})
	}

	const remove = (mappingId) => {
		return fetch(`${url}/api/mappings/${mappingId}`, {
			method: 'DELETE',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		}).then((response) => {
			store.updating.set(false);
			if (response.status !== 200) {
				updateError.set('Could not remove')
			} else {
				refresh();
				return response.json();
			}
		})
	}

	const get = (mappingId) => {
		let result = store.data().filter((mapping) => {
			return mapping.name === mappingId;
		})[0];
		return result;
	}

	refresh();

	return struct({
		store: store,
		methods: {
			refresh,
			validate,
			applyRules,
			update,
			remove,
			get
		}
	});
}