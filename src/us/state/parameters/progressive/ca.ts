import { defineState } from "../helpers"
import type { UsStateParameters } from "../types"
/**
 * 2026 California individual income tax parameters.
 *
 * 1% mental health services surtax above $1,000,000.
 *
 * @statute Cal. Rev. & Tax. Code § 17041
 */
export const US_2026_STATE_CA: UsStateParameters = defineState({
	code: "CA",
	name: "California",
	type: "progressive",
	single: [
		[0, 0.01],
		[11_079, 0.02],
		[26_264, 0.04],
		[41_452, 0.06],
		[57_542, 0.08],
		[72_724, 0.093],
		[371_479, 0.103],
		[445_771, 0.113],
		[742_953, 0.123],
	],
	mfj: [
		[0, 0.01],
		[22_158, 0.02],
		[52_528, 0.04],
		[82_904, 0.06],
		[115_084, 0.08],
		[145_448, 0.093],
		[742_958, 0.103],
		[891_542, 0.113],
		[1_485_906, 0.123],
	],
	hoh: [
		[0, 0.01],
		[22_173, 0.02],
		[52_530, 0.04],
		[67_716, 0.06],
		[83_805, 0.08],
		[98_990, 0.093],
		[505_208, 0.103],
		[606_251, 0.113],
		[1_010_417, 0.123],
	],
	std: [5540, 11080, 11080],
	personalCredit: [153, 306],
	dependentCredit: 153,
	surtax: { threshold: 1_000_000, rate: 0.01 },
})
