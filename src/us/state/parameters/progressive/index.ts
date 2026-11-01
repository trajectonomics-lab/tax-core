import type { UsStateParameters } from "../types"
import { US_2026_STATE_AL } from "./al"
import { US_2026_STATE_AR } from "./ar"
import { US_2026_STATE_CA } from "./ca"
import { US_2026_STATE_CT } from "./ct"
import { US_2026_STATE_DC } from "./dc"
import { US_2026_STATE_DE } from "./de"
import { US_2026_STATE_HI } from "./hi"
import { US_2026_STATE_KS } from "./ks"
import { US_2026_STATE_LA } from "./la"
import { US_2026_STATE_MD } from "./md"
import { US_2026_STATE_ME } from "./me"
import { US_2026_STATE_MN } from "./mn"
import { US_2026_STATE_MO } from "./mo"
import { US_2026_STATE_MT } from "./mt"
import { US_2026_STATE_ND } from "./nd"
import { US_2026_STATE_NE } from "./ne"
import { US_2026_STATE_NJ } from "./nj"
import { US_2026_STATE_NM } from "./nm"
import { US_2026_STATE_NY } from "./ny"
import { US_2026_STATE_OH } from "./oh"
import { US_2026_STATE_OK } from "./ok"
import { US_2026_STATE_OR } from "./or"
import { US_2026_STATE_RI } from "./ri"
import { US_2026_STATE_SC } from "./sc"
import { US_2026_STATE_VA } from "./va"
import { US_2026_STATE_VT } from "./vt"
import { US_2026_STATE_WI } from "./wi"
import { US_2026_STATE_WV } from "./wv"

const STATES: readonly UsStateParameters[] = [
	US_2026_STATE_LA,
	US_2026_STATE_AL,
	US_2026_STATE_AR,
	US_2026_STATE_CA,
	US_2026_STATE_CT,
	US_2026_STATE_DE,
	US_2026_STATE_DC,
	US_2026_STATE_HI,
	US_2026_STATE_KS,
	US_2026_STATE_ME,
	US_2026_STATE_MD,
	US_2026_STATE_MN,
	US_2026_STATE_MO,
	US_2026_STATE_MT,
	US_2026_STATE_NE,
	US_2026_STATE_NJ,
	US_2026_STATE_NM,
	US_2026_STATE_NY,
	US_2026_STATE_ND,
	US_2026_STATE_OH,
	US_2026_STATE_OK,
	US_2026_STATE_OR,
	US_2026_STATE_RI,
	US_2026_STATE_SC,
	US_2026_STATE_VT,
	US_2026_STATE_VA,
	US_2026_STATE_WV,
	US_2026_STATE_WI,
]

/** Statutory parameter table for all 2026 graduated-rate state individual income taxes. */
export const PROGRESSIVE_STATES: readonly UsStateParameters[] = STATES
