"use strict";
var AdventOfCode2019_13_1;
(function (AdventOfCode2019_13_1) {
    const DAY = 13;
    const PROBLEM = 1;
    async function run() {
        let input = await AdventOfCode.getInput(DAY);
        if (input == null)
            return;
        const code = input.trim().split(",").map(p => parseInt(p.trim()));
        const rnr = new Interpreter(code, []);
        rnr.fullRun();
        let tiles = [];
        AdventOfCode.outputConsole(rnr.output);
        for (let i = 0; i < rnr.output.length; i += 3) {
            if (rnr.output[i + 2] === 2)
                tiles.push(rnr.output[i + 0] * 100000 + rnr.output[i + 1]);
        }
        let count = tiles.filter((v, i, s) => s.indexOf(v) === i).length;
        AdventOfCode.output(DAY, PROBLEM, count.toString());
    }
    AdventOfCode2019_13_1.run = run;
    class Interpreter {
        constructor(prog, input) {
            this.is_halted = false;
            this.program = new InfMem(prog);
            this.inputqueue = input;
            this.instructionpointer = 0;
            this.output = [];
            this.relative_base = 0;
        }
        fullRun() {
            while (!this.is_halted) {
                const r = this.singleStep();
                if (r === StepResult.EXECUTED)
                    continue;
                if (r === StepResult.HALTED)
                    return this.output;
                if (r === StepResult.WAITING_FOR_IN)
                    throw "not enough input";
                throw "unknown output of singleStep";
            }
            return this.output;
        }
        singleStep() {
            const cmd = new Op(this.program.r(this.instructionpointer));
            if (cmd.opcode == OpCode.ADD) {
                const p0 = cmd.getParameter(this, 0);
                const p1 = cmd.getParameter(this, 1);
                const pv = p0 + p1;
                cmd.setParameter(this, 2, pv);
                this.incInstrPtr(cmd);
                return StepResult.EXECUTED;
            }
            else if (cmd.opcode == OpCode.MUL) {
                const p0 = cmd.getParameter(this, 0);
                const p1 = cmd.getParameter(this, 1);
                const pv = p0 * p1;
                cmd.setParameter(this, 2, pv);
                this.incInstrPtr(cmd);
                return StepResult.EXECUTED;
            }
            else if (cmd.opcode == OpCode.HALT) {
                this.is_halted = true;
                return StepResult.HALTED;
            }
            else if (cmd.opcode == OpCode.IN) {
                if (this.inputqueue.length == 0)
                    return StepResult.WAITING_FOR_IN;
                const pv = this.inputqueue[0];
                cmd.setParameter(this, 0, pv);
                this.inputqueue = this.inputqueue.slice(1);
                this.incInstrPtr(cmd);
                return StepResult.EXECUTED;
            }
            else if (cmd.opcode == OpCode.OUT) {
                const p0 = cmd.getParameter(this, 0);
                this.output.push(p0);
                //AdventOfCode.outputConsole("# " + p0);
                this.incInstrPtr(cmd);
                return StepResult.EXECUTED;
            }
            else if (cmd.opcode == OpCode.TJMP) {
                const p0 = cmd.getParameter(this, 0);
                if (p0 != 0)
                    this.instructionpointer = cmd.getParameter(this, 1);
                else
                    this.incInstrPtr(cmd);
                return StepResult.EXECUTED;
            }
            else if (cmd.opcode == OpCode.FJMP) {
                const p0 = cmd.getParameter(this, 0);
                if (p0 == 0)
                    this.instructionpointer = cmd.getParameter(this, 1);
                else
                    this.incInstrPtr(cmd);
                return StepResult.EXECUTED;
            }
            else if (cmd.opcode == OpCode.LT) {
                const p0 = cmd.getParameter(this, 0);
                const p1 = cmd.getParameter(this, 1);
                const pv = p0 < p1 ? 1 : 0;
                cmd.setParameter(this, 2, pv);
                this.incInstrPtr(cmd);
                return StepResult.EXECUTED;
            }
            else if (cmd.opcode == OpCode.EQ) {
                const p0 = cmd.getParameter(this, 0);
                const p1 = cmd.getParameter(this, 1);
                const pv = p0 == p1 ? 1 : 0;
                cmd.setParameter(this, 2, pv);
                this.incInstrPtr(cmd);
                return StepResult.EXECUTED;
            }
            else if (cmd.opcode == OpCode.ARB) {
                const p0 = cmd.getParameter(this, 0);
                this.relative_base = this.relative_base + p0;
                this.incInstrPtr(cmd);
                return StepResult.EXECUTED;
            }
            else
                throw "Unknown Op: " + cmd.opcode + " @ " + this.instructionpointer;
        }
        incInstrPtr(cmd) {
            this.instructionpointer += 1 + cmd.parametercount;
        }
    }
    let StepResult;
    (function (StepResult) {
        StepResult[StepResult["EXECUTED"] = 0] = "EXECUTED";
        StepResult[StepResult["HALTED"] = 1] = "HALTED";
        StepResult[StepResult["WAITING_FOR_IN"] = 2] = "WAITING_FOR_IN";
    })(StepResult || (StepResult = {}));
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
        OpCode[OpCode["ARB"] = 9] = "ARB";
        OpCode[OpCode["HALT"] = 99] = "HALT";
    })(OpCode || (OpCode = {}));
    let ParamMode;
    (function (ParamMode) {
        ParamMode[ParamMode["POSITION_MODE"] = 0] = "POSITION_MODE";
        ParamMode[ParamMode["IMMEDIATE_MODE"] = 1] = "IMMEDIATE_MODE";
        ParamMode[ParamMode["RELATIVE_MODE"] = 2] = "RELATIVE_MODE";
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
            else if (this.opcode == OpCode.ARB) {
                this.name = "ARB";
                this.parametercount = 1;
            }
            else
                throw "Unknown opcode: " + this.opcode;
        }
        getParameter(proc, index) {
            const prog = proc.program;
            const ip = proc.instructionpointer;
            let p = prog.r(ip + 1 + index);
            if (this.modes[index] == ParamMode.POSITION_MODE)
                p = prog.r(p);
            else if (this.modes[index] == ParamMode.IMMEDIATE_MODE)
                p = p;
            else if (this.modes[index] == ParamMode.RELATIVE_MODE)
                p = prog.r(proc.relative_base + p);
            else
                throw "Unknown ParamMode: " + this.modes[index];
            return p;
        }
        setParameter(proc, index, value) {
            const prog = proc.program;
            const ip = proc.instructionpointer;
            let p = prog.r(ip + 1 + index);
            if (this.modes[index] == ParamMode.POSITION_MODE)
                prog.w(p, value);
            else if (this.modes[index] == ParamMode.IMMEDIATE_MODE)
                throw "Immediate mode not allowed in write";
            else if (this.modes[index] == ParamMode.RELATIVE_MODE)
                prog.w(proc.relative_base + p, value);
            else
                throw "Unknown ParamMode: " + this.modes[index];
        }
    }
    class InfMem {
        constructor(v) {
            this.data = {};
            for (let i = 0; i < v.length; i++)
                this.data[i] = v[i];
        }
        r(pos) {
            if (!(pos in this.data))
                this.data[pos] = 0;
            return this.data[pos];
        }
        w(pos, val) {
            return this.data[pos] = val;
        }
    }
})(AdventOfCode2019_13_1 || (AdventOfCode2019_13_1 = {}));
