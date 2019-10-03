/**
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import coll from '../collection';


describe('base', () => {
  it('constructs the base collection', () => {
    const collection = coll.base('/foo')(false);
    expect(collection).toEqual({
      version: '1.0',
      href: 'http://localhost:4000/api/foo',
      links: [
        { rel: 'home', href: 'http://localhost:4000/api' },
        { rel: 'authenticate', href: 'http://localhost:4000/api/auth' },
        { rel: 'register-user', href: 'http://localhost:4000/api/users' },
      ],
    });
  });
  it('with auth token sets the logout link', () => {
    const collection = coll.base('/foo')(true);
    expect(collection).toEqual({
      version: '1.0',
      href: 'http://localhost:4000/api/foo',
      links: [
        { rel: 'home', href: 'http://localhost:4000/api' },
        { rel: 'authenticated-as', href: 'http://localhost:4000/api/auth' },
        { rel: 'logout', href: 'http://localhost:4000/api/auth' },
      ],
    });
  });
});

describe('withError', () => {
  it('sets the error of the collection', () => {
    const collection = coll.withError({ message: 'Oh no!' })({});
    expect(collection).toEqual({
      error: { message: 'Oh no!' },
    });
  });
});

describe('withTemplate', () => {
  it('sets the template of the collection', () => {
    const keys = ['fizz', 'foo', 'baz'];
    const obj = {
      foo: 'bar',
      fizz: 'buzz',
    };
    const collection = coll.withTemplate(keys)(obj)({});
    expect(collection).toEqual({
      template: {
        data: [
          { name: 'fizz', value: 'buzz' },
          { name: 'foo', value: 'bar' },
          { name: 'baz', value: '' },
        ],
      },
    });
  });
});

describe('addLink', () => {
  it('adds a link to the collection', () => {
    const initial = {
      links: [{ rel: 'foo', href: 'http://localhost:4000/api/foo' }],
    };
    const collection = coll.addLink('/bar')('bar')(initial);
    expect(collection).toEqual({
      links: [
        { rel: 'bar', href: 'http://localhost:4000/api/bar' },
        { rel: 'foo', href: 'http://localhost:4000/api/foo' },
      ],
    });
  });
  it('when collection does not have links creates links array', () => {
    const collection = coll.addLink('/foo')('foo')({});
    expect(collection).toEqual({
      links: [{ rel: 'foo', href: 'http://localhost:4000/api/foo' }],
    });
  });
});

describe('addItem', () => {
  it('adds an item to the collection', () => {
    const initial = {
      items: [{ href: 'http://localhost:4000/api/foo' }],
    };
    const item = { href: 'http://localhost:4000/api/bar' };

    const collection = coll.addItem(item)(initial);

    expect(collection).toEqual({
      items: [
        { href: 'http://localhost:4000/api/bar' },
        { href: 'http://localhost:4000/api/foo' },
      ],
    });
  });
  it('when collection does not have items creates items array', () => {
    const item = { href: 'http://localhost:4000/api/foo' };
    const collection = coll.addItem(item)({});
    expect(collection).toEqual({
      items: [{ href: 'http://localhost:4000/api/foo' }],
    });
  });
});

describe('item', () => {
  it('constructs an item', () => {
    const keys = ['fizz', 'bar', 'qux'];
    const item = coll.item('/foo')(keys)({
      bar: 'baz',
      fizz: 'buzz',
    });
    expect(item).toEqual({
      href: 'http://localhost:4000/api/foo',
      data: [
        { name: 'fizz', value: 'buzz' },
        { name: 'bar', value: 'baz' },
        { name: 'qux', value: '' },
      ],
    });
  });
});
