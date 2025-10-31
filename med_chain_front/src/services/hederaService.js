import { Client, PrivateKey, AccountId, AccountCreateTransaction, AccountBalanceQuery, TransactionReceiptQuery } from "@hashgraph/sdk";

/**
 * Initialize Hedera client
 * @param {string} accountId - The account ID
 * @param {string} privateKey - The private key
 * @param {string} network - The network type (testnet, previewnet, mainnet)
 * @returns {Client} The Hedera client
 */
export const initializeClient = (accountId, privateKey, network = "testnet") => {
  const client = Client.forName(network);
  client.setOperator(AccountId.fromString(accountId), PrivateKey.fromString(privateKey));
  return client;
};

/**
 * Create a new account on Hedera
 * @param {Client} client - The Hedera client
 * @param {number} initialBalance - Initial balance in hbars
 * @returns {Promise<object>} The new account details
 */
export const createAccount = async (client, initialBalance = 10) => {
  // Generate a new key pair
  const newPrivateKey = PrivateKey.generateED25519();
  const newPublicKey = newPrivateKey.publicKey;
  
  // Create the account
  const transaction = new AccountCreateTransaction()
    .setKey(newPublicKey)
    .setInitialBalance(initialBalance)
    .freezeWith(client);

  // Sign the transaction with the client operator key
  const signTx = await transaction.sign(newPrivateKey);
  
  // Submit to a Hedera network
  const txResponse = await signTx.execute(client);
  
  // Request the receipt of the transaction
  const receipt = await new TransactionReceiptQuery()
    .setTransactionId(txResponse.transactionId)
    .execute(client);
    
  // Get the new account ID
  const newAccountId = receipt.accountId;
  
  return {
    accountId: newAccountId.toString(),
    privateKey: newPrivateKey.toString(),
    publicKey: newPublicKey.toString()
  };
};

/**
 * Get account balance
 * @param {Client} client - The Hedera client
 * @param {string} accountId - The account ID
 * @returns {Promise<number>} The account balance in hbars
 */
export const getAccountBalance = async (client, accountId) => {
  const balance = await new AccountBalanceQuery()
    .setAccountId(AccountId.fromString(accountId))
    .execute(client);
    
  return balance.hbars.toTinybars().toNumber();
};

/**
 * Register hospital on Hedera
 * @param {string} hospitalName - The hospital name
 * @param {string} operatorAccountId - The operator account ID
 * @param {string} operatorPrivateKey - The operator private key
 * @returns {Promise<object>} The registration result
 */
export const registerHospital = async (hospitalName, operatorAccountId, operatorPrivateKey) => {
  try {
    // Initialize client
    const client = initializeClient(operatorAccountId, operatorPrivateKey);
    
    // Create a new account for the hospital
    const accountDetails = await createAccount(client, 10);
    
    // Store hospital info (in a real app, this would be stored in a HIP-19 database or similar)
    const hospitalInfo = {
      id: accountDetails.accountId,
      name: hospitalName,
      createdAt: new Date().toISOString(),
      privateKey: accountDetails.privateKey,
      publicKey: accountDetails.publicKey
    };
    
    return {
      success: true,
      hospital: hospitalInfo
    };
  } catch (error) {
    console.error("Error registering hospital:", error);
    return {
      success: false,
      error: error.message
    };
  }
};