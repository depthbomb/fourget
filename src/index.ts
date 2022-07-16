import { Cli, Builtins }                             from 'clipanion';
import { BINARY_NAME, BINARY_LABEL, BINARY_VERSION } from '~constants';
import { DownloadCommand }                           from '~commands/download';

async function boot(): Promise<void> {

	const cli = new Cli({
		binaryLabel: BINARY_LABEL,
		binaryName: BINARY_NAME,
		binaryVersion: BINARY_VERSION
	});
	
	cli.register(DownloadCommand);
	cli.register(Builtins.HelpCommand);
	cli.register(Builtins.VersionCommand);
	
	await cli.runExit(process.argv.slice(2));
};

boot();
