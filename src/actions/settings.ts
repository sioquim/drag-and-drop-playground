'use server';

// eslint-disable-next-line import/no-extraneous-dependencies
import { kv } from '@vercel/kv';
import { revalidatePath as nextRevalidatePath } from 'next/cache';

export type Settings = {
  name: string;
  prompt: string;
};
export const saveSettings = async (
  settings: Settings,
  revalidatePath?: string
): Promise<Settings> => {
  await kv.set('settings', settings);
  if (revalidatePath) {
    nextRevalidatePath(revalidatePath);
  }
  return settings;
};

export const getSettings = async (): Promise<Settings | null> => kv.get('settings');
