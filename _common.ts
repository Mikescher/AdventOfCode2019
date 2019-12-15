
namespace AdventOfCode
{
	export class Config
	{
		public static consoleOutputEnabled:   boolean = true;
		public static immediateOutputEnabled: boolean = true;
		public static finalOutputEnabled:     boolean = true;

		public static is_running: boolean = false;
	}

	export function output(day: number, problem: number, txt: string)
	{
		if (!Config.finalOutputEnabled) return;

		let elem = document.querySelector(`#day${day.toString().padStart(2, "0")} .solution_${problem}`) as HTMLDivElement;
		elem.innerHTML = txt;
	}

	export async function outputIntermed(txt: string)
	{
		if (!Config.immediateOutputEnabled) return;

		let elem = document.querySelector(`#intermed_output`) as HTMLDivElement;
		elem.classList.remove("hidden");
		elem.innerText = txt;

		await sleep(0);
	}

	export function outputConsole(txt?: any)
	{
		if (!Config.consoleOutputEnabled) return;

		console.log(txt);
	}

	export async function sleep (n: number)
	{
		await new Promise(resolve => setTimeout(resolve, n));
	}

	export function getInput(num: number)
	{
		return new Promise<string>((resolve, _) => 
		{
			const xhr = new XMLHttpRequest();
			xhr.overrideMimeType("text/plain");
			xhr.open("GET", `${num.toString().padStart(2, "0")}_input.txt`);

			xhr.onload    = evt => { resolve(xhr.responseText); };
			xhr.onerror   = evt => { resolve(""); };
			xhr.ontimeout = evt => { resolve(""); };

			xhr.send();
		});
	}
}
interface Window { [key:string]: any; }

window.onload = () => 
{
	for(let day=1; day <= 25; day++)
	{
		for (let problem=1; problem<=2; problem++)
		{
			let elem = document.querySelector(`#day${day.toString().padStart(2, "0")} .challenge_${problem}`) as HTMLAnchorElement;
			if (elem != null)
			{
				elem.onclick = async () => 
				{
					if (AdventOfCode.Config.is_running) return;

					elem.classList.add("btnOn");
					await AdventOfCode.sleep(50);
					try 
					{
						AdventOfCode.Config.is_running = true;
						let ref = `AdventOfCode2019_${day.toString().padStart(2, "0")}_${problem}`;
						await window[ref].run();
					} 
					finally 
					{
						AdventOfCode.Config.is_running = false;
						elem.classList.remove("btnOn");
					}
				};
				//AdventOfCode.outputConsole(`Registered click handler for ${day}:${problem}`)
			}
		}
	}

	const btnConsole      = document.getElementById(`btnConsole`)      as HTMLDivElement;
	btnConsole.onclick = () => 
	{
		if (btnConsole.classList.contains("btnOn")) {
			btnConsole.classList.remove("btnOn");
			AdventOfCode.Config.consoleOutputEnabled = false;
			console.clear();
		} else {
			btnConsole.classList.add("btnOn");
			AdventOfCode.Config.consoleOutputEnabled = true;
		}
	}
	
	const btnExtraOutput  = document.getElementById(`btnExtraOutput`)  as HTMLDivElement;
	btnExtraOutput.onclick = async () => 
	{
		if (btnExtraOutput.classList.contains("btnOn")) {
			btnExtraOutput.classList.remove("btnOn");
			(document.querySelector(`#intermed_output`) as HTMLDivElement).classList.add("hidden");
			await AdventOfCode.sleep(50);
			AdventOfCode.Config.immediateOutputEnabled = false;
			(document.querySelector(`#intermed_output`) as HTMLDivElement).textContent = "";
			(document.querySelector(`#intermed_output`) as HTMLDivElement).classList.add("hidden");
		} else {
			btnExtraOutput.classList.add("btnOn");
			AdventOfCode.Config.immediateOutputEnabled = true;
		}
	}

	const btnResultOutput = document.getElementById(`btnResultOutput`) as HTMLDivElement;
	btnResultOutput.onclick = () => 
	{
		if (btnResultOutput.classList.contains("btnOn")) {
			btnResultOutput.classList.remove("btnOn");
			AdventOfCode.Config.finalOutputEnabled = false;

			document.querySelectorAll(".span_solution").forEach((p, k, _) => (p as HTMLDivElement).textContent = "");
		} else {
			btnResultOutput.classList.add("btnOn");
			AdventOfCode.Config.finalOutputEnabled = true;
		}
	}

};