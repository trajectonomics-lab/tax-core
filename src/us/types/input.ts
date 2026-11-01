import type { UsCreditsInput } from "./credits-input"
import type { UsStateCode, UsStateCreditsInput } from "./state"

/** Four statutory US Federal individual income tax filing statuses (IRC § 1). */
export type UsFilingStatus =
	| "single"
	| "married_filing_jointly"
	| "married_filing_separately"
	| "head_of_household"

/** Gross income components categorized by tax treatment (IRC §§ 61, 1(h)). */
export interface UsIncomeInput {
	readonly w2Wages?: number
	readonly selfEmploymentNetEarnings?: number
	readonly ordinaryInterest?: number
	readonly ordinaryDividends?: number
	readonly shortTermCapitalGains?: number
	readonly rentalAndOtherOrdinaryIncome?: number
	readonly longTermCapitalGains?: number
	readonly qualifiedDividends?: number
}

/** Schedule 1 Above-the-Line Adjustments to income (IRC §§ 62, 219, 223, 221). */
export interface UsAdjustmentsInput {
	readonly educatorExpenses?: number
	readonly bothSpousesEducators?: boolean
	readonly hsaContributions?: number
	readonly hsaCoverageType?: "self_only" | "family"
	readonly traditionalIraContributions?: number
	readonly studentLoanInterest?: number
	readonly preTaxDeferrals401k?: number
	readonly age50OrOlder?: boolean
	readonly age55OrOlder?: boolean
	readonly deductibleSelfEmploymentTax?: number
}

/** Schedule A Itemized Deductions (IRC §§ 164, 170, 213). */
export interface UsItemizedDeductionsInput {
	readonly medicalExpenses?: number
	readonly stateAndLocalTaxes?: number
	readonly mortgageInterest?: number
	readonly charitableContributions?: number
}

/** Complete statutory input for US Federal Individual Income Tax calculation. */
export interface UsTaxInput {
	readonly taxYear?: 2026 | number
	readonly filingStatus: UsFilingStatus
	readonly income: UsIncomeInput
	readonly adjustments?: UsAdjustmentsInput
	readonly itemizedDeductions?: UsItemizedDeductionsInput
	readonly deductionElection?: "auto" | "standard" | "itemized"
	readonly taxpayerAge65OrOlder?: boolean
	readonly taxpayerBlind?: boolean
	readonly spouseAge65OrOlder?: boolean
	readonly spouseBlind?: boolean
	readonly withholding?: number
	readonly netInvestmentIncome?: number
	readonly magi?: number
	/** Include W-2 FICA payroll taxes (default: true). */
	readonly includeFica?: boolean
	/** Form 6251 AMT tax preferences (e.g. ISO exercise bargain element). */
	readonly amtPreferences?: number
	/** Non-refundable and refundable tax credits input. */
	readonly credits?: UsCreditsInput
	/** Optional US state or District of Columbia ISO code for state income tax. */
	readonly state?: UsStateCode
	/** Number of dependents claimed for state dependent exemptions or credits. */
	readonly stateDependents?: number
	/** State income tax withheld from wages in major dollars. */
	readonly stateWithholding?: number
	/** State non-refundable and refundable credits in major dollars. */
	readonly stateCredits?: UsStateCreditsInput
}
