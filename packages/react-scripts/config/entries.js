const HtmlWebpackPlugin = require('html-webpack-plugin');
const paths = require('./paths');


const resolveApp = relativePath => path.resolve(path.appPath, relativePath);

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

const moduleTemplateExtensions = [
  'html',
  'htm'
]

const resolveFile = (resolveFn, extensions, filePath) => {
  const extension = extensions.find(extension =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`))
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return null;
};
 
const ENTRY_POINT = /^ENTRY_POINT_/i;

const entryConfigs = Object.keys(process.env)
  .filter(key => ENTRY_POINT.test(key))
  .map(key => process.env[key])
  .map(value => {
    const js = resolveFile(resolveApp, moduleFileExtensions, value);
    const html = resolveFile(resolveApp, moduleTemplateExtensions, value);
    const chunk = value;

    return js ? { js, html, chunk } : null;
  })
  .filter(Boolean)

if (entryConfigs.length === 0) {
  entryConfigs.push({ js: paths.appIndexJs, html: paths.appHtml, chunk: 'index' });
}

const entryPoints = entryConfigs.map(config => config.js);
const entryHtmls = entryConfigs.map(config => config.html).filter(Boolean);
const entryFiles = entryPoints.concat(entryHtmls);

const genHtmlWebpackPlugins = (isEnvProduction) => {
  return entryConfigs.filter(config => !!config.html).map(config => new HtmlWebpackPlugin(
    Object.assign(
      {},
      {
        inject: true,
        template: config.html,
        chunks: [config.chunk]
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
  ));
};

module.exports = {
  entryPoints,
  entryHtmls,
  entryFiles,
  genHtmlWebpackPlugin,
};