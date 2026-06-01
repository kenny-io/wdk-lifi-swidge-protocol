# Changelog

All notable changes to this project will be documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.2] — 2026-06-01

### Fixed
- `_resolveToToken` now performs a proper destination-chain token lookup instead of passing the source symbol directly. The old approach failed for tokens that are rebranded on the destination chain (e.g. Ethereum USDT → Arbitrum USDT0). Resolution now fetches source token metadata, searches the destination chain's token list, and selects the highest-market-cap stablecoin matching symbol, `coinKey`, or a `{symbol}0` variant.
- All typed error classes now asserted by class (not message string) in the unit test suite.
- `LifiQuoteError` was missing from test imports, causing four tests to pass vacuously.

### Changed
- Integration tests overhauled: split into three credential tiers, Tier 1 (discovery) runs against the live LI.FI API without any env vars, Tier 2 (quotes) runs against mainnet tokens without funds.
- Status test updated: the all-zeros hash resolves to a real LI.FI transaction (HTTP 200); the test now uses a genuinely non-existent hash that returns 404.

## [0.1.1] — 2026-06-01

### Fixed
- Repository URL updated to `github.com/kenny-io/wdk-lifi-swidge-protocol`.
- Support channel updated to `help.li.fi/hc/en-us`.

## [0.1.0] — 2026-06-01

### Added
- Initial implementation of `LifiSwidgeProtocol` extending `SwidgeProtocol` from `@tetherto/wdk-wallet@1.0.0-beta.9`.
- `quoteSwidge(options)` — non-binding quote supporting exact-in and exact-out modes.
- `swidge(options, config)` — executes swap, bridge, or combined swap+bridge via LI.FI.
- `getSwidgeStatus(id, options)` — polls LI.FI status API, maps to canonical `SwidgeStatus` values.
- `getSupportedChains()` — returns all chains supported by LI.FI.
- `getSupportedTokens(options)` — returns supported tokens, optionally scoped by chain.
- Automatic ERC-20 approval handling (exact minimum, reset-to-zero for USDT-like tokens).
- ERC-4337 smart account support via `WalletAccountEvmErc4337`.
- Typed error classes: `LifiConfigurationError`, `LifiQuoteError`, `LifiExecutionError`, `LifiStatusError`, `LifiReadOnlyAccountError`, `LifiUnsupportedChainError`.
- `maxNetworkFeeBps` and `maxProtocolFeeBps` fee caps at protocol and per-call level.
- `order`, `allowBridges`, `denyBridges`, `integrator`, `apiKey` config options.
- Zero new runtime dependencies beyond `ethers` and `bare-node-runtime`.
