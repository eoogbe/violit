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
    <Main />
  </MemoryRouter>
</StoreProvider>
```

When error:

```jsx
import { MemoryRouter } from 'react-router-dom';
import * as BOARD from '__fixtures__/boardFixture';
import * as THREADS from '__fixtures__/threadsFixture';

mockFetch([
  BOARD.boardFetch,
  THREADS.threadsFetch,
]);

const state = {
  error: true,
};

<StoreProvider state={state}>
  <MemoryRouter>
    <Main />
  </MemoryRouter>
</StoreProvider>
```
