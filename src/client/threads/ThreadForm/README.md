```jsx
import { MemoryRouter } from 'react-router-dom';
import * as THREADS from '__fixtures__/threadsFixture';

mockFetch([
  THREADS.canCreateThreadFetch,
]);

<MemoryRouter initialEntries={['/new-thread']}>
  <ThreadForm />
</MemoryRouter>
```
