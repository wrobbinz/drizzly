import { version } from '../../package.json';
import { Router } from 'express';
import news from './news'

export default ({ config }) => {
	let api = Router();
	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	api.use('/news', news({ config }))
	
	return api
}
