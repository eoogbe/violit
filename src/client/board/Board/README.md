```jsx
import { MemoryRouter } from 'react-router-dom';
import * as BOARD from '__fixtures__/boardFixture';
import * as THREADS from '__fixtures__/threadsFixture';

mockFetch([
  BOARD.boardFetch,
  THREADS.threadsFetch,
]);

<MemoryRouter>
  <Board />
</MemoryRouter>
```
