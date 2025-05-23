// import * as bjj from "babyjubjub-utils";
// Benchmark Jat9292 / babyjubjub - utils

import { BitSize } from "@/pages/Bench";
import { BSGSLibrary } from "./libraries";

// Run
const speedHashMap = {
	"bjj8": {
		32: 1330,
		40: 6410
	},
	"bjj4": {
		32: 2523,
		40: 6143,
	},
	"bjj1": {
		32: 8322,
		40: 11923
	}
}

// ### 1 thread
// - 32 bits: 8322ms
// - 40 bits: 11923ms

// ### 4 threads
// - 32 bits: 2523ms
// - 40 bits: 6143ms

// ### 8 threads
// - 32 bits: 1330ms
// - 40 bits: 6410ms

export const Jat9292BbjBsGsResults = {
	"Jat9292/bjj/1": {
		"32": speedHashMap.bjj1[32],
		"40": speedHashMap.bjj1[40],
		"library": "Jat9292/babyjubjub",
		"threads": 1,
	},
	"Jat9292/bjj/4": {
		"32": speedHashMap.bjj4[32],
		"40": speedHashMap.bjj4[40],
		"library": "Jat9292/babyjubjub",
		"threads": 4,
	},
	"Jat9292/bjj/8": {
		"32": speedHashMap.bjj8[32],
		"40": speedHashMap.bjj8[40],
		"library": "Jat9292/babyjubjub",
		"threads": 8,
	},
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