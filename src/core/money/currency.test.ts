import { describe, expect, it } from "bun:test"
import { CURRENCY_PRECISION } from "./currency"

describe("Supported currency precision", () => {
	it("defines 2-decimal minor units for THB (satang) and USD (cents)", () => {
		expect(CURRENCY_PRECISION.THB).toBe(2)
		expect(CURRENCY_PRECISION.USD).toBe(2)
	})

	it("covers exactly the supported currencies", () => {
		expect(Object.keys(CURRENCY_PRECISION).sort()).toEqual(["THB", "USD"])
	})
})
