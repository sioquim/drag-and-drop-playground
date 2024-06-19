'use client';

import type { ReactNode } from 'react';
import { useMemo, useState, useEffect, createContext } from 'react';

export type SessionContextProps = {
  sessionKey: string | null;
};

export const SessionContext = createContext<SessionContextProps | undefined>(undefined);

export const SessionProvider = ({
  children,
  sessionKey,
}: {
  children: ReactNode;
  sessionKey: string | null;
}) => {
  const [session, setSession] = useState<string | null>(null);

  useEffect(() => {
    if (sessionKey) {
      setSession(sessionKey);
    }
  }, [sessionKey]);

  const value = useMemo(() => ({ sessionKey: session }), [session]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};
