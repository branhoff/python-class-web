import { Firestore } from '@google-cloud/firestore';
import type { ProgressEvent, ProgressRepository } from './repository.ts';

export function createFirestoreProgressRepository(projectId: string): ProgressRepository {
  return new FirestoreProgressRepository(new Firestore({ projectId }));
}

class FirestoreProgressRepository implements ProgressRepository {
  private readonly db: Firestore;

  constructor(db: Firestore) {
    this.db = db;
  }

  async appendEvent(userId: string, event: ProgressEvent): Promise<void> {
    await this.events(userId).add({ cellId: event.cellId, kind: event.kind, at: event.at });
  }

  async listEvents(userId: string): Promise<ProgressEvent[]> {
    const snapshot = await this.events(userId).orderBy('at').get();
    return snapshot.docs.map((doc) => {
      const { cellId, kind, at } = doc.data() as ProgressEvent;
      return { cellId, kind, at };
    });
  }

  private events(userId: string) {
    return this.db.collection('users').doc(userId).collection('events');
  }
}
