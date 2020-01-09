"use strict";
var AdventOfCode2019_25_1;
(function (AdventOfCode2019_25_1) {
    const DAY = 25;
    const PROBLEM = 1;
    async function run() {
        let input = await AdventOfCode.getInput(DAY);
        if (input == null)
            return;
        //await runInteractive(input); 
        await runAuto(input);
    }
    AdventOfCode2019_25_1.run = run;
    async function runAuto(input) {
        const code = input.trim().split(",").map(p => parseInt(p.trim()));
        let visited = new Set();
        let work = [];
        work.push([0, []]);
        let rooms = [];
        let dest = new Room();
        dest.name = "Floor";
        dest.path = [Direction.S, Direction.S, Direction.S, Direction.E, Direction.S, Direction.E];
        let items = {};
        let allitems = [];
        while (work.length > 0) {
            let workitem = work.pop();
            let room = getRoom(code, workitem[1]);
            if (visited.has(room.name))
                continue;
            visited.add(room.name);
            rooms.push(room);
            AdventOfCode.outputConsole(`${room.name} => ${room.path.map(p => dir_to_short_str(p)).join("")}`);
            if (room.object !== null) {
                items[room.object] = room;
                allitems.push(room.object);
            }
            for (const d of room.doors) {
                let p2 = Object.assign([], room.path);
                p2.push(d);
                work.push([workitem[0] + 1, p2]);
            }
        }
        for (let bmap = 0; bmap < Math.pow(2, allitems.length); bmap++) {
            let packeditems = allitems.filter((v, i, a) => (bmap & Math.pow(2, i)) !== 0);
            let destrooms = packeditems.map(p => items[p]);
            let fullpath = [];
            for (const destroomm of destrooms) {
                for (const d of destroomm.path)
                    fullpath.push(dir_to_str(d) + "\n");
                fullpath.push("take " + destroomm.object + "\n");
                for (const d of destroomm.path.slice().reverse())
                    fullpath.push(dir_to_str_inv(d) + "\n");
            }
            fullpath.push("inv\n");
            for (const d of dest.path)
                fullpath.push(dir_to_str(d) + "\n");
            let rnr = new Interpreter(code, fullpath.flatMap(p => p.split("").map(q => q.charCodeAt(0))));
            rnr.autoRun();
            let strout = rnr.output.map(p => String.fromCharCode(p)).join("");
            await AdventOfCode.outputIntermed("Inv: [" + packeditems.join(" ++ ") + "]\n" + fullpath.join("") + "\n\n" + strout);
            //await AdventOfCode.sleep(10*1000);
            if (strout.indexOf("You can't go that way.") > 0) {
                AdventOfCode.output(DAY, PROBLEM, "ERROR");
                return; // error
            }
            if (strout.indexOf("A loud, robotic voice says \"Alert! ") > 0)
                continue;
            if (strout.indexOf("It is suddenly completely dark! You are eaten by a Grue!") > 0)
                continue;
            if (strout.indexOf("You're launched into space! Bye!") > 0)
                continue;
            if (strout.indexOf("Oh, hello! You should be able to get in by typing") > 0) {
                let lastline = strout.trim().split(new RegExp('\r?\n')).slice().reverse()[0];
                let r = lastline.substring(lastline.indexOf("typing") + "typing".length).trim().split(" ")[0];
                AdventOfCode.output(DAY, PROBLEM, r.trim());
                return;
            }
            AdventOfCode.output(DAY, PROBLEM, "ERROR");
            return; // error
        }
    }
    class Room {
        constructor() {
            this.name = "";
            this.doors = [];
            this.object = null;
            this.path = [];
        }
    }
    let Direction;
    (function (Direction) {
        Direction[Direction["N"] = 0] = "N";
        Direction[Direction["E"] = 1] = "E";
        Direction[Direction["S"] = 2] = "S";
        Direction[Direction["W"] = 3] = "W";
    })(Direction || (Direction = {}));
    function getRoom(code, dirs) {
        let rnr = new Interpreter(code, dirs.map(p => dir_to_str(p) + "\n").join("").split("").map(p => p.charCodeAt(0)));
        rnr.autoRun();
        let lines = rnr.output
            .map(p => String.fromCharCode(p))
            .join("")
            .split(new RegExp('\r?\n'))
            .reverse();
        let r_dir = [];
        let r_obj = null;
        for (let lin of lines) {
            if (lin === "Command?")
                continue;
            if (lin === "")
                continue;
            if (lin.startsWith("- ")) {
                let obj = lin.substring(2);
                if (obj === "north")
                    r_dir.push(Direction.N);
                else if (obj === "east")
                    r_dir.push(Direction.E);
                else if (obj === "south")
                    r_dir.push(Direction.S);
                else if (obj === "west")
                    r_dir.push(Direction.W);
                else
                    r_obj = obj;
                continue;
            }
            if (lin.startsWith("== ")) {
                let name = lin.substring(3, lin.length - 3);
                let r = new Room();
                r.doors = r_dir;
                r.name = name;
                r.object = r_obj;
                r.path = dirs;
                return r;
            }
        }
        throw "EOD";
    }
    function dir_to_str(d) {
        if (d === Direction.N)
            return "north";
        if (d === Direction.E)
            return "east";
        if (d === Direction.S)
            return "south";
        if (d === Direction.W)
            return "west";
        throw d;
    }
    function dir_to_str_inv(d) {
        if (d === Direction.N)
            return "south";
        if (d === Direction.E)
            return "west";
        if (d === Direction.S)
            return "north";
        if (d === Direction.W)
            return "east";
        throw d;
    }
    function dir_to_short_str(d) {
        if (d === Direction.N)
            return "N";
        if (d === Direction.E)
            return "E";
        if (d === Direction.S)
            return "S";
        if (d === Direction.W)
            return "W";
        throw d;
    }
    async function runInteractive(input) {
        AdventOfCode.showIntermedInput(true);
        const code = input.trim().split(",").map(p => parseInt(p.trim()));
        let rnr = new Interpreter(code, []);
        let last_out = "";
        for (;;) {
            rnr.autoRun();
            let xout = rnr.output
                .map(p => String.fromCharCode(p))
                .join("")
                .split(new RegExp('\r?\n'))
                .reverse()
                .filter((v, i, a) => i < 60)
                .reverse()
                .join('\n');
            if (last_out !== xout) {
                last_out = xout;
                await AdventOfCode.outputIntermed(xout);
            }
            else {
                await AdventOfCode.sleep(0);
            }
            if (AdventOfCode.isLastInputEnter() && rnr.inputqueue.length === 0) {
                let cmd = AdventOfCode.getAndClearInput();
                rnr.inputqueue = cmd.split("").map(p => p.charCodeAt(0));
                rnr.inputqueue.push(10);
            }
        }
    }
    class Interpreter {
        constructor(prog, input) {
            this.is_halted = false;
            this.last_io_success = true;
            this.program = new InfMem(prog);
            this.inputqueue = input;
            this.instructionpointer = 0;
            this.output = [];
            this.relative_base = 0;
            this.blocking_io = true;
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
                if (this.inputqueue.length == 0) {
                    if (this.blocking_io)
                        return StepResult.WAITING_FOR_IN;
                    cmd.setParameter(this, 0, -1);
                    this.incInstrPtr(cmd);
                    this.last_io_success = false;
                    return StepResult.EXECUTED;
                }
                const pv = this.inputqueue[0];
                cmd.setParameter(this, 0, pv);
                this.inputqueue = this.inputqueue.slice(1);
                this.incInstrPtr(cmd);
                this.last_io_success = true;
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
})(AdventOfCode2019_25_1 || (AdventOfCode2019_25_1 = {}));
