// IndexedDB utility for persistent storage in Chrome
const DB_NAME = 'QuickCopyDB';
const DB_VERSION = 1;
const STORE_NAME = 'clipboardSessions';

export interface ClipboardSession {
  id: string;
  value: string;
  currentIndex: number;
  isEditing: boolean;
  createdAt?: number;
  updatedAt?: number;
}

class QuickCopyDB {
  private db: IDBDatabase | null = null;

  // Initialize the database
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('Database failed to open');
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('Database opened successfully');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          objectStore.createIndex('updatedAt', 'updatedAt', { unique: false });
          console.log('Object store created');
        }
      };
    });
  }

  // Get all sessions from the database
  async getAllSessions(): Promise<ClipboardSession[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.getAll();

      request.onsuccess = () => {
        const sessions = request.result as ClipboardSession[];
        // Sort by updatedAt to maintain order
        sessions.sort((a, b) => (a.updatedAt || 0) - (b.updatedAt || 0));
        resolve(sessions);
      };

      request.onerror = () => {
        console.error('Error getting sessions');
        reject(request.error);
      };
    });
  }

  // Save a single session
  async saveSession(session: ClipboardSession): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(STORE_NAME);
      
      const sessionWithTimestamp = {
        ...session,
        updatedAt: Date.now(),
        createdAt: session.createdAt || Date.now(),
      };

      const request = objectStore.put(sessionWithTimestamp);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        console.error('Error saving session');
        reject(request.error);
      };
    });
  }

  // Save multiple sessions at once
  async saveSessions(sessions: ClipboardSession[]): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(STORE_NAME);

      let completed = 0;
      const total = sessions.length;

      if (total === 0) {
        resolve();
        return;
      }

      sessions.forEach((session, index) => {
        const sessionWithTimestamp = {
          ...session,
          updatedAt: Date.now() + index, // Add index to maintain order
          createdAt: session.createdAt || Date.now(),
        };

        const request = objectStore.put(sessionWithTimestamp);

        request.onsuccess = () => {
          completed++;
          if (completed === total) {
            resolve();
          }
        };

        request.onerror = () => {
          console.error('Error saving session');
          reject(request.error);
        };
      });
    });
  }

  // Delete a session by ID
  async deleteSession(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.delete(id);

      request.onsuccess = () => {
        console.log(`Session ${id} deleted`);
        resolve();
      };

      request.onerror = () => {
        console.error('Error deleting session');
        reject(request.error);
      };
    });
  }

  // Clear all sessions
  async clearAllSessions(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.clear();

      request.onsuccess = () => {
        console.log('All sessions cleared');
        resolve();
      };

      request.onerror = () => {
        console.error('Error clearing sessions');
        reject(request.error);
      };
    });
  }

  // Get a single session by ID
  async getSession(id: string): Promise<ClipboardSession | undefined> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.get(id);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.error('Error getting session');
        reject(request.error);
      };
    });
  }
}

// Export a singleton instance
export const db = new QuickCopyDB();

