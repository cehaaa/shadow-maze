export class Utility {
	static shuffle(array: any[]) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}
	static getRandomCoordinate(
		width: number,
		height: number
	): { x: number; y: number } {
		const x = Math.floor(Math.random() * width);
		const y = Math.floor(Math.random() * height);
		return { x, y };
	}
}
