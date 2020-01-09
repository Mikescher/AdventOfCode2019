"use strict";
var AdventOfCode2019_06_2;
(function (AdventOfCode2019_06_2) {
    const DAY = 6;
    const PROBLEM = 2;
    class Body {
        constructor(n) {
            this.children = [];
            this.parent = null;
            this.name = n;
        }
    }
    class StellarSystem {
        constructor() {
            this.bodies = {};
            this.com = new Body("COM");
            this.bodies["COM"] = this.com;
        }
        getOrCreate(name) {
            if (name in this.bodies)
                return this.bodies[name];
            return this.bodies[name] = new Body(name);
        }
        add(mastername, slavename) {
            const master = this.getOrCreate(mastername);
            const slave = this.getOrCreate(slavename);
            if (slave.parent !== null)
                throw "slave already has master";
            slave.parent = master;
            master.children.push(slave);
        }
        getChecksum() {
            return this.calcChecksum(this.com, 0);
        }
        calcChecksum(master, depth) {
            let r = depth;
            for (const body of master.children) {
                r += this.calcChecksum(body, depth + 1);
            }
            return r;
        }
        getTransferDistance(ba, bb) {
            let dist = {};
            // From [BA] upwards
            {
                let obj = this.bodies[ba].parent;
                let dctr = 0;
                while (obj !== null) {
                    dist[obj.name] = dctr;
                    dctr++;
                    obj = obj.parent;
                }
            }
            // From [BB] upwards
            {
                let obj = this.bodies[bb].parent;
                let dctr = 0;
                while (obj !== null) {
                    if (obj.name in dist)
                        return dctr + dist[obj.name];
                    dctr++;
                    obj = obj.parent;
                }
            }
            return -1; // no path;
        }
    }
    async function run() {
        let input = await AdventOfCode.getInput(DAY);
        if (input == null)
            return;
        const data = input
            .split(new RegExp('\r?\n'))
            .filter(p => p.trim().length > 0)
            .map(p => p.split(')'));
        let sys = new StellarSystem();
        for (const dat of data)
            sys.add(dat[0], dat[1]);
        AdventOfCode.output(DAY, PROBLEM, sys.getTransferDistance("YOU", "SAN").toString());
    }
    AdventOfCode2019_06_2.run = run;
})(AdventOfCode2019_06_2 || (AdventOfCode2019_06_2 = {}));
