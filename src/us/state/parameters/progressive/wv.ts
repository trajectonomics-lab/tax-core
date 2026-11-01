import { defineState } from "../helpers"
import type { UsStateParameters } from "../types"
/**
 * 2026 West Virginia individual income tax parameters.
 *
 * @statute W. Va. Code § 11-21-4
 */
export const US_2026_STATE_WV: UsStateParameters = defineState({
	code: "WV",
	name: "West Virginia",
	type: "progressive",
	single: [
		[0, 0.0222],
		[10_000, 0.0296],
		[25_000, 0.0333],
		[40_000, 0.0444],
		[60_000, 0.0482],
	],
	mfj: [
		[0, 0.0222],
		[10_000, 0.0296],
		[25_000, 0.0333],
		[40_000, 0.0444],
		[60_000, 0.0482],
	],
	std: [0, 0],
	personalExemption: [2000, 4000],
	dependentExemption: 2_000,
})
