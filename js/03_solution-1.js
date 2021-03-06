"use strict";
var AdventOfCode2019_03_1;
(function (AdventOfCode2019_03_1) {
    const DAY = 3;
    const PROBLEM = 1;
    class Mov {
        constructor(v) { this.dir = v[0]; this.len = parseInt(v.substr(1)); }
    }
    class Pos {
        constructor(x, y) { this.x = x; this.y = y; }
        manhatten() {
            return Math.abs(this.x) + Math.abs(this.y);
        }
        ident() { return this.x * 10000 + this.y; }
        static manhattenCompare(a, b) {
            const aa = a.manhatten();
            const bb = b.manhatten();
            if (aa > bb)
                return +1;
            if (aa < bb)
                return -1;
            return 0;
        }
    }
    function getPath(movs) {
        let r = [];
        let x = 0;
        let y = 0;
        for (let mov of movs) {
            for (let i = 0; i < mov.len; i++) {
                if (mov.dir == "U")
                    y++;
                if (mov.dir == "R")
                    x++;
                if (mov.dir == "D")
                    y--;
                if (mov.dir == "L")
                    x--;
                r.push(new Pos(x, y));
            }
        }
        return r;
    }
    async function run() {
        let input = await AdventOfCode.getInput(DAY);
        if (input == null)
            return;
        const xin = input
            .split(new RegExp('\r?\n'))
            .filter(p => p.trim().length > 0)
            .map(p => p.split(",").map(q => new Mov(q)))
            .map(p => getPath(p));
        const path1 = xin[0];
        const path2 = xin[1];
        let intersections = [];
        let p1hash = {};
        for (let p1 of path1)
            p1hash[p1.ident()] = p1;
        for (let p2 of path2) {
            if (p2.ident() in p1hash)
                intersections.push(p2);
        }
        intersections.sort((a, b) => Pos.manhattenCompare(a, b));
        AdventOfCode.output(DAY, PROBLEM, intersections[0].manhatten().toString());
    }
    AdventOfCode2019_03_1.run = run;
})(AdventOfCode2019_03_1 || (AdventOfCode2019_03_1 = {}));
