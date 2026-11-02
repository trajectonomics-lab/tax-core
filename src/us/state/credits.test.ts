import { describe, expect, it } from "bun:test"
import { TaxValidationError, toMinorUnits } from "../../core/money"
import { calculateUsStateCredits } from "./credits"

const cents = (dollars: number): number => toMinorUnits(dollars, "USD")

describe("calculateUsStateCredits", () => {
	it("returns the tax unchanged when no credits or withholding apply", () => {
		const result = calculateUsStateCredits(cents(1_000), 0, 0, undefined, undefined, "USD")
		expect(result.totalTaxCents).toBe(cents(1_000))
		expect(result.netTaxCents).toBe(cents(1_000))
		expect(result.claimedNonRefundableCents).toBe(0)
	})

	it("sums personal, dependent and caller non-refundable credits", () => {
		const result = calculateUsStateCredits(
			cents(1_000),
			cents(153),
			cents(306),
			{ nonRefundable: 41 },
			undefined,
			"USD",
		)
		expect(result.claimedNonRefundableCents).toBe(cents(500))
		expect(result.allowedNonRefundableCents).toBe(cents(500))
		expect(result.totalTaxCents).toBe(cents(500))
	})

	it("caps non-refundable credits at the tax before credits", () => {
		const result = calculateUsStateCredits(cents(100), cents(153), 0, undefined, undefined, "USD")
		expect(result.claimedNonRefundableCents).toBe(cents(153))
		expect(result.allowedNonRefundableCents).toBe(cents(100))
		expect(result.totalTaxCents).toBe(0)
	})

	it("lets refundable credits and withholding push net tax below zero", () => {
		const result = calculateUsStateCredits(cents(100), 0, 0, { refundable: 250 }, 50, "USD")
		expect(result.refundableCents).toBe(cents(250))
		expect(result.withholdingCents).toBe(cents(50))
		expect(result.netTaxCents).toBe(cents(100) - cents(250) - cents(50))
	})

	it("rejects negative caller credits and withholding", () => {
		expect(() =>
			calculateUsStateCredits(100, 0, 0, { nonRefundable: -1 }, undefined, "USD"),
		).toThrow(TaxValidationError)
		expect(() => calculateUsStateCredits(100, 0, 0, { refundable: -1 }, undefined, "USD")).toThrow(
			TaxValidationError,
		)
		expect(() => calculateUsStateCredits(100, 0, 0, undefined, -1, "USD")).toThrow(
			TaxValidationError,
		)
	})
})
