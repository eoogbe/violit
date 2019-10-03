```jsx
import { MemoryRouter } from 'react-router-dom';
import * as THREADS from '__fixtures__/threadsFixture';

<MemoryRouter>
  <ThreadItem
    slug={THREADS.thread1.slug}
    author={THREADS.thread1.author}
    dateCreated={THREADS.thread1.dateCreated}
    headline={THREADS.thread1.headline}
  />
</MemoryRouter>
```
