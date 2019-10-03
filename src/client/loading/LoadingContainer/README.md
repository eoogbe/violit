```jsx
const loadData = () => Promise.resolve('foo');
const render = (data) => <div>{data}</div>;

<LoadingContainer loadData={loadData} render={render} />
```

When loading (refresh page if loaded):

```jsx
import { wait } from 'testUtils/wait';

const loadData = () => wait(1000000);
const render = (data) => <div>{data}</div>;

<LoadingContainer loadData={loadData} render={render} />
```

When error:

```jsx
const loadData = () => Promise.reject();
const render = (data) => <div>{data}</div>;

<LoadingContainer
  loadData={loadData}
  action="loading the foo"
  render={render}
/>
```
