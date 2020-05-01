const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
   fixBabelImports('antd', {
     libraryDirectory: 'es',
     style: true,
   }),
   addLessLoader({
       lessOptions: {
           javascriptEnabled: true,
           modifyVars: {
               '@primary-color': 'darken(#428bca, 6.5%)',
               '@success-color': '#5cb85c',
               '@processing-color': '@primary-color',
               '@error-color': 'darken(#d9534f, 10%)',
               '@highlight-color': '@error-color',
               '@warning-color': '#f0ad4e',
               '@normal-color': '#d9d9d9'
           }
       }
   })
);