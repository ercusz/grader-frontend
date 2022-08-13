const path = require('path');
const toPath = (filePath) => path.join(process.cwd(), filePath);

module.exports = {
  stories: ['../**/*.stories.mdx', '../**/*.stories.@(js|jsx|ts|tsx)'],
  /** Expose public folder to storybook as static */
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-controls',
    '@storybook/addon-actions',
    '@storybook/addon-backgrounds',
    '@storybook/addon-viewport',
    '@storybook/addon-toolbars',
    '@storybook/addon-measure',
    '@storybook/addon-outline',
    'storybook-css-modules-preset',
    'storybook-dark-mode',
    'storybook-addon-next-router',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    // {
    //   name: '@storybook/addon-postcss',
    //   options: {
    //     postcssLoaderOptions: {
    //       implementation: require('postcss'),
    //     },
    //   },
    // },
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
  webpackFinal: (config) => {
    config.module.rules.push({
      test: /\.css$/,
      use: [
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [require('tailwindcss'), require('autoprefixer')],
            },
          },
        },
      ],
      include: path.resolve(__dirname, '../'),
    });
    return config;
  },
};
