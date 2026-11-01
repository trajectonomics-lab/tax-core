import { type TaxSupportedCurrency, toMinorUnits } from "../../core/money"
import type { UsStateCreditsInput } from "../types"
import { UsStateField } from "../types/state-fields"

/** State credits, withholding, and net-tax amounts in integer cents. */
export interface UsStateCreditsResult {
	readonly claimedNonRefundableCents: number
	readonly allowedNonRefundableCents: number
	readonly totalTaxCents: number
	readonly refundableCents: number
	readonly withholdingCents: number
	readonly netTaxCents: number
}

/**
 * Applies state personal, dependent, and caller-supplied credits plus state withholding.
 *
 * Math: non-refundable credits are capped at tax before credits; refundable credits and
 * withholding reduce net tax payable (possibly below zero).
 * Units: All amounts are integer cents; caller credit and withholding inputs are major dollars.
 *
 * @param taxBeforeCreditsCents State bracket tax plus surtax in integer cents.
 * @param personalCreditCents State personal non-refundable credit in cents.
 * @param dependentCreditCents State dependent non-refundable credit in cents.
 * @param credits Caller-supplied state non-refundable and refundable credits.
 * @param withholding Caller-supplied state income tax withholding in major dollars.
 * @param currency Supported statutory currency threaded for minor-unit conversion.
 * @returns Allowed non-refundable credits, total state tax, refundable credits,
 * withholding, and net state tax payable in integer cents.
 */
export function calculateUsStateCredits(
	taxBeforeCreditsCents: number,
	personalCreditCents: number,
	dependentCreditCents: number,
	credits: UsStateCreditsInput | undefined,
	withholding: number | undefined,
	currency: TaxSupportedCurrency,
): UsStateCreditsResult {
	const claimedNonRefundableCents =
		personalCreditCents +
		dependentCreditCents +
		toMinorUnits(credits?.nonRefundable ?? 0, currency, UsStateField.CreditsNonRefundable)
	const allowedNonRefundableCents = Math.min(taxBeforeCreditsCents, claimedNonRefundableCents)
	const totalTaxCents = taxBeforeCreditsCents - allowedNonRefundableCents
	const refundableCents = toMinorUnits(
		credits?.refundable ?? 0,
		currency,
		UsStateField.CreditsRefundable,
	)
	const withholdingCents = toMinorUnits(withholding ?? 0, currency, UsStateField.Withholding)
	const netTaxCents = totalTaxCents - refundableCents - withholdingCents
	return {
		claimedNonRefundableCents,
		allowedNonRefundableCents,
		totalTaxCents,
		refundableCents,
		withholdingCents,
		netTaxCents,
	}
}
