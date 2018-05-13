/// <reference types="node" />
export interface DBRecord {
    [datainterface: string]: number | string | NodeBuffer | Date;
    DEFAULT_ENCODING?: {
        string: string;
        number: string;
    };
}
export declare class binDB {
    private init;
    private record;
    private file;
    constructor(init: string | string[], settings?: DBRecord);
    private parse(init);
    private parseArr(init);
    readIn(rid: number): Promise<void>;
}
