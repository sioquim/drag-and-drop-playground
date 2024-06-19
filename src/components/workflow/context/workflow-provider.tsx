'use client';

import { nanoid } from 'nanoid';
import type { ReactNode } from 'react';
import { useMemo, useState, useEffect, useCallback, createContext } from 'react';
import type { Settings } from 'src/actions/settings';
import { getSettings, saveSettings } from 'src/actions/settings';
import { updateSteps, getStepsBySessionKey } from 'src/actions/steps';
import type { ActionStep } from 'src/lib/actions';

export type WorkflowContextProps = {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  selectedStep: ActionStep | null;
  setSelectedStep: React.Dispatch<React.SetStateAction<ActionStep | null>>;
  steps: ActionStep[];
  setSteps: React.Dispatch<React.SetStateAction<ActionStep[]>>;
  setNormalizedSteps?: (steps: ActionStep[]) => Promise<void>;
};

export const WorkflowContext = createContext<WorkflowContextProps | undefined>(undefined);

export const WorkflowProvider = ({
  children,
  sessionKey,
}: { children: ReactNode } & { sessionKey: string | null }) => {
  const [settings, setSettings] = useState<Settings>({ name: '', prompt: '' });
  const [steps, setSteps] = useState<ActionStep[]>([]);
  const [selectedStep, setSelectedStep] = useState<ActionStep | null>(null);

  const syncSettings = useCallback(async (payload: Settings) => {
    await saveSettings(payload, '/');
  }, []);

  useEffect(() => {
    if (settings.name || settings.prompt) {
      syncSettings(settings);
    }
  }, [settings, syncSettings]);

  useEffect(() => {
    const initialiseSettings = async () => {
      const kvSettings = await getSettings();
      if (!kvSettings?.name && !kvSettings?.prompt) {
        const newSettings = {
          name: 'New Workflow',
          prompt: '',
        };
        setSettings(newSettings);
      } else {
        setSettings(kvSettings);
      }
    };

    initialiseSettings();
  }, []);

  useEffect(() => {
    const initialiseSteps = async (_sessionKey: string) => {
      let existingData = await getStepsBySessionKey(_sessionKey);
      if (!existingData || existingData.length === 0) {
        await updateSteps(
          _sessionKey,
          [
            { id: nanoid(), name: 'Start', description: 'Start of the workflow', metadata: {} },
            {
              id: nanoid(),
              name: 'Choose an action',
              description: 'First step of the workflow',
              metadata: {},
            },
            { id: nanoid(), name: 'End', description: 'End of the workflow', metadata: {} },
          ],
          '/'
        );
        existingData = await getStepsBySessionKey(_sessionKey);
      }
      setSteps(existingData as any);
    };

    if (sessionKey) {
      initialiseSteps(sessionKey);
    }
  }, [sessionKey]);

  useEffect(() => {
    const syncSteps = async (_steps: ActionStep[], _sessionKey: string) => {
      await updateSteps(_sessionKey, _steps);
    };

    if (sessionKey) {
      syncSteps(steps, sessionKey);
    }
  }, [steps, sessionKey]);

  const value = useMemo(
    () => ({ steps, setSteps, selectedStep, setSelectedStep, settings, setSettings }),
    [steps, selectedStep, settings]
  );

  return <WorkflowContext.Provider value={value}>{children}</WorkflowContext.Provider>;
};
