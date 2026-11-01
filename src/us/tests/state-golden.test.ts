import { describe, expect, it } from "bun:test"
import { calculateUsTax } from "../index"
import type { UsStateCode } from "../types"

/**
 * Hand-computed worked examples (single filer, W-2 wages only, no FICA) derived directly
 * from the published 2026 state bracket tables, independent of the engine's arithmetic.
 */
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
