import { describe, expect, it } from "bun:test"
import { calculateUsTax } from "../index"
import type { UsFilingStatus, UsStateCode } from "../types"

/**
 * Hand-computed worked examples for values corrected against official 2026 state documents
 * (see references/SOURCES.md): the DFA Arkansas formula, Hawaii Announcement 2024-03 and Louisiana RIB 26-005.
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
	{
		// Louisiana RIB 26-005: head of household uses the joint 25,750 deduction (not 1.5x
		// single): 3% x (100,000 - 25,750) = 2,227.50.
		state: "LA",
		wages: 100_000,
		expectedTax: 2227.5,
		label: "LA head of household with the joint-size deduction",
		filingStatus: "head_of_household",
	},
	{
		// Utah S.B. 60 (2026 GS): rate 4.45% (was 4.5%). Single 100,000 wages:
		// 4.45% x 100,000 = 4,450 tax before credit, less 966 personal credit = 3,484.
		state: "UT",
		wages: 100_000,
		expectedTax: 3484,
		label: "UT 4.45% statutory rate with personal credit",
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
