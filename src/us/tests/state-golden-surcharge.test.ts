import { describe, expect, it } from "bun:test"
import { calculateUsTax } from "../index"
import type { UsFilingStatus } from "../types"

/**
 * Hand-computed Maine examples for the 2% surcharge of 36 M.R.S. § 5111(7), whose threshold
 * depends on filing status ($1,000,000 single, $1,500,000 joint or head of household, half of
 * the joint amount when married filing separately). Each bracket slice and the surcharge are
 * rounded half-up to the cent, as the engine does. All incomes are far above the standard
 * deduction phase-out, so only the $5,300 / $10,600 personal exemption applies.
 */
interface SurchargeExample {
	readonly filingStatus: UsFilingStatus
	readonly wages: number
	readonly expectedTax: number
	readonly label: string
}

const EXAMPLES: readonly SurchargeExample[] = [
	{
		// Taxable 1,194,700: 1,589.20 + 2,527.875 + 1,129,850 x 7.15% = 84,901.35,
		// plus 2% x (1,194,700 - 1,000,000) = 3,894.00.
		filingStatus: "single",
		wages: 1_200_000,
		expectedTax: 88_795.36,
		label: "single above the $1,000,000 threshold",
	},
	{
		// Taxable 1,389,410 is above the single threshold but below the joint $1,500,000:
		// 3,181.30 + 5,055.75 + 1,259,660 x 7.15% = 98,302.74, no surcharge.
		filingStatus: "married_filing_jointly",
		wages: 1_400_010,
		expectedTax: 98_302.74,
		label: "joint below the $1,500,000 threshold",
	},
	{
		// Taxable 1,594,700 on the single schedule: 1,589.20 + 2,527.875
		// + 1,529,850 x 7.15% = 113,501.35, plus 2% x (1,594,700 - 750,000) = 16,894.00.
		filingStatus: "married_filing_separately",
		wages: 1_600_000,
		expectedTax: 130_395.36,
		label: "separate above half of the joint threshold",
	},
]

describe("Maine income tax surcharge by filing status", () => {
	for (const example of EXAMPLES) {
		it(`matches the hand-computed ${example.label}`, () => {
			const result = calculateUsTax({
				filingStatus: example.filingStatus,
				income: { w2Wages: example.wages },
				includeFica: false,
				state: "ME",
			})
			expect(result.breakdown.state?.totalTax).toBeCloseTo(example.expectedTax, 2)
		})
	}
})
