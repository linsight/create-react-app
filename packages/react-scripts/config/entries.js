const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const paths = require('./paths');

const resolveSrc = (relativePath) => path.resolve(paths.appSrc, relativePath);
const resolvePublic = (relativePath) =>
  path.resolve(paths.appPublic, relativePath);

const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx',
];

const moduleTemplateExtensions = ['html'];

const resolveFile = (resolveFn, extensions, filePath) => {
  const extension = extensions.find((extension) =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`))
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return null;
};

const ENTRY_POINT = /^ENTRY_POINT_/i;

const entryConfigs = Object.keys(process.env)
  .filter((key) => ENTRY_POINT.test(key))
  .map((key) => process.env[key])
  .map((value) => {
    const js = resolveFile(resolveSrc, moduleFileExtensions, value);
    const html = resolveFile(resolvePublic, moduleTemplateExtensions, value);
    const chunk = value;

    return js ? { js, html, chunk } : null;
  })
  .filter(Boolean);

if (entryConfigs.length === 0) {
  entryConfigs.push({
    js: paths.appIndexJs,
    html: paths.appHtml,
    chunk: 'index',
  });
}

const entryJs = entryConfigs.map((config) => config.js).filter(Boolean);
const entryHtmls = entryConfigs.map((config) => config.html).filter(Boolean);
const entryFiles = entryJs.concat(entryHtmls);

const getEntryPoints = (webpackEnv) => {
  const isEnvDevelopment = webpackEnv === 'development';

  const entryPoints = {};

  entryConfigs.forEach((config) => {
    const res = isEnvDevelopment
      ? [
          require.resolve('react-dev-utils/webpackHotDevClient'),
          require.resolve('react-error-overlay'),
        ]
      : [];

    res.push(config.js);
    entryPoints[config.chunk] = res;
  });

  return entryPoints;
};

const genHtmlWebpackPlugins = (webpackEnv) => {
  const isEnvProduction = webpackEnv === 'production';

  return entryConfigs
    .filter((config) => !!config.html)
    .map(
      (config) =>
        new HtmlWebpackPlugin(
          Object.assign(
            {},
            {
              inject: true,
              template: config.html,
              filename: `${config.chunk}.html`,
              chunks: [config.chunk],
            },
            isEnvProduction
              ? {
                  minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    keepClosingSlash: true,
                    minifyJS: true,
                    minifyCSS: true,
                    minifyURLs: true,
                  },
                }
              : undefined
          )
        )
    );
};

module.exports = {
  getEntryPoints,
  entryHtmls,
  entryFiles,
  genHtmlWebpackPlugins,
};
