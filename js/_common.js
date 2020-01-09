"use strict";
var AdventOfCode;
(function (AdventOfCode) {
    class Config {
    }
    Config.consoleOutputEnabled = true;
    Config.immediateOutputEnabled = true;
    Config.finalOutputEnabled = true;
    Config.lastInputIsEnter = false;
    Config.is_running = false;
    AdventOfCode.Config = Config;
    function isLastInputEnter() { return Config.lastInputIsEnter; }
    AdventOfCode.isLastInputEnter = isLastInputEnter;
    function getAndClearInput() {
        const inputElement = document.getElementById(`directinput`);
        let v = inputElement.value;
        inputElement.value = "";
        Config.lastInputIsEnter = false;
        return v;
    }
    AdventOfCode.getAndClearInput = getAndClearInput;
    function output(day, problem, txt) {
        if (!Config.finalOutputEnabled)
            return;
        let elem = document.querySelector(`#day${day.toString().padStart(2, "0")} .solution_${problem}`);
        elem.innerHTML = txt;
    }
    AdventOfCode.output = output;
    async function outputIntermed(txt) {
        if (!Config.immediateOutputEnabled)
            return;
        let elem2 = document.querySelector(`#additional`);
        elem2.classList.remove("hidden");
        let elem = document.querySelector(`#intermed_output`);
        elem.innerText = txt;
        await sleep(0);
    }
    AdventOfCode.outputIntermed = outputIntermed;
    async function clearIntermed() {
        let elem2 = document.querySelector(`#additional`);
        elem2.classList.add("hidden");
        let elem = document.querySelector(`#intermed_output`);
        elem.innerText = "";
        elem.setAttribute("style", ""); // reset to default
        await sleep(0);
    }
    AdventOfCode.clearIntermed = clearIntermed;
    function setIntermedOutputSize(fontsize) {
        let elem = document.querySelector(`#intermed_output`);
        elem.setAttribute("style", "font-size: " + fontsize);
    }
    AdventOfCode.setIntermedOutputSize = setIntermedOutputSize;
    function showIntermedInput(displ) {
        let elem = document.querySelector(`#directinput`);
        if (displ)
            elem.classList.remove("hidden");
        else
            elem.classList.add("hidden");
    }
    AdventOfCode.showIntermedInput = showIntermedInput;
    function outputConsole(txt) {
        if (!Config.consoleOutputEnabled)
            return;
        console.log(txt);
    }
    AdventOfCode.outputConsole = outputConsole;
    async function sleep(n) {
        await new Promise(resolve => setTimeout(resolve, n));
    }
    AdventOfCode.sleep = sleep;
    async function sleepIfIntermed(n) {
        if (!Config.immediateOutputEnabled)
            return;
        await new Promise(resolve => setTimeout(resolve, n));
    }
    AdventOfCode.sleepIfIntermed = sleepIfIntermed;
    async function sleepIfConsole(n) {
        if (!Config.consoleOutputEnabled)
            return;
        await new Promise(resolve => setTimeout(resolve, n));
    }
    AdventOfCode.sleepIfConsole = sleepIfConsole;
    function getInput(num) {
        return new Promise((resolve, _) => {
            const xhr = new XMLHttpRequest();
            xhr.overrideMimeType("text/plain");
            xhr.open("GET", `${num.toString().padStart(2, "0")}_input.txt`);
            xhr.onload = evt => { resolve(xhr.responseText); };
            xhr.onerror = evt => { resolve(""); };
            xhr.ontimeout = evt => { resolve(""); };
            xhr.send();
        });
    }
    AdventOfCode.getInput = getInput;
})(AdventOfCode || (AdventOfCode = {}));
window.onload = () => {
    for (let day = 1; day <= 25; day++) {
        for (let problem = 1; problem <= 2; problem++) {
            let elem = document.querySelector(`#day${day.toString().padStart(2, "0")} .challenge_${problem}`);
            if (elem != null) {
                elem.onclick = async () => {
                    if (AdventOfCode.Config.is_running)
                        return;
                    elem.classList.add("btnOn");
                    await AdventOfCode.sleep(50);
                    try {
                        await AdventOfCode.clearIntermed();
                        await AdventOfCode.showIntermedInput(false);
                        AdventOfCode.Config.is_running = true;
                        let ref = `AdventOfCode2019_${day.toString().padStart(2, "0")}_${problem}`;
                        await window[ref].run();
                    }
                    finally {
                        AdventOfCode.Config.is_running = false;
                        elem.classList.remove("btnOn");
                    }
                };
                //AdventOfCode.outputConsole(`Registered click handler for ${day}:${problem}`)
            }
        }
    }
    const btnConsole = document.getElementById(`btnConsole`);
    btnConsole.onclick = () => {
        if (btnConsole.classList.contains("btnOn")) {
            btnConsole.classList.remove("btnOn");
            AdventOfCode.Config.consoleOutputEnabled = false;
            console.clear();
        }
        else {
            btnConsole.classList.add("btnOn");
            AdventOfCode.Config.consoleOutputEnabled = true;
        }
    };
    const btnExtraOutput = document.getElementById(`btnExtraOutput`);
    btnExtraOutput.onclick = async () => {
        if (btnExtraOutput.classList.contains("btnOn")) {
            btnExtraOutput.classList.remove("btnOn");
            document.querySelector(`#intermed_output`).classList.add("hidden");
            await AdventOfCode.sleep(50);
            AdventOfCode.Config.immediateOutputEnabled = false;
            document.querySelector(`#intermed_output`).textContent = "";
            document.querySelector(`#intermed_output`).classList.add("hidden");
        }
        else {
            btnExtraOutput.classList.add("btnOn");
            AdventOfCode.Config.immediateOutputEnabled = true;
        }
    };
    const btnResultOutput = document.getElementById(`btnResultOutput`);
    btnResultOutput.onclick = () => {
        if (btnResultOutput.classList.contains("btnOn")) {
            btnResultOutput.classList.remove("btnOn");
            AdventOfCode.Config.finalOutputEnabled = false;
            document.querySelectorAll(".span_solution").forEach((p, k, _) => p.textContent = "");
        }
        else {
            btnResultOutput.classList.add("btnOn");
            AdventOfCode.Config.finalOutputEnabled = true;
        }
    };
    const inputElement = document.getElementById(`directinput`);
    inputElement.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            AdventOfCode.Config.lastInputIsEnter = true;
        }
        else {
            AdventOfCode.Config.lastInputIsEnter = false;
        }
    });
};
