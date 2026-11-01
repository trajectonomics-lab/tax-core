import { defineState } from "../helpers"
import type { UsStateParameters } from "../types"
/**
 * 2026 South Carolina individual income tax parameters.
 *
 * @statute S.C. Code Ann. § 12-6-510
 */
export const US_2026_STATE_SC: UsStateParameters = defineState({
	code: "SC",
	name: "South Carolina",
	type: "progressive",
	single: [
		[0, 0],
		[3_640, 0.03],
		[18_230, 0.06],
	],
	mfj: [
		[0, 0],
		[3_640, 0.03],
		[18_230, 0.06],
	],
	std: [8350, 16700],
	dependentExemption: 4_930,
})
