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

const path = require('path');

module.exports = {
  template: {
    head: {
      links: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css?family=Montserrat|Roboto+Mono|Roboto:400,700&display=swap',
        },
      ],
    },
  },
  styles: {
    StyleGuide: {
      '@global body': {
        fontFamily: "'Roboto', sans-serif",
      },
      '@global code': {
        fontFamily: "'Roboto Mono', monospace",
      },
    },
  },
  styleguideComponents: {
		Wrapper: path.join(__dirname, 'styleguide', 'Wrapper'),
	},
  context: {
    StoreProvider: path.join(__dirname, 'styleguide', 'StoreProvider'),
    mockFetch: path.join(__dirname, 'styleguide', 'mockFetch'),
  },
  pagePerSection: true,
  sections: [
    {
      name: 'Violit',
      components: [
        'src/client/app/App/App.js',
        'src/client/app/Main/Main.js',
        'src/client/app/UserDropdown/UserDropdown.js',
      ],
    },
    {
      name: 'Board screen',
      components: [
        'src/client/board/Board/Board.js',
        'src/client/threads/ThreadList/ThreadList.js',
        'src/client/threads/ThreadItem/ThreadItem.js',
      ],
    },
    {
      name: 'Thread screen',
      components: [
        'src/client/threads/Thread/Thread.js',
        'src/client/threads/ThreadMain/ThreadMain.js',
        'src/client/comments/CommentForm/CommentForm.js',
        'src/client/comments/CommentList/CommentList.js',
        'src/client/comments/Comment/Comment.js',
      ],
    },
    {
      name: 'New thread screen',
      components: [
        'src/client/threads/ThreadForm/ThreadForm.js',
      ],
    },
    {
      name: 'Login Screen',
      components: [
        'src/client/auth/Login/Login.js',
      ],
    },
    {
      name: 'Signup Screen',
      components: [
        'src/client/auth/Signup/Signup.js',
      ],
    },
    {
      name: 'Core elements',
      components: [
        'src/client/core/Alert/Alert.js',
        'src/client/core/Button/Button.js',
        'src/client/core/Markdown/Markdown.js',
        'src/client/core/RelativeDatetime/RelativeDatetime.js',
      ],
    },
    {
      name: 'Article elements',
      components: [
        'src/client/article/ArticleHeader/ArticleHeader.js',
        'src/client/article/ArticleFooter/ArticleFooter.js',
        'src/client/article/EmptyListParagraph/EmptyListParagraph.js',
      ],
    },
    {
      name: 'Form elements',
      components: [
        'src/client/forms/FormError/FormError.js',
        'src/client/forms/Input/Input.js',
      ],
    },
    {
      name: 'Dropdown elements',
      components: [
        'src/client/dropdown/DropdownMenu/DropdownMenu.js',
      ],
    },
    {
      name: 'Loading elements',
      components: [
        'src/client/loading/LoadingContainer/LoadingContainer.js',
      ],
    },
  ],
  webpackConfig: {
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            customize: require.resolve('babel-preset-react-app/webpack-overrides'),
            babelrc: false,
            configFile: false,
            presets: ['babel-preset-react-app'],
            cacheDirectory: true,
            cacheCompression: false,
          },
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: { importLoaders: 1, },
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: () => [
                  require('postcss-flexbugs-fixes'),
                  require('postcss-preset-env')({
                    autoprefixer: {
                      flexbox: 'no-2009',
                    },
                    stage: 3,
                  }),
                  require('postcss-normalize'),
                ],
              },
            },
          ],
          sideEffects: true,
        },
      ],
    },
    resolve: {
      alias: {
        '__fixtures__': path.resolve(__dirname, 'src', '__fixtures__'),
        'client': path.resolve(__dirname, 'src', 'client'),
        'testUtils': path.resolve(__dirname, 'src', 'testUtils'),
      },
    },
  },
};
