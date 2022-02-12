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

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

export async function sheet_cli() {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);
	!flags.sheetId && cli.showHelp(0);
	!flags.sheetName &&
		flags.sheetId &&
		(await sheet.withID(flags.sheetId, flags.rows, flags.css));
	flags.sheetName &&
		flags.sheetId &&
		(await sheet.withName(
			flags.sheetId,
			flags.sheetName,
			flags.rows,
			flags.css
		));
	debug && log(flags);
}
