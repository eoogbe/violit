```jsx
import { MdAdd, MdDelete, MdEdit } from 'react-icons/md';

const ITEMS = [
  {
    onClick: () => {},
    icon: MdAdd,
    text: 'Add',
  },
  {
    onClick: () => {},
    icon: MdEdit,
    text: 'Edit',
  },
  {
    onClick: () => {},
    icon: MdDelete,
    text: 'Delete',
  },
];

<>
  <div style={{ position: 'relative' }}>
    <DropdownMenu id="dropdown-menu" items={ITEMS} />
  </div>
  <div style={{ height: '125px' }} />
</>
```
