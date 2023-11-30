## npy文件

Numpy的格式，能读写磁盘上的文本数据和二进制数据；

提供了多种存取数组内容的文件操作函数；

保存数组数据的文件可以是二进制格式或者文本格式。

npy 文件用于保存 ndarray 类型的数据

## npz文件

如果想多组数组保存到一个文件中，多个npy文件打包为zip，即为npz

npz 文件用于保存 nadrray 数据组成的字典

## js读取方法

npy：[numpy-parser](https://github.com/ludwigschubert/js-numpy-parser#numpy-parser)等js库可直接读取.npy文件中的数据

npz: [tfjs-npy-node](https://github.com/MaximeKjaer/tfjs-npy-node/tree/master)此为nodejs用，js读取可以先使用JSZip解压.npz文件，然后循环读取解压出来的npy数据