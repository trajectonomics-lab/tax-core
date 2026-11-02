import type { BracketEvaluationResult } from "../../core/brackets"
import { fromMinorUnits, type Money, type TaxSupportedCurrency, usd } from "../../core/money"
import type { UsStateBreakdown } from "../types"
import { UsStateField } from "../types/state-fields"
import type { UsStateCreditsResult } from "./credits"
import type { UsStateDeductionsResult } from "./deductions"
import type { UsStateParameters } from "./parameters/types"

/** Inputs required to assemble a state tax audit breakdown. */
export interface BuildUsStateBreakdownParams {
	readonly params: UsStateParameters
	readonly agiCents: number
	readonly deductions: UsStateDeductionsResult
	readonly evaluation: BracketEvaluationResult
	readonly surtaxCents: number
	readonly taxBeforeCreditsCents: number
	readonly credits: UsStateCreditsResult
	readonly effectiveRate: number
	readonly marginalRate: number
	readonly currency: TaxSupportedCurrency
}

/**
 * Converts integer cents to non-negative USD Money tagged with its diagnostic field.
 *
 * Units: Input is integer minor units; output is major-unit Money.
 * Throws: TaxValidationError if the amount is negative or not a safe integer.
 */
function money(cents: number, currency: TaxSupportedCurrency, field: UsStateField): Money<"USD"> {
	return usd(fromMinorUnits(cents, currency, field), field)
}

/**
 * Assembles the audit breakdown for one state individual income tax calculation.
 *
 * Purpose: Packages every deduction, exemption, bracket slice, surtax, credit, and withholding
 * figure so callers can audit the state liability.
 * Units: All monetary inputs are integer cents; outputs are major-unit Money.
 * Throws: TaxValidationError if any component amount is negative or not a safe integer
 * (net payable may be negative).
 *
 * @param p State calculation amounts and statutory parameters.
 * @returns Complete state tax audit breakdown.
 * @statute State individual income tax statutes; see per-state parameter tables.
 */
export function buildUsStateBreakdown(p: BuildUsStateBreakdownParams): UsStateBreakdown {
	const { currency, deductions: d, credits: c } = p
	return {
		code: p.params.code,
		name: p.params.name,
		type: p.params.type,
		agi: money(p.agiCents, currency, UsStateField.Agi),
		standardDeduction: money(d.standardDeductionCents, currency, UsStateField.StandardDeduction),
		personalExemption: money(d.personalExemptionCents, currency, UsStateField.PersonalExemption),
		dependentExemption: money(d.dependentExemptionCents, currency, UsStateField.DependentExemption),
		taxableIncome: money(d.taxableIncomeCents, currency, UsStateField.TaxableIncome),
		slices: p.evaluation.slices,
		bracketTax: money(p.evaluation.totalTax, currency, UsStateField.BracketTax),
		surtax: money(p.surtaxCents, currency, UsStateField.Surtax),
		taxBeforeCredits: money(p.taxBeforeCreditsCents, currency, UsStateField.TaxBeforeCredits),
		credits: {
			personal: money(d.personalCreditCents, currency, UsStateField.CreditsPersonal),
			dependent: money(d.dependentCreditCents, currency, UsStateField.CreditsDependent),
			claimedNonRefundable: money(
				c.claimedNonRefundableCents,
				currency,
				UsStateField.CreditsClaimedNonRefundable,
			),
			allowedNonRefundable: money(
				c.allowedNonRefundableCents,
				currency,
				UsStateField.CreditsNonRefundable,
			),
			refundable: money(c.refundableCents, currency, UsStateField.CreditsRefundable),
		},
		totalTax: money(c.totalTaxCents, currency, UsStateField.TotalTax),
		withholding: money(c.withholdingCents, currency, UsStateField.Withholding),
		netTaxPayable: usd(
			fromMinorUnits(c.netTaxCents, currency, UsStateField.NetTaxPayable, { allowNegative: true }),
			UsStateField.NetTaxPayable,
			{ allowNegative: true },
		),
		effectiveRate: p.effectiveRate,
		marginalRate: p.marginalRate,
	}
}
