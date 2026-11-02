import { describe, expect, it } from "bun:test"
import { calculateUsTax } from "../index"
import type { UsFilingStatus, UsStateCode } from "../types"

/**
 * Hand-computed examples for statutory phase-outs below, inside and above their ranges:
 * Maine's standard deduction (36 M.R.S. § 5124-C(2)) and Minnesota's standard deduction and
 * dependent exemption (Minn. Stat. §§ 290.0123 subd. 5, 290.0121 subd. 2), using the 2026
 * thresholds of the Minnesota Department of Revenue inflation-adjusted amounts. Each bracket
 * slice is rounded half-up to the cent, as the engine does, so expected values are to the cent.
 */
interface PhaseOutExample {
	readonly state: UsStateCode
	readonly wages: number
	readonly expectedTax: number
	readonly label: string
	readonly filingStatus?: UsFilingStatus
	readonly dependents?: number
}

const EXAMPLES: readonly PhaseOutExample[] = [
	{
		// Maine single below 102,250: full 15,700 deduction; taxable 100,000 - 15,700 - 5,300
		// = 79,000; 4,117.075 + 14,150 x 7.15% = 5,128.81.
		state: "ME",
		wages: 100_000,
		expectedTax: 5128.81,
		label: "ME below the phase-out range",
	},
	{
		// Reduction 15,700 x (140,000 - 102,250) / 75,000 = 7,902.33, deduction 7,797.67;
		// taxable 126,902.33; 4,117.075 + 62,052.33 x 7.15% = 8,553.82.
		state: "ME",
		wages: 140_000,
		expectedTax: 8553.82,
		label: "ME inside the single phase-out range",
	},
	{
		// Joint reduction 31,400 x (250,000 - 204,550) / 150,000 = 9,514.20, deduction 21,885.80;
		// taxable 250,000 - 21,885.80 - 10,600 = 217,514.20; 8,237.05 + 87,764.20 x 7.15%.
		state: "ME",
		wages: 250_000,
		expectedTax: 14_512.19,
		label: "ME inside the joint phase-out range",
		filingStatus: "married_filing_jointly",
	},
	{
		// Head of household range is 153,400 to 265,900: reduction 23,550 x (200,000 - 153,400)
		// / 112,500 = 9,754.93, deduction 13,795.07; taxable 180,904.93 on the head of household
		// schedule: 2,383.80 + 3,793.50 + 83,604.93 x 7.15% = 12,155.05.
		state: "ME",
		wages: 200_000,
		expectedTax: 12_155.05,
		label: "ME inside the head of household phase-out range",
		filingStatus: "head_of_household",
	},
	{
		// Above 177,250 the Maine deduction is gone: taxable 200,000 - 5,300 = 194,700;
		// 1,589.20 + 2,527.88 + 129,850 x 7.15% = 13,401.36.
		state: "ME",
		wages: 200_000,
		expectedTax: 13_401.36,
		label: "ME above the phase-out range",
	},
	{
		// Minnesota single below 244,400: taxable 200,000 - 15,300 = 184,700;
		// 1,782.085 + 5,176.16 + 75,270 x 7.85% = 12,866.95.
		state: "MN",
		wages: 200_000,
		expectedTax: 12_866.95,
		label: "MN below the deduction phase-out",
	},
	{
		// Reduction 3% x (300,000 - 244,400) = 1,668; deduction 13,632; taxable 286,368;
		// 1,782.085 + 5,176.16 + 7,357.02 + 83,218 x 9.85% = 22,512.24.
		state: "MN",
		wages: 300_000,
		expectedTax: 22_512.24,
		label: "MN between the first and second thresholds",
	},
	{
		// Reduction 3% x 93,400 + 10% x (400,000 - 337,800) = 2,802 + 6,220 = 9,022;
		// deduction 6,278; taxable 393,722; 14,315.265 + 190,572 x 9.85% = 33,086.61.
		state: "MN",
		wages: 400_000,
		expectedTax: 33_086.61,
		label: "MN above the second threshold",
	},
	{
		// The reduction 29,022 is capped at 80% of 15,300 = 12,240; deduction 3,060;
		// taxable 596,940; 14,315.265 + 393,790 x 9.85% = 53,103.59.
		state: "MN",
		wages: 600_000,
		expectedTax: 53_103.59,
		label: "MN with the reduction capped at 80%",
	},
	{
		// Two dependents at 5,300; 5,500 over 244,500 is 3 steps of 2,500, so 6% is disallowed:
		// exemption 10,600 x 94% = 9,964; deduction 15,300 - 168 = 15,132; taxable 224,904;
		// 14,315.265 + 21,754 x 9.85% = 16,458.04.
		state: "MN",
		wages: 250_000,
		expectedTax: 16_458.04,
		label: "MN dependent exemption partly disallowed",
		dependents: 2,
	},
	{
		// Separate filers use half the thresholds: 3% x (150,000 - 122,200) = 834, deduction
		// 14,466; taxable 135,534 on the separate schedule: 1,302.73 + 4,922.52 + 38,794 x 7.85%.
		state: "MN",
		wages: 150_000,
		expectedTax: 9270.58,
		label: "MN separate filer with halved thresholds",
		filingStatus: "married_filing_separately",
	},
	{
		// 500,000 is 102 steps over 244,500, so the one 5,300 exemption is fully disallowed;
		// the deduction falls to 20% of 15,300 = 3,060; taxable 496,940: 14,315.27 + 28,938.32.
		state: "MN",
		wages: 500_000,
		expectedTax: 43_253.59,
		label: "MN dependent exemption fully disallowed",
		dependents: 1,
	},
]

describe("US state tax phase-outs", () => {
	for (const example of EXAMPLES) {
		it(`matches the hand-computed ${example.label}`, () => {
			const result = calculateUsTax({
				filingStatus: example.filingStatus ?? "single",
				income: { w2Wages: example.wages },
				includeFica: false,
				state: example.state,
				...(example.dependents ? { stateDependents: example.dependents } : {}),
			})
			expect(result.breakdown.state?.totalTax).toBeCloseTo(example.expectedTax, 2)
		})
	}
})
