export const fetchSolanaBalance = async (publicKey: string | undefined) => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'x-chain': 'solana',
      'X-API-KEY': '537be612ab8a4f4cb65f3ab3fb46f188'
    }
  };

  try {
    const response = await fetch(
      `https://public-api.birdeye.so/v1/wallet/token_balance?wallet=${publicKey}&token_address=So11111111111111111111111111111111111111111`,
      options
    );
    console.log(response.json())
    if (!response.ok) {
      return null
    }
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

  