<p align="center">
	<table>
		<tbody>
			<td align="center">
				<h1>fourget</h1>
				<p>CLI tool for downloading media from 4chan threads</p>
				<p>
					<a href="https://www.npmjs.com/package/fourget"><img src="https://img.shields.io/npm/v/fourget?color=crimson&label=fourget&logo=npm&style=flat-square"></a>
					<a href="https://www.npmjs.com/package/fourget"><img src="https://img.shields.io/npm/dt/fourget?color=crimson&logo=npm&style=flat-square"></a>
					<a href="https://www.npmjs.com/package/fourget"><img src="https://img.shields.io/librariesio/release/npm/fourget?color=crimson&logo=npm&style=flat-square"></a>
				</p>
				<p>
					<a href="https://github.com/depthbomb/fourget/releases/latest"><img src="https://img.shields.io/github/release-date/depthbomb/fourget.svg?label=Released&logo=github&style=flat-square"></a>
					<a href="https://github.com/depthbomb/fourget/releases/latest"><img src="https://img.shields.io/github/release/depthbomb/fourget.svg?label=Stable&logo=github&style=flat-square"></a>
					<a href="https://github.com/depthbomb/fourget"><img src="https://img.shields.io/github/repo-size/depthbomb/fourget.svg?label=Repo%20Size&logo=github&style=flat-square"></a>
				</p>
				<img width="2000" height="0">
			</td>
		</tbody>
	</table>
</p>

# Installation

```
npm i fourget -g
```

# Usage

```
$ fourget <thread URL> <directory>
```

# Options

## `-o`, `--organize`

Whether to put files into organized directories based on board and thread ID.

For example downloading from a URL like `https://boards.4channel.org/c/thread/4444444` would create a structure like `<output>/c/4444444 - Thread Name/`.

## `-f`, `--filter`

A comma-delimited list of file extensions (with leading period) to download, for example `.gif,.png`.

## `-r`, `--redownload`

Whether to redownload files if they already exist.

## `-t`, `--throttle`

The number of milliseconds to wait between downloading files. Omit to use no delay.

---

# Planned Features

- Thread watching/automatically download new files as they are posted
