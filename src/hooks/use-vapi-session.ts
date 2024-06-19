import { nanoid } from 'nanoid';
import { useState, useEffect } from 'react';

const VAPI_SESSION_KEY = 'vapi-session';

export const useVapiSession = () => {
  const [sessionKey, setSessionKey] = useState<string | null>(null);

  useEffect(() => {
    const storedSessionKey = localStorage.getItem(VAPI_SESSION_KEY);
    if (storedSessionKey) {
      setSessionKey(storedSessionKey);
    } else {
      const newSessionKey = nanoid();
      localStorage.setItem(VAPI_SESSION_KEY, newSessionKey);
      setSessionKey(newSessionKey);
    }
  }, []);

  return sessionKey;
};
