import { SavedPhotoStrip } from '../types';

const DB_NAME = 'PhotoboothDB';
const DB_VERSION = 1;
const STORE_NAME = 'photoStrips';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function savePhotoStrip(strip: SavedPhotoStrip): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(strip);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error('Failed to save to IndexedDB', err);
  }
}

export async function getAllPhotoStrips(): Promise<SavedPhotoStrip[]> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('timestamp');
    const request = index.openCursor(null, 'prev'); // newest first
    const results: SavedPhotoStrip[] = [];

    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          results.push(cursor.value);
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error('Failed to get photo strips', err);
    return [];
  }
}

export async function deletePhotoStrip(id: string): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(id);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error('Failed to delete photo strip', err);
  }
}

// User Filter Preferences (Favorites & Recent)
const FAVORITES_KEY = 'photobooth_favorite_filters';
const RECENT_KEY = 'photobooth_recent_filters';

export function getFavoriteFilters(): string[] {
  try {
    const saved = localStorage.getItem(FAVORITES_KEY);
    return saved ? JSON.parse(saved) : ['classic-bw', 'pink-glow', 'film', 'golden-glow'];
  } catch {
    return [];
  }
}

export function toggleFavoriteFilter(filterId: string): string[] {
  const current = getFavoriteFilters();
  const exists = current.includes(filterId);
  const updated = exists ? current.filter((id) => id !== filterId) : [...current, filterId];
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  } catch {
    // Ignore quota issues
  }
  return updated;
}

export function getRecentFilters(): string[] {
  try {
    const saved = localStorage.getItem(RECENT_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function addRecentFilter(filterId: string): string[] {
  if (!filterId || filterId === 'original') return getRecentFilters();
  const current = getRecentFilters().filter((id) => id !== filterId);
  const updated = [filterId, ...current].slice(0, 10);
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  } catch {
    // Ignore
  }
  return updated;
}
