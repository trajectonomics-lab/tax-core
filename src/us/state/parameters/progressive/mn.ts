import { defineState } from "../helpers"
import type { UsStateParameters } from "../types"
/**
 * 2026 Minnesota individual income tax parameters.
 *
 * @statute Minn. Stat. § 290.06
 */
export const US_2026_STATE_MN: UsStateParameters = defineState({
	code: "MN",
	name: "Minnesota",
	type: "progressive",
	single: [
		[0, 0.0535],
		[33_310, 0.068],
		[109_430, 0.0785],
		[203_150, 0.0985],
	],
	mfj: [
		[0, 0.0535],
		[48_700, 0.068],
		[193_480, 0.0785],
		[337_930, 0.0985],
	],
	hoh: [
		[0, 0.0535],
		[41_060, 0.068],
		[164_400, 0.0785],
		[271_600, 0.0985],
	],
	std: [15300, 30600, 22950],
	dependentExemption: 5_300,
})
