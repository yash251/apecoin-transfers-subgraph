import { Contract } from "../generated/Contract/Contract";
import { Account, Token } from "../generated/schema";
import { BigDecimal, ethereum, Address } from "@graphprotocol/graph-ts";

export function fetchTokenDetails(event: ethereum.Event): Token | null {
    let token = Token.load(event.address.toHexString());
    if (!token) {
        token = new Token(event.address.toHex());

        token.name = "N/A";
        token.symbol = "N/A";
        token.decimals = BigDecimal.fromString("0");

        let contract = Contract.bind(event.address);

        let tokenName = contract.try_name();
        if (!tokenName.reverted) {
            token.name = tokenName.value;
        }

        let tokenSymbol = contract.try_symbol();
        if (!tokenSymbol.reverted) {
            token.symbol = tokenSymbol.value;
        }

        let tokenDecimals = contract.try_decimals();
        if (!tokenDecimals.reverted) {
            token.decimals = BigDecimal.fromString(tokenDecimals.value.toString());
        }

        token.save();
    }
    return token;
}