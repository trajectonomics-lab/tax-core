import { describe, expect, it } from "bun:test"
import { toMinorUnits, usd } from "../../core/money"
import { calculateUsStateTax } from "../stages/state"
import { US_2026_STATE_PARAMETERS } from "../state/parameters"

function calculate(
	state: string,
	agiDollars: number,
	options: {
		filingStatus?:
			| "single"
			| "married_filing_jointly"
			| "married_filing_separately"
			| "head_of_household"
		dependents?: number
		withholding?: number
		credits?: { nonRefundable?: number; refundable?: number }
	} = {},
) {
	return calculateUsStateTax(
		{
			state: state as never,
			filingStatus: options.filingStatus ?? "single",
			income: {},
			...(options.dependents === undefined ? {} : { stateDependents: options.dependents }),
			...(options.withholding === undefined ? {} : { stateWithholding: options.withholding }),
			...(options.credits === undefined ? {} : { stateCredits: options.credits }),
		},
		toMinorUnits(agiDollars, "USD"),
		options.filingStatus ?? "single",
		"USD",
	)
}

describe("US State Income Tax Stage", () => {
	it("returns a zero result when no state is selected", () => {
		const result = calculateUsStateTax(
			{ filingStatus: "single", income: {} },
			toMinorUnits(50_000, "USD"),
			"single",
			"USD",
		)
		expect(result.totalTaxCents).toBe(0)
		expect(result.netTaxCents).toBe(0)
		expect(result.breakdown).toBeUndefined()
	})

	it("computes zero tax and zero rates for a no-income-tax state", () => {
		const result = calculate("FL", 60_000)
		expect(result.breakdown?.code).toBe("FL")
		expect(result.breakdown?.type).toBe("none")
		expect(result.breakdown?.taxableIncome).toBe(usd(60_000))
		expect(result.breakdown?.totalTax).toBe(usd(0))
		expect(result.breakdown?.effectiveRate).toBe(0)
		expect(result.breakdown?.marginalRate).toBe(0)
	})

	it("computes a flat state tax with non-refundable and refundable credits and withholding", () => {
		const result = calculate("CO", 60_000, {
			withholding: 500,
			credits: { nonRefundable: 100, refundable: 50 },
		})
		expect(result.breakdown?.standardDeduction).toBe(usd(16_100))
		expect(result.breakdown?.taxableIncome).toBe(usd(43_900))
		expect(result.breakdown?.bracketTax).toBe(usd(1_931.6))
		expect(result.breakdown?.credits.allowedNonRefundable).toBe(usd(100))
		expect(result.breakdown?.credits.refundable).toBe(usd(50))
		expect(result.breakdown?.withholding).toBe(usd(500))
		expect(result.totalTaxCents).toBe(183_160)
		expect(result.netTaxCents).toBe(128_160)
		expect(result.breakdown?.effectiveRate).toBeCloseTo(1_831.6 / 60_000, 10)
		expect(result.breakdown?.marginalRate).toBe(0.044)
	})

	it("applies flat-state dependent exemptions for a joint return", () => {
		const result = calculate("GA", 60_000, {
			filingStatus: "married_filing_jointly",
			dependents: 2,
		})
		expect(result.breakdown?.standardDeduction).toBe(usd(24_000))
		expect(result.breakdown?.dependentExemption).toBe(usd(8_000))
		expect(result.breakdown?.taxableIncome).toBe(usd(28_000))
		expect(result.breakdown?.bracketTax).toBe(usd(1_453.2))
	})

	it("computes progressive brackets and personal/dependent credits", () => {
		const result = calculate("CA", 100_000, { dependents: 1 })
		expect(result.breakdown?.taxableIncome).toBe(usd(94_460))
		expect(result.breakdown?.bracketTax).toBe(usd(5_223.42))
		expect(result.breakdown?.credits.personal).toBe(usd(153))
		expect(result.breakdown?.credits.dependent).toBe(usd(153))
		expect(result.breakdown?.credits.claimedNonRefundable).toBe(usd(306))
		expect(result.totalTaxCents).toBe(491_742)
		expect(result.breakdown?.marginalRate).toBe(0.093)
		expect(result.breakdown?.slices.length).toBe(US_2026_STATE_PARAMETERS.CA.brackets.single.length)
	})

	it("adds the Massachusetts millionaire surtax and reports the combined marginal rate", () => {
		const result = calculate("MA", 2_000_000)
		expect(result.breakdown?.taxableIncome).toBe(usd(1_995_600))
		expect(result.breakdown?.bracketTax).toBe(usd(99_780))
		expect(result.breakdown?.surtax).toBe(usd(36_498))
		expect(result.breakdown?.taxBeforeCredits).toBe(usd(136_278))
		expect(result.totalTaxCents).toBe(13_627_800)
		expect(result.breakdown?.marginalRate).toBe(0.09)
	})

	it("adds the California mental health surtax above one million dollars", () => {
		const result = calculate("CA", 2_000_000)
		expect(result.breakdown?.taxableIncome).toBe(usd(1_994_460))
		expect(result.breakdown?.surtax).toBe(usd(9_944.6))
		expect(result.breakdown?.marginalRate).toBe(0.133)
	})

	it("floors state taxable income at zero and effective rate at zero", () => {
		const result = calculate("CO", 0)
		expect(result.breakdown?.taxableIncome).toBe(usd(0))
		expect(result.breakdown?.totalTax).toBe(usd(0))
		expect(result.breakdown?.effectiveRate).toBe(0)
	})

	it("caps non-refundable state credits at the tax before credits", () => {
		const result = calculate("CO", 20_000, { credits: { nonRefundable: 5_000 } })
		expect(result.breakdown?.taxableIncome).toBe(usd(3_900))
		expect(result.breakdown?.credits.claimedNonRefundable).toBe(usd(5_000))
		expect(result.breakdown?.credits.allowedNonRefundable).toBe(usd(171.6))
		expect(result.totalTaxCents).toBe(0)
	})

	it("uses the married-filing-separately standard deduction and single brackets", () => {
		const result = calculate("NY", 100_000, { filingStatus: "married_filing_separately" })
		expect(result.breakdown?.standardDeduction).toBe(usd(8_025))
		expect(result.breakdown?.taxableIncome).toBe(usd(91_975))
		expect(result.breakdown?.marginalRate).toBe(0.059)
	})

	it("uses head-of-household brackets and standard deduction", () => {
		const result = calculate("CA", 120_000, { filingStatus: "head_of_household" })
		expect(result.breakdown?.standardDeduction).toBe(usd(11_080))
		expect(result.breakdown?.taxableIncome).toBe(usd(108_920))
		expect(result.breakdown?.marginalRate).toBeGreaterThan(0)
	})
})
