export class Contracts {
    ERC20: string;
    STAKING: string;
    LP: string;

    constructor(network :string) {
        this.ERC20 = process.env.CONTRACT_ERC20 as string;
        this.STAKING = process.env.CONTRACT_STAKING as string;
        this.LP = process.env.CONTRACT_LP_TOKEN as string;
        if (network == "rinkeby") {
            this.ERC20 = process.env.CONTRACT_ERC20_RINKEBY as string;
            this.STAKING = process.env.CONTRACT_STAKING_RINKEBY as string;
            this.LP = process.env.CONTRACT_LP_TOKEN_RINKEBY as string;
        } else if (network == "ropsten") {
            this.ERC20 = process.env.CONTRACT_ERC20_ROPSTEN as string;
            this.STAKING = process.env.CONTRACT_STAKING_ROPSTEN as string;
            this.LP = process.env.CONTRACT_LP_TOKEN_ROPSTEN as string;
        }
    }
}