import type { UsStateParameters } from "../types"
import { FLAT_STATES_A } from "./flat-a"
import { FLAT_STATES_B } from "./flat-b"

/** Statutory parameter table for all 2026 flat-rate state individual income taxes. */
export const FLAT_STATES: readonly UsStateParameters[] = [...FLAT_STATES_A, ...FLAT_STATES_B]
