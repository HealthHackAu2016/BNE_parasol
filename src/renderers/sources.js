const { h } = require('mercury');

module.exports = (state, app) => {

	let { sources } = state;

	const uploader = () => {
		let content = [
			h('h3', 'Add new data source')
		];

		if (sources.store.uploading) {
			content.push(h('p', `Uploading ${sources.store.upload.filename}...`));
		} else {
			content.push(h('input.btn.btn-default', {
				accept: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				type: 'file',
				'ev-change': (e) => {
					sources.methods.upload(e.currentTarget.files[0]);
				}
			}, 'Upload'));
		}
		return h('div.Uploader', content);
	}

	return h('section.Content', [
		h('div.Content_Header', [
			h('div.Content_Title', 'Data Sources'),
			h('div.Content_Options.btn-group', [
			])
		]),
		h('div.Content_Main', [
			h('h3', 'Available data sources'),
			h('div.Sources', sources.store.sources.map((source) => {
				return h('div.Source', source.fileName);
			})),
			uploader()
		])
	]);
}