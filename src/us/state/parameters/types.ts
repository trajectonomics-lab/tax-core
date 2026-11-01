import type { TaxBracket } from "../../../core/brackets"
import type { UsFilingStatus, UsStateCode, UsStateTaxType } from "../../types"

/** Lower-bound and rate tuple for a state bracket tier, in major dollars and rate ratio. */
export type UsStateBracketTier = readonly [lowerDollars: number, rate: number]

/** Ordered list of state bracket lower bounds and statutory rates. */
export type UsStateBracketTiers = readonly UsStateBracketTier[]

/** Optional millionaire or high-income surtax applied above a taxable-income threshold. */
export interface UsStateSurtax {
	readonly threshold: number
	readonly rate: number
}

/** Compact statutory definition used by the parameter builder. */
export interface UsStateDefinition {
	readonly code: UsStateCode
	readonly name: string
	readonly type: UsStateTaxType
	readonly single: UsStateBracketTiers
	readonly mfj: UsStateBracketTiers
	readonly hoh?: UsStateBracketTiers
	readonly std: readonly [single: number, mfj: number, hoh?: number]
	readonly personalExemption?: readonly [single: number, mfj: number, hoh?: number]
	readonly personalCredit?: readonly [single: number, mfj: number, hoh?: number]
	readonly dependentExemption?: number
	readonly dependentCredit?: number
	readonly surtax?: UsStateSurtax
}

/** Complete statutory parameter table for one state's 2026 individual income tax. */
export interface UsStateParameters {
	readonly code: UsStateCode
	readonly name: string
	readonly type: UsStateTaxType
	readonly brackets: Record<UsFilingStatus, readonly TaxBracket[]>
	readonly standardDeduction: Record<UsFilingStatus, number>
	readonly personalExemption: Record<UsFilingStatus, number>
	readonly personalCredit: Record<UsFilingStatus, number>
	readonly dependentExemption: number
	readonly dependentCredit: number
	readonly surtax?: UsStateSurtax
}
