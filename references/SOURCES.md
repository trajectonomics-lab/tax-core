# State tax reference sources

Raw official documents live in `references/states/` and are **git-ignored** (large, third-party,
re-downloadable). This manifest is the tracked record of where each came from and what it
verified. Retrieved 2026-11-01. Download with `curl -L -A "Mozilla/5.0 Chrome/126" <url>`; maine.gov,
mass.gov, tax.ri.gov and revenue.nebraska.gov refuse or time out `curl` and need a real browser.

**Important limit.** Most official documents here are *employer withholding* publications. They prove
rates, brackets and standard deductions only where the withholding method is the statutory schedule
(CA, KY, MO, ME, NY, MN, CT, HI). Where a withholding table is calibrated differently (Ohio 1.6% /
2.99% / 3.4%, North Dakota, Nebraska) it cannot confirm our statutory figures.

Status: **match** = engine agrees with the document; **mismatch** = engine is wrong; **unconfirmed** =
no official document read, only news or secondary reports.

## Read in an official document

| State | Local file | Source URL | Status |
| --- | --- | --- | --- |
| CA | `CA-2026-540-tax-rate-schedules.pdf` | https://www.ftb.ca.gov/forms/2026/2026-540-tax-rate-schedules.pdf | match (brackets, all 3 statuses). 2026 std deduction / credits not yet published (2025 × 1.034 agrees) |
| CT | `CT-ip-2026-1.pdf`, `CT-2026-withholding-tables.pdf` | https://portal.ct.gov/-/media/drs/publications/pubsip/2026/ip-2026-1.pdf | match (single / joint / HoH brackets; exemptions $12,000 / $15,000 / $19,000 / $24,000) |
| KY | `KY-2026-withholding-formula.pdf` | https://revenue.ky.gov/Forms/2026%20Withholding%20Formula.pdf | match (3.5%, $3,360) |
| MO | `MO-2026-withholding-formula.pdf` | https://dor.mo.gov/forms/Withholding%20Formula_2026.pdf | match (single thresholds $1,348 to $9,436; $16,100 std deduction) |
| MN | `MN-2026-inflation-adjusted-amounts.pdf`, `MN-2026-wh-inst.pdf` | https://www.revenue.state.mn.us/sites/default/files/2025-12/inflation-adjusted-amounts-2026.pdf | match (std deduction 15,300 / 30,600 / 23,000; dependent exemption $5,300). **Phase-outs modeled** (2026-11-03): standard deduction reduced 3% of AGI over $244,400 plus 10% over $337,800 (separate: half), capped at 80%, per Minn. Stat. § 290.0123 subd. 5 (text read at revisor.mn.gov, thresholds from this document); dependent exemption disallowed 2% per $2,500 over $244,500 single / $305,600 HoH / $366,700 joint / $183,350 separate ($1,250 steps), § 290.0121 subd. 2 |
| NY | `NY-2026-NYS-50-T-NYS.pdf` | https://www.tax.ny.gov/pdf/publications/withholding/nys50_t_nys.pdf | match for single brackets and the 3.9 / 4.4 / 5.15 / 5.4 / 5.9% rates. Married-status brackets are not shown in withholding form |
| ME | `ME-2026-wh-tab-instr-August2026.pdf` (downloads with a Chrome user agent) | https://www.maine.gov/revenue/sites/maine.gov.revenue/files/inline-files/26_wh_tab_instr_August2026.pdf | match (brackets, $5,300 exemption, $15,700 / $31,400 deduction). **Modeled** (2026-11-03): 2% surcharge on taxable income over $1,000,000 single, $1,500,000 joint and head of household, $750,000 separate (36 M.R.S. § 5111(7), read at legislature.maine.gov); standard deduction phase-out per § 5124-C(2): $102,250 to $177,250 single/separate, $204,550 to $354,550 joint. Head of household range ($153,400 to $265,900, width $112,500) is **derived**: statutory $120,000 start indexed by the same factor as the single and joint starts; not stated in any document read |
| NC | `NC-2026-NC30.pdf` | https://www.ncdor.gov/income-tax-withholding-tables-and-instructions-employers/open | match (3.99%, $12,750 threshold) |
| SC | `SC-2026-WH1603F.pdf`, `SC-2026-WH1603.pdf` | https://dor.sc.gov/sites/dor/files/forms/WH1603F_2026.pdf | match for 0% / 3% / 6% at $3,640 / $18,230. Reports of a later 1.99% / 5.21% schedule (H.4216) are unconfirmed |
| AR | `AR-2026-withholding-formula.pdf` | https://www.dfa.arkansas.gov/wp-content/uploads/whformula_2026.pdf | **fixed** (was mismatch): brackets are 0% to $5,599, 2% to $11,199, 3% to $15,999, 3.4% to $26,399, then 3.9%; the top rate became 3.7% retroactive to 2026-01-01 (H.B. 1001; revised formula of 2026-05-29 not downloaded). $2,470 deduction matches |
| HI | `HI-ann24-03.pdf`, `HI-2026-booklet-A.pdf` | https://files.hawaii.gov/tax/news/announce/ann24-03.pdf | **fixed** (was mismatch): 2026 std deduction is $8,000 single/MFS, $16,000 joint, $12,000 HoH (Act 46); engine has 4,400 / 8,800 / 6,424 |
| MD | `MD-2026-withholding-guide.pdf` | https://www.marylandcomptroller.gov/content/dam/mdcomp/tax/instructions/withholding/2026/withholding-guide.pdf | **fixed** (was mismatch): std deduction $3,400 single (joint $6,800 doubled, not stated) (engine $3,350 single / $6,700 joint) |
| GA | `GA-2026-employers-tax-guide-updated-june.pdf` | https://dor.georgia.gov/document/document/2026-employers-tax-guide-updated-june-2026/download | **fixed** (was mismatch): 4.99% from 2026-05-11 (5.19% before; engine uses the year rate), standard deduction $30,000 joint / $15,000 other, dependent allowance $5,000 (was $4,000) |
| WV | `WV-2026-SB392-sub1-enr.pdf` | https://code.wvlegislature.gov/signed_bills/2026%5C2026-RS-SB392-SUB1%20ENR_signed.pdf | **fixed** (was mismatch): W. Va. Code § 11-21-4j, taxable years from 2026-01-01: 2.11 / 2.81 / 3.16 / 4.22 / 4.58% at $10k / $25k / $40k / $60k; MFS table at half those thresholds |
| IA | `IA-2026-withholding-formula.pdf` | https://revenue.iowa.gov/media/53/download | match (3.80%) |
| OH | `OH-2026-percentage-method.pdf`, `OH-2026-optional-computer-formula.pdf` | https://dam.assets.ohio.gov/image/upload/tax.ohio.gov/employer_withholding/2026%20Withholding%20Tables/WHT_PercentageMethod_2026.pdf | partial: $26,050 threshold confirmed; withholding rates (1.6 / 2.99 / 3.4%) are not the statutory 2.75% |
| ND | `ND-2026-withholding-rates-booklet.pdf` | https://www.tax.nd.gov/sites/www/files/documents/forms/individual/2026-iit/2026-income-tax-withholding-rates-booklet.pdf | **unconfirmed**: withholding zero band is $57,625 single / $57,500 married, which does not map to our statutory $48,475 / $80,975 (probably 2025 values) |
| MS | `MS-2026-weekly-table.pdf` | https://www.dor.ms.gov/sites/default/files/business/Weekly2026.pdf | partial. Re-read 2026-11-03: the weekly table is a lookup keyed by exemption amount and does not state the 4% rate or the $2,300 / $4,600 deduction, so MS stays **unconfirmed** |
| MT | `MT-2026-publication-1.pdf` | https://revenuefiles.mt.gov/files/Forms/Publication-1/Publication-1-2026.pdf | partial: 5.65% confirmed; the publication says withholding uses the filing-status standard deduction but does not state brackets or amounts; $47,500 / $95,000 and $16,100 / $32,200 stay **unconfirmed** |
| OR | `OR-2026-withholding-tax-formulas.pdf`, `OR-2026-withholding-tax-tables.pdf` | https://www.oregon.gov/dor/forms/FormsPubs/withholding-tax-tables_206-430_2026.pdf | partial. Re-read 2026-11-03: the file still states the 2025 amounts ($2,910 / $5,820 deduction, $256 credit), which match the engine, so 2026 amounts remain **unconfirmed** |
| VT | `VT-2026-GB-1210.pdf` | https://tax.vermont.gov/sites/tax/files/documents/GB-1210-2026.pdf | **likely mismatch, not yet fixed**: withholding band widths are about 2.7% larger than ours (single 3.35% band 50,750 vs 49,400; joint 84,700 vs 82,500), so our thresholds look like 2025 values. Exact 2026 statutory thresholds not stated; the withholding booklet uses allowances, not the statutory schedule. Re-checked 2026-11-03: legislature.vermont.gov did not respond and web results are only vendor summaries that disagree with each other, so thresholds stay **unconfirmed** until the Department of Taxes publishes the 2026 rate schedules |
| CO | `CO-2026-DR0004.pdf` | https://tax.colorado.gov/sites/tax/files/documents/DR_0004_2026.pdf | partial (allowance form only) |
| LA | `LA-2026-RIB-26-005.pdf` | https://dam.ldr.la.gov/lawspolicies/RIB%2026-005-Updated%20Withholding%20Tables.pdf | **fixed** (2026-11-03): std deduction $12,875 single/separate, $25,750 joint, qualifying surviving spouse and **head of household** (engine had 1.5x single for HoH). Bulletin says the amounts are a CPI-U estimate as of 2025-12-01 and the official 2026 amounts may differ slightly |
| UT | `UT-2026-SB0060-enrolled.pdf` | https://le.utah.gov/Session/2026/bills/enrolled/SB0060.pdf (via web.archive.org snapshot 20261008030309) | **fixed** (2026-11-05): individual income tax rate reduced from 4.5% to 4.45% under Utah Code § 59-10-104(2)(b) as amended by S.B. 60 (2026 General Session), effective retrospectively for taxable years beginning on or after 2026-01-01 |

## Reported but not read in an official document

- **MA**: surtax threshold $1,107,750 (2026 Form 1-ES instructions) agrees; mass.gov blocks `curl`.
- **MI**: 4.25%, $5,900 exemption agree with reports of Form 446; michigan.gov blocks `curl`.
- **IL** 4.95% / $2,925, **IN** 2.95%, **ID** 5.3%: agree with reports; official files timed out.
- **VA**: $8,750 / $17,500 deduction for 2025 and 2026 agrees with reports; file timed out.

## Not yet collected

AL, DE, KS, NE, NJ, NM, OK, PA, RI, WI, DC (searches returned only older-year or blocked documents; the 2026 forms for several states are not yet published). The Oregon "2026" formula file contains 2025 amounts.
