const {state, struct, computed, value, array, varhash} = require('mercury');

module.exports = (app) => {

	let store = state({
		sources: array([]),
		refreshing: value(),
		uploading: value(),
		upload: varhash({})
	});

	let url = '';

	const refresh = () => {
		store.refreshing.set(true);
		fetch(`${url}/api/sources`).then((response) => {
			store.refreshing.set(false);
			if (response.status !== 200) {
			} else {
				return response.json();
			}
		}).then((data) => {
			console.log(data);
			store.sources.set(data);
		});
	};

	const upload = (file) => {
		let data = new FormData()
		data.append('file', file)

		store.uploading.set(true);
		store.upload.put('filename', file.name);

		fetch(`${url}/api/sources`, {
			method: 'POST',
			body: data
		}).then((response) => {
			store.uploading.set(false);
			if (response.status !== 200) {
				store.upload.put('error', 'Could not upload');
			} else {
				return response.json();
			}
		}).then((upload) => {
			refresh();
		});
	}

	refresh();

	return struct({
		store: store,
		methods: {
			refresh, upload
		}
	});
}