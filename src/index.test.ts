import { describe, expect, it } from "bun:test"
import * as api from "./index"
import {
	applyPercentage,
	calculateTax,
	clampCap,
	evaluateBrackets,
	fromMinorUnits,
	money,
	roundHalfUp,
	TaxValidationError,
	thb,
	toMinorUnits,
	usd,
	validateMonetaryAmount,
} from "./index"
import * as th from "./th/index"
import * as us from "./us/index"

describe("@trajectonomics/tax public index exports", () => {
	it("exports all expected core utilities and functions", () => {
		expect(typeof money).toBe("function")
		expect(typeof thb).toBe("function")
		expect(typeof usd).toBe("function")
		expect(typeof TaxValidationError).toBe("function")
		expect(typeof validateMonetaryAmount).toBe("function")
		expect(typeof roundHalfUp).toBe("function")
		expect(typeof toMinorUnits).toBe("function")
		expect(typeof fromMinorUnits).toBe("function")
		expect(typeof applyPercentage).toBe("function")
		expect(typeof clampCap).toBe("function")
		expect(typeof evaluateBrackets).toBe("function")
		expect(typeof calculateTax).toBe("function")
	})

	it("does not leak internal currency lookups", () => {
		expect("CURRENCIES" in api).toBe(false)
		expect("getCurrencyPrecision" in api).toBe(false)
	})

	it("exports valid subpath entries for th and us", () => {
		expect(typeof th).toBe("object")
		expect(typeof us).toBe("object")
	})
})
