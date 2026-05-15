import { signalStore, withState } from '@ngrx/signals';

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState({})
);
