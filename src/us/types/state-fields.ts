/**
 * Diagnostic and reporting field identifiers for state income tax calculations.
 */
export enum UsStateField {
	Code = "state.code",
	Agi = "state.agi",
	StandardDeduction = "state.standardDeduction",
	PersonalExemption = "state.personalExemption",
	DependentExemption = "state.dependentExemption",
	TaxableIncome = "state.taxableIncome",
	BracketTax = "state.bracketTax",
	Surtax = "state.surtax",
	CreditsPersonal = "state.credits.personal",
	CreditsDependent = "state.credits.dependent",
	CreditsNonRefundable = "state.credits.nonRefundable",
	CreditsRefundable = "state.credits.refundable",
	Withholding = "state.withholding",
	TotalTax = "state.totalTax",
	NetTaxPayable = "state.netTaxPayable",
}
