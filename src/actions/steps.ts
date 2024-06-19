'use server';

// eslint-disable-next-line import/no-extraneous-dependencies
import { kv } from '@vercel/kv';
import { nanoid } from 'nanoid';
import { revalidatePath as nextRevalidatePath } from 'next/cache';
import type { ActionStep, InsertActionStep } from 'src/lib/actions';

// Function to update steps in KV and revalidate path if provided
const saveSteps = async (
  sessionKey: string,
  steps: ActionStep[],
  revalidatePath?: string
): Promise<ActionStep[]> => {
  await kv.set(sessionKey, steps);
  if (revalidatePath) {
    nextRevalidatePath(revalidatePath);
  }
  return steps;
};

export const updateStep = async (
  sessionKey: string,
  payload: Partial<ActionStep> & { id: string },
  revalidatePath?: string
): Promise<ActionStep> => {
  const currentSteps = (await getStepsBySessionKey(sessionKey)) || [];
  const updatedSteps = currentSteps.map((step) =>
    step.id === payload.id ? { ...step, ...payload } : step
  );
  await saveSteps(sessionKey, updatedSteps, revalidatePath);
  return updatedSteps.find((step) => step.id === payload.id)!;
};

export const addSteps = async (
  sessionKey: string,
  payload: InsertActionStep[],
  revalidatePath?: string
): Promise<ActionStep[]> => {
  const currentSteps = (await getStepsBySessionKey(sessionKey)) || [];
  const payloadWithId = payload.map((item) => ({ ...item, id: nanoid() }));
  const updatedSteps = [...currentSteps, ...payloadWithId];
  return saveSteps(sessionKey, updatedSteps, revalidatePath);
};

export const updateSteps = async (
  sessionKey: string,
  payload: ActionStep[],
  revalidatePath?: string
): Promise<ActionStep[]> => {
  const result = await saveSteps(sessionKey, payload, revalidatePath);
  return result;
};

export const getStepsBySessionKey = async (sessionKey: string): Promise<ActionStep[] | null> =>
  kv.get(sessionKey);
