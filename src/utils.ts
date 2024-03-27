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

export function fetchAccount(address: string): Account | null {
    let account = Account.load(address);
    if (!account) {
        account = new Account(address);
        account.save();
    }
    return account;
}


export function fetchBalance(
    tokenAddress: Address,
    accountAddress: Address
): BigDecimal {
    let contract = Contract.bind(tokenAddress);
    let amount = BigDecimal.fromString("0");
    let tokenBalance = contract.try_balanceOf(accountAddress);

    if (!tokenBalance.reverted) {
        amount = tokenBalance.value.toBigDecimal();
    }

    return amount;
}