export interface IJoinpoint {
    target: any;
    args: any[];
    method: string;
    proceed: (...args: any[]) => any;
    proceedApply: (...args: any[]) => any;
    proceedCount: (...args: any[]) => any;
}
