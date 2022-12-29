# 打包 Native-Image

#### 不同平台的打包方式

由于 `Native-Image` 不支持跨平台，每个平台打包出来的镜像，基本上只能在该平台上运行，所以这里提供了 `Windows` 和 `Linux` 两个平台的打包方法：
1. [Windows环境打包简单应用](native-image/native-image-windows.md)
2. [Linux环境打包简单应用](native-image/native-image-linux.md)


#### 复杂应用待踩坑

目前，本人仅对最简单的一个示例进行了打包，后续会对复杂应用进行打包，遇到的问题会在这里记录。


#### 参考资料：Java AOT

本人在学习Java AOT时偶然发现了一偏写的比较不错的文章，推荐给大家。

1. Java在云原生的破局利器——AOT(JIT与AOT)：https://huaweicloud.csdn.net/63311d00d3efff3090b52913.html
