```jsx
import { MemoryRouter } from 'react-router-dom';
import * as THREADS from '__fixtures__/threadsFixture';

mockFetch([
  THREADS.threadsFetch,
]);

<MemoryRouter>
  <ThreadList />
</MemoryRouter>
```

Without threads:

```jsx
import { MemoryRouter } from 'react-router-dom';

mockFetch([
  {
    url: 'http://localhost:4000/api/threads',
    method: 'GET',
    status: 200,
    body: {
      items: [],
    },
  }
]);

<MemoryRouter>
  <ThreadList />
</MemoryRouter>
```
