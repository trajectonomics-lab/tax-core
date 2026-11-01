import { describe, expect, it } from "bun:test"
import { TaxValidationError, usd } from "../../core/money"
import { calculateUsTax } from "../index"

describe("US State Tax Integration", () => {
	it("folds flat state tax into totalTax and state withholding/credits into netTaxPayable", () => {
		const result = calculateUsTax({
			filingStatus: "single",
			income: { w2Wages: 60_000 },
			includeFica: false,
			state: "CO",
			stateWithholding: 500,
			stateCredits: { nonRefundable: 100, refundable: 50 },
		})
		expect(result.breakdown.regularIncomeTax).toBe(usd(5_020))
		expect(result.breakdown.state?.totalTax).toBe(usd(1_831.6))
		expect(result.breakdown.state?.netTaxPayable).toBe(usd(1_281.6))
		expect(result.totalTax).toBe(usd(6_851.6))
		expect(result.netTaxPayable).toBe(usd(6_301.6))
	})

	it("adds no state tax for a no-income-tax state", () => {
		const result = calculateUsTax({
			filingStatus: "single",
			income: { w2Wages: 60_000 },
			includeFica: false,
			state: "FL",
		})
		expect(result.breakdown.state?.type).toBe("none")
		expect(result.breakdown.state?.totalTax).toBe(usd(0))
		expect(result.totalTax).toBe(usd(result.breakdown.regularIncomeTax))
		expect(result.netTaxPayable).toBe(usd(5_020))
	})

	it("allows a combined refund when state refundable credits exceed state tax and withholding", () => {
		const result = calculateUsTax({
			filingStatus: "single",
			income: { w2Wages: 50_000 },
			includeFica: false,
			state: "CO",
			stateWithholding: 100,
			stateCredits: { refundable: 2_000 },
		})
		expect(result.breakdown.state?.totalTax).toBe(usd(1_491.6))
		expect(result.breakdown.state?.netTaxPayable).toBe(
			usd(-608.4, "netTaxPayable", { allowNegative: true }),
		)
		expect(result.totalTax).toBe(usd(5_311.6))
		expect(result.netTaxPayable).toBe(usd(3_211.6))
	})

	it("rejects an unsupported state code", () => {
		expect(() =>
			calculateUsTax({
				filingStatus: "single",
				income: { w2Wages: 50_000 },
				state: "ZZ" as never,
			}),
		).toThrow(TaxValidationError)
	})

	it("rejects negative state withholding", () => {
		expect(() =>
			calculateUsTax({
				filingStatus: "single",
				income: { w2Wages: 50_000 },
				state: "CO",
				stateWithholding: -1,
			}),
		).toThrow(TaxValidationError)
	})

	it("rejects a fractional state dependent count", () => {
		expect(() =>
			calculateUsTax({
				filingStatus: "single",
				income: { w2Wages: 50_000 },
				state: "CO",
				stateDependents: 1.5,
			}),
		).toThrow(TaxValidationError)
	})

	it("rejects negative state non-refundable credits", () => {
		expect(() =>
			calculateUsTax({
				filingStatus: "single",
				income: { w2Wages: 50_000 },
				state: "CO",
				stateCredits: { nonRefundable: -10 },
			}),
		).toThrow(TaxValidationError)
	})

	it("rejects negative state refundable credits", () => {
		expect(() =>
			calculateUsTax({
				filingStatus: "single",
				income: { w2Wages: 50_000 },
				state: "CO",
				stateCredits: { refundable: -10 },
			}),
		).toThrow(TaxValidationError)
	})
})
