x00281052  --  intercept,如果加载的图片突然变得很白，大概率是这个值变成了0，重新从dataSet中取这个值再赋值到image的intercept可以解决

```js
dataSet.floatString('x00281052')
```

