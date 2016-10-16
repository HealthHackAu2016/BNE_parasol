const multiparty = require('multiparty');
const concat = require('concat-stream');

module.exports = (app, config) => {

	let sources = app.core.services.sources;

	app.get('/api/sources', (req, res, next) => {
		sources.find({}, { _id: 1, fileName: 1 }).then((results) => {
			return res.json(results);
		}).catch(next);
	});

	app.post('/api/sources', (req, res, next) => {
		let form = new multiparty.Form();

		let uploads = {};
		form.on('part', (part) => {
			if (!part.filename) return part.resume();

			let concatStream = concat((data) => {
				uploads[part.filename] = data;
			});

			part.pipe(concatStream);
			part.resume();
		})

		form.on('error', (err) => {
			return next(err);
		});

		form.on('close', () => {
			req.files = uploads;
			return next();
		});

		form.parse(req);
	}, (req, res, next) => {

		Promise.all(Object.keys(req.files).map((filename) => {
			return sources.insert({
				fileName: filename,
				content: req.files[filename]
			});
		})).then(() => {
			return res.json({ status: 'OK' });
		}).catch(next);
	});

}