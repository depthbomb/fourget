import { Cli }             from 'clipanion';
import { DownloadCommand } from '~commands/download';

const cli = new Cli({
	binaryLabel: 'fourget',
	binaryName: 'fourget',
	binaryVersion: '0.2.0'
});

cli.register(DownloadCommand);
cli.runExit(process.argv.slice(2));
