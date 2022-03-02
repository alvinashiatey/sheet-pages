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
	const { id, sheetName, rows, css } = handleArgs(flags, config());
	input.includes(`help`) && cli.showHelp(0);
	!id && cli.showHelp(0);
	!sheetName && id && (await sheet.withID(id, rows, css));
	sheetName && id && (await sheet.withName(id, sheetName, rows, css));
	debug && log(flags);
}

const handleArgs = (flag, conf) => {
	let f = {};
	if (conf !== false) {
		f.id = conf.id;
		f.sheetName = conf.SheetName;
		f.rows = conf.rows;
		f.css = conf.css;
	} else {
		f.id = flag.sheetId;
		f.sheetName = flag.sheetName;
		f.rows = flag.rows;
		f.css = flag.css;
	}
	return f;
};
