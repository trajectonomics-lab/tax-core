# @trajectonomics/tax

Pure, deterministic statutory tax calculation engine with subpaths for Thailand (`@trajectonomics/tax/th`) and the United States (`@trajectonomics/tax/us`), covering 2026 federal tax plus all 50 state income tax systems and the District of Columbia.

## United States State Tax

`calculateUsTax` accepts an optional `state` code (`AL` through `WY` plus `DC`). When present, the result includes `breakdown.state` with state taxable income, bracket slices, personal/dependent credits, state withholding, and net state tax, and the state liability is folded into the top-level `totalTax` and `netTaxPayable`.

- Nine no-income-tax states (`AK`, `FL`, `NV`, `NH`, `SD`, `TN`, `TX`, `WA`, `WY`) return zero state tax and zero state rates.
- Fourteen flat-rate states and twenty-seven graduated-rate states plus `DC` use their 2026 standard deductions, personal/dependent exemptions, and statutory bracket tables.
- `MA` includes the 4% millionaire surtax and `CA` includes the 1% mental health services surtax.
- State inputs also include `stateDependents`, `stateWithholding`, and `stateCredits` (`nonRefundable` / `refundable`).
- State calculations start from federal AGI and apply the state standard deduction, personal/dependent exemptions or credits, and the state bracket table. Local/city income taxes, state itemized deductions, and income-tested phase-outs not encoded in the parameter tables are out of scope.

## Commands

- `bun run check`: Complete verification suite (`lint`, `typecheck`, `test` with 100% coverage, `build`, `lint:package`).
- `bun run build`: Build ESM and CJS bundles via `tsdown`.
- `bun test`: Run test suite with 100% coverage enforcement.
- `bun run typecheck`: Run strict TypeScript compiler checks.
- `bun run lint`: Lint with Biome (zero warnings allowed).
- `bun run format`: Auto-format and organize imports with Biome.
- `bun run lint:package`: Validate package manifests and type exports with `publint` and `@arethetypeswrong/cli`.

## Releasing

Versions are computed, never edited by hand (`package.json` says `0.0.0-development` on purpose). `scripts/version.ts` reads the last `vX.Y.Z` git tag and the conventional commit messages since then:

| Commits since last release | Bump |
| --- | --- |
| any `feat!:` / `fix!:` / `BREAKING CHANGE:` | major (minor while on 0.x) |
| any `feat:` | minor |
| anything else | patch |

- **Alpha, automatic:** Every merge to `main` that touches code publishes `<next>-alpha.<n>` under the npm dist-tag `alpha` (`bun add @trajectonomics/tax@alpha`). `n` counts up per upcoming version.
- **Stable, on demand:** Actions → Release → Run workflow (on `main`). It publishes `<next>` under `latest`, tags `vX.Y.Z`, and creates a GitHub release with generated notes. The bump input overrides the computed one; pick `major` to cut 1.0.0.

PR titles must be conventional commits (enforced by the `PR title` check) because squash-merge commit subjects become the basis for version calculation.

Preview the next version locally:

```bash
bun scripts/version.ts --channel alpha
bun scripts/version.ts --channel stable
```

## License

MIT
