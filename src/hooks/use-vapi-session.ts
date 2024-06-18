import { nanoid } from 'nanoid';
import { useState, useEffect } from 'react';

const VAPI_SESSION_KEY = 'vapi-session';

export const useVapiSession = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const storedSessionId = localStorage.getItem(VAPI_SESSION_KEY);
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = nanoid();
      localStorage.setItem(VAPI_SESSION_KEY, newSessionId);
      setSessionId(newSessionId);
    }
  }, []);

  return sessionId;
};
