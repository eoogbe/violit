```jsx
import * as USER from '__fixtures__/userFixture';
import { constants as authConstants } from 'client/auth';

const state = {
  [authConstants.NAME]: {
    credentials: USER.credentials,
  },
};

<StoreProvider state={state}>
  <div style={{ marginLeft: '50px', width: '150px' }}>
    <UserDropdown />
  </div>
</StoreProvider>
```
