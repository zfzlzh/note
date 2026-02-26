```js

var webpack = require('webpack');
module.exports = {
    mode:'development',
    entry:'./src/js/dv_index.js',
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        //添加babel
                        presets: [[
                            "@babel/preset-env",{
                                targets: {
                                    browsers: [
                                        "last 2 versions", 
                                        "ie >= 11",
                                        "> 0.5% in CN",        // 中国市场份额 > 0.5%
                                        "not dead",            // 官方还在维护
                                        "chrome >= 49"
                                    ] // 根据需要调整目标浏览器
                                },
                                //设置类型为usage，这样会自动按需引入polyfill
                                useBuiltIns: "usage",
                                //定义corejs版本
                                corejs:  { version: '3.47', proposals: false },//proposals 是否包含实验性功能，false为关闭实验性功能
                        	}
                        ]],
                    }
                }
            },
        ]
    },
}
```

