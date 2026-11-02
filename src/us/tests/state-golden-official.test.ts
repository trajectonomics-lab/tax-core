import { describe, expect, it } from "bun:test"
import { calculateUsTax } from "../index"
import type { UsFilingStatus, UsStateCode } from "../types"

/**
 * Hand-computed worked examples for values corrected against official 2026 state documents
 * (see references/SOURCES.md): the DFA Arkansas formula and Hawaii Announcement 2024-03.
 */
interface OfficialExample {
	readonly state: UsStateCode
	readonly wages: number
	readonly expectedTax: number
	readonly label: string
	readonly filingStatus?: UsFilingStatus
}

const EXAMPLES: readonly OfficialExample[] = [
	{
		// Arkansas: 37,530 taxable after 2,470; 2% x 5,600 + 3% x 4,800 + 3.4% x 10,400
		// + 3.7% x 11,130 = 1,021.41, less the 29 personal credit.
		state: "AR",
		wages: 40_000,
		expectedTax: 992.41,
		label: "AR five-step schedule with personal credit",
	},
	{
		// Hawaii HoH: 86,856 taxable after the 12,000 deduction and 1,144 exemption.
		state: "HI",
		wages: 100_000,
		expectedTax: 4937.86,
		label: "HI head of household with the 2026 deduction",
		filingStatus: "head_of_household",
	},
]

describe("US state tax corrected against official documents", () => {
	for (const example of EXAMPLES) {
		it(`matches the hand-computed ${example.label}`, () => {
			const result = calculateUsTax({
				filingStatus: example.filingStatus ?? "single",
				income: { w2Wages: example.wages },
				includeFica: false,
				state: example.state,
			})
			expect(result.breakdown.state?.totalTax).toBeCloseTo(example.expectedTax, 2)
		})
	}
})
