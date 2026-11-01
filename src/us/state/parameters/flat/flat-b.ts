import { defineState } from "../helpers"
import type { UsStateParameters } from "../types"

/**
 * 2026 Kentucky individual income tax parameters.
 *
 * @statute Ky. Rev. Stat. § 141.020
 */
const KENTUCKY: UsStateParameters = defineState({
	code: "KY",
	name: "Kentucky",
	type: "flat",
	single: [[0, 0.035]],
	mfj: [[0, 0.035]],
	std: [3360, 3360, 3360],
})

/**
 * 2026 Massachusetts individual income tax parameters.
 *
 * 4% millionaire surtax on taxable income above $1,083,150.
 *
 * @statute Mass. Gen. Laws ch. 62, § 4
 */
const MASSACHUSETTS: UsStateParameters = defineState({
	code: "MA",
	name: "Massachusetts",
	type: "flat",
	single: [[0, 0.05]],
	mfj: [[0, 0.05]],
	std: [0, 0],
	personalExemption: [4400, 8800, 6_800],
	dependentExemption: 1_000,
	surtax: { threshold: 1_083_150, rate: 0.04 },
})

/**
 * 2026 Michigan individual income tax parameters.
 *
 * @statute Mich. Comp. Laws § 206.51
 */
const MICHIGAN: UsStateParameters = defineState({
	code: "MI",
	name: "Michigan",
	type: "flat",
	single: [[0, 0.0425]],
	mfj: [[0, 0.0425]],
	std: [0, 0],
	personalExemption: [5900, 11800],
	dependentExemption: 5_900,
})

/**
 * 2026 Mississippi individual income tax parameters.
 *
 * Zero-rate bracket below $10,000.
 *
 * @statute Miss. Code Ann. § 27-7-5
 */
const MISSISSIPPI: UsStateParameters = defineState({
	code: "MS",
	name: "Mississippi",
	type: "flat",
	single: [[10_000, 0.04]],
	mfj: [[10_000, 0.04]],
	std: [2300, 4600],
	personalExemption: [6000, 12000],
	dependentExemption: 1_500,
})

/**
 * 2026 North Carolina individual income tax parameters.
 *
 * @statute N.C. Gen. Stat. § 105-153.7
 */
const NORTH_CAROLINA: UsStateParameters = defineState({
	code: "NC",
	name: "North Carolina",
	type: "flat",
	single: [[0, 0.0399]],
	mfj: [[0, 0.0399]],
	std: [12750, 25500],
})

/**
 * 2026 Pennsylvania individual income tax parameters.
 *
 * @statute 72 Pa. Cons. Stat. § 7302
 */
const PENNSYLVANIA: UsStateParameters = defineState({
	code: "PA",
	name: "Pennsylvania",
	type: "flat",
	single: [[0, 0.0307]],
	mfj: [[0, 0.0307]],
	std: [0, 0],
})

/**
 * 2026 Utah individual income tax parameters.
 *
 * Utah starts from federal taxable income; the 6% federal standard-deduction credit is modeled as a non-refundable credit.
 *
 * @statute Utah Code § 59-10-104
 */
const UTAH: UsStateParameters = defineState({
	code: "UT",
	name: "Utah",
	type: "flat",
	single: [[0, 0.045]],
	mfj: [[0, 0.045]],
	std: [16100, 32200],
	personalCredit: [966, 1932],
	dependentExemption: 2_111,
})

const STATES: readonly UsStateParameters[] = [
	KENTUCKY,
	MASSACHUSETTS,
	MICHIGAN,
	MISSISSIPPI,
	NORTH_CAROLINA,
	PENNSYLVANIA,
	UTAH,
]

/** Statutory parameter table for the 2026 flat-rate states in group B. */
export const FLAT_STATES_B: readonly UsStateParameters[] = STATES
