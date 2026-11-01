import type { BracketEvaluationResult } from "../../core/brackets"
import { fromMinorUnits, type TaxSupportedCurrency, usd } from "../../core/money"
import type { UsStateBreakdown } from "../types"
import { UsStateField } from "../types/state-fields"
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
	readonly claimedNonRefundableCents: number
	readonly allowedNonRefundableCents: number
	readonly refundableCents: number
	readonly totalTaxCents: number
	readonly withholdingCents: number
	readonly netTaxCents: number
	readonly effectiveRate: number
	readonly marginalRate: number
	readonly currency: TaxSupportedCurrency
}

function dollars(cents: number, currency: TaxSupportedCurrency, field: string): number {
	return fromMinorUnits(cents, currency, field)
}

/**
 * Assembles the audit breakdown for one state individual income tax calculation.
 *
 * Units: All monetary inputs and outputs are integer cents converted to major-dollar Money.
 *
 * @param p State calculation amounts and statutory parameters.
 * @returns Complete state tax audit breakdown.
 */
export function buildUsStateBreakdown(p: BuildUsStateBreakdownParams): UsStateBreakdown {
	const currency = p.currency
	return {
		code: p.params.code,
		name: p.params.name,
		type: p.params.type,
		agi: usd(dollars(p.agiCents, currency, UsStateField.Agi)),
		standardDeduction: usd(
			dollars(p.deductions.standardDeductionCents, currency, UsStateField.StandardDeduction),
		),
		personalExemption: usd(
			dollars(p.deductions.personalExemptionCents, currency, UsStateField.PersonalExemption),
		),
		dependentExemption: usd(
			dollars(p.deductions.dependentExemptionCents, currency, UsStateField.DependentExemption),
		),
		taxableIncome: usd(
			dollars(p.deductions.taxableIncomeCents, currency, UsStateField.TaxableIncome),
		),
		slices: p.evaluation.slices,
		bracketTax: usd(dollars(p.evaluation.totalTax, currency, UsStateField.BracketTax)),
		surtax: usd(dollars(p.surtaxCents, currency, UsStateField.Surtax)),
		taxBeforeCredits: usd(dollars(p.taxBeforeCreditsCents, currency, UsStateField.TotalTax)),
		credits: {
			personal: usd(
				dollars(p.deductions.personalCreditCents, currency, UsStateField.CreditsPersonal),
			),
			dependent: usd(
				dollars(p.deductions.dependentCreditCents, currency, UsStateField.CreditsDependent),
			),
			claimedNonRefundable: usd(
				dollars(p.claimedNonRefundableCents, currency, UsStateField.CreditsNonRefundable),
			),
			allowedNonRefundable: usd(
				dollars(p.allowedNonRefundableCents, currency, UsStateField.CreditsNonRefundable),
			),
			refundable: usd(dollars(p.refundableCents, currency, UsStateField.CreditsRefundable)),
		},
		totalTax: usd(dollars(p.totalTaxCents, currency, UsStateField.TotalTax)),
		withholding: usd(dollars(p.withholdingCents, currency, UsStateField.Withholding)),
		netTaxPayable: usd(
			fromMinorUnits(p.netTaxCents, currency, UsStateField.NetTaxPayable, {
				allowNegative: true,
			}),
			UsStateField.NetTaxPayable,
			{ allowNegative: true },
		),
		effectiveRate: p.effectiveRate,
		marginalRate: p.marginalRate,
	}
}
