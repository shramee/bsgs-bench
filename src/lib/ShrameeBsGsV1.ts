import * as bb from "baby-giant-wasm";
import { BSGSLibrary } from "./libraries";

export const ShrameeBsGsV1Results = {
	"shramee/GrumpkinBsGs V1": {
		"32": 457.5,
		"40": 8376,
		"library": "shramee/GrumpkinBsGs V1"
	},
}

export const ShrameeBsGsV1: BSGSLibrary = {
	name: "shramee/GrumpkinBsGs V1",
	supportedBits: [32, 40],
	// async setup() { },
	async compute(nBitNumber: bigint, bitSize: BitSize): Promise<bigint> {
		const n = BigInt(nBitNumber);
		const [x, y] = bb.grumpkin_point(n.toString()).split("|");

		if (bitSize > 32) {
			return bb.grumpkin_bsgs_str_40(x, y);
		} else {
			// 32 bits
			return bb.grumpkin_bsgs_str(x, y);
		}
	}
};
