import { defineState } from "../helpers"
import type { UsStateParameters } from "../types"
/**
 * 2026 Arkansas individual income tax parameters.
 *
 * @statute Ark. Code Ann. § 26-51-201
 */
export const US_2026_STATE_AR: UsStateParameters = defineState({
	code: "AR",
	name: "Arkansas",
	type: "progressive",
	single: [
		[0, 0.02],
		[4_600, 0.039],
	],
	mfj: [
		[0, 0.02],
		[4_600, 0.039],
	],
	std: [2470, 4940],
	personalCredit: [29, 58],
	dependentCredit: 29,
})
