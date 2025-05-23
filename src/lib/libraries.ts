import { BitSize } from "@/pages/Bench";
import { ShrameeBsGsV1, ShrameeBsGsV1Results } from "./ShrameeBsGsV1";
import { Jat9292BbjBsGsResults } from "./BabyJub_Utils";

export interface BSGSLibrary {
	name: string;
	supportedBits: number[];
	compute(number: bigint, bitSize: BitSize): Promise<bigint>;
}

// Example libraries array - you can extend this with your actual WASM libraries
export const libraries: BSGSLibrary[] = [
	ShrameeBsGsV1,
	// Add your actual WASM libraries here
];

export const libResults = {
	...Jat9292BbjBsGsResults,
	...ShrameeBsGsV1Results,
};