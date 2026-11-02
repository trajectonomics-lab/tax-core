import { describe, expect, it } from "bun:test"
import { toMinorUnits } from "../../core/money"
import { calculateUsStateSurtax } from "./surtax"

const MA_SURTAX = { threshold: 1_083_150, rate: 0.04 }

describe("calculateUsStateSurtax", () => {
	it("returns an inactive zero result when the state has no surtax", () => {
		expect(
			calculateUsStateSurtax(toMinorUnits(2_000_000, "USD"), undefined, "single", "USD"),
		).toEqual({
			taxCents: 0,
			rate: 0,
			active: false,
		})
	})

	it("taxes only the portion above the threshold", () => {
		const result = calculateUsStateSurtax(
			toMinorUnits(1_183_150, "USD"),
			MA_SURTAX,
			"single",
			"USD",
		)
		expect(result.taxCents).toBe(toMinorUnits(4_000, "USD"))
		expect(result.rate).toBe(0.04)
		expect(result.active).toBe(true)
	})

	it("is active exactly at the threshold because the next dollar is surtaxed", () => {
		const result = calculateUsStateSurtax(
			toMinorUnits(1_083_150, "USD"),
			MA_SURTAX,
			"single",
			"USD",
		)
		expect(result).toEqual({ taxCents: 0, rate: 0.04, active: true })
	})

	it("is inactive below the threshold", () => {
		expect(calculateUsStateSurtax(1, MA_SURTAX, "single", "USD").active).toBe(false)
	})

	it("reads a per-status threshold for the filing status", () => {
		const surtax = {
			threshold: {
				single: 1_000_000,
				married_filing_jointly: 1_500_000,
				married_filing_separately: 750_000,
				head_of_household: 1_500_000,
			},
			rate: 0.02,
		}
		const income = toMinorUnits(1_200_000, "USD")
		expect(calculateUsStateSurtax(income, surtax, "single", "USD").taxCents).toBe(
			toMinorUnits(4_000, "USD"),
		)
		expect(calculateUsStateSurtax(income, surtax, "married_filing_jointly", "USD").active).toBe(
			false,
		)
		expect(calculateUsStateSurtax(income, surtax, "married_filing_separately", "USD")).toEqual({
			taxCents: toMinorUnits(9_000, "USD"),
			rate: 0.02,
			active: true,
		})
	})
})
