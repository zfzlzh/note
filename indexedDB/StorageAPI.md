# navigator.storage

安全环境（127.0.0.1，https，localhost）下可用，非安全环境（0.0.0.0，电脑ip）不可用，为undefined，可用window.isSecureContext判断当前是否安全环境

```js
navigator.storage
//storageManager{
//	estimate:Promise<>
//	getDirectory:Promise<>
//	persist:Promise<boolean>
//	persisted:Promise<boolean>
//}
```

