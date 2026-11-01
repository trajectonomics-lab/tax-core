import { describe, expect, it } from "bun:test"
import { calculateUsTax } from "../index"
import type { UsFilingStatus, UsStateCode } from "../types"

/**
 * Hand-computed worked examples (single filer, W-2 wages only, no FICA) derived directly
 * from the published 2026 state bracket tables, independent of the engine's arithmetic.
 */
interface WorkedExample {
	readonly state: UsStateCode
	readonly wages: number
	readonly expectedTax: number
	readonly label: string
	readonly filingStatus?: UsFilingStatus
	readonly dependents?: number
}

const EXTENDED_EXAMPLES: readonly WorkedExample[] = [
	{
		// Georgia joint: 5.19% x (100,000 - 24,000 deduction - 2 x 4,000 dependent exemption).
		state: "GA",
		wages: 100_000,
		expectedTax: 3529.2,
		label: "GA joint return with two dependents",
		filingStatus: "married_filing_jointly",
		dependents: 2,
	},
	{
		// Massachusetts: 5% x 1,195,600 + 4% x (1,195,600 - 1,083,150) after the 4,400 exemption.
		state: "MA",
		wages: 1_200_000,
		expectedTax: 64_278,
		label: "MA millionaire surtax",
	},
	{
		// New Jersey head of household uses the joint schedule: 99,000 taxable after 1,000 exemption.
		// 280 + 525 + 490 + 350 + 19,000 x 5.525%.
		state: "NJ",
		wages: 100_000,
		expectedTax: 2694.75,
		label: "NJ head of household on the joint rate table",
		filingStatus: "head_of_household",
	},
]

const WORKED_EXAMPLES: ReadonlyArray<readonly [UsStateCode, number, number, string]> = [
	// Missouri: 83,900 taxable; 262.86 across the lower tiers + 4.7% x 74,464.
	["MO", 100_000, 3762.67, "MO progressive after the $1,348 zero tier"],
	// Pennsylvania: 3.07% x 100,000, no standard deduction.
	["PA", 100_000, 3070, "PA flat without deduction"],
	// Colorado: 4.4% x (100,000 - 16,100).
	["CO", 100_000, 3691.6, "CO flat after federal-linked standard deduction"],
	// Ohio: 2.75% x (97,642 - 26,050) after the $2,400 exemption and zero bracket.
	["OH", 100_042, 1968.78, "OH flat above the zero bracket"],
	// California: 5,223.42 bracket tax on 94,460 taxable less the $153 exemption credit.
	["CA", 100_000, 5070.42, "CA nine-tier schedule less personal credit"],
	// Arizona: 2.5% x (100,000 - 16,100 federal-conforming standard deduction).
	["AZ", 100_000, 2097.5, "AZ flat after federal-conforming standard deduction"],
	// South Carolina: 3% x (18,230 - 3,640) + 6% x (83,900 - 18,230) after the 16,100 deduction.
	["SC", 100_000, 4377.9, "SC three-tier schedule after federal-conforming deduction"],
	// Maine: 40,000 taxable (15,300 deduction, 5,300 exemption): 1,589.20 + 850.50.
	["ME", 60_600, 2439.7, "ME two-tier schedule after official 2026 deduction"],
	// New York: 4,859.75 bracket tax on 92,000 taxable.
	["NY", 100_000, 4859.75, "NY graduated schedule"],
]

describe("US state tax worked examples", () => {
	for (const [state, wages, expectedTax, label] of WORKED_EXAMPLES) {
		it(`matches the hand-computed ${label}`, () => {
			const result = calculateUsTax({
				filingStatus: "single",
				income: { w2Wages: wages },
				includeFica: false,
				state,
			})
			expect(result.breakdown.state?.totalTax).toBeCloseTo(expectedTax, 2)
		})
	}
})

describe("US state tax extended worked examples", () => {
	for (const example of EXTENDED_EXAMPLES) {
		it(`matches the hand-computed ${example.label}`, () => {
			const result = calculateUsTax({
				filingStatus: example.filingStatus ?? "single",
				income: { w2Wages: example.wages },
				includeFica: false,
				state: example.state,
				...(example.dependents === undefined ? {} : { stateDependents: example.dependents }),
			})
			expect(result.breakdown.state?.totalTax).toBeCloseTo(example.expectedTax, 2)
		})
	}

	it("adds the state marginal rate to the top-level marginal rate", () => {
		const federal = calculateUsTax({
			filingStatus: "single",
			income: { w2Wages: 100_000 },
			includeFica: false,
		})
		const withState = calculateUsTax({
			filingStatus: "single",
			income: { w2Wages: 100_000 },
			includeFica: false,
			state: "PA",
		})
		expect(withState.marginalRate).toBeCloseTo(federal.marginalRate + 0.0307, 6)
	})
})
