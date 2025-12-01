/**
 * Offline Storage and Sync Queue
 * Stores actions locally and syncs when online
 */

const OFFLINE_STORAGE_KEY = "ratio_offline_queue";
const OFFLINE_DATA_KEY = "ratio_offline_data";

export interface OfflineAction {
  id: string;
  type: string;
  table: string;
  action: "insert" | "update" | "delete";
  data: any;
  timestamp: string;
}

/**
 * Check if online
 */
export function isOnline(): boolean {
  return typeof navigator !== "undefined" && navigator.onLine;
}

/**
 * Store action in offline queue
 */
export function queueOfflineAction(
  action: Omit<OfflineAction, "id" | "timestamp">
): void {
  if (typeof window === "undefined") return;

  const queue = getOfflineQueue();
  const newAction: OfflineAction = {
    ...action,
    id: `offline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
  };

  queue.push(newAction);
  localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(queue));
}

/**
 * Get offline queue
 */
export function getOfflineQueue(): OfflineAction[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(OFFLINE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error reading offline queue:", error);
    return [];
  }
}

/**
 * Clear offline queue
 */
export function clearOfflineQueue(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(OFFLINE_STORAGE_KEY);
}

/**
 * Store data locally for offline access
 */
export function storeOfflineData(key: string, data: any): void {
  if (typeof window === "undefined") return;

  try {
    const stored = getOfflineData();
    stored[key] = {
      data,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(OFFLINE_DATA_KEY, JSON.stringify(stored));
  } catch (error) {
    console.error("Error storing offline data:", error);
  }
}

/**
 * Get offline data
 */
export function getOfflineData(): Record<
  string,
  { data: any; timestamp: string }
> {
  if (typeof window === "undefined") return {};

  try {
    const stored = localStorage.getItem(OFFLINE_DATA_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("Error reading offline data:", error);
    return {};
  }
}

/**
 * Get specific offline data
 */
export function getOfflineDataByKey(key: string): any | null {
  const allData = getOfflineData();
  return allData[key]?.data || null;
}

/**
 * Clear offline data
 */
export function clearOfflineData(key?: string): void {
  if (typeof window === "undefined") return;

  if (key) {
    const stored = getOfflineData();
    delete stored[key];
    localStorage.setItem(OFFLINE_DATA_KEY, JSON.stringify(stored));
  } else {
    localStorage.removeItem(OFFLINE_DATA_KEY);
  }
}

/**
 * Process offline queue when coming back online
 */
export async function processOfflineQueue(
  processor: (action: OfflineAction) => Promise<void>
): Promise<number> {
  if (!isOnline()) return 0;

  const queue = getOfflineQueue();
  let processed = 0;

  for (const action of queue) {
    try {
      await processor(action);
      processed++;
    } catch (error) {
      console.error(`Error processing offline action ${action.id}:`, error);
      // Keep failed actions in queue for retry
    }
  }

  // Remove processed actions
  if (processed > 0) {
    const remaining = queue.slice(processed);
    if (remaining.length > 0) {
      localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(remaining));
    } else {
      clearOfflineQueue();
    }
  }

  return processed;
}
