import * as path from 'path';

function nodeExternals(node: Array<string>): { [k: string]: string } {
  const result: { [k: string]: string } = {};

  for (const name of node) {
    result[name] = `globalThis.require('${ name }')`;
  }

  return result;
}

export default function(info: object): { [key: string]: any } {
  const plugins: Array<any> = [
    ['import', { libraryName: 'ant-design-vue', libraryDirectory: 'es', style: true }]
  ];

  const config: { [key: string]: any } = {
    frame: 'vue',
    dll: [
      'vue',
      'vue-router',
      'vuex'
    ],
    entry: {
      index: [path.join(__dirname, 'src/index.tsx')]
    },
    html: [
      { template: path.join(__dirname, 'src/index.pug') }
    ],
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
      plugins,
      exclude: /node_modules/i
    },
    ts: {
      plugins,
      exclude: /node_modules/i
    },
    sass: {
      include: /src/
    }
  };

  return config;
}