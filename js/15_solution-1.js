"use strict";
var AdventOfCode2019_15_1;
(function (AdventOfCode2019_15_1) {
    const DAY = 15;
    const PROBLEM = 1;
    async function run() {
        let input = await AdventOfCode.getInput(DAY);
        if (input == null)
            return;
        const code = input.trim().split(",").map(p => parseInt(p.trim()));
        let wm = new WorldMap();
        let rnr = new Interpreter(code, []);
        let d = Direction.North;
        await AdventOfCode.outputIntermed(wm.dump());
        for (;;) {
            if (wm.isfree(move_pos(wm.position, turn_right(d)))) {
                d = turn_right(d);
            }
            rnr.inputqueue.push(d);
            rnr.autoRun();
            if (rnr.is_halted)
                throw "halted";
            if (rnr.output.length !== 1)
                throw "out";
            let nx = wm.position[0];
            let ny = wm.position[1];
            if (d === Direction.North)
                ny--;
            if (d === Direction.East)
                nx++;
            if (d === Direction.South)
                ny++;
            if (d === Direction.West)
                nx--;
            if (rnr.output[0] === 0) {
                wm.set_wall(nx, ny);
                d = turn_left(d);
            }
            else if (rnr.output[0] === 1) {
                wm.set_empty(nx, ny);
                wm.position = [nx, ny];
            }
            else if (rnr.output[0] === 2) {
                wm.set_target(nx, ny);
                wm.position = [nx, ny];
            }
            rnr.output = [];
            await AdventOfCode.outputIntermed(wm.dump());
            if (wm.unknowns.length === 0)
                break;
        }
        await AdventOfCode.outputIntermed(wm.dump());
        const dist = await wm.calcDistance();
        await AdventOfCode.outputIntermed(wm.dump3());
        AdventOfCode.output(DAY, PROBLEM, dist.toString());
    }
    AdventOfCode2019_15_1.run = run;
    function turn_right(d) {
        if (d === Direction.North)
            return Direction.East;
        if (d === Direction.East)
            return Direction.South;
        if (d === Direction.South)
            return Direction.West;
        if (d === Direction.West)
            return Direction.North;
        throw "d";
    }
    function turn_left(d) {
        if (d === Direction.North)
            return Direction.West;
        if (d === Direction.East)
            return Direction.North;
        if (d === Direction.South)
            return Direction.East;
        if (d === Direction.West)
            return Direction.South;
        throw "d";
    }
    function move_pos(p, d) {
        let nx = p[0];
        let ny = p[1];
        if (d === Direction.North)
            ny--;
        if (d === Direction.East)
            nx++;
        if (d === Direction.South)
            ny++;
        476;
        if (d === Direction.West)
            nx--;
        return [nx, ny];
    }
    let Direction;
    (function (Direction) {
        Direction[Direction["North"] = 1] = "North";
        Direction[Direction["South"] = 2] = "South";
        Direction[Direction["West"] = 3] = "West";
        Direction[Direction["East"] = 4] = "East";
    })(Direction || (Direction = {}));
    let Field;
    (function (Field) {
        Field[Field["Unknown"] = 0] = "Unknown";
        Field[Field["Wall"] = 1] = "Wall";
        Field[Field["Empty"] = 2] = "Empty";
        Field[Field["POI"] = 3] = "POI";
        Field[Field["Target"] = 4] = "Target";
        Field[Field["Path"] = 5] = "Path";
    })(Field || (Field = {}));
    class WorldMap {
        constructor() {
            this.world = {};
            this.unknowns = [];
            this.position = [0, 0];
            this.minx = 0;
            this.miny = 0;
            this.maxx = 0;
            this.maxy = 0;
            this.target_pos = [NaN, NaN];
            this.distance_map = {};
            this.set_empty(0, 0);
        }
        async calcDistance() {
            this.position = [0, 0];
            let distance_map = {};
            distance_map[0] = 0;
            let updates = [];
            updates.unshift([-1, 0]);
            updates.unshift([+1, 0]);
            updates.unshift([0, +1]);
            updates.unshift([0, -1]);
            while (updates.length > 0) {
                const pos = updates.pop();
                if (pos === undefined)
                    throw "undef";
                if (!this.isfree(pos))
                    continue;
                const x = pos[0];
                const y = pos[1];
                const i = (y * 10000000 + x);
                const i_n = ((y - 1) * 10000000 + (x));
                const i_e = ((y) * 10000000 + (x + 1));
                const i_s = ((y + 1) * 10000000 + (x));
                const i_w = ((y) * 10000000 + (x - 1));
                const d_curr = (i in distance_map) ? distance_map[i] : Number.MAX_SAFE_INTEGER;
                const d_n = (i_n in distance_map) ? distance_map[i_n] : Number.MAX_SAFE_INTEGER;
                const d_e = (i_e in distance_map) ? distance_map[i_e] : Number.MAX_SAFE_INTEGER;
                const d_s = (i_s in distance_map) ? distance_map[i_s] : Number.MAX_SAFE_INTEGER;
                const d_w = (i_w in distance_map) ? distance_map[i_w] : Number.MAX_SAFE_INTEGER;
                let d_new = Math.min(d_n, d_e, d_s, d_w);
                if (d_new !== Number.MAX_SAFE_INTEGER)
                    d_new++;
                await AdventOfCode.outputIntermed(this.dump2(distance_map, updates));
                if (d_curr <= d_new)
                    continue;
                distance_map[i] = d_new;
                updates.unshift([x + 1, y]);
                updates.unshift([x - 1, y]);
                updates.unshift([x, y + 1]);
                updates.unshift([x, y - 1]);
            }
            await AdventOfCode.outputIntermed(this.dump2(distance_map, updates));
            let tpos = this.target_pos;
            for (;;) {
                const x = tpos[0];
                const y = tpos[1];
                const i = (y * 10000000 + x);
                const d = distance_map[i];
                const i_n = ((y - 1) * 10000000 + (x));
                const i_e = ((y) * 10000000 + (x + 1));
                const i_s = ((y + 1) * 10000000 + (x));
                const i_w = ((y) * 10000000 + (x - 1));
                const d_n = (i_n in distance_map) ? distance_map[i_n] : Number.MAX_SAFE_INTEGER;
                const d_e = (i_e in distance_map) ? distance_map[i_e] : Number.MAX_SAFE_INTEGER;
                const d_s = (i_s in distance_map) ? distance_map[i_s] : Number.MAX_SAFE_INTEGER;
                const d_w = (i_w in distance_map) ? distance_map[i_w] : Number.MAX_SAFE_INTEGER;
                if (d === 1)
                    break;
                if (d_n + 1 === d) {
                    tpos = [tpos[0], tpos[1] - 1];
                    this.set(tpos[0], tpos[1], Field.Path);
                }
                else if (d_e + 1 === d) {
                    tpos = [tpos[0] + 1, tpos[1]];
                    this.set(tpos[0], tpos[1], Field.Path);
                }
                else if (d_s + 1 === d) {
                    tpos = [tpos[0], tpos[1] + 1];
                    this.set(tpos[0], tpos[1], Field.Path);
                }
                else if (d_w + 1 === d) {
                    tpos = [tpos[0] - 1, tpos[1]];
                    this.set(tpos[0], tpos[1], Field.Path);
                }
                else
                    throw "";
            }
            return distance_map[(this.target_pos[1] * 10000000 + this.target_pos[0])];
        }
        dump2(distance_map, updates) {
            let str = "";
            for (let yy = this.miny; yy <= this.maxy; yy++) {
                for (let xx = this.minx; xx <= this.maxx; xx++) {
                    const i = (yy * 10000000 + xx);
                    if (this.get(xx, yy) === Field.Wall) {
                        str += "#";
                    }
                    else if (updates.filter(u => u[0] === xx && u[1] === yy).length > 0) {
                        str += "@";
                    }
                    else if (i in distance_map) {
                        str += "+";
                    }
                    else {
                        str += ".";
                    }
                }
                str += "\n";
            }
            return str;
        }
        isfree(p) {
            const f = this.get(p[0], p[1]);
            return (f !== Field.Wall) && (f !== Field.Unknown);
        }
        get(x, y) {
            const i = (y * 10000000 + x);
            if (!(i in this.world))
                return Field.Unknown;
            return this.world[i];
        }
        set(x, y, f) {
            const i = (y * 10000000 + x);
            if (this.world[i] === Field.POI)
                this.unknowns = this.unknowns.filter(p => p[0] !== x || p[1] !== y);
            this.world[i] = f;
            if (f === Field.POI)
                this.unknowns.push([x, y]);
            if (f === Field.Target)
                this.target_pos = [x, y];
            this.minx = Math.min(this.minx, x);
            this.maxx = Math.max(this.maxx, x);
            this.miny = Math.min(this.miny, y);
            this.maxy = Math.max(this.maxy, y);
        }
        set_empty(x, y) {
            this.set(x, y, Field.Empty);
            if (this.get(x - 1, y) === Field.Unknown)
                this.set(x - 1, y, Field.POI);
            if (this.get(x + 1, y) === Field.Unknown)
                this.set(x + 1, y, Field.POI);
            if (this.get(x, y - 1) === Field.Unknown)
                this.set(x, y - 1, Field.POI);
            if (this.get(x, y + 1) === Field.Unknown)
                this.set(x, y + 1, Field.POI);
        }
        set_target(x, y) {
            this.set(x, y, Field.Target);
            if (this.get(x - 1, y) === Field.Unknown)
                this.set(x - 1, y, Field.POI);
            if (this.get(x + 1, y) === Field.Unknown)
                this.set(x + 1, y, Field.POI);
            if (this.get(x, y - 1) === Field.Unknown)
                this.set(x, y - 1, Field.POI);
            if (this.get(x, y + 1) === Field.Unknown)
                this.set(x, y + 1, Field.POI);
        }
        set_wall(x, y) {
            this.set(x, y, Field.Wall);
        }
        dump() {
            let str = "";
            for (let yy = this.miny; yy <= this.maxy; yy++) {
                for (let xx = this.minx; xx <= this.maxx; xx++) {
                    if (xx === this.position[0] && yy === this.position[1]) {
                        str += "X";
                    }
                    else if (xx === 0 && yy === 0) {
                        str += "0";
                    }
                    else {
                        switch (this.get(xx, yy)) {
                            case Field.Empty:
                                str += ".";
                                break;
                            case Field.POI:
                                str += "?";
                                break;
                            case Field.Target:
                                str += "@";
                                break;
                            case Field.Unknown:
                                str += " ";
                                break;
                            case Field.Wall:
                                str += "#";
                                break;
                            case Field.Path:
                                str += "=";
                                break;
                        }
                    }
                }
                str += "\n";
            }
            return str;
        }
        dump3() {
            let str = "";
            for (let yy = this.miny; yy <= this.maxy; yy++) {
                for (let xx = this.minx; xx <= this.maxx; xx++) {
                    if (xx === 0 && yy === 0) {
                        str += "X";
                    }
                    else {
                        switch (this.get(xx, yy)) {
                            case Field.Empty:
                                str += " ";
                                break;
                            case Field.POI:
                                str += " ";
                                break;
                            case Field.Target:
                                str += "@";
                                break;
                            case Field.Unknown:
                                str += " ";
                                break;
                            case Field.Wall:
                                str += "#";
                                break;
                            case Field.Path:
                                str += ".";
                                break;
                        }
                    }
                }
                str += "\n";
            }
            return str;
        }
    }
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
        autoRun() {
            while (!this.is_halted) {
                const r = this.singleStep();
                if (r === StepResult.EXECUTED)
                    continue;
                if (r === StepResult.HALTED)
                    return StepResult.HALTED;
                if (r === StepResult.WAITING_FOR_IN)
                    return StepResult.WAITING_FOR_IN;
                throw "unknown output of singleStep";
            }
            return StepResult.HALTED;
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
})(AdventOfCode2019_15_1 || (AdventOfCode2019_15_1 = {}));
