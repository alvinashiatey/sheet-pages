import fs from 'fs';
import YAML from 'yaml';

function getConfig() {
	try {
		const configPath = `${process.cwd()}/config.yml`;
		const configExists = fs.existsSync(configPath);
		if (!configExists) {
			return false;
		}
		const configFile = fs.readFileSync(configPath, 'utf8');
		return YAML.parse(configFile);
	} catch (e) {
		console.error(e);
		return false;
	}
}

export default getConfig();
