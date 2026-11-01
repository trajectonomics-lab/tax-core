import { defineState } from "./helpers"
import type { UsStateParameters } from "./types"

const ALASKA: UsStateParameters = defineState({
	code: "AK",
	name: "Alaska",
	type: "none",
	single: [[0, 0]],
	mfj: [[0, 0]],
	std: [0, 0],
})

const FLORIDA: UsStateParameters = defineState({
	code: "FL",
	name: "Florida",
	type: "none",
	single: [[0, 0]],
	mfj: [[0, 0]],
	std: [0, 0],
})

const NEVADA: UsStateParameters = defineState({
	code: "NV",
	name: "Nevada",
	type: "none",
	single: [[0, 0]],
	mfj: [[0, 0]],
	std: [0, 0],
})

const NEW_HAMPSHIRE: UsStateParameters = defineState({
	code: "NH",
	name: "New Hampshire",
	type: "none",
	single: [[0, 0]],
	mfj: [[0, 0]],
	std: [0, 0],
})

const SOUTH_DAKOTA: UsStateParameters = defineState({
	code: "SD",
	name: "South Dakota",
	type: "none",
	single: [[0, 0]],
	mfj: [[0, 0]],
	std: [0, 0],
})

const TENNESSEE: UsStateParameters = defineState({
	code: "TN",
	name: "Tennessee",
	type: "none",
	single: [[0, 0]],
	mfj: [[0, 0]],
	std: [0, 0],
})

const TEXAS: UsStateParameters = defineState({
	code: "TX",
	name: "Texas",
	type: "none",
	single: [[0, 0]],
	mfj: [[0, 0]],
	std: [0, 0],
})

const WASHINGTON: UsStateParameters = defineState({
	code: "WA",
	name: "Washington",
	type: "none",
	single: [[0, 0]],
	mfj: [[0, 0]],
	std: [0, 0],
})

const WYOMING: UsStateParameters = defineState({
	code: "WY",
	name: "Wyoming",
	type: "none",
	single: [[0, 0]],
	mfj: [[0, 0]],
	std: [0, 0],
})

const STATES: readonly UsStateParameters[] = [
	ALASKA,
	FLORIDA,
	NEVADA,
	NEW_HAMPSHIRE,
	SOUTH_DAKOTA,
	TENNESSEE,
	TEXAS,
	WASHINGTON,
	WYOMING,
]

/**
 * Statutory parameter table for the nine states with no 2026 wage income tax.
 *
 * @statute State constitutions and statutes repealing or prohibiting an individual income tax.
 */
export const NO_TAX_STATES: readonly UsStateParameters[] = STATES
