```jsx
import * as COMMENTS from '__fixtures__/commentsFixture';
import * as THREADS from '__fixtures__/threadsFixture';

mockFetch([
  COMMENTS.commentsFetch,
]);

<CommentList threadSlug={THREADS.thread1.slug} />
```

When loading (refresh page if loaded):

```jsx
import * as THREADS from '__fixtures__/threadsFixture';
import { wait } from 'testUtils/wait';

window.fetch = () => wait(1000000);

<CommentList threadSlug={THREADS.thread1.slug} />
```

When error:

```jsx
import * as THREADS from '__fixtures__/threadsFixture';

window.fetch = () => Promise.reject();

<CommentList threadSlug={THREADS.thread1.slug} />
```

Without comments:

```jsx
import * as THREADS from '__fixtures__/threadsFixture';

mockFetch([
  {
    url: THREADS.thread1.commentsUrl,
    method: 'GET',
    status: 200,
    body: {
      items: [],
    },
  },
]);

<CommentList threadSlug={THREADS.thread1.slug} />
```
