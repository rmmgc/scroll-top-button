import babel from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve'
import css from 'rollup-plugin-css-only'
import pkg from './package.json';

const banner = `/*!
 * ${pkg.name}
 * ${pkg.description}
 *
 * @version v${pkg.version}
 * @author ${pkg.author}
 * @license ${pkg.license}
 */
`;

const isProduction = process.env.NODE_ENV === 'production';
console.log(`Building for ${isProduction ? 'production' : 'development'}...`);

let configuration = [
  {
    input: 'src/index.js',
    output: {
      banner,
      name: 'scrollTopButton',
      file: isProduction ? pkg.browser : 'dev/main.js',
      format: 'iife',
      exports: 'auto',
      plugins: []
    },
    plugins: [
      nodeResolve({ browser: true }),
      commonjs(),
      ...isProduction
        ? [
          babel({ babelHelpers: 'bundled', exclude: ['node_modules/**'] }),
          terser({ output: { comments: /^!/ } })
        ]
        : [serve({ open: true, contentBase: 'dev' })],
      css({ output: 'main.css' }),
    ],
  },
];

// Include cjs build in production mode
if (isProduction) {
  configuration.push({
    input: 'src/index.js',
    output: {
      banner,
      file: pkg.commonjs,
      format: 'cjs',
      exports: 'default'
    },
    external: Object.keys(pkg.dependencies),
    plugins: [
      css({ output: 'main.css' }),
    ],
  });
}

export default configuration;