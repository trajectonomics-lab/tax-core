import { multiplySafeInteger, type TaxSupportedCurrency, toMinorUnits } from "../../core/money"
import type { UsFilingStatus } from "../types"
import { UsStateField } from "../types/state-fields"
import type { UsStateParameters } from "./parameters/types"

/** Resolved state standard deduction, exemptions, and personal/dependent credits in cents. */
export interface UsStateDeductionsResult {
	readonly standardDeductionCents: number
	readonly personalExemptionCents: number
	readonly dependentExemptionCents: number
	readonly personalCreditCents: number
	readonly dependentCreditCents: number
	readonly taxableIncomeCents: number
}

/**
 * Resolves state standard deductions, personal/dependent exemptions, and credits.
 *
 * Math: taxable = max(0, AGI - standard deduction - personal exemption - dependent exemptions).
 * Units: AGI is integer cents; parameter amounts are major dollars converted to integer cents.
 *
 * @param agiCents Federal adjusted gross income in integer cents.
 * @param status Filing status.
 * @param dependents Validated non-negative dependent count.
 * @param params State statutory parameter table.
 * @param currency Supported statutory currency threaded for minor-unit conversion.
 * @returns Resolved deduction, exemption, credit, and taxable-income amounts.
 */
export function calculateUsStateDeductions(
	agiCents: number,
	status: UsFilingStatus,
	dependents: number,
	params: UsStateParameters,
	currency: TaxSupportedCurrency,
): UsStateDeductionsResult {
	const standardDeductionCents = toMinorUnits(
		params.standardDeduction[status],
		currency,
		UsStateField.StandardDeduction,
	)
	const personalExemptionCents = toMinorUnits(
		params.personalExemption[status],
		currency,
		UsStateField.PersonalExemption,
	)
	const dependentExemptionCents = multiplySafeInteger(
		toMinorUnits(params.dependentExemption, currency, UsStateField.DependentExemption),
		dependents,
		UsStateField.DependentExemption,
	)
	const personalCreditCents = toMinorUnits(
		params.personalCredit[status],
		currency,
		UsStateField.CreditsPersonal,
	)
	const dependentCreditCents = multiplySafeInteger(
		toMinorUnits(params.dependentCredit, currency, UsStateField.CreditsDependent),
		dependents,
		UsStateField.CreditsDependent,
	)
	const taxableIncomeCents = Math.max(
		0,
		agiCents - standardDeductionCents - personalExemptionCents - dependentExemptionCents,
	)

	return {
		standardDeductionCents,
		personalExemptionCents,
		dependentExemptionCents,
		personalCreditCents,
		dependentCreditCents,
		taxableIncomeCents,
	}
}
