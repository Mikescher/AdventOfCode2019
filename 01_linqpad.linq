<Query Kind="Program" />

void Main()
{
	// 1
	
	File
		.ReadAllLines(@"F:\Home\Cloud\Programming\Typescript\AdventOfCode2019\01_input.txt")
		.Select(int.Parse)
		.Select(p => p/3 - 2)
		.Aggregate((a,b) => a+b)
		.Dump();


	// 2

	File
		.ReadAllLines(@"F:\Home\Cloud\Programming\Typescript\AdventOfCode2019\01_input.txt")
		.Select(int.Parse)
		.Select(mass =>
		{
			var fuel = mass / 3 - 2;
			var lastfuel = fuel;
			for (; ; )
			{
				int newfuel = lastfuel / 3 - 2;
				if (newfuel <= 0) break;
				fuel += newfuel;
				lastfuel = newfuel;
			}
			return fuel;
		})
		.Aggregate((a, b) => a + b)
		.Dump();
}

// Define other methods, classes and namespaces here
