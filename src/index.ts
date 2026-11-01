export {
	type BracketEvaluationResult,
	type BracketSlice,
	evaluateBrackets,
	type TaxBracket,
} from "./core/brackets"

export {
	type ClampedAmount,
	clampCap,
	type StatutoryCapOptions,
} from "./core/caps"
export {
	applyPercentage,
	fromMinorUnits,
	type Money,
	money,
	type RoundingMode,
	roundHalfUp,
	type TaxSupportedCurrency,
	TaxValidationError,
	thb,
	toMinorUnits,
	usd,
	type ValidateAmountOptions,
	validateMonetaryAmount,
} from "./core/money"

export {
	calculateTax,
	type JurisdictionCode,
	type TaxResult,
	type TaxSystem,
} from "./core/system"
