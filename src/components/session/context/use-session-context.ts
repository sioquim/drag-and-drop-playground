import { useContext } from 'react';
import type { SessionContextProps } from './session-provider';
import { SessionContext } from './session-provider';

export const useSession = (): SessionContextProps => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
