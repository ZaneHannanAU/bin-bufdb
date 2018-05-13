import {DBRecord} from './bin-db';
// all types
export const types:string[] = [
	// nums
	// signed integer types
	'int',
	'int8',
	'int16',
	'int32',

	// unsigned integer types
	'uint',
	'lint',
	'luint',
	'uint8',
	'uint16',
	'uint32',

	// 6 byte int types (int48/luint 6)
	'datems',
	'date',

	// floating point types
	'float',
	'double',

	// bins/multiple length
	'bin', // known variable length
	'chars', // Known length, end 0x00, pad 0x00
	// freedom
	'free', // null bytes
	'freeto'
];

const ms:number = 1e3;
// base types
export const btypes = {
	// variable width integers; call(len, offset, buffer[, value])
	// write
	w_uintBE(len:number, idx:number, buf:NodeBuffer, v:number = NaN):number {return buf.writeUIntBE(v, idx, len);},
	w_uintLE(len:number, idx:number, buf:NodeBuffer, v:number = NaN):number {return buf.writeUIntLE(v, idx, len);},
	w_intBE (len:number, idx:number, buf:NodeBuffer, v:number = NaN):number {return buf.writeIntBE (v, idx, len);},
	w_intLE (len:number, idx:number, buf:NodeBuffer, v:number = NaN):number {return buf.writeIntLE (v, idx, len);},
	// read
	r_uintBE(len:number, idx:number, buf:NodeBuffer):number {return buf.readUIntBE(idx, len);},
	r_uintLE(len:number, idx:number, buf:NodeBuffer):number {return buf.readUIntLE(idx, len);},
	r_intBE (len:number, idx:number, buf:NodeBuffer):number {return buf.readIntBE (idx, len);},
	r_intLE (len:number, idx:number, buf:NodeBuffer):number {return buf.readIntLE (idx, len);},

	// fixed-width integers; call(offset, buffer[, value])
	// 8 bit
	w_uint8(idx:number, buf:NodeBuffer, v:number = NaN):number {return buf.writeUInt8(v, idx);},
	w_int8 (idx:number, buf:NodeBuffer, v:number = NaN):number {return buf.writeInt8 (v, idx);},
	r_uint8(idx:number, buf:NodeBuffer):number {return buf.readUInt8(idx);},
	r_int8 (idx:number, buf:NodeBuffer):number {return buf.readInt8 (idx);},
	// 16 bit
	w_uint16BE(idx:number, buf:NodeBuffer, v:number = NaN):number {return buf.writeUInt16BE(v, idx);},
	w_uint16LE(idx:number, buf:NodeBuffer, v:number = NaN):number {return buf.writeUInt16LE(v, idx);},
	w_int16BE (idx:number, buf:NodeBuffer, v:number = NaN):number {return buf.writeInt16BE (v, idx);},
	w_int16LE (idx:number, buf:NodeBuffer, v:number = NaN):number {return buf.writeInt16LE (v, idx);},
	r_uint16BE(idx:number, buf:NodeBuffer):number {return buf.readUInt16BE(idx);},
	r_uint16LE(idx:number, buf:NodeBuffer):number {return buf.readUInt16LE(idx);},
	r_int16BE (idx:number, buf:NodeBuffer):number {return buf.readInt16BE (idx);},
	r_int16LE (idx:number, buf:NodeBuffer):number {return buf.readInt16LE (idx);},
	// 32 bit
	w_uint32BE(idx:number, buf:NodeBuffer, v:number = NaN):number {return buf.writeUInt32BE(v, idx);},
	w_uint32LE(idx:number, buf:NodeBuffer, v:number = NaN):number {return buf.writeUInt32LE(v, idx);},
	w_int32BE (idx:number, buf:NodeBuffer, v:number = NaN):number {return buf.writeInt32BE (v, idx);},
	w_int32LE (idx:number, buf:NodeBuffer, v:number = NaN):number {return buf.writeInt32LE (v, idx);},
	r_uint32BE(idx:number, buf:NodeBuffer):number {return buf.readUInt32BE(idx);},
	r_uint32LE(idx:number, buf:NodeBuffer):number {return buf.readUInt32LE(idx);},
	r_int32BE (idx:number, buf:NodeBuffer):number {return buf.readInt32BE (idx);},
	r_int32LE (idx:number, buf:NodeBuffer):number {return buf.readInt32LE (idx);},

	// date; call(offset, buffer[, value])
	w_datems(idx:number, buf:NodeBuffer, v:any = Date.now()):number {return buf.writeIntBE(v.valueOf(), idx, 6);},
	r_datems(idx:number, buf:NodeBuffer):number {return buf.readIntBE(idx, 6);},
	w_date(idx:number, buf:NodeBuffer, v:number|string|Date = Date.now()/ms):number {
		const V = 'number' !== typeof v
			? v instanceof Date
				? v.getTime() / ms
				: new Date(v).getTime() / ms
			: v

		return buf.writeIntBE(V, idx, 6);
	},
	r_date(idx:number, buf:NodeBuffer):Date {return new Date(buf.readIntBE(idx, 6) * ms);},

	// floating point; call(offset, buffer[, value])
	w_doubleBE(idx:number, buf:NodeBuffer, v:number = NaN) {return buf.writeDoubleBE(v, idx);},
	w_doubleLE(idx:number, buf:NodeBuffer, v:number = NaN) {return buf.writeDoubleLE(v, idx);},
	w_floatBE (idx:number, buf:NodeBuffer, v:number = NaN) {return buf.writeFloatBE (v, idx);},
	w_floatLE (idx:number, buf:NodeBuffer, v:number = NaN) {return buf.writeFloatLE (v, idx);},
	r_doubleBE(idx:number, buf:NodeBuffer) {return buf.readDoubleBE(idx);},
	r_doubleLE(idx:number, buf:NodeBuffer) {return buf.readDoubleLE(idx);},
	r_floatBE (idx:number, buf:NodeBuffer) {return buf.readFloatBE (idx);},
	r_floatLE (idx:number, buf:NodeBuffer) {return buf.readFloatLE (idx);},

	// bin; call(length, offset, buffer[, value])
	r_bin(len:number, idx:number, buf:NodeBuffer):NodeBuffer {return buf.slice(len, idx);},
	w_bin(len:number, idx:number, buf:NodeBuffer, v:NodeBuffer):number {return v.copy(buf, idx, 0, len);},

	// chars; call(length, offset, buffer[, value][, encoding[, noAssert]])
	r_chars(len:number, idx:number, buf:NodeBuffer, enc:string = 'utf8'):string {
		const L = buf.indexOf(0, idx);
		if (!~L || L > (len+idx))
			return buf.toString(enc, idx, idx+len);
		else
			return buf.toString(enc, idx, L);
	},
	w_chars(len:number, idx:number, buf:NodeBuffer, v:string = '', enc:string = 'utf8', noAssert:boolean = false):number {
		if (!noAssert && Buffer.byteLength(v) > len)
			throw new RangeError('Unable to write beyond the end of the buffer.');
		buf.fill(0, idx, idx + len);
		return buf.write(v, idx, len, enc);
	},
};




// individual type
export interface vtype {
	readonly len: number; // binary length; not zero unless desc === 'F'
	readonly desc: string; // byte type; uppercase = not primitive
}

// bulk types
export interface vTypes {
	[index: string]: (idx:number, len:number, self:DBRecord, key:string, enc?:string, noAssert?:boolean) => vtype;
}
export const vtypes:vTypes = {
	free(idx:number, len:number, self:DBRecord, key:string):vtype {
		Object.defineProperty(self, key, {
			get():null {return null;},
			enumerable: true
		});
		void idx;
		return {len, desc: 'F'};
	},
	freeto(idx:number, to:number, self:DBRecord, key:string):vtype {
		const len = to - idx;
		return vtypes.free(idx, len, self, key);
	},

	bin(idx:number, len:number, self:DBRecord, key:string):vtype {
		Object.defineProperty(self, key, {
			get():NodeBuffer {
				return btypes.r_bin(len, idx, this.buf);
			},
			set(v:NodeBuffer):number {
				return btypes.w_bin(len, idx, this.buf, v);
			},
			enumerable: true
		});
		return {len, desc: 'b'};
	},
	chars(idx:number, len:number, self:DBRecord, key:string, enc:string = self.DEFAULT_ENCODING.string || 'utf8', noAssert:boolean = false):vtype {
		Object.defineProperty(self, key, {
			get():string {
				return btypes.r_chars(len, idx, this.buf, enc);
			},
			set(v:string):number {
				return btypes.w_chars(len, idx, this.buf, v, enc, noAssert);
			},
			enumerable: true
		});
		return {len, desc: 's'}; 
	},
	float(idx:number, len:number = 4, self:DBRecord, key:string, enc:string = self.DEFAULT_ENCODING.number || 'BE'):vtype {
		if (len === 8)
			return vtypes.double(idx, len, self, key, enc);
		else if (len !== 4)
			throw new RangeError('float length must be 4 or 8');
		const r_f = 'BE' === enc.toUpperCase() ? btypes.r_floatBE : btypes.r_floatLE;
		const w_f = 'BE' === enc.toUpperCase() ? btypes.w_floatBE : btypes.w_floatLE;
		Object.defineProperty(self, key, {
			get():number {return r_f(idx, this.buf);},
			set(v:number):number {return w_f(idx, this.buf, v);},
			enumerable: true
		});
		return {len, desc: 'f'};
	},
	double(idx:number, len:number = 8, self:DBRecord, key:string, enc:string = self.DEFAULT_ENCODING.number || 'BE'):vtype {
		if (len !== 8)
			throw new RangeError('double length must be 8');
		const r_d = 'BE' === enc.toUpperCase() ? btypes.r_doubleBE : btypes.r_doubleLE;
		const w_d = 'BE' === enc.toUpperCase() ? btypes.w_doubleBE : btypes.w_doubleLE;
		Object.defineProperty(self, key, {
			get():number {return r_d(idx, this.buf);},
			set(v:number):number {return w_d(idx, this.buf, v);},
			enumerable: true
		});
		return {len, desc: 'f'};
	},
	int(idx:number, len:number, self:DBRecord, key:string, enc:string = self.DEFAULT_ENCODING.number || 'BE'):vtype {
		switch (len) {
			case 1:
				return vtypes.int8(idx, len, self, key);
			case 2:
				return vtypes.int16(idx, len, self, key, enc);
			case 4:
				return vtypes.int32(idx, len, self, key, enc);
			default:
				return vtypes.lint(idx, len, self, key, enc);
		};
	},
	lint(idx:number, len:number, self:DBRecord, key:string, enc:string = self.DEFAULT_ENCODING.number || 'BE'):vtype {
		if (len > 6 || len < 1 || Math.floor(Math.abs(len)) !== len)
			throw new RangeError('lint length must be a positive integer between 1 and 6');
		const r_i = 'BE' === enc.toUpperCase() ? btypes.r_intBE : btypes.r_intLE;
		const w_i = 'BE' === enc.toUpperCase() ? btypes.w_intBE : btypes.w_intLE;
		Object.defineProperty(self, key, {
			get():number {return r_i(len, idx, this.buf);},
			set(v:number):number {return w_i(len, idx, this.buf, v);},
			enumerable: true
		});
		return {len, desc: 'i'};
	},
	date(idx:number, len:number = 6, self:DBRecord, key:string):vtype {
		if (len !== 6)
			throw new RangeError('date length must be 6');
		Object.defineProperty(self, key, {
			get():Date {return btypes.r_date(idx, this.buf);},
			set(v:number|Date):number {return btypes.w_date(idx, this.buf, v);},
			enumerable: true
		});
		return {len, desc: 'D'}; // date returns a Date
	},
	datems(idx:number, len:number = 6, self:DBRecord, key:string):vtype {
		if (len !== 6)
			throw new RangeError('datems length must be 6');
		Object.defineProperty(self, key, {
			get():number {return btypes.r_datems(idx, this.buf);},
			set(v:number):number {return btypes.w_datems(idx, this.buf, v);},
			enumerable: true
		});
		return {len, desc: 'i'}; // datems returns a number
	},
	int8(idx:number, len:number = 1, self:DBRecord, key:string):vtype {
		if (len !== 1)
			throw new RangeError('int8 length must be 1');
		Object.defineProperty(self, key, {
			get():number {return btypes.r_int8(idx, this.buf);},
			set(v:number):number {return btypes.w_int8(idx, this.buf, v);},
			enumerable: true
		});
		return {len, desc: 'i'};
	},
	int16(idx:number, len:number = 2, self:DBRecord, key:string, enc:string = self.DEFAULT_ENCODING.number || 'BE'):vtype {
		if (len !== 2)
			throw new RangeError('int16 length must be 2');
		const r_i = 'BE' === enc.toUpperCase() ? btypes.r_int16BE : btypes.r_int16LE;
		const w_i = 'BE' === enc.toUpperCase() ? btypes.w_int16BE : btypes.w_int16LE;
		Object.defineProperty(self, key, {
			get():number {return r_i(idx, this.buf);},
			set(v:number):number {return w_i(idx, this.buf, v);},
			enumerable: true
		});
		return {len, desc: 'i'};
	},
	int32(idx:number, len:number = 4, self:DBRecord, key:string, enc:string = self.DEFAULT_ENCODING.number || 'BE'):vtype {
		if (len !== 4)
			throw new RangeError('int32 length must be 4');
		const r_i = 'BE' === enc.toUpperCase() ? btypes.r_int32BE : btypes.r_int32LE;
		const w_i = 'BE' === enc.toUpperCase() ? btypes.w_int32BE : btypes.w_int32LE;
		Object.defineProperty(self, key, {
			get():number {return r_i(idx, this.buf);},
			set(v:number):number {return w_i(idx, this.buf, v);},
			enumerable: true
		});
		return {len, desc: 'i'};
	},

	uint(idx:number, len:number, self:DBRecord, key:string, enc:string = self.DEFAULT_ENCODING.number || 'BE'):vtype {
		switch (len) {
			case 1:
				return vtypes.uint8(idx, len, self, key);
			case 2:
				return vtypes.uint16(idx, len, self, key, enc);
			case 4:
				return vtypes.uint32(idx, len, self, key, enc);
			default:
				return vtypes.luint(idx, len, self, key, enc);
		};
	},
	luint(idx:number, len:number, self:DBRecord, key:string, enc:string = self.DEFAULT_ENCODING.number || 'BE'):vtype {
		if (len > 6 || len < 1 || Math.floor(Math.abs(len)) !== len)
			throw new RangeError('luint length must be a positive integer between 1 and 6');
		const r_u = 'BE' === enc.toUpperCase() ? btypes.r_uintBE : btypes.r_uintLE;
		const w_u = 'BE' === enc.toUpperCase() ? btypes.w_uintBE : btypes.w_uintLE;
		Object.defineProperty(self, key, {
			get():number {return r_u(len, idx, this.buf);},
			set(v:number):number {return w_u(len, idx, this.buf, v);},
			enumerable: true
		});
		return {len, desc: 'u'};
	},
	uint8(idx:number, len:number = 1, self:DBRecord, key:string):vtype {
		if (len !== 1)
			throw new RangeError('uint8 length must be 1');
		Object.defineProperty(self, key, {
			get():number {return btypes.r_uint8(idx, this.buf);},
			set(v:number):number {return btypes.w_uint8(idx, this.buf, v);},
			enumerable: true
		});
		return {len, desc: 'u'};
	},
	uint16(idx:number, len:number = 2, self:DBRecord, key:string, enc:string = self.DEFAULT_ENCODING.number || 'BE'):vtype {
		if (len !== 2)
			throw new RangeError('uint16 length must be 2');
		const r_u = 'BE' === enc.toUpperCase() ? btypes.r_uint16BE : btypes.r_uint16LE;
		const w_u = 'BE' === enc.toUpperCase() ? btypes.w_uint16BE : btypes.w_uint16LE;
		Object.defineProperty(self, key, {
			get():number {return r_u(idx, this.buf);},
			set(v:number):number {return w_u(idx, this.buf, v);},
			enumerable: true
		});
		return {len, desc: 'u'};
	},
	uint32(idx:number, len:number = 4, self:DBRecord, key:string, enc:string = self.DEFAULT_ENCODING.number || 'BE'):vtype {
		if (len !== 4)
			throw new RangeError('uint32 length must be 4');
		const r_u = 'BE' === enc.toUpperCase() ? btypes.r_uint32BE : btypes.r_uint32LE;
		const w_u = 'BE' === enc.toUpperCase() ? btypes.w_uint32BE : btypes.w_uint32LE;
		Object.defineProperty(self, key, {
			get():number {return r_u(idx, this.buf);},
			set(v:number):number {return w_u(idx, this.buf, v);},
			enumerable: true
		});
		return {len, desc: 'u'};
	},

};
