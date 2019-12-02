
namespace AdventOfCode
{
	export function output(day: number, problem: number, txt: string)
	{
		let elem = document.querySelector(`#day${day.toString().padStart(2, "0")} .solution_${problem}`) as HTMLDivElement;
		elem.innerHTML = txt;
	}

	export function getInput(num: number)
	{
		return new Promise<string>((resolve, reject) => 
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
			let elem = document.querySelector(`#day${day.toString().padStart(2, "0")} .challenge_${problem}`) as HTMLDivElement;
			if (elem != null)
			{
				elem.onclick = () => 
				{
					let ref = `AdventOfCode2019_${day.toString().padStart(2, "0")}_${problem}`;
					 window[ref].run();
				};
				//console.log(`Registered click handler for ${day}:${problem}`)
			}
		}
	}
};