import { type PyodideInterface } from "pyodide";
declare class PythonInWeb {
    static pyodide: PyodideInterface | null;
    constructor();
    static loadPyodide(loadPyodide: any): Promise<any>;
    loadPackage(): Promise<void>;
    runPythonCode(code: string): Promise<void>;
}
export default PythonInWeb;
