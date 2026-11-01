import { defineState } from "../helpers"
import type { UsStateParameters } from "../types"
/**
 * 2026 Louisiana individual income tax parameters.
 *
 * 2025 Act 1 flattened the schedule to a single 3% tier.
 *
 * @statute La. Stat. Ann. § 47:32
 */
export const US_2026_STATE_LA: UsStateParameters = defineState({
	code: "LA",
	name: "Louisiana",
	type: "progressive",
	single: [[0, 0.03]],
	mfj: [[0, 0.03]],
	std: [12875, 25750],
})
