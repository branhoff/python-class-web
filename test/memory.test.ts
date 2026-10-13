import { MemoryProgressRepository } from '../src/repository/memory.ts';
import { runRepositoryContract } from './contract.ts';

runRepositoryContract('memory', async () => new MemoryProgressRepository());
