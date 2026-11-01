import { applyPercentage, type TaxSupportedCurrency, toMinorUnits } from "../../core/money"
import { UsStateField } from "../types/state-fields"
import type { UsStateSurtax } from "./parameters/types"

/** Computed state surtax amount and whether the taxpayer is inside the surtax band. */
export interface UsStateSurtaxResult {
	readonly taxCents: number
	readonly rate: number
	readonly active: boolean
}

/**
 * Computes a state high-income or millionaire surtax above a taxable-income threshold.
 *
 * Math: surtax = rate * max(0, taxable income - threshold); active when taxable income
 * exceeds the threshold.
 * Units: Taxable income and result are integer cents; threshold is major dollars.
 * Throws: TaxValidationError if the threshold or rate cannot be converted or is invalid.
 *
 * @param taxableIncomeCents State taxable income in integer cents.
 * @param surtax Optional statutory surtax threshold and rate.
 * @param currency Supported statutory currency threaded for minor-unit conversion.
 * @returns Surtax amount in cents, statutory rate, and whether it applies.
 */
export function calculateUsStateSurtax(
	taxableIncomeCents: number,
	surtax: UsStateSurtax | undefined,
	currency: TaxSupportedCurrency,
): UsStateSurtaxResult {
	if (!surtax) return { taxCents: 0, rate: 0, active: false }
	const thresholdCents = toMinorUnits(surtax.threshold, currency, UsStateField.Surtax)
	const baseCents = Math.max(0, taxableIncomeCents - thresholdCents)
	return {
		taxCents: applyPercentage(baseCents, surtax.rate),
		rate: surtax.rate,
		active: baseCents > 0,
	}
}
