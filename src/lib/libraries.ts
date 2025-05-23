import { BitSize } from "@/pages/Bench";
import { ShrameeBsGsV1, ShrameeBsGsBlaze, ShrameeBsGsResults } from "./ShrameeBsGsV1";
import { Jat9292BbjBsGsResults } from "./BabyJub_Utils";

export interface BSGSLibrary {
	name: string;
	supportedBits: number[];
	compute(number: bigint, bitSize: BitSize): Promise<bigint>;
}

// Example libraries array - you can extend this with your actual WASM libraries
export const libraries: BSGSLibrary[] = [
	ShrameeBsGsV1,
	ShrameeBsGsBlaze,
	// Add your actual WASM libraries here
];

export const libResults = {
	...Jat9292BbjBsGsResults,
	...ShrameeBsGsResults,
};