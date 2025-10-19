#!/bin/bash

# Pyth Oracle address
PYTH="0x2880aB155794e7179c9eE2e38200202908C17B43"
RPC="https://testnet-rpc.monad.xyz/"

# Asset feed IDs
declare -A ASSETS
ASSETS["BTC"]="0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43"
ASSETS["ETH"]="0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace"
ASSETS["SOL"]="0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d"
ASSETS["BNB"]="0x2f95862b045670cd22bee3114c39763a4a08beeb663b145d283c31d7d1101c4f"
ASSETS["AVAX"]="0x93da3352f9f1d105fdfe4971cfa80e9dd777bfc5d0f683ebb6e1294b92137bb7"
ASSETS["XRP"]="0xec5d399846a9209f3fe5881d70aae9268c94339ff9817e8d18ff19fa05eea1c8"
ASSETS["ADA"]="0x2a01deaec9e51a579277b34b122399984d0bbf57e2458a7e42fecd2829867a0d"
ASSETS["MATIC"]="0x5de33a9112c2b700b8d30b8a3402c103578ccfa2765696471cc672bd5cf6ac52"
ASSETS["NEAR"]="0xc415de8d2eba7db216527dff4b60e8f3a5311c740dadb233e13e12547e226750"
ASSETS["DOGE"]="0xdcef50dd0a4cd2dcc17e45df1676dcb336a11a61c69df7a0299b0150c672d25c"
ASSETS["TRX"]="0x67aed5a24fdad045475e7195c98a98aea119c763f272d4523f5bac93a4f33c2b"
ASSETS["SUI"]="0x23d7315113f5b1d3ba7a83604c44b94d79f4fd69af77f804fc7f920a6dc65744"
ASSETS["ASTAR"]="0xb7e3904c08ddd9c0c10c6d207d390fd19e87eb6aab96304f571ed94caebdefa0"
ASSETS["SHIB"]="0xf0d57deca57b3da2fe63a493f4c25925fdfd8edf834b20f93e1f84dbd1504d4a"
ASSETS["PEPE"]="0xd69731a2e74ac1ce884fc3890f7ee324b6deb66147055249568869ed700882e4"
ASSETS["HYPE"]="0x7c28a4f3ca1e583f83c5c430ae9ad42f80bc3f6fcbde13906e7b569cd6f22aa1"
ASSETS["DOT"]="0xca3eed9b267293f6595901c734c7525ce8ef49adafe8284606ceb307afa2ca5b"
ASSETS["APT"]="0x03ae4db29ed4ae33d323568895aa00337e658e348b37509f5372ae51f0af00d5"

echo "=== Pyth Price Feeds on Monad Testnet ==="
echo ""

source ~/.zshenv

for ASSET in "${!ASSETS[@]}"; do
    FEED_ID="${ASSETS[$ASSET]}"
    echo "Checking $ASSET..."

    # Get price data
    RESULT=$(cast call $PYTH "getPriceUnsafe(bytes32)" $FEED_ID --rpc-url $RPC 2>&1)

    if [[ $RESULT == 0x* ]] && [[ ${#RESULT} -gt 10 ]]; then
        # Parse the result (price is first 64 chars after 0x, then conf, expo, publishTime)
        PRICE_HEX="0x${RESULT:2:64}"
        CONF_HEX="0x${RESULT:66:64}"
        EXPO_HEX="0x${RESULT:130:64}"
        TIME_HEX="0x${RESULT:194:64}"

        # Convert to decimal
        PRICE=$(cast --to-dec $PRICE_HEX 2>/dev/null || echo "0")
        CONF=$(cast --to-dec $CONF_HEX 2>/dev/null || echo "0")
        EXPO=$(cast --to-dec $EXPO_HEX 2>/dev/null || echo "0")
        TIMESTAMP=$(cast --to-dec $TIME_HEX 2>/dev/null || echo "0")

        # Convert timestamp to date
        if [ "$TIMESTAMP" != "0" ]; then
            DATE=$(date -r $TIMESTAMP 2>/dev/null || echo "N/A")
        else
            DATE="N/A"
        fi

        echo "  ✅ $ASSET: Price=$PRICE, Confidence=$CONF, Exponent=$EXPO"
        echo "     Last Update: $DATE ($TIMESTAMP)"
    else
        echo "  ❌ $ASSET: No data or error"
    fi
    echo ""
done

echo "=== Complete ==="