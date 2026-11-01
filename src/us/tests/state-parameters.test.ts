import { describe, expect, it } from "bun:test"
import { calculateUsTax } from "../index"
import { US_2026_STATE_PARAMETERS, type UsStateParameters } from "../state/parameters"
import { US_STATE_CODES, type UsFilingStatus } from "../types"

const STATUSES = [
	"single",
	"married_filing_jointly",
	"married_filing_separately",
	"head_of_household",
] as const

function expectValidSchedule(state: UsStateParameters, status: UsFilingStatus): void {
	const brackets = state.brackets[status]
	expect(brackets.length).toBeGreaterThan(0)
	expect(brackets[brackets.length - 1]?.upTo).toBeNull()
	let previous = 0
	for (const bracket of brackets) {
		expect(bracket.rate).toBeGreaterThanOrEqual(0)
		expect(bracket.rate).toBeLessThanOrEqual(1)
		if (bracket.upTo !== null) {
			expect(bracket.upTo).toBeGreaterThan(previous)
			previous = bracket.upTo
		}
	}
}

describe("US State Parameter Registry", () => {
	it("registers every state code exactly once", () => {
		expect(Object.keys(US_2026_STATE_PARAMETERS).sort()).toEqual([...US_STATE_CODES].sort())
		expect(US_STATE_CODES.length).toBe(51)
	})

	it("classifies 9 no-tax, 14 flat, and 27 progressive states plus DC", () => {
		const states = Object.values(US_2026_STATE_PARAMETERS)
		expect(states.filter((state) => state.type === "none")).toHaveLength(9)
		expect(states.filter((state) => state.type === "flat")).toHaveLength(14)
		expect(states.filter((state) => state.type === "progressive")).toHaveLength(28)
	})

	it("provides ordered, bounded schedules for every filing status", () => {
		for (const state of Object.values(US_2026_STATE_PARAMETERS)) {
			for (const status of STATUSES) {
				expectValidSchedule(state, status)
				expect(state.standardDeduction[status]).toBeGreaterThanOrEqual(0)
				expect(state.personalExemption[status]).toBeGreaterThanOrEqual(0)
				expect(state.personalCredit[status]).toBeGreaterThanOrEqual(0)
			}
			expect(state.dependentExemption).toBeGreaterThanOrEqual(0)
			expect(state.dependentCredit).toBeGreaterThanOrEqual(0)
		}
	})

	it("keeps every no-income-tax state at a zero rate and zero deductions", () => {
		for (const code of ["AK", "FL", "NV", "NH", "SD", "TN", "TX", "WA", "WY"] as const) {
			const state = US_2026_STATE_PARAMETERS[code]
			expect(state.type).toBe("none")
			expect(state.brackets.single.every((bracket) => bracket.rate === 0)).toBe(true)
			expect(state.standardDeduction.single).toBe(0)
			expect(state.personalExemption.single).toBe(0)
		}
	})

	it("uses one positive statutory rate for each flat-tax state", () => {
		for (const state of Object.values(US_2026_STATE_PARAMETERS)) {
			if (state.type !== "flat") continue
			const positive = new Set(
				state.brackets.single.map((bracket) => bracket.rate).filter((rate) => rate > 0),
			)
			expect(positive.size).toBe(1)
		}
	})

	it("models the Massachusetts millionaire surtax and California mental health surtax", () => {
		expect(US_2026_STATE_PARAMETERS.MA.surtax).toEqual({ threshold: 1_083_150, rate: 0.04 })
		expect(US_2026_STATE_PARAMETERS.CA.surtax).toEqual({ threshold: 1_000_000, rate: 0.01 })
	})

	it("calculates every state through the public US tax seam", () => {
		for (const code of US_STATE_CODES) {
			const result = calculateUsTax({
				filingStatus: "single",
				income: { w2Wages: 100_000 },
				includeFica: false,
				state: code,
			})
			expect(result.breakdown.state?.code).toBe(code)
			expect(result.breakdown.state?.name).toBe(US_2026_STATE_PARAMETERS[code].name)
			expect(result.totalTax).toBeGreaterThanOrEqual(0)
		}
	})
})
