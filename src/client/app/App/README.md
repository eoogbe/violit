```jsx
import { MemoryRouter } from 'react-router-dom';
import * as BOARD from '__fixtures__/boardFixture';
import * as THREADS from '__fixtures__/threadsFixture';
import * as USER from '__fixtures__/userFixture';
import { constants as authConstants } from 'client/auth';

mockFetch([
  BOARD.boardFetch,
  THREADS.threadsFetch,
]);

const state = {
  [authConstants.NAME]: {
    credentials: USER.credentials,
  },
};

<StoreProvider state={state}>
  <MemoryRouter>
    <App />
  </MemoryRouter>
</StoreProvider>
```

When logged out:

```jsx
import { MemoryRouter } from 'react-router-dom';
import * as BOARD from '__fixtures__/boardFixture';
import * as THREADS from '__fixtures__/threadsFixture';

mockFetch([
  BOARD.boardFetch,
  THREADS.threadsFetch,
]);

<StoreProvider>
  <MemoryRouter>
    <App />
  </MemoryRouter>
</StoreProvider>
```
