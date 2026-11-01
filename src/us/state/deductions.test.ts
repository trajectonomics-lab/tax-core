import { describe, expect, it } from "bun:test"
import { TaxValidationError, toMinorUnits } from "../../core/money"
import { calculateUsStateDeductions } from "./deductions"
import { US_2026_STATE_PARAMETERS } from "./parameters"

const cents = (dollars: number): number => toMinorUnits(dollars, "USD")

describe("calculateUsStateDeductions", () => {
	it("subtracts the standard deduction from AGI", () => {
		const result = calculateUsStateDeductions(
			cents(100_000),
			"single",
			0,
			US_2026_STATE_PARAMETERS.CO,
			"USD",
		)
		expect(result.standardDeductionCents).toBe(cents(16_100))
		expect(result.taxableIncomeCents).toBe(cents(83_900))
	})

	it("uses the joint standard deduction and personal exemption for joint filers", () => {
		const result = calculateUsStateDeductions(
			cents(100_000),
			"married_filing_jointly",
			0,
			US_2026_STATE_PARAMETERS.AL,
			"USD",
		)
		expect(result.standardDeductionCents).toBe(cents(8_500))
		expect(result.personalExemptionCents).toBe(cents(3_000))
		expect(result.taxableIncomeCents).toBe(cents(88_500))
	})

	it("multiplies dependent exemptions and credits by the dependent count", () => {
		const exemption = calculateUsStateDeductions(
			cents(100_000),
			"single",
			3,
			US_2026_STATE_PARAMETERS.GA,
			"USD",
		)
		expect(exemption.dependentExemptionCents).toBe(cents(12_000))
		const credit = calculateUsStateDeductions(
			cents(100_000),
			"single",
			2,
			US_2026_STATE_PARAMETERS.CA,
			"USD",
		)
		expect(credit.dependentCreditCents).toBe(cents(950))
		expect(credit.personalCreditCents).toBe(cents(153))
	})

	it("floors taxable income at zero", () => {
		const result = calculateUsStateDeductions(
			cents(1_000),
			"single",
			0,
			US_2026_STATE_PARAMETERS.CO,
			"USD",
		)
		expect(result.taxableIncomeCents).toBe(0)
	})

	it("rejects a dependent count whose product is not a safe integer", () => {
		expect(() =>
			calculateUsStateDeductions(
				0,
				"single",
				Number.MAX_SAFE_INTEGER,
				US_2026_STATE_PARAMETERS.GA,
				"USD",
			),
		).toThrow(TaxValidationError)
	})
})
