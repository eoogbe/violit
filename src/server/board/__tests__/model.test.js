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

import * as BOARD from '__fixtures__/boardFixture';
import initDb from 'testUtils/initializeDatabase';
import createModel from '../model';

let db;

beforeEach(() => {
  db = initDb();
});

afterEach(() => {
  db.close();
});

describe('getBoard', () => {
  it('finds the board', () => {
    const { getBoard } = createModel({ db });
    const board = getBoard();
    expect(board).toEqual(BOARD.board);
  });
});
