# 1.Failed to load resource: net::ERR_CONTENT_LENGTH_MISMATCH

## 后缀200

首先确定发布到服务器上的文件是否有问题，无则查看服务器日志，原因可能为nginx缓存文件权限不够，或者访问这个文件的时候权限没对上

## 后缀206

可能为磁盘已满，删除一些占用过大的文件

也可能为配置问题，

在http里面加入三行配置

```
proxy_buffer_size 128k;
proxy_buffers   32 128k;
proxy_busy_buffers_size 128k;
```

