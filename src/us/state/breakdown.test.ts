import { describe, expect, it } from "bun:test"
import { evaluateBrackets } from "../../core/brackets"
import { TaxValidationError, toMinorUnits, usd } from "../../core/money"
import { buildUsStateBreakdown } from "./breakdown"
import { calculateUsStateCredits } from "./credits"
import { calculateUsStateDeductions } from "./deductions"
import { US_2026_STATE_PARAMETERS } from "./parameters"

const cents = (dollars: number): number => toMinorUnits(dollars, "USD")
const params = US_2026_STATE_PARAMETERS.CO

function build(withholdingDollars: number, refundableDollars: number) {
	const deductions = calculateUsStateDeductions(cents(60_000), "single", 0, params, "USD")
	const evaluation = evaluateBrackets(deductions.taxableIncomeCents, params.brackets.single)
	const credits = calculateUsStateCredits(
		evaluation.totalTax,
		0,
		0,
		{ refundable: refundableDollars },
		withholdingDollars,
		"USD",
	)
	return buildUsStateBreakdown({
		params,
		agiCents: cents(60_000),
		deductions,
		evaluation,
		surtaxCents: 0,
		taxBeforeCreditsCents: evaluation.totalTax,
		credits,
		effectiveRate: 0.03,
		marginalRate: 0.044,
		currency: "USD",
	})
}

describe("buildUsStateBreakdown", () => {
	it("reports identity, deductions, taxable income and tax in major dollars", () => {
		const breakdown = build(0, 0)
		expect(breakdown.code).toBe("CO")
		expect(breakdown.name).toBe("Colorado")
		expect(breakdown.type).toBe("flat")
		expect(breakdown.agi).toBe(usd(60_000))
		expect(breakdown.standardDeduction).toBe(usd(16_100))
		expect(breakdown.taxableIncome).toBe(usd(43_900))
		expect(breakdown.bracketTax).toBe(usd(1_931.6))
		expect(breakdown.taxBeforeCredits).toBe(usd(1_931.6))
		expect(breakdown.slices.length).toBeGreaterThan(0)
		expect(breakdown.effectiveRate).toBe(0.03)
		expect(breakdown.marginalRate).toBe(0.044)
	})

	it("reports a negative net payable when refundable credits exceed the liability", () => {
		const breakdown = build(500, 2_000)
		expect(breakdown.withholding).toBe(usd(500))
		expect(breakdown.credits.refundable).toBe(usd(2_000))
		expect(breakdown.netTaxPayable).toBe(usd(-568.4, "netTaxPayable", { allowNegative: true }))
	})

	it("rejects negative component amounts", () => {
		const breakdown = {
			params,
			agiCents: -1,
			deductions: calculateUsStateDeductions(0, "single", 0, params, "USD"),
			evaluation: evaluateBrackets(0, params.brackets.single),
			surtaxCents: 0,
			taxBeforeCreditsCents: 0,
			credits: calculateUsStateCredits(0, 0, 0, undefined, undefined, "USD"),
			effectiveRate: 0,
			marginalRate: 0,
			currency: "USD",
		} as const
		expect(() => buildUsStateBreakdown(breakdown)).toThrow(TaxValidationError)
	})
})
