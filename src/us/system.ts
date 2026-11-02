import type { TaxResult, TaxSystem } from "../core/system"
import { executeUsTaxCalculation } from "./calculate"
import type { UsTaxBreakdown, UsTaxInput } from "./types"

/**
 * US Federal and state Individual Income Tax System implementation for 2026.
 *
 * @statute IRC § 1 et seq.; state individual income tax statutes for Tax Year 2026.
 */
export const us: TaxSystem<UsTaxInput, "USD", UsTaxBreakdown> = {
	jurisdiction: "US",
	taxYear: 2026,
	currency: "USD",
	calculate(input: UsTaxInput): TaxResult<"USD", UsTaxBreakdown> {
		return executeUsTaxCalculation(input)
	},
}

/**
 * Calculates 2026 US federal and optional state Individual Income Tax for the specified input.
 *
 * @statute IRC § 1 et seq.; state individual income tax statutes for Tax Year 2026.
 */
export function calculateUsTax(input: UsTaxInput): TaxResult<"USD", UsTaxBreakdown> {
	return us.calculate(input)
}
