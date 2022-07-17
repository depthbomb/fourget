import { join }     from 'pathe';
import { platform } from 'node:os';
import { cwd }      from 'node:process';

const _os = platform();

export const IS_WIN32  = _os === 'win32';
export const IS_LINUX  = ['freebsd', 'openbsd', 'linux'].includes(_os);
export const IS_MACOS  = ['macos', 'darwin'].includes(_os);

export const CWD_PATH  = cwd();
export const SRC_PATH  = join(CWD_PATH, 'src');
export const DIST_PATH = join(CWD_PATH, 'dist');
