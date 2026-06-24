/**
 * WDK Swidge protocol backed by the LI.FI REST API. Provides quotes, execution,
 * and status tracking for swap, bridge, and combined swap+bridge operations
 * across all chains supported by LI.FI.
 */
export default class LifiSwidgeProtocol extends SwidgeProtocol {
    /**
     * Creates a new LI.FI Swidge protocol without a bound wallet account.
     * Only `quoteSwidge`, `getSupportedChains`, and `getSupportedTokens` are available.
     *
     * @overload
     * @param {undefined} [account] - No account; quote and discovery methods only.
     * @param {LifiSwidgeProtocolConfig} [config] - Fee caps, LI.FI routing options, and reliability/security settings.
     */
    constructor(account?: undefined, config?: LifiSwidgeProtocolConfig | undefined);
    /**
     * Creates a read-only LI.FI Swidge protocol.
     * Only `quoteSwidge`, `getSwidgeStatus`, `getSupportedChains`, and `getSupportedTokens` are available.
     *
     * @overload
     * @param {WalletAccountReadOnlyEvm | WalletAccountReadOnlyEvmErc4337} account - Read-only account used to derive the source address for quotes.
     * @param {LifiSwidgeProtocolConfig} [config] - Fee caps, LI.FI routing options, and reliability/security settings.
     */
    constructor(account: WalletAccountReadOnlyEvm | WalletAccountReadOnlyEvmErc4337, config?: LifiSwidgeProtocolConfig | undefined);
    /**
     * Creates a full LI.FI Swidge protocol capable of executing swap and bridge operations.
     *
     * @overload
     * @param {WalletAccountEvm | WalletAccountEvmErc4337} account - Writable EOA or ERC-4337 smart account that signs and sends transactions.
     * @param {LifiSwidgeProtocolConfig} [config] - Fee caps, LI.FI routing options, and reliability/security settings.
     */
    constructor(account: WalletAccountEvm | WalletAccountEvmErc4337, config?: LifiSwidgeProtocolConfig | undefined);
    /**
     * The LI.FI protocol configuration.
     *
     * @protected
     */
    protected _config: LifiSwidgeProtocolConfig;
    /** @private */
    private _chainId;
    /** @private */
    private _provider;
    /**
     * Executes a swap, bridge, or combined swap+bridge operation.
     * Handles ERC-20 approval automatically, granting only the exact amount required.
     * For tokens that revert on non-zero-to-non-zero approval (e.g. USDT on Ethereum),
     * a reset-to-zero transaction is sent first.
     *
     * @param {SwidgeOptions} options - Route options: token pair, destination chain, amount (exact-in or exact-out), slippage, and recipient.
     * @param {Partial<EvmErc4337WalletPaymasterTokenConfig | EvmErc4337WalletSponsorshipPolicyConfig | EvmErc4337WalletNativeCoinsConfig> & Pick<LifiSwidgeProtocolConfig, 'maxNetworkFeeBps' | 'maxProtocolFeeBps'>} [config] - Per-call overrides for fee caps and ERC-4337 config.
     * @returns {Promise<SwidgeResult>} The bridge transaction hash (as `id` and `hash`), fees, all sent transactions, and quoted amounts.
     * @throws {LifiReadOnlyAccountError} If the bound account is read-only or absent.
     * @throws {LifiConfigurationError} If no connected provider is available.
     * @throws {LifiValidationError} If the options or the quote's transaction data fail validation.
     * @throws {LifiExecutionError} If a fee cap is exceeded before any transaction is sent.
     * @throws {LifiUntrustedContractError} If `trustedContracts` is enabled and the quote targets an unknown contract.
     * @throws {LifiQuoteError} If LI.FI cannot produce a route or the quote API request fails.
     */
    swidge(options: SwidgeOptions, config?: Partial<EvmErc4337WalletPaymasterTokenConfig | EvmErc4337WalletSponsorshipPolicyConfig | EvmErc4337WalletNativeCoinsConfig> & Pick<LifiSwidgeProtocolConfig, "maxNetworkFeeBps" | "maxProtocolFeeBps">): Promise<SwidgeResult>;
    /**
     * Returns a non-binding quote for a swap, bridge, or combined swap+bridge operation.
     *
     * @param options - Route options: token pair, destination chain, amount, slippage, and recipient.
     * @returns Non-binding amounts, fees, estimated duration, and price impact for the route.
     * @throws {LifiConfigurationError} If no connected provider is available.
     * @throws {LifiValidationError} If the options fail validation.
     * @throws {LifiUnsupportedChainError} If `toChain` is a chain name not in the supported chains map.
     * @throws {LifiQuoteError} If LI.FI cannot produce a route or the quote API request fails.
     */
    quoteSwidge(options: SwidgeOptions): Promise<SwidgeQuote>;
    /**
     * Returns the current status of an in-flight swidge operation.
     *
     * @param id - The source-chain transaction hash returned by `swidge()`.
     * @param options - Optional chain hints to speed up LI.FI indexing.
     * @returns Current status and all known transactions for the operation.
     * @throws {LifiStatusError} If the LI.FI status API returns an error or the id is not found.
     */
    getSwidgeStatus(id: string, options?: SwidgeStatusOptions): Promise<SwidgeStatusResult>;
    /**
     * Returns all chains currently supported by LI.FI.
     *
     * @returns Array of supported chain descriptors.
     * @throws {LifiQuoteError} If the chains API request fails.
     */
    getSupportedChains(): Promise<SwidgeSupportedChain[]>;
    /**
     * Returns tokens available for swapping or bridging, optionally filtered by source chain.
     *
     * @param options - Optional filter: `fromChain` restricts results to tokens on that chain.
     * @returns Flat array of supported token descriptors.
     * @throws {LifiQuoteError} If the tokens API request fails.
     */
    getSupportedTokens(options?: SwidgeSupportedTokensOptions): Promise<SwidgeSupportedToken[]>;
    /** @private */
    private _getChainId;
    /** @private */
    private _resolveChainId;
    /** @private */
    private _resolveToToken;
    /** @private */
    private _resolveCrossChainToToken;
    /** @private */
    private _fetchTokenInfo;
    /** @private */
    private _findDestinationToken;
    /** @private */
    private _isDestinationTokenCandidate;
    /** @private */
    private _scoreDestinationToken;
    /** @private */
    private _searchTokens;
    /** @private */
    private _fetchQuote;
    /** @private */
    private _buildFees;
    /** @private */
    private _checkFeeCaps;
    /** @private */
    private _buildBridgeTx;
    /** @private */
    private _handleApproval;
    /** @private */
    private _mapLifiStatus;
    /** @private */
    private _isErc4337Account;
    /** @private */
    private _isWritableAccount;
    /** @private */
    private _request;
    /** @private */
    private _buildHeaders;
}
export type SwidgeOptions = import("@tetherto/wdk-wallet/protocols").SwidgeOptions;
export type SwidgeQuote = import("@tetherto/wdk-wallet/protocols").SwidgeQuote;
export type SwidgeResult = import("@tetherto/wdk-wallet/protocols").SwidgeResult;
export type SwidgeStatusResult = import("@tetherto/wdk-wallet/protocols").SwidgeStatusResult;
export type SwidgeSupportedChain = import("@tetherto/wdk-wallet/protocols").SwidgeSupportedChain;
export type SwidgeSupportedToken = import("@tetherto/wdk-wallet/protocols").SwidgeSupportedToken;
export type SwidgeSupportedTokensOptions = import("@tetherto/wdk-wallet/protocols").SwidgeSupportedTokensOptions;
export type WalletAccountEvm = import("@tetherto/wdk-wallet-evm").WalletAccountEvm;
export type WalletAccountReadOnlyEvm = import("@tetherto/wdk-wallet-evm").WalletAccountReadOnlyEvm;
export type WalletAccountEvmErc4337 = import("@tetherto/wdk-wallet-evm-erc-4337").WalletAccountEvmErc4337;
export type WalletAccountReadOnlyEvmErc4337 = import("@tetherto/wdk-wallet-evm-erc-4337").WalletAccountReadOnlyEvmErc4337;
export type EvmErc4337WalletPaymasterTokenConfig = import("@tetherto/wdk-wallet-evm-erc-4337").EvmErc4337WalletPaymasterTokenConfig;
export type EvmErc4337WalletSponsorshipPolicyConfig = import("@tetherto/wdk-wallet-evm-erc-4337").EvmErc4337WalletSponsorshipPolicyConfig;
export type EvmErc4337WalletNativeCoinsConfig = import("@tetherto/wdk-wallet-evm-erc-4337").EvmErc4337WalletNativeCoinsConfig;
export type Eip1193Provider = import("ethers").Eip1193Provider;
/**
 * Route selection strategy forwarded to the LI.FI quote API.
 */
export type LifiRouteOrder = "RECOMMENDED" | "FASTEST" | "CHEAPEST";
/**
 * Optional chain hints for a LI.FI status lookup.
 */
export type SwidgeStatusOptions = {
    /**
     * - Source chain of the transaction, as a WDK chain name or numeric LI.FI chain ID. Speeds up indexing.
     */
    fromChain?: string | number | undefined;
    /**
     * - Destination chain of the transaction, as a WDK chain name or numeric LI.FI chain ID.
     */
    toChain?: string | number | undefined;
};
export type LifiSwidgeProtocolConfig = {
    /**
     * - Maximum network fee as basis points of the input amount.
     * Computed in USD terms since network fees are denominated in native token, not source token.
     * If exceeded, `swidge()` throws before sending any transaction.
     */
    maxNetworkFeeBps?: number | bigint | undefined;
    /**
     * - Maximum LI.FI protocol fee as basis points of the input amount.
     * Compared directly in source token units. If exceeded, `swidge()` throws before sending any transaction.
     */
    maxProtocolFeeBps?: number | bigint | undefined;
    /**
     * - RPC URL string or EIP-1193 provider object.
     * Falls back to `account._config.provider` when omitted.
     */
    provider?: string | import("ethers").Eip1193Provider | undefined;
    /**
     * - LI.FI integrator identifier, sent as the x-lifi-integrator header.
     */
    integrator?: string | undefined;
    /**
     * - LI.FI API key for higher rate limits, sent as x-lifi-api-key. Never expose client-side.
     */
    apiKey?: string | undefined;
    /**
     * - Route selection strategy: 'RECOMMENDED' (default), 'FASTEST', or 'CHEAPEST'.
     */
    order?: LifiRouteOrder | undefined;
    /**
     * - Whitelist of bridge protocol names (e.g. ['stargate', 'cctp']).
     */
    allowBridges?: string[] | undefined;
    /**
     * - Blacklist of bridge protocol names to exclude (e.g. ['across']).
     */
    denyBridges?: string[] | undefined;
    /**
     * - Timeout in ms per LI.FI API request attempt. Default 30000.
     */
    timeout?: number | undefined;
    /**
     * - Extra attempts on transient API failures (5xx, 429, network errors, timeouts).
     * Default 1, mirroring the LI.FI SDK. Set 0 to disable retries.
     */
    retries?: number | undefined;
    /**
     * - Base backoff delay in ms, doubled per attempt and capped at 5000. Default 500.
     * For 429 responses the Retry-After header takes precedence when present.
     */
    retryDelay?: number | undefined;
    /**
     * - When set, the quote's transaction
     * target and approval address must be known LI.FI contracts, otherwise `swidge()` throws before sending
     * any transaction. Pass `true` to use the built-in per-chain allowlist of LI.FI Diamond deployments,
     * or a map of chain ID to extra trusted addresses (merged with the built-ins). Off by default,
     * matching LI.FI SDK behavior.
     */
    trustedContracts?: true | Record<number, string | string[]> | undefined;
};
import { SwidgeProtocol } from '@tetherto/wdk-wallet/protocols';
