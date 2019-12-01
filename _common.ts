
namespace AdventOfCode
{
	export function output(day: number, problem: number, txt: string)
	{
		let elem = document.querySelector(`#day${day.toString().padStart(2, "0")} .solution_${problem}`) as HTMLDivElement;
		elem.innerHTML = txt;
	}

	export function getInput(num: number)
	{
		return new Promise<string|null>((resolve, reject) => 
		{
			const xhr = new XMLHttpRequest();
			xhr.overrideMimeType("text/plain");
			xhr.open("GET", `${num.toString().padStart(2, "0")}_input.txt`);

			xhr.onload    = evt => { resolve(xhr.responseText); };
			xhr.onerror   = evt => { resolve(null); };
			xhr.ontimeout = evt => { resolve(null); };

			xhr.send();
		});
	}
}