"use strict";
var AdventOfCode2019_16_2;
(function (AdventOfCode2019_16_2) {
    const DAY = 16;
    const PROBLEM = 2;
    async function run() {
        let input = await AdventOfCode.getInput(DAY);
        if (input == null)
            return;
        const message = input.trim().split("").map(p => parseInt(p));
        let offset = parseInt(message.slice(0, 7).map(p => p.toString()).reduce((a, b) => a + b));
        let off_offset = Math.floor(offset / message.length) * message.length;
        let step = [];
        for (let i = off_offset / message.length; i < 10000; i++)
            for (const d of message)
                step.push(d);
        step = step.slice(offset - off_offset);
        for (let i = 0; i < 100; i++) {
            step = StupidBigFFT(step);
            AdventOfCode.outputConsole(`[${i}] ` + step.slice(0, 8).map(p => p.toString()).reduce((a, b) => a + b));
            await AdventOfCode.sleepIfConsole(0);
        }
        AdventOfCode.output(DAY, PROBLEM, step.slice(0, 8).map(p => p.toString()).reduce((a, b) => a + b));
    }
    AdventOfCode2019_16_2.run = run;
    function StupidBigFFT(msg) {
        let result = new Array(msg.length);
        let sum = 0;
        for (let i = msg.length - 1; i >= 0; i--) {
            sum = (sum + msg[i]) % 10;
            result[i] = sum;
        }
        return result;
    }
})(AdventOfCode2019_16_2 || (AdventOfCode2019_16_2 = {}));
