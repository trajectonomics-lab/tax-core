import { defineState } from "../helpers"
import type { UsStateParameters } from "../types"

/**
 * 2026 Arizona individual income tax parameters.
 *
 * Pre-OBBBA federal standard deduction; $100 dependent credit.
 *
 * @statute Ariz. Rev. Stat. § 43-1011
 */
const ARIZONA: UsStateParameters = defineState({
	code: "AZ",
	name: "Arizona",
	type: "flat",
	single: [[0, 0.025]],
	mfj: [[0, 0.025]],
	std: [8350, 16700],
	dependentCredit: 100,
})

/**
 * 2026 Colorado individual income tax parameters.
 *
 * @statute Colo. Rev. Stat. § 39-22-104
 */
const COLORADO: UsStateParameters = defineState({
	code: "CO",
	name: "Colorado",
	type: "flat",
	single: [[0, 0.044]],
	mfj: [[0, 0.044]],
	std: [16100, 32200],
})

/**
 * 2026 Georgia individual income tax parameters.
 *
 * @statute Ga. Code Ann. § 48-7-20
 */
const GEORGIA: UsStateParameters = defineState({
	code: "GA",
	name: "Georgia",
	type: "flat",
	single: [[0, 0.0519]],
	mfj: [[0, 0.0519]],
	std: [12000, 24000],
	dependentExemption: 4_000,
})

/**
 * 2026 Idaho individual income tax parameters.
 *
 * Zero-rate bracket below the statutory threshold.
 *
 * @statute Idaho Code § 63-3024
 */
const IDAHO: UsStateParameters = defineState({
	code: "ID",
	name: "Idaho",
	type: "flat",
	single: [[4_811, 0.053]],
	mfj: [[9_622, 0.053]],
	std: [16100, 32200],
})

/**
 * 2026 Illinois individual income tax parameters.
 *
 * @statute 35 Ill. Comp. Stat. 5/201
 */
const ILLINOIS: UsStateParameters = defineState({
	code: "IL",
	name: "Illinois",
	type: "flat",
	single: [[0, 0.0495]],
	mfj: [[0, 0.0495]],
	std: [0, 0],
	personalExemption: [2925, 5850],
	dependentExemption: 2_925,
})

/**
 * 2026 Indiana individual income tax parameters.
 *
 * @statute Ind. Code § 6-3-2-1
 */
const INDIANA: UsStateParameters = defineState({
	code: "IN",
	name: "Indiana",
	type: "flat",
	single: [[0, 0.0295]],
	mfj: [[0, 0.0295]],
	std: [0, 0],
	personalExemption: [1000, 2000],
	dependentExemption: 1_000,
})

/**
 * 2026 Iowa individual income tax parameters.
 *
 * @statute Iowa Code § 422.5
 */
const IOWA: UsStateParameters = defineState({
	code: "IA",
	name: "Iowa",
	type: "flat",
	single: [[0, 0.038]],
	mfj: [[0, 0.038]],
	std: [16100, 32200],
	personalCredit: [40, 80],
	dependentCredit: 40,
})

const STATES: readonly UsStateParameters[] = [
	ARIZONA,
	COLORADO,
	GEORGIA,
	IDAHO,
	ILLINOIS,
	INDIANA,
	IOWA,
]

/** Statutory parameter table for the 2026 flat-rate states in group A. */
export const FLAT_STATES_A: readonly UsStateParameters[] = STATES
