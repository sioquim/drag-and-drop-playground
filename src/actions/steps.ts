'use server';

// eslint-disable-next-line import/no-extraneous-dependencies
import { kv } from '@vercel/kv';
import { nanoid } from 'nanoid';
import { revalidatePath as nextRevalidatePath } from 'next/cache';
import type { ActionStep, InsertActionStep } from 'src/lib/actions';

export const addSteps = async (
  sessionKey: string,
  payload: InsertActionStep[],
  revalidatePath?: string
) => {
  // Retrieve the existing steps
  const currentSteps = ((await getStepsBySessionKey(sessionKey)) as ActionStep[]) || [];

  // Add unique IDs to the new steps
  const payloadWithId = payload.map((item) => ({ ...item, id: nanoid() }));

  // Add the new steps to the steps array
  const updatedSteps = [...currentSteps, ...payloadWithId];

  // Sort the steps by order: non-null values first in ascending order, then null values
  const sortedSteps = updatedSteps
    .filter((step) => step.order !== null)
    .sort((a, b) => a.order! - b.order!)
    .concat(updatedSteps.filter((step) => step.order === null));

  // Normalize the order values
  let previousOrder = -1;
  const normalizedSteps = sortedSteps.map((step, index) => {
    if (step.order !== null && step.order! <= previousOrder) {
      step.order = previousOrder + 1;
    }
    previousOrder = step.order !== null ? step.order! : previousOrder;
    return { ...step, order: previousOrder };
  });

  // Save the updated steps array
  await kv.set(sessionKey, normalizedSteps);

  // Revalidate the path if provided
  if (revalidatePath) {
    nextRevalidatePath(revalidatePath);
  }

  return normalizedSteps;
};

export const getStepsBySessionKey = async (sessionKey: string): Promise<ActionStep[] | null> =>
  kv.get(sessionKey);
