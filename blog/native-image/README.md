# 打包 Native-Image

#### 准备环境，打包简单应用

由于 `Native-Image` 不支持跨平台，每个平台打包出来的镜像，基本上只能在该平台上运行，所以这里提供了 `Windows` 和 `Linux` 两个平台的打包方法：
1. [Windows环境打包简单应用](native-image/native-image-windows.md)
2. [Linux环境打包简单应用](native-image/native-image-linux.md)


#### 复杂应用踩坑

复杂应用打包的时候，会遇到很多问题，这里记录一下：[踩坑记录](native-image/treading-pit-log.md)


#### 参考资料：Java AOT

本人在学习Java AOT时偶然发现了一偏写的非常不错的文章，推荐给大家。

1. Java在云原生的破局利器——AOT(JIT与AOT)：https://huaweicloud.csdn.net/63311d00d3efff3090b52913.html
