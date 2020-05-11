We used craco-antd successfully for a year, but bitrot has set it and it seems to be falling apart.

Let's use the official antd docs now, which have evolved since we first started using it.

1.  yarn add -E react-app-rewired customize-cra babel-plugin-import less less-loader antd-dayjs-webpack-plugin

2. fix the package.json

"customize-cra": "1.0.0-alpha.0",

this addresses the bug here:

https://github.com/arackaf/customize-cra/issues/241
