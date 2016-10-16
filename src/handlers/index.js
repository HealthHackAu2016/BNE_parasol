let handlers = [
	require('./numeric'),
	require('./boolean'),
	require('./string')
];

module.exports = handlers.reduce((r, handler) => {
	r[handler.id] = handler;
	return r;
}, {});