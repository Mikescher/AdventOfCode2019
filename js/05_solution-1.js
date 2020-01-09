"use strict";
var AdventOfCode2019_05_1;
(function (AdventOfCode2019_05_1) {
    const DAY = 5;
    const PROBLEM = 1;
    async function run() {
        let input = await AdventOfCode.getInput(DAY);
        if (input == null)
            return;
        let runner = new Interpreter(input.split(",").map(p => parseInt(p.trim())), [1]);
        runner.run();
        AdventOfCode.output(DAY, PROBLEM, runner.output.reverse()[0].toString());
    }
    AdventOfCode2019_05_1.run = run;
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
                    AdventOfCode.outputConsole("# " + p0);
                }
                else
                    throw "Unknown Op: " + cmd.opcode + " @ " + this.instructionpointer;
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
})(AdventOfCode2019_05_1 || (AdventOfCode2019_05_1 = {}));
