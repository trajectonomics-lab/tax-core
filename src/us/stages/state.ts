import { evaluateBrackets } from "../../core/brackets"
import type { TaxSupportedCurrency } from "../../core/money"
import { buildUsStateBreakdown } from "../state/breakdown"
import { calculateUsStateCredits } from "../state/credits"
import { calculateUsStateDeductions } from "../state/deductions"
import { US_2026_STATE_PARAMETERS } from "../state/parameters"
import { calculateUsStateSurtax } from "../state/surtax"
import type { UsFilingStatus, UsStateBreakdown, UsTaxInput } from "../types"
import { UsStateField } from "../types/state-fields"

/** State income tax amounts in integer cents plus the audit breakdown. */
export interface UsStateResult {
	readonly totalTaxCents: number
	readonly netTaxCents: number
	readonly breakdown: UsStateBreakdown | undefined
}

const EMPTY_RESULT: UsStateResult = {
	totalTaxCents: 0,
	netTaxCents: 0,
	breakdown: undefined,
}

/**
 * Computes 2026 state individual income tax from federal AGI, state deductions,
 * personal/dependent exemptions and credits, state surtaxes, and state withholding.
 *
 * Math: state taxable income = max(0, AGI - state standard deduction - exemptions);
 * tax = progressive bracket tax + surtax - non-refundable credits.
 * Units: AGI and all outputs are integer cents; parameter amounts are major dollars.
 *
 * @param input Complete US tax input including optional state code and state credits.
 * @param agiCents Federal adjusted gross income in integer cents.
 * @param filingStatus Federal and state filing status.
 * @param currency Supported statutory currency threaded for minor-unit conversion.
 * @returns State tax, refundable credits, withholding, net payable, and audit breakdown.
 * @statute State individual income tax statutes; see per-state parameter tables.
 */
export function calculateUsStateTax(
	input: UsTaxInput,
	agiCents: number,
	filingStatus: UsFilingStatus,
	currency: TaxSupportedCurrency,
): UsStateResult {
	if (input.state === undefined) return EMPTY_RESULT

	const params = US_2026_STATE_PARAMETERS[input.state]
	const deductions = calculateUsStateDeductions(
		agiCents,
		filingStatus,
		input.stateDependents ?? 0,
		params,
		currency,
	)
	const evaluation = evaluateBrackets(
		deductions.taxableIncomeCents,
		params.brackets[filingStatus],
		deductions.taxableIncomeCents,
		UsStateField.TaxableIncome,
	)
	const surtax = calculateUsStateSurtax(deductions.taxableIncomeCents, params.surtax, currency)
	const credits = calculateUsStateCredits(
		evaluation.totalTax + surtax.taxCents,
		deductions.personalCreditCents,
		deductions.dependentCreditCents,
		input.stateCredits,
		input.stateWithholding,
		currency,
	)
	const effectiveRate = agiCents > 0 ? credits.totalTaxCents / agiCents : 0
	const marginalRate = surtax.active
		? evaluation.marginalRate + surtax.rate
		: evaluation.marginalRate

	return {
		totalTaxCents: credits.totalTaxCents,
		netTaxCents: credits.netTaxCents,
		breakdown: buildUsStateBreakdown({
			params,
			agiCents,
			deductions,
			evaluation,
			surtaxCents: surtax.taxCents,
			taxBeforeCreditsCents: evaluation.totalTax + surtax.taxCents,
			claimedNonRefundableCents: credits.claimedNonRefundableCents,
			allowedNonRefundableCents: credits.allowedNonRefundableCents,
			refundableCents: credits.refundableCents,
			totalTaxCents: credits.totalTaxCents,
			withholdingCents: credits.withholdingCents,
			netTaxCents: credits.netTaxCents,
			effectiveRate,
			marginalRate,
			currency,
		}),
	}
}
