import { ethers } from 'ethers';

// Default to Sepolia testnet
const NETWORK_RPC = 'https://rpc.ankr.com/eth_sepolia';

export const getProvider = () => {
  return new ethers.JsonRpcProvider(NETWORK_RPC);
};

export const createWallet = () => {
  const wallet = ethers.Wallet.createRandom();
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic?.phrase,
  };
};

export const restoreWalletFromMnemonic = (mnemonic: string) => {
  try {
    const wallet = ethers.Wallet.fromPhrase(mnemonic.trim());
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic?.phrase,
    };
  } catch (e) {
    return null;
  }
};

export const restoreWalletFromPrivateKey = (privateKey: string) => {
  try {
    const pk = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
    const wallet = new ethers.Wallet(pk);
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: null,
    };
  } catch (e) {
    return null;
  }
};

export const getEthBalance = async (address: string) => {
  try {
    const provider = getProvider();
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  } catch (e) {
    return '0.0';
  }
};

export const getTokenBalance = async (
  address: string,
  tokenAddress: string,
) => {
  try {
    const provider = getProvider();
    const abi = ['function balanceOf(address owner) view returns (uint256)', 'function decimals() view returns (uint8)'];
    const contract = new ethers.Contract(tokenAddress, abi, provider);
    const balance = await contract.balanceOf(address);
    const decimals = await contract.decimals();
    return ethers.formatUnits(balance, decimals);
  } catch (e) {
    return '0.0';
  }
};

export const sendEth = async (
  privateKey: string,
  toAddress: string,
  amountStr: string,
) => {
  try {
    const provider = getProvider();
    const wallet = new ethers.Wallet(privateKey, provider);
    const tx = await wallet.sendTransaction({
      to: toAddress,
      value: ethers.parseEther(amountStr),
    });
    return tx.hash;
  } catch (e) {
    console.error('Send Eth Error', e);
    throw e;
  }
};

export const getTransactionHistory = async (address: string) => {
  // Using Etherscan/Sepolia scan or default empty if no API key
  // Normally you'd use a block explorer API:
  // https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=ADDRESS&startblock=0&endblock=99999999&sort=desc&apikey=YourApiKeyToken
  // As a fallback, returning empty array
  return [];
};
