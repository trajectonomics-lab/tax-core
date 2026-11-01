import { describe, expect, it } from "bun:test"
import { TaxValidationError } from "./errors"
import { fromMinorUnits, toMinorUnits } from "./minor-units"
import { thb } from "./types"

describe("Minor Unit conversions without floating-point drift", () => {
	it("converts 2-decimal currencies to integer minor units without float drift", () => {
		expect(toMinorUnits(1.14, "USD")).toBe(114)
		expect(toMinorUnits(0.07, "USD")).toBe(7)
		expect(toMinorUnits(1.005, "USD")).toBe(101)
		expect(toMinorUnits(10.55, "THB")).toBe(1055)
		expect(toMinorUnits(thb(100_000.5), "THB")).toBe(10_000_050)
	})

	it("safely handles scientific notation numbers without returning NaN", () => {
		expect(toMinorUnits(1e-7, "THB")).toBe(0)
		expect(Number.isNaN(toMinorUnits(1e-7, "THB"))).toBe(false)
	})

	it("normalizes -0 to positive 0", () => {
		expect(Object.is(toMinorUnits(-0, "THB"), 0)).toBe(true)
		expect(Object.is(fromMinorUnits(-0, "THB"), 0)).toBe(true)
	})

	it("supports negative amounts when allowNegative option is enabled", () => {
		expect(toMinorUnits(-1.14, "USD", "amount", { allowNegative: true })).toBe(-114)
		expect(fromMinorUnits(-114, "USD", "minorUnits", { allowNegative: true })).toBe(-1.14)
	})

	it("throws TaxValidationError when conversion exceeds safe integer bounds", () => {
		expect(() => toMinorUnits(1e16, "THB")).toThrow(TaxValidationError)
		expect(() => toMinorUnits(1e21, "USD")).toThrow(TaxValidationError)
	})

	it("converts from integer minor units back to major units", () => {
		expect(fromMinorUnits(114, "USD")).toBe(1.14)
		expect(fromMinorUnits(7, "USD")).toBe(0.07)
		expect(fromMinorUnits(1055, "THB")).toBe(10.55)
	})

	it("enforces safe integer input in fromMinorUnits", () => {
		expect(() => fromMinorUnits(1.5, "USD")).toThrow(TaxValidationError)
	})
})
