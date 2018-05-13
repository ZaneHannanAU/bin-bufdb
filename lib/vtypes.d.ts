/// <reference types="node" />
import { DBRecord } from './bin-db';
export declare const types: string[];
export declare const btypes: {
    w_uintBE(len: number, idx: number, buf: NodeBuffer, v?: number): number;
    w_uintLE(len: number, idx: number, buf: NodeBuffer, v?: number): number;
    w_intBE(len: number, idx: number, buf: NodeBuffer, v?: number): number;
    w_intLE(len: number, idx: number, buf: NodeBuffer, v?: number): number;
    r_uintBE(len: number, idx: number, buf: NodeBuffer): number;
    r_uintLE(len: number, idx: number, buf: NodeBuffer): number;
    r_intBE(len: number, idx: number, buf: NodeBuffer): number;
    r_intLE(len: number, idx: number, buf: NodeBuffer): number;
    w_uint8(idx: number, buf: NodeBuffer, v?: number): number;
    w_int8(idx: number, buf: NodeBuffer, v?: number): number;
    r_uint8(idx: number, buf: NodeBuffer): number;
    r_int8(idx: number, buf: NodeBuffer): number;
    w_uint16BE(idx: number, buf: NodeBuffer, v?: number): number;
    w_uint16LE(idx: number, buf: NodeBuffer, v?: number): number;
    w_int16BE(idx: number, buf: NodeBuffer, v?: number): number;
    w_int16LE(idx: number, buf: NodeBuffer, v?: number): number;
    r_uint16BE(idx: number, buf: NodeBuffer): number;
    r_uint16LE(idx: number, buf: NodeBuffer): number;
    r_int16BE(idx: number, buf: NodeBuffer): number;
    r_int16LE(idx: number, buf: NodeBuffer): number;
    w_uint32BE(idx: number, buf: NodeBuffer, v?: number): number;
    w_uint32LE(idx: number, buf: NodeBuffer, v?: number): number;
    w_int32BE(idx: number, buf: NodeBuffer, v?: number): number;
    w_int32LE(idx: number, buf: NodeBuffer, v?: number): number;
    r_uint32BE(idx: number, buf: NodeBuffer): number;
    r_uint32LE(idx: number, buf: NodeBuffer): number;
    r_int32BE(idx: number, buf: NodeBuffer): number;
    r_int32LE(idx: number, buf: NodeBuffer): number;
    w_datems(idx: number, buf: NodeBuffer, v?: any): number;
    r_datems(idx: number, buf: NodeBuffer): number;
    w_date(idx: number, buf: NodeBuffer, v?: string | number | Date): number;
    r_date(idx: number, buf: NodeBuffer): Date;
    w_doubleBE(idx: number, buf: NodeBuffer, v?: number): number;
    w_doubleLE(idx: number, buf: NodeBuffer, v?: number): number;
    w_floatBE(idx: number, buf: NodeBuffer, v?: number): number;
    w_floatLE(idx: number, buf: NodeBuffer, v?: number): number;
    r_doubleBE(idx: number, buf: NodeBuffer): number;
    r_doubleLE(idx: number, buf: NodeBuffer): number;
    r_floatBE(idx: number, buf: NodeBuffer): number;
    r_floatLE(idx: number, buf: NodeBuffer): number;
    r_bin(len: number, idx: number, buf: NodeBuffer): NodeBuffer;
    w_bin(len: number, idx: number, buf: NodeBuffer, v: NodeBuffer): number;
    r_chars(len: number, idx: number, buf: NodeBuffer, enc?: string): string;
    w_chars(len: number, idx: number, buf: NodeBuffer, v?: string, enc?: string, noAssert?: boolean): number;
};
export interface vtype {
    readonly len: number;
    readonly desc: string;
}
export interface vTypes {
    [index: string]: (idx: number, len: number, self: DBRecord, key: string, enc?: string, noAssert?: boolean) => vtype;
}
export declare const vtypes: vTypes;
