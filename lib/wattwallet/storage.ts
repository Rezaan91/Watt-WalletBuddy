import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  createEmptyStoredState,
  normalizeStoredState,
  type StoredState,
} from "@/lib/wattwallet/types";

const STORAGE_KEY = "wattwallet.launch-edition.v1";

export async function loadStoredState(): Promise<StoredState> {
  try {
    const serialized = await AsyncStorage.getItem(STORAGE_KEY);
    return serialized ? normalizeStoredState(JSON.parse(serialized)) : createEmptyStoredState();
  } catch {
    return createEmptyStoredState();
  }
}

export async function saveStoredState(state: StoredState) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export async function clearStoredState() {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

export { STORAGE_KEY };
