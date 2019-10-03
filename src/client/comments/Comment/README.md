```jsx
import * as COMMENTS from '__fixtures__/commentsFixture';

<Comment
  id="comment1"
  author={COMMENTS.comment1.author}
  dateCreated={COMMENTS.comment1.dateCreated}
  text={COMMENTS.comment1.text}
  canDelete
/>
```

When deleted:

```jsx
import * as COMMENTS from '__fixtures__/commentsFixture';

<Comment
  id="comment1"
  author={COMMENTS.comment2.author}
  dateCreated={COMMENTS.comment2.dateCreated}
  dateDeleted={COMMENTS.comment2.dateDeleted}
/>
```
