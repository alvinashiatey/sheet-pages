import axios from 'axios';
import ora from 'ora';
import chalk from 'chalk';
import HtmlGenerator from './HtmlGenerator.js';
const spinner = ora({ text: '' });
import Cache from './cache.js';

const getCache = (name) => {
	return new Cache(name);
}

export default {
	withID: async function (sheetId, rows = false, css = false, config = {}) {
		try {
			spinner.start(chalk.dim(`Fetching data for SheetId: ${sheetId}\n`));
			const url = `https://sheets.alvinashiatey.com/sheetapi/${sheetId}`;
			const response = await axios.get(url);
			const { data } = response;
			const htmlGenerator = new HtmlGenerator(
				data.data,
				config,
				css,
				rows,
				data.sheetName
			);
			await htmlGenerator.generate().then(() => {
				spinner.succeed(
					chalk.green(`Files Generated from SheetId: ${sheetId}`)
				);
			});
		} catch (error) {
			console.log(error.message);
			process.exit(1);
		}
	},
	withName: async function (
		sheetId,
		sheetName,
		rows = false,
		css = false,
		config = {}
	) {
		const fetchData = async (id, name) => {
			const url = `https://sheets.alvinashiatey.com/sheetapi/${id}/${name}`;
			const response = axios.get(url);
			return response;
		};
		try {
			const nameArray = sheetName.split(',');
			if (nameArray.length === 1) {
				spinner.start(
					chalk.dim(`Fetching data for SheetName: ${nameArray[0]}`)
				);
				const response = await fetchData(sheetId, sheetName);
				const { data } = response;
				const htmlGenerator = new HtmlGenerator(
					data.data,
					config,
					css,
					rows,
					data.sheetName
				);
				await htmlGenerator.generate().then(() => {
					spinner.succeed(
						chalk.green(
							`Files Generated from SheetName: ${sheetName}`
						)
					);
				});
			} else {
				spinner.start(`Fetching data for sheet names`);
				const promises = nameArray.map(name => {
					return fetchData(sheetId, name);
				});
				const responses = await Promise.all(promises);
				const data = responses.map(response => {
					return response.data;
				});
				spinner.succeed(`Fetched data for sheet names`);
				return console.log(data);
			}
		} catch (error) {
			spinner.fail(
				'Failed to fetch data, error: ' + chalk.yellow(error.message)
			);
			process.exit(1);
		}
	}
};
