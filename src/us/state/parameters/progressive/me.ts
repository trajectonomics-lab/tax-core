import { defineState } from "../helpers"
import type { UsStateParameters } from "../types"
/**
 * 2026 Maine individual income tax parameters.
 *
 * @statute Me. Rev. Stat. tit. 36, § 5111
 */
export const US_2026_STATE_ME: UsStateParameters = defineState({
	code: "ME",
	name: "Maine",
	type: "progressive",
	single: [
		[0, 0.058],
		[27_399, 0.0675],
		[64_849, 0.0715],
	],
	mfj: [
		[0, 0.058],
		[54_849, 0.0675],
		[129_749, 0.0715],
	],
	std: [8350, 16700],
	personalExemption: [5300, 10600],
	dependentCredit: 305,
})
