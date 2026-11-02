import { multiplySafeInteger, type TaxSupportedCurrency, toMinorUnits } from "../../core/money"
import type { UsFilingStatus } from "../types"
import { UsStateField } from "../types/state-fields"
import type { UsStateParameters } from "./parameters/types"
import { applyUsStatePhaseOut } from "./phase-out"

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
 * Math: taxable = max(0, AGI - standard deduction - personal exemption - dependent exemptions),
 * where the standard deduction and dependent exemptions first pass any statutory phase-out.
 * Units: AGI is integer cents; parameter amounts are major dollars converted to integer cents.
 * Throws: TaxValidationError if a parameter amount or the dependent product is not a safe
 * integer number of cents.
 *
 * @param agiCents Federal adjusted gross income in integer cents.
 * @param status Filing status.
 * @param dependents Validated non-negative dependent count.
 * @param params State statutory parameter table.
 * @param currency Supported statutory currency threaded for minor-unit conversion.
 * @returns Resolved deduction, exemption, credit, and taxable-income amounts.
 * @statute State individual income tax statutes; see per-state parameter tables.
 */
export function calculateUsStateDeductions(
	agiCents: number,
	status: UsFilingStatus,
	dependents: number,
	params: UsStateParameters,
	currency: TaxSupportedCurrency,
): UsStateDeductionsResult {
	const standardDeductionCents = applyUsStatePhaseOut(
		toMinorUnits(params.standardDeduction[status], currency, UsStateField.StandardDeduction),
		agiCents,
		status,
		params.standardDeductionPhaseOut,
		currency,
	)
	const personalExemptionCents = toMinorUnits(
		params.personalExemption[status],
		currency,
		UsStateField.PersonalExemption,
	)
	const dependentExemptionCents = applyUsStatePhaseOut(
		multiplySafeInteger(
			toMinorUnits(params.dependentExemption, currency, UsStateField.DependentExemption),
			dependents,
			UsStateField.DependentExemption,
		),
		agiCents,
		status,
		params.dependentExemptionPhaseOut,
		currency,
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
