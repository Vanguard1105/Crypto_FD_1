"use client";
interface IWebApp {
  initDataUnsafe: {
      user: {
          id: number;
          first_name: string;
          last_name: string;
          username: string;
          language_code: string;
      };
      start_param: string;
  };
  showAlert: (message: string) => void;
  close: () => void;
}

interface IUseTelegram {
  webApp: IWebApp | undefined;
  user: IWebApp['initDataUnsafe']['user'] | undefined;
  user_id: string | undefined;
}

export function useTelegram(): IUseTelegram {  
    // Check if we are in a browser environment  
    const webApp: IWebApp | undefined = typeof window !== 'undefined' ? (window as any).Telegram?.WebApp : undefined;  
  
    const user: IWebApp['initDataUnsafe']['user'] | undefined = webApp?.initDataUnsafe.user;  
    const user_id = String(user?.id);
  
    return {  
      webApp,  
      user,  
      user_id,
    };  
  }