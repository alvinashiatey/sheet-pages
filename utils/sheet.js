import axios from 'axios';
import ora from 'ora';
import chalk from 'chalk';
import HtmlGenerator from './HtmlGenerator.js';
const spinner = ora({ text: '' });
import Cache from './cache.js';

const getCache = name => {
	return new Cache(name);
};

export default {
	withID: async function (opt) {
		try {
			let data = {};
			if (!getCache(opt.sheetId).isEmpty) {
				console.log(chalk.yellow('Using cached data'));
				data = getCache(opt.sheetId).get('data');
			} else {
				console.log(chalk.yellow('Fetching data from Google Sheets'));
				spinner.start(
					chalk.dim(`Fetching data for SheetId: ${opt.sheetId}\n`)
				);
				const url = `https://sheets.alvinashiatey.com/sheetapi/${opt.sheetId}`;
				const response = await axios.get(url);
				({ data } = response);
				getCache(opt.sheetId).set('data', data);
			}
			const htmlGenerator = new HtmlGenerator({
				data: data.data,
				config: opt.config,
				css: opt.css || false,
				rows: opt.rows || false,
				columns: opt.columns || false,
				sheetName: data.sheetName
			});
			await htmlGenerator.generate().then(() => {
				spinner.succeed(
					chalk.green(`Files Generated from SheetId: ${opt.sheetId}`)
				);
			});
		} catch (error) {
			console.log(error.message);
			process.exit(1);
		}
	},
	withName: async function (opt) {
		const fetchData = async (id, name) => {
			const url = `https://sheets.alvinashiatey.com/sheetapi/${id}/${name}`;
			return axios.get(url);
		};
		try {
			let data = {};
			if (!getCache(opt.sheetId).isEmpty) {
				data = getCache(opt.sheetId).get('data');
			} else {
				spinner.start(
					chalk.dim(`Fetching data for SheetId: ${opt.sheetId}\n`)
				);
				const response = await fetchData(opt.sheetId, opt.sheetName);
				({ data } = response);
				getCache(opt.sheetId).set('data', data);
			}
			const htmlGenerator = new HtmlGenerator({
				data: data.data,
				config: opt.config,
				css: opt.css || false,
				rows: opt.rows || false,
				columns: opt.columns || false,
				sheetName: data.sheetName
			});
			await htmlGenerator.generate().then(() => {
				spinner.succeed(
					chalk.green(`Files Generated from SheetName: ${opt.sheetName}`)
				);
			});
		} catch (error) {
			spinner.fail(
				'Failed to fetch data, error: ' + chalk.yellow(error.message)
			);
			process.exit(1);
		}
	}
};
