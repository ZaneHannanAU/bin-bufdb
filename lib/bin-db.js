"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const vtypes_1 = require("./vtypes");
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const util_1 = require("util");
const path = __importStar(require("path"));
const { O_RDWR, O_CREAT, O_NONBLOCK } = fs.constants;
const openflags = O_RDWR | O_CREAT | O_NONBLOCK;
const fopen = util_1.promisify(fs.open), fclose = util_1.promisify(fs.close), fread = util_1.promisify(fs.read), fwrite = util_1.promisify(fs.write);
const parseType = /([^\[\s\]]+?)(?:\x20*([LB]E|ascii|utf8|utf16le|ucs2|base64|binary|hex))?(?:\[(?:(\d+)|0x([0-9a-fA-F]+)|0o([0-7]+)|2^(\d+))\])?\s+(\S+)(?:;?\x20*(noAssert))?/;
class binDB {
    constructor(init, settings = {}) {
        this.init = init;
        if (Array.isArray(init))
            this.parseArr(init);
        else
            this.parse(init);
        this.record = Object.create(settings);
        this.record.DEFAULT_ENCODING = {
            string: settings.DEFAULT_ENCODING ? settings.DEFAULT_ENCODING.string || 'utf8' : 'utf8',
            number: settings.DEFAULT_ENCODING ? settings.DEFAULT_ENCODING.number || 'BE' : 'BE',
        };
        this.record.DBNAME = settings.dbname;
        this.file = fopen(this.record.DBFILE || path.join(os.homedir(), '.bindb', this.record.DBNAME + '.bin'), openflags);
    }
    parse(init) {
        return this.parseArr(init.split(/\s*?\r?\n\s*?/g));
    }
    parseArr(init) {
        let idx = 0;
        for (const val of init) {
            const matched = val.match(parseType);
            if (!matched)
                throw new SyntaxError('matching array bin failed at ' + val);
            const [, btype, enc, dlen, xlen, olen, elen, key, noAssert] = matched;
            const len = (dlen || xlen || olen)
                ? parseInt(dlen || xlen || olen, dlen ? 10 : xlen ? 16 : olen ? 8 : undefined)
                : btype === 'freeto' && elen
                    ? Math.pow(2, parseInt(elen, 10))
                    : undefined;
            if (btype in vtypes_1.vtypes && vtypes_1.vtypes.hasOwnProperty(btype)) {
                idx += vtypes_1.vtypes[btype](idx, len, this.record, key, enc, noAssert === 'noAssert');
            }
        }
    }
    async readIn(rid) { console.log(rid); }
}
exports.binDB = binDB;
//# sourceMappingURL=bin-db.js.map