import fetch from 'node-fetch';
import crypto from 'crypto';
import pkg from 'ethereumjs-wallet';
const { hdkey } = pkg;


const username = process.argv[2]; // Get GitHub username from command-line arguments

async function getGithubUserData(username) {
  const response = await fetch(`https://api.github.com/users/${username}`);
  if (!response.ok) throw new Error("GitHub user doesn't exist");
  return response.json();
}

function generateDeterministicHash(userData) {
  const hash = crypto.createHash('sha256');
  hash.update(userData.login); // Use GitHub login as the unique identifier
  return hash.digest('hex');
}

function createWalletFromHash(hash) {
  const walletHdpath = "m/44'/60'/0'/0/";
  const hdwallet = hdkey.fromMasterSeed(Buffer.from(hash, 'hex'));
  const wallet = hdwallet.derivePath(walletHdpath + 0).getWallet();
  return `0x${wallet.getAddress().toString('hex')}`;
}

async function createDeterministicWallet(username) {
  try {
    const userData = await getGithubUserData(username);
    const deterministicHash = generateDeterministicHash(userData);
    const walletAddress = createWalletFromHash(deterministicHash);
    console.log(walletAddress);
    return walletAddress; // Return the wallet address for potential export
  } catch (error) {
    console.error(error.message);
  }
}

const walletAddress = await createDeterministicWallet(username);

export { walletAddress };
