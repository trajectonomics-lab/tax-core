import { defineState } from "../helpers"
import type { UsStateParameters } from "../types"
/**
 * 2026 Missouri individual income tax parameters.
 *
 * @statute Mo. Rev. Stat. § 143.011
 */
export const US_2026_STATE_MO: UsStateParameters = defineState({
	code: "MO",
	name: "Missouri",
	type: "progressive",
	single: [
		[1_348, 0.02],
		[2_696, 0.025],
		[4_044, 0.03],
		[5_392, 0.035],
		[6_740, 0.04],
		[8_088, 0.045],
		[9_436, 0.047],
	],
	mfj: [
		[1_348, 0.02],
		[2_696, 0.025],
		[4_044, 0.03],
		[5_392, 0.035],
		[6_740, 0.04],
		[8_088, 0.045],
		[9_436, 0.047],
	],
	std: [16100, 32200],
})
