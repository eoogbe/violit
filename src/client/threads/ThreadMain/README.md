```jsx
import { MemoryRouter } from 'react-router-dom';
import * as THREADS from '__fixtures__/threadsFixture';

<MemoryRouter>
  <ThreadMain
    id="thread1"
    slug={THREADS.thread1.slug}
    author={THREADS.thread1.author}
    dateCreated={THREADS.thread1.dateCreated}
    headline={THREADS.thread1.headline}
    articleBody={THREADS.thread1.articleBody}
    createComment={() => {}}
    loggedIn
    canCreateComment
    canDelete
  />
</MemoryRouter>
```

Without article body:

```jsx
import { MemoryRouter } from 'react-router-dom';
import * as THREADS from '__fixtures__/threadsFixture';

<MemoryRouter>
  <ThreadMain
    id="thread1"
    slug={THREADS.thread1.slug}
    author={THREADS.thread1.author}
    dateCreated={THREADS.thread1.dateCreated}
    headline={THREADS.thread1.headline}
    createComment={() => {}}
    loggedIn
    canCreateComment
    canDelete
  />
</MemoryRouter>
```

When deleted:

```jsx
import { MemoryRouter } from 'react-router-dom';
import * as THREADS from '__fixtures__/threadsFixture';

<MemoryRouter>
  <ThreadMain
    id="thread1"
    slug={THREADS.thread1.slug}
    author={THREADS.thread1.author}
    dateCreated={THREADS.thread1.dateCreated}
    dateDeleted={THREADS.thread1.dateDeleted}
    headline={THREADS.thread1.headline}
    articleBody={THREADS.thread1.articleBody}
    createComment={() => {}}
  />
</MemoryRouter>
```

When cannot create comment:

```jsx
import { MemoryRouter } from 'react-router-dom';
import * as THREADS from '__fixtures__/threadsFixture';

<MemoryRouter>
  <ThreadMain
    id="thread1"
    slug={THREADS.thread1.slug}
    author={THREADS.thread1.author}
    dateCreated={THREADS.thread1.dateCreated}
    headline={THREADS.thread1.headline}
    articleBody={THREADS.thread1.articleBody}
    createComment={() => {}}
  />
</MemoryRouter>
```
