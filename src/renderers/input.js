const { h } = require('mercury');

exports.row = (label, elements) => {
	return h('div.form-group', [
		h('label', label)
	].concat(elements || []));
};

exports.checkbox = (label, name) => {
	return h('div.checkbox', h('label', [
		h('input', { type: 'checkbox', name: name }),
		label
	]));
}