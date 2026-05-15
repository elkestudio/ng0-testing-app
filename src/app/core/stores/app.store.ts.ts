import { signalStore, withState } from '@ngrx/signals';

export const AppStoreTs = signalStore(
  { providedIn: 'root' },
  withState({})
);
