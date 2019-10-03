```jsx
import { MemoryRouter } from 'react-router-dom';

<StoreProvider>
  <MemoryRouter initialEntries={['/login']}>
    <Login createAsyncFunction={() => {}} />
  </MemoryRouter>
</StoreProvider>
```
