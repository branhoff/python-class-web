import type { ProgressEvent, ProgressRepository } from './repository.ts';

export class MemoryProgressRepository implements ProgressRepository {
  private readonly eventsByUser = new Map<string, ProgressEvent[]>();

  async appendEvent(userId: string, event: ProgressEvent): Promise<void> {
    const events = this.eventsByUser.get(userId) ?? [];
    events.push({ ...event });
    this.eventsByUser.set(userId, events);
  }

  async listEvents(userId: string): Promise<ProgressEvent[]> {
    const events = this.eventsByUser.get(userId) ?? [];
    return events.map((event) => ({ ...event })).sort((a, b) => a.at - b.at);
  }
}
