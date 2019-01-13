'use strict';

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const resolve = require('resolve');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const getClientEnvironment = require('./env');
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin-alt');
const typescriptFormatter = require('react-dev-utils/typescriptFormatter');
const nodeExternals = require('webpack-node-externals');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const paths = require('./paths.lib');

const publicPath = paths.servedPath;
const shouldUseRelativeAssetPaths = publicPath === './';
let shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
if (paths.libFile && paths.libFile.sourceMap !== undefined) {
  shouldUseSourceMap = paths.libFile.sourceMap;
}
const publicUrl = publicPath.slice(0, -1);
// Get environment variables to inject into our app.
const env = getClientEnvironment(publicUrl);

// Assert this just to be safe.
// Development builds of React are slow and not intended for production.
if (env.stringified['process.env'].NODE_ENV !== '"production"') {
  throw new Error('Production builds must have NODE_ENV=production.');
}

// Check if TypeScript is setup
const useTypeScript = fs.existsSync(paths.appTsConfig);

// style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;
const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;

// common function to get style loaders
const getStyleLoaders = (cssOptions, preProcessor, preOptions) => {
  const loaders = [
    require.resolve('style-loader'),
    {
      loader: require.resolve('css-loader'),
      options: cssOptions,
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: require.resolve('postcss-loader'),
      options: {
        // Necessary for external CSS imports to work
        // https://github.com/facebook/create-react-app/issues/2677
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009',
            },
            stage: 3,
          }),
        ],
      },
    },
  ];
  if (preProcessor && preOptions) {
    loaders.push({
      loader: require.resolve(preProcessor),
      options: preOptions,
    });
  } else if (preProcessor) {
    loaders.push(require.resolve(preProcessor));
  }
  return loaders;
};

module.exports = {
  mode: 'production',
  // Don't attempt to continue if there are any errors.
  bail: true,
  // We generate sourcemaps in production. This is slow but gives good results.
  // You can exclude the *.map files from the build during deployment.
  devtool: shouldUseSourceMap ? 'source-map' : false,
  // In production, we only want to load the app code.
  externals: [
    nodeExternals(),
    function(context, request, callback) {
      // src/HBComponents/HBButton -> ./HBButton
      if (/^src\/HBComponents\//.test(request)) {
        const requestObjPath = request.split(/^src\/HBComponents\//)[1];
        return callback(null, './' + requestObjPath);
      } else if (/^src\/assets\//.test(request)) {
        const requestObjPath = request.split(/^src\/assets\//)[1];
        return callback(null, './' + requestObjPath);
      }
      callback();
    },
  ],
  entry: paths.entryList,
  output: {
    // The build folder.
    path: paths.appBuild,
    libraryTarget: 'commonjs2',
    // Generated JS file names (with nested folders).
    // There will be one main bundle, and one file per asynchronous chunk.
    // We don't currently advertise code splitting but Webpack supports it.
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    // We inferred the "public path" (such as / or /my-project) from homepage.
    // publicPath: publicPath,
    publicPath: '/',
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: info => path.relative(paths.appSrc, info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
        parallel: true,
        cache: true,
        sourceMap: shouldUseSourceMap,
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          parser: safePostCssParser,
          map: shouldUseSourceMap
            ? {
                inline: false,
                annotation: true,
              }
            : false,
        },
      }),
    ],
    splitChunks: {
      chunks: 'all',
      name: false,
    },
  },
  resolve: {
    modules: ['node_modules'].concat(
      // It is guaranteed to exist because we tweak it in `env.js`
      process.env.NODE_PATH.split(path.delimiter).filter(Boolean),
    ),
    extensions: paths.moduleFileExtensions.map(ext => `.${ext}`).filter(ext => useTypeScript || !ext.includes('ts')),
    alias: {
      // Support React Native Web
      // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
      'react-native': 'react-native-web',
      src: path.resolve(__dirname, '../src'),
    },
    plugins: [PnpWebpackPlugin, new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson])],
  },
  resolveLoader: {
    plugins: [
      // Also related to Plug'n'Play, but this time it tells Webpack to load its loaders
      // from the current package.
      PnpWebpackPlugin.moduleLoader(module),
    ],
  },
  module: {
    strictExportPresence: true,
    rules: [
      // Disable require.ensure as it's not a standard language feature.
      { parser: { requireEnsure: false } },

      // First, run the linter.
      // It's important to do this before Babel processes the JS.
      {
        test: process.env.nolint ? /\.(nolint)$/ : /\.(js|mjs|jsx)$/,
        enforce: 'pre',
        use: [
          {
            options: {
              formatter: require.resolve('react-dev-utils/eslintFormatter'),
              eslintPath: require.resolve('eslint'),
            },
            loader: require.resolve('eslint-loader'),
          },
        ],
        include: paths.appSrc,
      },
      {
        oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'lib_media/[name].[hash:8].[ext]',
            },
          },
          {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            include: paths.appSrc,
            loader: require.resolve('babel-loader'),
            options: {
              customize: require.resolve('babel-preset-react-app/webpack-overrides'),
              babelrc: false,
              extends: path.resolve(__dirname, 'babel.lib.json'),
              cacheDirectory: true,
              // Save disk space when time isn't as important
              cacheCompression: true,
              compact: true,
            },
          },
          {
            test: /\.(js|mjs)$/,
            exclude: /@babel(?:\/|\\{1,2})runtime/,
            loader: require.resolve('babel-loader'),
            options: {
              babelrc: false,
              configFile: false,
              compact: false,
              presets: [[require.resolve('babel-preset-react-app/dependencies'), { helpers: true }]],
              cacheDirectory: true,
              // Save disk space when time isn't as important
              cacheCompression: true,
              sourceMaps: false,
            },
          },
          {
            test: /.mdx?$/,
            use: ['babel-loader', '@mdx-js/loader'],
          },
          {
            test: cssRegex,
            exclude: cssModuleRegex,
            loader: getStyleLoaders({
              importLoaders: 1,
              sourceMap: shouldUseSourceMap,
            }),
            sideEffects: true,
          },
          {
            test: cssModuleRegex,
            loader: getStyleLoaders({
              importLoaders: 1,
              sourceMap: shouldUseSourceMap,
              modules: true,
              getLocalIdent: getCSSModuleLocalIdent,
            }),
          },
          {
            test: sassRegex,
            exclude: sassModuleRegex,
            loader: getStyleLoaders(
              {
                importLoaders: 2,
                sourceMap: shouldUseSourceMap,
              },
              'sass-loader',
            ),
            sideEffects: true,
          },
          // Adds support for CSS Modules, but using SASS
          // using the extension .module.scss or .module.sass
          {
            test: sassModuleRegex,
            loader: getStyleLoaders(
              {
                importLoaders: 2,
                sourceMap: shouldUseSourceMap,
                modules: true,
                getLocalIdent: getCSSModuleLocalIdent,
              },
              'sass-loader',
            ),
          },
          // less-loader
          {
            test: lessRegex,
            exclude: lessModuleRegex,
            use: getStyleLoaders({ importLoaders: 2 }, 'less-loader', {
              javascriptEnabled: true
            }),
          },
          {
            test: lessModuleRegex,
            use: getStyleLoaders(
              {
                importLoaders: 2,
                modules: true,
                getLocalIdent: getCSSModuleLocalIdent,
              },
              'less-loader',
              {
                javascriptEnabled: true
              },
            ),
          },
          {
            loader: require.resolve('file-loader'),
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            options: {
              name: '/lib_media/[name].[ext]',
            },
          },
          // ** STOP ** Are you adding a new loader?
          // Make sure to add the new loader(s) before the "file" loader.
        ],
      },
    ],
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: process.env.analyzer ? 'server' : 'disabled',
      analyzerPort: 7117,
    }),
    new ModuleNotFoundPlugin(paths.appPath),
    new webpack.DefinePlugin(env.stringified),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[name].chunk.css',
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    fs.existsSync(paths.appTsConfig) &&
      new ForkTsCheckerWebpackPlugin({
        typescript: resolve.sync('typescript', {
          basedir: paths.appNodeModules,
        }),
        async: false,
        checkSyntacticErrors: true,
        tsconfig: paths.appTsConfig,
        compilerOptions: {
          module: 'esnext',
          moduleResolution: 'node',
          resolveJsonModule: true,
          isolatedModules: true,
          noEmit: true,
          jsx: 'preserve',
        },
        reportFiles: [
          '**',
          '!**/*.json',
          '!**/__tests__/**',
          '!**/?(*.)(spec|test).*',
          '!src/setupProxy.js',
          '!src/setupTests.*',
        ],
        watch: paths.appSrc,
        silent: true,
        formatter: typescriptFormatter,
      }),
  ].filter(Boolean),
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
  performance: false,
};
