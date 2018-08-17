"use strict";

describe(`gatsby-plugin-less`, () => {
  jest.mock(`../resolve`, () => module => `/resolved/path/${module}`);
  const actions = {
    setWebpackConfig: jest.fn() // loaders "mocks"

  };
  const loaders = {
    miniCssExtract: () => `miniCssExtract`,
    css: args => `css(${JSON.stringify(args)})`,
    postcss: args => `postcss(${JSON.stringify(args)})`
  };

  const _require = require(`../gatsby-node`),
        onCreateWebpackConfig = _require.onCreateWebpackConfig;

  beforeEach(() => {
    actions.setWebpackConfig.mockReset();
  });
  const tests = {
    stages: [`develop`, `build-javascript`, `develop-html`, `build-html`],
    options: {
      "No options": {},
      "Less options #1": {
        modifyVars: {
          "text-color": `#fff`
        },
        strictMath: true
      },
      "Less options #2": {
        modifyVars: require(`../theme-test.js`)
      },
      "PostCss plugins": {
        postCssPlugins: [`test1`]
      }
    }
  };
  tests.stages.forEach(stage => {
    for (let label in tests.options) {
      const options = tests.options[label];
      it(`Stage: ${stage} / ${label}`, () => {
        onCreateWebpackConfig({
          actions,
          loaders,
          stage: `develop`
        }, options);
        expect(actions.setWebpackConfig).toMatchSnapshot();
      });
    }
  });
});