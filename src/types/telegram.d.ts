declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name: string;
            username: string;
            language_code: string;
          };
          start_param?: string;
        };
        ready: () => void;
        showAlert: (message: string) => void;
        close: () => void;
        onEvent: <T extends (...args: any[]) => void>(event: string, handler: T) => void;
        offEvent: <T extends (...args: any[]) => void>(event: string, handler: T) => void;
        expand: () => void;
        MainButton: {
          setParams: (params: {
            is_visible?: boolean;
            is_active?: boolean;
            text?: string;
            color?: string;
          }) => void;
          onClick: (handler: () => void) => void;
          offClick: (handler: () => void) => void;
          show: () => void;
          hide: () => void;
        };
      };
    };
  }
}

export {};