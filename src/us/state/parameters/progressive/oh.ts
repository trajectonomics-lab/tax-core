import { defineState } from "../helpers"
import type { UsStateParameters } from "../types"
/**
 * 2026 Ohio individual income tax parameters.
 *
 * @statute Ohio Rev. Code § 5747.02
 */
export const US_2026_STATE_OH: UsStateParameters = defineState({
	code: "OH",
	name: "Ohio",
	type: "progressive",
	single: [[26_050, 0.0275]],
	mfj: [[26_050, 0.0275]],
	std: [0, 0],
	personalExemption: [2400, 4800],
	dependentExemption: 2_400,
})
