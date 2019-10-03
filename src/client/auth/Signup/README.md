```jsx
import { MemoryRouter } from 'react-router-dom';

<StoreProvider>
  <MemoryRouter initialEntries={['/signup']}>
    <Signup createAsyncFunction={() => {}} />
  </MemoryRouter>
</StoreProvider>
```
