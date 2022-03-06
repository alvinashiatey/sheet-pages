/**
 * sheet-pages
 * A simple cli to generate html pages from a shared google spreadsheet
 *
 * @author Alvin Ashiatey <https://www.alvinashiatey.com>
 */

import init from '../utils/init.js';
import cli from '../utils/cli.js';
import log from '../utils/log.js';
import sheet from '../utils/sheet.js';
import config from '../utils/getConfig.js';

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

export async function sheet_cli() {
	init({ clear });
	const { sheetId, sheetName, rows, columns, css } = handleArgs(
		flags,
		config
	);
	input.includes(`help`) && cli.showHelp(0);
	!sheetId && cli.showHelp(0);
	!sheetName &&
		sheetId &&
		(await sheet.withID({ sheetId, rows, columns, css, config }));
	sheetName &&
		sheetId &&
		(await sheet.withName({
			sheetId,
			sheetName,
			columns,
			rows,
			css,
			config
		}));
	debug && log(flags);
}

const handleArgs = (flag, conf) => {
	let f = {};
	if (conf !== false) {
		f.sheetId = conf.id;
		f.sheetName = conf.SheetName;
		f.rows = conf.rows;
		f.css = conf.css;
		f.columns = conf.columns;
	} else {
		f.sheetId = flag.sheetId;
		f.sheetName = flag.sheetName;
		f.rows = flag.rows;
		f.css = flag.css;
		f.columns = flag.columns;
	}
	return f;
};
