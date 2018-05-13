"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.types = [
    'int',
    'int8',
    'int16',
    'int32',
    'uint',
    'lint',
    'luint',
    'uint8',
    'uint16',
    'uint32',
    'datems',
    'date',
    'float',
    'double',
    'bin',
    'chars',
    'free',
    'freeto'
];
const ms = 1e3;
exports.btypes = {
    w_uintBE(len, idx, buf, v = NaN) { return buf.writeUIntBE(v, idx, len); },
    w_uintLE(len, idx, buf, v = NaN) { return buf.writeUIntLE(v, idx, len); },
    w_intBE(len, idx, buf, v = NaN) { return buf.writeIntBE(v, idx, len); },
    w_intLE(len, idx, buf, v = NaN) { return buf.writeIntLE(v, idx, len); },
    r_uintBE(len, idx, buf) { return buf.readUIntBE(idx, len); },
    r_uintLE(len, idx, buf) { return buf.readUIntLE(idx, len); },
    r_intBE(len, idx, buf) { return buf.readIntBE(idx, len); },
    r_intLE(len, idx, buf) { return buf.readIntLE(idx, len); },
    w_uint8(idx, buf, v = NaN) { return buf.writeUInt8(v, idx); },
    w_int8(idx, buf, v = NaN) { return buf.writeInt8(v, idx); },
    r_uint8(idx, buf) { return buf.readUInt8(idx); },
    r_int8(idx, buf) { return buf.readInt8(idx); },
    w_uint16BE(idx, buf, v = NaN) { return buf.writeUInt16BE(v, idx); },
    w_uint16LE(idx, buf, v = NaN) { return buf.writeUInt16LE(v, idx); },
    w_int16BE(idx, buf, v = NaN) { return buf.writeInt16BE(v, idx); },
    w_int16LE(idx, buf, v = NaN) { return buf.writeInt16LE(v, idx); },
    r_uint16BE(idx, buf) { return buf.readUInt16BE(idx); },
    r_uint16LE(idx, buf) { return buf.readUInt16LE(idx); },
    r_int16BE(idx, buf) { return buf.readInt16BE(idx); },
    r_int16LE(idx, buf) { return buf.readInt16LE(idx); },
    w_uint32BE(idx, buf, v = NaN) { return buf.writeUInt32BE(v, idx); },
    w_uint32LE(idx, buf, v = NaN) { return buf.writeUInt32LE(v, idx); },
    w_int32BE(idx, buf, v = NaN) { return buf.writeInt32BE(v, idx); },
    w_int32LE(idx, buf, v = NaN) { return buf.writeInt32LE(v, idx); },
    r_uint32BE(idx, buf) { return buf.readUInt32BE(idx); },
    r_uint32LE(idx, buf) { return buf.readUInt32LE(idx); },
    r_int32BE(idx, buf) { return buf.readInt32BE(idx); },
    r_int32LE(idx, buf) { return buf.readInt32LE(idx); },
    w_datems(idx, buf, v = Date.now()) { return buf.writeIntBE(v.valueOf(), idx, 6); },
    r_datems(idx, buf) { return buf.readIntBE(idx, 6); },
    w_date(idx, buf, v = Date.now() / ms) {
        const V = 'number' !== typeof v
            ? v instanceof Date
                ? v.getTime() / ms
                : new Date(v).getTime() / ms
            : v;
        return buf.writeIntBE(V, idx, 6);
    },
    r_date(idx, buf) { return new Date(buf.readIntBE(idx, 6) * ms); },
    w_doubleBE(idx, buf, v = NaN) { return buf.writeDoubleBE(v, idx); },
    w_doubleLE(idx, buf, v = NaN) { return buf.writeDoubleLE(v, idx); },
    w_floatBE(idx, buf, v = NaN) { return buf.writeFloatBE(v, idx); },
    w_floatLE(idx, buf, v = NaN) { return buf.writeFloatLE(v, idx); },
    r_doubleBE(idx, buf) { return buf.readDoubleBE(idx); },
    r_doubleLE(idx, buf) { return buf.readDoubleLE(idx); },
    r_floatBE(idx, buf) { return buf.readFloatBE(idx); },
    r_floatLE(idx, buf) { return buf.readFloatLE(idx); },
    r_bin(len, idx, buf) { return buf.slice(len, idx); },
    w_bin(len, idx, buf, v) { return v.copy(buf, idx, 0, len); },
    r_chars(len, idx, buf, enc = 'utf8') {
        const L = buf.indexOf(0, idx);
        if (!~L || L > (len + idx))
            return buf.toString(enc, idx, idx + len);
        else
            return buf.toString(enc, idx, L);
    },
    w_chars(len, idx, buf, v = '', enc = 'utf8', noAssert = false) {
        if (!noAssert && Buffer.byteLength(v) > len)
            throw new RangeError('Unable to write beyond the end of the buffer.');
        buf.fill(0, idx, idx + len);
        return buf.write(v, idx, len, enc);
    },
};
exports.vtypes = {
    free(idx, len, self, key) {
        Object.defineProperty(self, key, {
            get() { return null; },
            enumerable: true
        });
        void idx;
        return { len, desc: 'F' };
    },
    freeto(idx, to, self, key) {
        const len = to - idx;
        return exports.vtypes.free(idx, len, self, key);
    },
    bin(idx, len, self, key) {
        Object.defineProperty(self, key, {
            get() {
                return exports.btypes.r_bin(len, idx, this.buf);
            },
            set(v) {
                return exports.btypes.w_bin(len, idx, this.buf, v);
            },
            enumerable: true
        });
        return { len, desc: 'b' };
    },
    chars(idx, len, self, key, enc = self.DEFAULT_ENCODING.string || 'utf8', noAssert = false) {
        Object.defineProperty(self, key, {
            get() {
                return exports.btypes.r_chars(len, idx, this.buf, enc);
            },
            set(v) {
                return exports.btypes.w_chars(len, idx, this.buf, v, enc, noAssert);
            },
            enumerable: true
        });
        return { len, desc: 's' };
    },
    float(idx, len = 4, self, key, enc = self.DEFAULT_ENCODING.number || 'BE') {
        if (len === 8)
            return exports.vtypes.double(idx, len, self, key, enc);
        else if (len !== 4)
            throw new RangeError('float length must be 4 or 8');
        const r_f = 'BE' === enc.toUpperCase() ? exports.btypes.r_floatBE : exports.btypes.r_floatLE;
        const w_f = 'BE' === enc.toUpperCase() ? exports.btypes.w_floatBE : exports.btypes.w_floatLE;
        Object.defineProperty(self, key, {
            get() { return r_f(idx, this.buf); },
            set(v) { return w_f(idx, this.buf, v); },
            enumerable: true
        });
        return { len, desc: 'f' };
    },
    double(idx, len = 8, self, key, enc = self.DEFAULT_ENCODING.number || 'BE') {
        if (len !== 8)
            throw new RangeError('double length must be 8');
        const r_d = 'BE' === enc.toUpperCase() ? exports.btypes.r_doubleBE : exports.btypes.r_doubleLE;
        const w_d = 'BE' === enc.toUpperCase() ? exports.btypes.w_doubleBE : exports.btypes.w_doubleLE;
        Object.defineProperty(self, key, {
            get() { return r_d(idx, this.buf); },
            set(v) { return w_d(idx, this.buf, v); },
            enumerable: true
        });
        return { len, desc: 'f' };
    },
    int(idx, len, self, key, enc = self.DEFAULT_ENCODING.number || 'BE') {
        switch (len) {
            case 1:
                return exports.vtypes.int8(idx, len, self, key);
            case 2:
                return exports.vtypes.int16(idx, len, self, key, enc);
            case 4:
                return exports.vtypes.int32(idx, len, self, key, enc);
            default:
                return exports.vtypes.lint(idx, len, self, key, enc);
        }
        ;
    },
    lint(idx, len, self, key, enc = self.DEFAULT_ENCODING.number || 'BE') {
        if (len > 6 || len < 1 || Math.floor(Math.abs(len)) !== len)
            throw new RangeError('lint length must be a positive integer between 1 and 6');
        const r_i = 'BE' === enc.toUpperCase() ? exports.btypes.r_intBE : exports.btypes.r_intLE;
        const w_i = 'BE' === enc.toUpperCase() ? exports.btypes.w_intBE : exports.btypes.w_intLE;
        Object.defineProperty(self, key, {
            get() { return r_i(len, idx, this.buf); },
            set(v) { return w_i(len, idx, this.buf, v); },
            enumerable: true
        });
        return { len, desc: 'i' };
    },
    date(idx, len = 6, self, key) {
        if (len !== 6)
            throw new RangeError('date length must be 6');
        Object.defineProperty(self, key, {
            get() { return exports.btypes.r_date(idx, this.buf); },
            set(v) { return exports.btypes.w_date(idx, this.buf, v); },
            enumerable: true
        });
        return { len, desc: 'D' };
    },
    datems(idx, len = 6, self, key) {
        if (len !== 6)
            throw new RangeError('datems length must be 6');
        Object.defineProperty(self, key, {
            get() { return exports.btypes.r_datems(idx, this.buf); },
            set(v) { return exports.btypes.w_datems(idx, this.buf, v); },
            enumerable: true
        });
        return { len, desc: 'i' };
    },
    int8(idx, len = 1, self, key) {
        if (len !== 1)
            throw new RangeError('int8 length must be 1');
        Object.defineProperty(self, key, {
            get() { return exports.btypes.r_int8(idx, this.buf); },
            set(v) { return exports.btypes.w_int8(idx, this.buf, v); },
            enumerable: true
        });
        return { len, desc: 'i' };
    },
    int16(idx, len = 2, self, key, enc = self.DEFAULT_ENCODING.number || 'BE') {
        if (len !== 2)
            throw new RangeError('int16 length must be 2');
        const r_i = 'BE' === enc.toUpperCase() ? exports.btypes.r_int16BE : exports.btypes.r_int16LE;
        const w_i = 'BE' === enc.toUpperCase() ? exports.btypes.w_int16BE : exports.btypes.w_int16LE;
        Object.defineProperty(self, key, {
            get() { return r_i(idx, this.buf); },
            set(v) { return w_i(idx, this.buf, v); },
            enumerable: true
        });
        return { len, desc: 'i' };
    },
    int32(idx, len = 4, self, key, enc = self.DEFAULT_ENCODING.number || 'BE') {
        if (len !== 4)
            throw new RangeError('int32 length must be 4');
        const r_i = 'BE' === enc.toUpperCase() ? exports.btypes.r_int32BE : exports.btypes.r_int32LE;
        const w_i = 'BE' === enc.toUpperCase() ? exports.btypes.w_int32BE : exports.btypes.w_int32LE;
        Object.defineProperty(self, key, {
            get() { return r_i(idx, this.buf); },
            set(v) { return w_i(idx, this.buf, v); },
            enumerable: true
        });
        return { len, desc: 'i' };
    },
    uint(idx, len, self, key, enc = self.DEFAULT_ENCODING.number || 'BE') {
        switch (len) {
            case 1:
                return exports.vtypes.uint8(idx, len, self, key);
            case 2:
                return exports.vtypes.uint16(idx, len, self, key, enc);
            case 4:
                return exports.vtypes.uint32(idx, len, self, key, enc);
            default:
                return exports.vtypes.luint(idx, len, self, key, enc);
        }
        ;
    },
    luint(idx, len, self, key, enc = self.DEFAULT_ENCODING.number || 'BE') {
        if (len > 6 || len < 1 || Math.floor(Math.abs(len)) !== len)
            throw new RangeError('luint length must be a positive integer between 1 and 6');
        const r_u = 'BE' === enc.toUpperCase() ? exports.btypes.r_uintBE : exports.btypes.r_uintLE;
        const w_u = 'BE' === enc.toUpperCase() ? exports.btypes.w_uintBE : exports.btypes.w_uintLE;
        Object.defineProperty(self, key, {
            get() { return r_u(len, idx, this.buf); },
            set(v) { return w_u(len, idx, this.buf, v); },
            enumerable: true
        });
        return { len, desc: 'u' };
    },
    uint8(idx, len = 1, self, key) {
        if (len !== 1)
            throw new RangeError('uint8 length must be 1');
        Object.defineProperty(self, key, {
            get() { return exports.btypes.r_uint8(idx, this.buf); },
            set(v) { return exports.btypes.w_uint8(idx, this.buf, v); },
            enumerable: true
        });
        return { len, desc: 'u' };
    },
    uint16(idx, len = 2, self, key, enc = self.DEFAULT_ENCODING.number || 'BE') {
        if (len !== 2)
            throw new RangeError('uint16 length must be 2');
        const r_u = 'BE' === enc.toUpperCase() ? exports.btypes.r_uint16BE : exports.btypes.r_uint16LE;
        const w_u = 'BE' === enc.toUpperCase() ? exports.btypes.w_uint16BE : exports.btypes.w_uint16LE;
        Object.defineProperty(self, key, {
            get() { return r_u(idx, this.buf); },
            set(v) { return w_u(idx, this.buf, v); },
            enumerable: true
        });
        return { len, desc: 'u' };
    },
    uint32(idx, len = 4, self, key, enc = self.DEFAULT_ENCODING.number || 'BE') {
        if (len !== 4)
            throw new RangeError('uint32 length must be 4');
        const r_u = 'BE' === enc.toUpperCase() ? exports.btypes.r_uint32BE : exports.btypes.r_uint32LE;
        const w_u = 'BE' === enc.toUpperCase() ? exports.btypes.w_uint32BE : exports.btypes.w_uint32LE;
        Object.defineProperty(self, key, {
            get() { return r_u(idx, this.buf); },
            set(v) { return w_u(idx, this.buf, v); },
            enumerable: true
        });
        return { len, desc: 'u' };
    },
};
//# sourceMappingURL=vtypes.js.map