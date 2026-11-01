/**
 * Currencies the tax engine accounts in: one statutory currency per supported jurisdiction.
 *
 * Purpose: Compile-time gate for every monetary API. Callers map their own currency codes
 * onto this union; there is no runtime validation or fallback.
 * @statute Thai Revenue Code (THB) and US Internal Revenue Code (USD) both require
 * amounts to be stated in the domestic currency.
 */
export type TaxSupportedCurrency = "THB" | "USD"

/**
 * Minor-unit precision (fractional decimal digits) per supported currency.
 *
 * Units: THB 2 (1 baht = 100 satang), USD 2 (1 dollar = 100 cents).
 * Internal to the money module; not part of the public package API.
 */
export const CURRENCY_PRECISION: Readonly<Record<TaxSupportedCurrency, number>> = {
	THB: 2,
	USD: 2,
}
