import { Cli }             from 'clipanion';
import { DownloadCommand } from '~commands/download';

async function boot(): Promise<void> {
	const cli = new Cli({
		binaryLabel: 'fourget',
		binaryName: 'fourget',
		binaryVersion: '0.2.0'
	});
	
	cli.register(DownloadCommand);
	
	await cli.runExit(process.argv.slice(2));
};

boot();
