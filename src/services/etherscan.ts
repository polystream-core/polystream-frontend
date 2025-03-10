import {appConfig, env} from "../constants/AppConfig";

interface EtherscanRequestParams {
  module: string;
  action: string;
  address?: string;
  [key: string]: any;
}

interface EtherscanResponse<T> {
  status: string;
  message: string;
  result: T;
}

export class EtherscanService {
  private apiKey: string;
  private baseUrl: string;
  private chainId: string;

  constructor() {
    this.apiKey = env.ETHERSCAN_API_KEY;
    this.baseUrl = appConfig.ETHERSCAN_BASE_URI;
    this.chainId = appConfig.SCROLL_CHAIN_ID;
  }

  /**
   * Make a request to the Etherscan API
   * @param params Parameters to send to the Etherscan API
   * @returns Promise with the API response
   */
  async makeRequest<T>(params: EtherscanRequestParams): Promise<T> {
    try {
      const queryParams = new URLSearchParams({
        ...params,
        chainId: this.chainId,
        apikey: this.apiKey
      }).toString();

      const response = await fetch(`${this.baseUrl}?${queryParams}`);

      if (!response.ok) {
        throw new Error(`Etherscan API error: ${response.status} ${response.statusText}`);
      }

      const data: EtherscanResponse<T> = await response.json();

      if (data.status === '0') {
        throw new Error(`Etherscan API error: ${data.message}`);
      }

      return data.result;
    } catch (error) {
      console.error('Error calling Etherscan API:', error);
      throw error;
    }
  }

  /**
   * Get the ETH balance for a specific address
   * @param address The Ethereum address to check
   * @returns Promise with the balance as a string
   */
  async getAddressBalance(address: string): Promise<string> {
    console.log(this.apiKey)
    console.log(this.chainId)
    return this.makeRequest<string>({
      module: 'account',
      action: 'balance',
      address,
      tag: 'latest'
    });
  }

  /**
   * Get transactions for a specific address
   * @param address The Ethereum address
   * @param startBlock Optional starting block number
   * @param endBlock Optional ending block number
   * @returns Promise with the transaction list
   */
  async getAddressTransactions(
    address: string,
    startBlock?: number,
    endBlock?: number,
  ): Promise<any[]> {
    const params: EtherscanRequestParams = {
      module: 'account',
      action: 'txlist',
      address,
      sort: 'desc'
    };

    if (startBlock) params.startblock = startBlock.toString();
    if (endBlock) params.endblock = endBlock.toString();

    return this.makeRequest<any[]>(params);
  }

  /**
   * Get ERC20 token transactions for a specific address
   * @param address The Ethereum address
   * @param contractAddress Optional ERC20 token contract address
   * @returns Promise with the token transactions
   */
  async getTokenTransactions(
    address: string,
    contractAddress?: string,
  ): Promise<any[]> {
    const params: EtherscanRequestParams = {
      module: 'account',
      action: 'tokentx',
      address,
      sort: 'desc'
    };

    if (contractAddress) params.contractaddress = contractAddress;

    return this.makeRequest<any[]>(params);
  }

  /**
   * Get current gas price from Etherscan
   * @returns Promise with gas price in wei
   */
  async getGasPrice(): Promise<string> {
    return this.makeRequest<string>({
      module: 'gastracker',
      action: 'gasoracle'
    });
  }
}