import { applyPercentage, type TaxSupportedCurrency, toMinorUnits } from "../../core/money"
import type { UsFilingStatus } from "../types"
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
 * reaches the threshold. A per-status threshold is looked up by filing status.
 * Units: Taxable income and result are integer cents; threshold is major dollars.
 * Throws: TaxValidationError if the threshold or rate cannot be converted or is invalid.
 *
 * @param taxableIncomeCents State taxable income in integer cents.
 * @param surtax Optional statutory surtax threshold and rate.
 * @param status Filing status, used when the threshold varies by status.
 * @param currency Supported statutory currency threaded for minor-unit conversion.
 * @returns Surtax amount in cents, statutory rate, and whether it applies.
 */
export function calculateUsStateSurtax(
	taxableIncomeCents: number,
	surtax: UsStateSurtax | undefined,
	status: UsFilingStatus,
	currency: TaxSupportedCurrency,
): UsStateSurtaxResult {
	if (!surtax) return { taxCents: 0, rate: 0, active: false }
	const threshold =
		typeof surtax.threshold === "number" ? surtax.threshold : surtax.threshold[status]
	const thresholdCents = toMinorUnits(threshold, currency, UsStateField.SurtaxThreshold)
	const baseCents = Math.max(0, taxableIncomeCents - thresholdCents)
	return {
		taxCents: applyPercentage(baseCents, surtax.rate),
		rate: surtax.rate,
		active: taxableIncomeCents >= thresholdCents,
	}
}
