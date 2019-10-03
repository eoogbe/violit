```jsx
import { MemoryRouter, Route } from 'react-router-dom';
import * as COMMENTS from '__fixtures__/commentsFixture';
import * as THREADS from '__fixtures__/threadsFixture';
import * as USER from '__fixtures__/userFixture';
import { constants as authConstants } from 'client/auth';

mockFetch([
  THREADS.threadFetch1,
  COMMENTS.canCreateCommentFetch,
  COMMENTS.commentsFetch,
]);

const state = {
  [authConstants.NAME]: {
    credentials: USER.credentials,
  },
};

<StoreProvider state={state}>
  <MemoryRouter initialEntries={[THREADS.thread1.path]}>
    <Route path="/threads/:slug">
      <Thread />
    </Route>
  </MemoryRouter>
</StoreProvider>
```
