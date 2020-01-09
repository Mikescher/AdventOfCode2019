"use strict";
var AdventOfCode2019_07_1;
(function (AdventOfCode2019_07_1) {
    const DAY = 7;
    const PROBLEM = 1;
    async function run() {
        let input = await AdventOfCode.getInput(DAY);
        if (input == null)
            return;
        let code = input.split(",").map(p => parseInt(p.trim()));
        let outputs = [];
        for (let i = 0; i < 5 * 5 * 5 * 5 * 5; i++) {
            let v = i;
            let a1 = v % 5;
            v = Math.floor(v / 5);
            let a2 = v % 5;
            v = Math.floor(v / 5);
            let a3 = v % 5;
            v = Math.floor(v / 5);
            let a4 = v % 5;
            v = Math.floor(v / 5);
            let a5 = v % 5;
            v = Math.floor(v / 5);
            if ([a1, a2, a3, a4, a5].sort((a, b) => a - b).filter((v, i, s) => s.indexOf(v) === i).length !== 5)
                continue;
            const runner1 = new Interpreter(code, [a1, 0]);
            runner1.run();
            const runner2 = new Interpreter(code, [a2, runner1.output[0]]);
            runner2.run();
            const runner3 = new Interpreter(code, [a3, runner2.output[0]]);
            runner3.run();
            const runner4 = new Interpreter(code, [a4, runner3.output[0]]);
            runner4.run();
            const runner5 = new Interpreter(code, [a5, runner4.output[0]]);
            runner5.run();
            outputs.push(runner5.output[0]);
            AdventOfCode.outputConsole([a1, a2, a3, a4, a5].toString() + "  -->  " + runner1.output[0] + " |> " + runner2.output[0] + " |> " + runner3.output[0] + " |> " + runner4.output[0] + " |> " + runner5.output[0]);
        }
        const max = outputs.sort((a, b) => a - b).reverse()[0];
        AdventOfCode.output(DAY, PROBLEM, max.toString());
    }
    AdventOfCode2019_07_1.run = run;
    class Interpreter {
        constructor(prog, input) {
            this.program = prog;
            this.input = input;
            this.instructionpointer = 0;
            this.inputpointer = 0;
            this.output = [];
        }
        run() {
            while (true) {
                const cmd = new Op(this.program[this.instructionpointer]);
                let ipinc = true;
                if (cmd.opcode == OpCode.ADD) {
                    const p0 = cmd.getParameter(this, 0);
                    const p1 = cmd.getParameter(this, 1);
                    const pv = p0 + p1;
                    cmd.setParameter(this, 2, pv);
                }
                else if (cmd.opcode == OpCode.MUL) {
                    const p0 = cmd.getParameter(this, 0);
                    const p1 = cmd.getParameter(this, 1);
                    const pv = p0 * p1;
                    cmd.setParameter(this, 2, pv);
                }
                else if (cmd.opcode == OpCode.HALT) {
                    return;
                }
                else if (cmd.opcode == OpCode.IN) {
                    const pv = this.input[this.inputpointer];
                    cmd.setParameter(this, 0, pv);
                    this.inputpointer++;
                }
                else if (cmd.opcode == OpCode.OUT) {
                    const p0 = cmd.getParameter(this, 0);
                    this.output.push(p0);
                    //AdventOfCode.outputConsole("# " + p0);
                }
                else if (cmd.opcode == OpCode.TJMP) {
                    const p0 = cmd.getParameter(this, 0);
                    if (p0 != 0) {
                        this.instructionpointer = cmd.getParameter(this, 1);
                        ipinc = false;
                    }
                }
                else if (cmd.opcode == OpCode.FJMP) {
                    const p0 = cmd.getParameter(this, 0);
                    if (p0 == 0) {
                        this.instructionpointer = cmd.getParameter(this, 1);
                        ipinc = false;
                    }
                }
                else if (cmd.opcode == OpCode.LT) {
                    const p0 = cmd.getParameter(this, 0);
                    const p1 = cmd.getParameter(this, 1);
                    const pv = p0 < p1 ? 1 : 0;
                    cmd.setParameter(this, 2, pv);
                }
                else if (cmd.opcode == OpCode.EQ) {
                    const p0 = cmd.getParameter(this, 0);
                    const p1 = cmd.getParameter(this, 1);
                    const pv = p0 == p1 ? 1 : 0;
                    cmd.setParameter(this, 2, pv);
                }
                else
                    throw "Unknown Op: " + cmd.opcode + " @ " + this.instructionpointer;
                if (ipinc)
                    this.instructionpointer += 1 + cmd.parametercount;
            }
        }
    }
    let OpCode;
    (function (OpCode) {
        OpCode[OpCode["ADD"] = 1] = "ADD";
        OpCode[OpCode["MUL"] = 2] = "MUL";
        OpCode[OpCode["IN"] = 3] = "IN";
        OpCode[OpCode["OUT"] = 4] = "OUT";
        OpCode[OpCode["TJMP"] = 5] = "TJMP";
        OpCode[OpCode["FJMP"] = 6] = "FJMP";
        OpCode[OpCode["LT"] = 7] = "LT";
        OpCode[OpCode["EQ"] = 8] = "EQ";
        OpCode[OpCode["HALT"] = 99] = "HALT";
    })(OpCode || (OpCode = {}));
    let ParamMode;
    (function (ParamMode) {
        ParamMode[ParamMode["POSITION_MODE"] = 0] = "POSITION_MODE";
        ParamMode[ParamMode["IMMEDIATE_MODE"] = 1] = "IMMEDIATE_MODE";
    })(ParamMode || (ParamMode = {}));
    class Op {
        constructor(v) {
            this.opcode = v % 100;
            v = Math.floor(v / 100);
            this.modes = [];
            for (let i = 0; i < 4; i++) {
                this.modes.push(v % 10);
                v = Math.floor(v / 10);
            }
            if (this.opcode == OpCode.ADD) {
                this.name = "ADD";
                this.parametercount = 3;
            }
            else if (this.opcode == OpCode.MUL) {
                this.name = "MUL";
                this.parametercount = 3;
            }
            else if (this.opcode == OpCode.HALT) {
                this.name = "HALT";
                this.parametercount = 0;
            }
            else if (this.opcode == OpCode.IN) {
                this.name = "IN";
                this.parametercount = 1;
            }
            else if (this.opcode == OpCode.OUT) {
                this.name = "OUT";
                this.parametercount = 1;
            }
            else if (this.opcode == OpCode.TJMP) {
                this.name = "TJMP";
                this.parametercount = 2;
            }
            else if (this.opcode == OpCode.FJMP) {
                this.name = "FJMP";
                this.parametercount = 2;
            }
            else if (this.opcode == OpCode.LT) {
                this.name = "LT";
                this.parametercount = 3;
            }
            else if (this.opcode == OpCode.EQ) {
                this.name = "EQ";
                this.parametercount = 3;
            }
            else
                throw "Unknown opcode: " + this.opcode;
        }
        getParameter(proc, index) {
            const prog = proc.program;
            const ip = proc.instructionpointer;
            let p = prog[ip + 1 + index];
            if (this.modes[index] == ParamMode.POSITION_MODE)
                p = prog[p];
            else if (this.modes[index] == ParamMode.IMMEDIATE_MODE)
                p = p;
            else
                throw "Unknown ParamMode: " + this.modes[index];
            return p;
        }
        setParameter(proc, index, value) {
            const prog = proc.program;
            const ip = proc.instructionpointer;
            let p = prog[ip + 1 + index];
            if (this.modes[index] == ParamMode.POSITION_MODE)
                prog[p] = value;
            else if (this.modes[index] == ParamMode.IMMEDIATE_MODE)
                throw "Immediate mode not allowed in write";
            else
                throw "Unknown ParamMpde: " + this.modes[index];
        }
    }
})(AdventOfCode2019_07_1 || (AdventOfCode2019_07_1 = {}));
