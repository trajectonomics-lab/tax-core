import { describe, expect, it } from "bun:test"
import { toMinorUnits } from "../../core/money"
import { calculateUsStateSurtax } from "./surtax"

const MA_SURTAX = { threshold: 1_083_150, rate: 0.04 }

describe("calculateUsStateSurtax", () => {
	it("returns an inactive zero result when the state has no surtax", () => {
		expect(calculateUsStateSurtax(toMinorUnits(2_000_000, "USD"), undefined, "USD")).toEqual({
			taxCents: 0,
			rate: 0,
			active: false,
		})
	})

	it("taxes only the portion above the threshold", () => {
		const result = calculateUsStateSurtax(toMinorUnits(1_183_150, "USD"), MA_SURTAX, "USD")
		expect(result.taxCents).toBe(toMinorUnits(4_000, "USD"))
		expect(result.rate).toBe(0.04)
		expect(result.active).toBe(true)
	})

	it("is inactive exactly at the threshold", () => {
		const result = calculateUsStateSurtax(toMinorUnits(1_083_150, "USD"), MA_SURTAX, "USD")
		expect(result).toEqual({ taxCents: 0, rate: 0.04, active: false })
	})

	it("is inactive below the threshold", () => {
		expect(calculateUsStateSurtax(1, MA_SURTAX, "USD").active).toBe(false)
	})
})
