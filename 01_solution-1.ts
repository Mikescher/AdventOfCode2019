function run_1_1() { AdventOfCode2019_01_1.run(); }

namespace AdventOfCode2019_01_1
{
	const DAY     = 1;
	const PROBLEM = 1;

	export async function run()
	{
		let input = await getInput(DAY);
		if (input == null) return;

		const fuel = input
			.split(new RegExp('\r?\n'))
			.filter(p => p.trim().length > 0)
			.map(p => parseInt(p))
			.map(p => Math.floor(p/3) - 2)
			.reduce((a,b) => a+b);

		output(DAY, PROBLEM, fuel.toString());
	}
	
	function output(day: number, problem: number, txt: string)
	{
		let elem = document.querySelector(`#day${day.toString().padStart(2, "0")} .solution_${problem}`) as HTMLDivElement;
		elem.innerHTML = txt;
	}

	function getInput(num: number)
	{
		return new Promise<string|null>((resolve, reject) => 
		{
			const xhr = new XMLHttpRequest();
			xhr.open("GET", `${num.toString().padStart(2, "0")}_input.txt`);

			xhr.onload    = evt => { resolve(xhr.responseText); };
			xhr.onerror   = evt => { resolve(null); };
			xhr.ontimeout = evt => { resolve(null); };

			xhr.send();
		});
	}
}
