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
| MN | `MN-2026-inflation-adjusted-amounts.pdf`, `MN-2026-wh-inst.pdf` | https://www.revenue.state.mn.us/sites/default/files/2025-12/inflation-adjusted-amounts-2026.pdf | match (std deduction 15,300 / 30,600 / 23,000; dependent exemption $5,300). Not modeled: deduction and exemption phase-outs above $244,400 |
| NY | `NY-2026-NYS-50-T-NYS.pdf` | https://www.tax.ny.gov/pdf/publications/withholding/nys50_t_nys.pdf | match for single brackets and the 3.9 / 4.4 / 5.15 / 5.4 / 5.9% rates. Married-status brackets are not shown in withholding form |
| ME | (browser only) | https://www.maine.gov/revenue/sites/maine.gov.revenue/files/inline-files/26_wh_tab_instr_August2026.pdf | match (brackets, $5,300 exemption, $15,700 / $31,400 deduction). **Gaps**: 2% surcharge over $1M single / $1.5M married; deduction phase-out $102,250 to $177,250 single, $204,550 to $354,550 joint |
| NC | `NC-2026-NC30.pdf` | https://www.ncdor.gov/income-tax-withholding-tables-and-instructions-employers/open | match (3.99%, $12,750 threshold) |
| SC | `SC-2026-WH1603F.pdf`, `SC-2026-WH1603.pdf` | https://dor.sc.gov/sites/dor/files/forms/WH1603F_2026.pdf | match for 0% / 3% / 6% at $3,640 / $18,230. Reports of a later 1.99% / 5.21% schedule (H.4216) are unconfirmed |
| AR | `AR-2026-withholding-formula.pdf` | https://www.dfa.arkansas.gov/wp-content/uploads/whformula_2026.pdf | **mismatch**: brackets are 0% to $5,599, 2% to $11,199, 3% to $15,999, 3.4% to $26,399, then 3.9%; the top rate became 3.7% retroactive to 2026-01-01 (H.B. 1001; revised formula of 2026-05-29 not downloaded). $2,470 deduction matches |
| HI | `HI-ann24-03.pdf`, `HI-2026-booklet-A.pdf` | https://files.hawaii.gov/tax/news/announce/ann24-03.pdf | **mismatch**: 2026 std deduction is $8,000 single/MFS, $16,000 joint, $12,000 HoH (Act 46); engine has 4,400 / 8,800 / 6,424 |
| MD | `MD-2026-withholding-guide.pdf` | https://www.marylandcomptroller.gov/content/dam/mdcomp/tax/instructions/withholding/2026/withholding-guide.pdf | **mismatch**: std deduction $3,400 (engine $3,350 single / $6,700 joint) |
| IA | `IA-2026-withholding-formula.pdf` | https://revenue.iowa.gov/media/53/download | match (3.80%) |
| OH | `OH-2026-percentage-method.pdf`, `OH-2026-optional-computer-formula.pdf` | https://dam.assets.ohio.gov/image/upload/tax.ohio.gov/employer_withholding/2026%20Withholding%20Tables/WHT_PercentageMethod_2026.pdf | partial: $26,050 threshold confirmed; withholding rates (1.6 / 2.99 / 3.4%) are not the statutory 2.75% |
| ND | `ND-2026-withholding-rates-booklet.pdf` | https://www.tax.nd.gov/sites/www/files/documents/forms/individual/2026-iit/2026-income-tax-withholding-rates-booklet.pdf | **unconfirmed**: withholding zero band is $57,625 single / $57,500 married, which does not map to our statutory $48,475 / $80,975 (probably 2025 values) |
| MS | `MS-2026-weekly-table.pdf` | https://www.dor.ms.gov/sites/default/files/business/Weekly2026.pdf | partial, values not yet read |
| MT | `MT-2026-publication-1.pdf` | https://revenuefiles.mt.gov/files/Forms/Publication-1/Publication-1-2026.pdf | partial: 5.65% confirmed; federal standard deduction used |
| OR | `OR-2026-withholding-tax-formulas.pdf`, `OR-2026-withholding-tax-tables.pdf` | https://www.oregon.gov/dor/forms/FormsPubs/withholding-tax-tables_206-430_2026.pdf | partial, values not yet read |
| CO | `CO-2026-DR0004.pdf` | https://tax.colorado.gov/sites/tax/files/documents/DR_0004_2026.pdf | partial (allowance form only) |
| LA | `LA-2026-RIB-26-005.pdf` | https://dam.ldr.la.gov/lawspolicies/RIB%2026-005-Updated%20Withholding%20Tables.pdf | partial, not checked |

## Reported but not read in an official document

- **GA**: revised 2026 guide (2026-06-17): rate **4.99%**, std deduction $15,000 / $30,000; engine has 5.19% and
  $12,000 / $24,000. `dor.georgia.gov` document URL returned 404.
- **UT**: Pub. 14 revision (2026-04-27): rate **4.45%**, retroactive to 2026-01-01; engine has 4.5%.
- **WV**: SB 392 (2026-03-31) 5% cut retroactive to 2026-01-01; engine has the 2025 rates (2.22 to 4.82%).
- **MA**: surtax threshold $1,107,750 (2026 Form 1-ES instructions) agrees; mass.gov blocks `curl`.
- **MI**: 4.25%, $5,900 exemption agree with reports of Form 446; michigan.gov blocks `curl`.
- **IL** 4.95% / $2,925, **IN** 2.95%, **ID** 5.3%: agree with reports; official files timed out.
- **VA**: $8,750 / $17,500 deduction for 2025 and 2026 agrees with reports; file timed out.

## Not yet collected

AL, DE, KS, NE, NJ, NM, OK, PA, RI, VT, WI, DC.
