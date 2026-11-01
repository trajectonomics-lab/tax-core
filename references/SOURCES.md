# State tax reference sources

Raw official documents live in `references/states/` and are **git-ignored** (large, third-party,
and re-downloadable). This manifest is the tracked record of where each came from and what it
verified. Retrieved 2026-11-01. Download with `curl -L -A "Mozilla/5.0 Chrome/126" <url>` (some
sites, e.g. maine.gov, also need a real browser).

Status: **match** = engine data agrees with the document; **mismatch** = engine data is wrong;
**partial** = document checked only in part.

| State | Local file | Source URL | Status |
| --- | --- | --- | --- |
| CA | `CA-2026-540-tax-rate-schedules.pdf` | https://www.ftb.ca.gov/forms/2026/2026-540-tax-rate-schedules.pdf | match (brackets, all 3 statuses); 2026 std deduction and credits not yet published (2025 × 1.034 agrees) |
| ME | (browser only) | https://www.maine.gov/revenue/sites/maine.gov.revenue/files/inline-files/26_wh_tab_instr_August2026.pdf | match (brackets, $5,300 exemption, $15,700 / $31,400 deduction); **gaps**: 2% surcharge over $1M single / $1.5M married, deduction phase-out $102,250–$177,250 single, $204,550–$354,550 joint |
| AR | `AR-2026-withholding-formula.pdf` | https://www.dfa.arkansas.gov/wp-content/uploads/whformula_2026.pdf | **mismatch**: brackets are 0% to $5,599, 2% to $11,199, 3% to $15,999, 3.4% to $26,399, then 3.9%; the 3.9% top rate became 3.7% retroactive to 2026-01-01 (H.B. 1001, DFA revision of 2026-05-29, not downloaded); standard deduction $2,470 matches |
| CO | `CO-2026-DR0004.pdf` | https://tax.colorado.gov/sites/tax/files/documents/DR_0004_2026.pdf | partial (allowance form only; no rate table) |
| DE | `DE-nonresident-withholding-worksheet.pdf` | https://revenuefiles.delaware.gov/docs/10_WithholdingWorksheet_NonResident.pdf | partial, not checked |
| HI | `HI-ann24-03.pdf`, `HI-2026-booklet-A.pdf` | https://files.hawaii.gov/tax/news/announce/ann24-03.pdf, https://files.hawaii.gov/tax/news/pubs/25BkltA.pdf | **mismatch**: 2026 standard deduction is $8,000 single/MFS, $16,000 joint, $12,000 head of household (Act 46); engine uses the 2024–25 amounts 4,400 / 8,800 / 6,424 |
| IA | `IA-2026-withholding-formula.pdf` | https://revenue.iowa.gov/media/53/download | match (3.80% rate) |
| LA | `LA-2026-RIB-26-005.pdf` | https://dam.ldr.la.gov/lawspolicies/RIB%2026-005-Updated%20Withholding%20Tables.pdf | partial, not checked |

## Found by search but not downloaded (official pages timed out or 404)

- **GA**: DOR revised its 2026 withholding guide on 2026-06-17 (HB 463 / HB 1199): flat rate **4.99%**
  and standard deduction $15,000 / $30,000. Engine still has 5.19% and $12,000 / $24,000. Not yet
  confirmed against the official file (`dor.georgia.gov` document URL returned 404).
- **IN**: state rate 2.95% from 2026-01-01 (agrees with engine); Departmental Notice #1 timed out.
- **IL**: 4.95%, exemption $2,925 (agrees); Comptroller bulletin timed out.
- **ID**: withholding tables revised 2026-07-31 (child credit sunset); rate 5.3%.

## Not yet collected

AL, CT, KS, KY, MD, MA, MI, MN, MS, MO, MT, NE, NJ, NM, NY, NC, ND, OK, OR, PA, RI, SC, UT, VT, VA,
WV, WI, DC.
