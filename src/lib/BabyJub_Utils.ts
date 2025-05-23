// import * as bjj from "babyjubjub-utils";
// Benchmark Jat9292 / babyjubjub - utils

import { BitSize } from "@/pages/Bench";
import { BSGSLibrary } from "./libraries";

// Run
const speedHashMap = {
	"bjj8": {
		32: 2517,
		40: 11193
	},
	"bjj4": {
		32: 4631,
		40: 11155
	},
	"bjj1": {
		32: 15505,
		40: 22063
	}
}
// 32 bits 8 threads: 2517ms
// 40 bits 8 threads: 11193ms
// 32 bits 4 threads: 4631ms
// 40 bits 4 threads: 11155ms
// 32 bits 1 thread: 15505ms
// 40 bits 1 thread: 22063ms

export const Jat9292BbjBsGsResults = {
	"Jat9292/bjj/8": {
		"32": 2518.10000000149,
		"40": 11194,
		"library": "Jat9292/babyjubjub",
		"threads": 8,
	},
	"Jat9292/bjj/4": {
		"32": 4632.099999997765,
		"40": 11155.800000000745,
		"library": "Jat9292/babyjubjub",
		"threads": 4,
	},
	"Jat9292/bjj/1": {
		"32": 15506.800000000745,
		"40": 22065.300000000745,
		"library": "Jat9292/babyjubjub",
		"threads": 1,
	}
}

const BabyJubUtils8Threads: BSGSLibrary = {
	name: "babyjub 8 threads",
	supportedBits: [32, 40],
	async compute(nBitNumber: string, bitsize: BitSize): Promise<string> {
		await new Promise<void>(resolve => setTimeout(resolve, speedHashMap.bjj8[bitsize > 32 ? 40 : 32]));

		// Return a dummy result
		return `0x${nBitNumber}`;
	}
};

const BabyJubUtils4Threads: BSGSLibrary = {
	name: "babyjub 4 threads",
	supportedBits: [32, 40],
	async compute(nBitNumber: string, bitsize: BitSize): Promise<string> {
		await new Promise<void>(resolve => setTimeout(resolve, speedHashMap.bjj4[bitsize > 32 ? 40 : 32]));

		// Return a dummy result
		return `0x${nBitNumber}`;
	}
};

const BabyJubUtils1Threads: BSGSLibrary = {
	name: "babyjub 1 thread",
	supportedBits: [32, 40],
	async compute(nBitNumber: string, bitsize: BitSize): Promise<string> {
		await new Promise<void>(resolve => setTimeout(resolve, speedHashMap.bjj1[bitsize > 32 ? 40 : 32]));

		// Return a dummy result
		return `0x${nBitNumber}`;
	}
};

export default [BabyJubUtils8Threads, BabyJubUtils4Threads, BabyJubUtils1Threads];