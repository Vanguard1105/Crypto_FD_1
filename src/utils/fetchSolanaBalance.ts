import { Connection, PublicKey } from '@solana/web3.js';

export const fetchSolanaBalance = async (publicKey: string | undefined): Promise<number | null> => {
  try {
    const connection = new Connection('https://api.mainnet-beta.solana.com');
    const publicKeyObj = new PublicKey(String(publicKey));
    const balance = await connection.getBalance(publicKeyObj);
    const balanceInSol = balance; // Convert lamports to SOL
    return balanceInSol;
  } catch (error) {
    console.error('Error fetching Solana balance:', error);
    return null; // Return null in case of error
  }
};

// export const fetchSolanaBalance = async (publicKey: string | undefined) => {
//   const options = {
//     method: 'GET',
//     headers: {
//       accept: 'application/json',
//       'x-chain': 'solana',
//       'X-API-KEY': '537be612ab8a4f4cb65f3ab3fb46f188'
//     }
//   };

//   try {
//     const response = await fetch(
//       `https://public-api.birdeye.so/v1/wallet/token_balance?wallet=${publicKey}&token_address=So11111111111111111111111111111111111111111`,
//       options
//     );
//     const data = await response.json(); 
//     console.log(data.data)
//     if (!response.ok) {
//       return null
//     }
//     if (data.success && data.data) {
//       const balance = Number(data.data['uiAmount']);
//       return balance;
      
//     } else {
//       return null;
//     }
//   } catch (error) {
//     console.log("ERROR : ", error)
//     return null;
//   } 
// };

  
  