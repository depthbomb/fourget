import { joinURL }           from 'ufo';
import { join, resolve }     from 'pathe';
import consola               from 'consola';
import { existsSync }        from 'node:fs';
import convert, { ms }       from 'convert';
import { $fetch }            from 'ohmyfetch';
import { Option, Command }   from 'clipanion';
import { Stopwatch }         from 'ts-stopwatch';
import { mkdir, appendFile } from 'node:fs/promises';
import type { BaseContext }  from 'clipanion';
import type { Post, Thread } from '~@types/Thread';

export class DownloadCommand extends Command<BaseContext> {
	public static override paths = [Command.Default];

	public threadUrl = Option.String({
		required: true
	});
	public outputPath = Option.String({
		required: true
	});
	public organizeOutput = Option.Boolean('-o,--organize', false, {
		description: 'Whether to put files into organized directories by board and thread'
	});
	public filterFiles = Option.String('-f,--filter', {
		description: 'List of period-prefixed file extensions to download, delimited by a comma'
	});
	public redownload = Option.Boolean('-r,--redownload', false, {
		description: 'Whether to redownload a file if it already exists'
	});
	public throttle = Option.String('-t,throttle', {
		required: false,
		description: 'The duration to wait between downloads in milliseconds, omit to use no delay'
	})

	private downloadedFiles = 0;
	private downloadSize    = 0;

	private readonly urlPattern: RegExp = /https?:\/\/(?:www\.)?boards\.4chan(?:nel)?\.org\/(?<board>\w{1,4})\/thread\/(?<thread>\d+)/i;

	public async execute(): Promise<number | void> {
		const sw = new Stopwatch();

		sw.start();

		const match = this.urlPattern.exec(this.threadUrl);

		if (!match) {
			consola.error('Invalid thread URL');
			return 1;
		}

		this.outputPath = resolve(this.outputPath);

		if (!existsSync(this.outputPath)) {
			consola.error('Path', this.outputPath, 'does not exist');
			return 1;
		}

		const { board, thread } = match.groups;
		const endpoint          = await this.buildThreadEndpoint(board, thread);
		const { posts }         = await $fetch<Thread>(endpoint);
		const { sub }           = posts[0];

		consola.info('Retrieved thread info');

		if (this.organizeOutput) {
			this.outputPath = await this.buildOutputDirectory(board, thread, sub);
			if (!existsSync(this.outputPath)) {
				await mkdir(this.outputPath, { recursive: true });

				consola.info('Created output directory', this.outputPath);
			}
		}

		const filesToDownload = await this.getFilesToDownload(board, posts);
		for (const [fileUrl, outputFile] of filesToDownload) {
			if (existsSync(outputFile)) {
				if (this.redownload) {
					await this.downloadFile(fileUrl, outputFile);
				} else {
					consola.info(outputFile, 'already exists, skipping');
				}
				continue;
			}

			await this.downloadFile(fileUrl, outputFile);
			await this.wait();
		}

		sw.stop();

		consola.info(
			'Downloaded',
			this.downloadedFiles,
			'file(s)',
			`(${convert(this.downloadSize, 'bytes').to('MB')}MB)`,
			'in', `${ms(sw.getTime())}`
		);

		return 0;
	};

	private async getFilesToDownload(board: string, posts: Post[]): Promise<Map<string, string>> {
		const postsToDownload = new Map<string, string>();
		const postsWithFiles = posts.filter(post => {
			const { filename } = post;
			if (this.filterFiles) {
				const filter = this.filterFiles.split(',');
				return !!filename && filter.includes(post.ext);
			}

			return !!filename;
		});
		for (const post of postsWithFiles) {
			const { ext, tim, filename } = post;
			const outputFilename = join(this.outputPath, `${tim}-${filename}${ext}`);
			const fileUrl        = joinURL('https://i.4cdn.org', board, `${tim}${ext}`);
			postsToDownload.set(fileUrl, outputFilename);
		}

		return postsToDownload;
	};

	private async buildThreadEndpoint(board: string, thread: string): Promise<string> {
		return joinURL('https://a.4cdn.org', board, 'thread', `${thread}.json`);
	};

	private async buildOutputDirectory(board: string, thread: string, sub: string): Promise<string> {
		sub = sub.replace(/[|&;$%@"<>()+,]/g, '').replace(/\//g, '-');
		return join(this.outputPath, board, `${thread} - ${sub}`);
	};

	private async downloadFile(url: string, destination: string): Promise<void> {
		try {
			const res = await $fetch(url, { responseType: 'arrayBuffer' });
			await appendFile(destination, Buffer.from(res));
			consola.info('Downloaded', url);
			this.downloadedFiles++;
			this.downloadSize = this.downloadSize + res.byteLength;
		} catch (err) {
			consola.error('Failed to download', url);
			consola.error(err);
		}
	};

	private async wait(): Promise<void> {
		if (this.throttle) {
			const duration = parseInt(this.throttle);
			await new Promise(res => setTimeout(res, duration));
		}
	};
};
