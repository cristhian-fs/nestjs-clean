require('tsconfig-paths').register({
  baseUrl: require('path').resolve(__dirname),
  paths: { '@/*': ['./dist/src/*'] },
});
