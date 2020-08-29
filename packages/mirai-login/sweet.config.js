import process from 'process';
import path from 'path';

const isDev = process.env.NODE_ENV === 'development';

function nodeExternals(node) {
  const result = {};

  for (const name of node) {
    result[name] = `globalThis.require('${ name }')`;
  }

  return result;
}

export default function(info) {
  const plugins = [
    ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }],
    ['import', { libraryName: 'lodash', libraryDirectory: '', camel2DashComponentName: false }, 'lodash']
  ];

  if (!isDev) {
    plugins.unshift(['transform-react-remove-prop-types', { mode: 'remove', removeImport: true }]);
  }

  const config = {
    frame: 'react',
    dll: [
      'react',
      'react-dom',
      'prop-types',
      '@reduxjs/toolkit',
      'react-redux',
      'reselect'
    ],
    entry: {
      index: [path.join(__dirname, 'src/index.js')]
    },
    externals: nodeExternals([
      'child_process',
      'fs',
      'os',
      'path',
      'process',
      'stream',
      'util',
      'electron',
      'fs-extra',
      'glob',
      'got'
    ]),
    js: {
      ecmascript: true,
      jsx: true,
      plugins,
      exclude: /node_modules/
    },
    sass: {
      include: /src/
    },
    css: {
      modifyVars: {
        // https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
        '@primary-color': '#722ed1'
      },
      include: /node_modules[\\/]_?antd/
    },
    html: [{ template: path.join(__dirname, 'src/index.pug') }]
  };

  return config;
}