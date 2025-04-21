export const fetchSolanaBalance = async (publicKey: string | undefined) => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'x-chain': 'solana',
      'X-API-KEY': '95f8c867ae794645a9f5a6c8c8146a31'
    }
  };

  try {
    const response = await fetch(
      `https://public-api.birdeye.so/v1/wallet/token_balance?wallet=${publicKey}&token_address=So11111111111111111111111111111111111111111`,
      options
    );
    const data = await response.json(); 
    if (data.success && data.data) {
      const balance = Number(data.data['uiAmount']);
      return balance;
      
    } else {
      return null;
    }
  } catch (error) {
    console.log("ERROR : ", error)
    return null;
  } 
};

// import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';  

// export const fetchSolanaBalance = async (publicKeyString: string | undefined) => {  
//   if (!publicKeyString) return null;  

//   try {  
//     const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');  
//     const publicKey = new PublicKey(publicKeyString);  
//     const lamports = await connection.getBalance(publicKey);  
//     const solBalance = lamports / 1e9; // Convert lamports to SOL  
//     return solBalance;  
//   } catch (error) {  
//     console.log("ERROR:", error);  
//     return null;  
//   }  
// };  
  