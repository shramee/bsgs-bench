import { BitSize } from "@/pages/Bench";

export interface BSGSLibrary {
	name: string;
	supportedBits: number[];
	compute(number: string, bitSize: BitSize): Promise<string>;
}

// Example libraries array - you can extend this with your actual WASM libraries
export const libraries: BSGSLibrary[] = [
	// ...BabyJub_Utils,
	// Add your actual WASM libraries here
];
