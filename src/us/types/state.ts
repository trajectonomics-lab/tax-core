import type { BracketSlice } from "../../core/brackets"
import type { Money } from "../../core/money"

const STATE_CODES = [
	"AL",
	"AK",
	"AZ",
	"AR",
	"CA",
	"CO",
	"CT",
	"DE",
	"DC",
	"FL",
	"GA",
	"HI",
	"ID",
	"IL",
	"IN",
	"IA",
	"KS",
	"KY",
	"LA",
	"ME",
	"MD",
	"MA",
	"MI",
	"MN",
	"MS",
	"MO",
	"MT",
	"NE",
	"NV",
	"NH",
	"NJ",
	"NM",
	"NY",
	"NC",
	"ND",
	"OH",
	"OK",
	"OR",
	"PA",
	"RI",
	"SC",
	"SD",
	"TN",
	"TX",
	"UT",
	"VT",
	"VA",
	"WA",
	"WV",
	"WI",
	"WY",
] as const

/** ISO 3166-2 state code for all 50 US states plus the District of Columbia. */
export type UsStateCode = (typeof STATE_CODES)[number]

/** Read-only runtime registry of every supported US state code. */
export const US_STATE_CODES: readonly UsStateCode[] = STATE_CODES

/** Statutory structure of a state individual income tax schedule. */
export type UsStateTaxType = "none" | "flat" | "progressive"

/** Caller-supplied state non-refundable and refundable credits in major dollars. */
export interface UsStateCreditsInput {
	readonly nonRefundable?: number
	readonly refundable?: number
}

/** Audit trail for state personal, dependent, and caller-supplied credits. */
export interface UsStateCreditsBreakdown {
	readonly personal: Money<"USD">
	readonly dependent: Money<"USD">
	readonly claimedNonRefundable: Money<"USD">
	readonly allowedNonRefundable: Money<"USD">
	readonly refundable: Money<"USD">
}

/** Detailed audit trail for a state individual income tax calculation. */
export interface UsStateBreakdown {
	readonly code: UsStateCode
	readonly name: string
	readonly type: UsStateTaxType
	readonly agi: Money<"USD">
	readonly standardDeduction: Money<"USD">
	readonly personalExemption: Money<"USD">
	readonly dependentExemption: Money<"USD">
	readonly taxableIncome: Money<"USD">
	readonly slices: readonly BracketSlice[]
	readonly bracketTax: Money<"USD">
	readonly surtax: Money<"USD">
	readonly taxBeforeCredits: Money<"USD">
	readonly credits: UsStateCreditsBreakdown
	readonly totalTax: Money<"USD">
	readonly withholding: Money<"USD">
	readonly netTaxPayable: Money<"USD">
	readonly effectiveRate: number
	readonly marginalRate: number
}
