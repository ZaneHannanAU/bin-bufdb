import {vtypes} from './vtypes';
import * as fs from 'fs';
import * as os from 'os';
import {promisify as p} from 'util';
import * as path from 'path';
const {O_RDWR, O_CREAT, O_NONBLOCK} = fs.constants;

const openflags = O_RDWR | O_CREAT | O_NONBLOCK;
const fopen = p(fs.open),
	fclose = p(fs.close),
	fread = p(fs.read),
	fwrite = p(fs.write);

const parseType:RegExp = /([^\[\s\]]+?)(?:\x20*([LB]E|ascii|utf8|utf16le|ucs2|base64|binary|hex))?(?:\[(?:(\d+)|0x([0-9a-fA-F]+)|0o([0-7]+)|2^(\d+))\])?\s+(\S+)(?:;?\x20*(noAssert))?/;
// type([length])? name ('default' JSONvalue)

export interface DBRecord {
	[datainterface: string]: number | string | NodeBuffer | Date;
	DEFAULT_ENCODING?: {string: string, number: string};
}
export class binDB {
	private record:any;
	private file:Promise<number>;


	constructor(private init: string|string[], settings: DBRecord = {}) {
		if (Array.isArray(init)) this.parseArr(init);
		else this.parse(init);
		this.record = Object.create(settings);
		this.record.DEFAULT_ENCODING = {
			string: settings.DEFAULT_ENCODING ? settings.DEFAULT_ENCODING.string || 'utf8' : 'utf8',
			number: settings.DEFAULT_ENCODING ? settings.DEFAULT_ENCODING.number || 'BE' : 'BE',
		};
		this.record.DBNAME = settings.dbname;
		this.file = fopen(this.record.DBFILE || path.join(os.homedir(), '.bindb', this.record.DBNAME + '.bin'), openflags);
	}
	private parse(init: string) {
		return this.parseArr(init.split(/\s*?\r?\n\s*?/g))
	}
	private parseArr(init: string[]) {
		let idx:number = 0;
		for (const val of init) {
			const matched:string[]|null = val.match(parseType);
			if (!matched)
				throw new SyntaxError('matching array bin failed at ' + val)
			const [, btype, enc, dlen, xlen, olen, elen, key, noAssert] = <string[]>matched;
			const len = (dlen || xlen || olen)
				? parseInt(dlen || xlen || olen, dlen ? 10 : xlen ? 16 : olen ? 8 : undefined)
				: btype === 'freeto' && elen
					? Math.pow(2, parseInt(elen, 10))
					: undefined;
			if (btype in vtypes && vtypes.hasOwnProperty(btype)) {
				idx += vtypes[btype](idx, len, this.record, key, enc, noAssert === 'noAssert');
			}
		}
	}
	public async readIn(rid:number) {console.log(rid)}
}
