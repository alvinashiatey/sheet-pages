import meow from 'meow';
import meowHelp from 'cli-meow-help';

const flags = {
	clear: {
		type: `boolean`,
		default: false,
		alias: `c`,
		desc: `Clear the console`
	},
	noClear: {
		type: `boolean`,
		default: false,
		desc: `Don't clear the console`
	},
	debug: {
		type: `boolean`,
		default: false,
		alias: `d`,
		desc: `Print debug info`
	},
	version: {
		type: `boolean`,
		alias: `v`,
		desc: `Print CLI version`
	},
	sheetId: {
		type: `string`,
		alias: `i`,
		desc: `The ID for the google sheet, this is required for the CLI to work`
	},
	sheetName: {
		type: `string`,
		alias: `n`,
		desc: `The ID for the google sheet`
	},
	rows: {
		type: `boolean`,
		default: false,
		alias: `r`,
		desc: `The ID for the google sheet`
	}
};

const commands = {
	help: { desc: `Print help info` }
};

const helpText = meowHelp({
	name: `sheetpages`,
	flags,
	commands
});

const options = {
	inferType: true,
	description: false,
	hardRejection: false,
	flags
};

export default meow(helpText, options);
