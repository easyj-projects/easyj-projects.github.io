# GraalVM Native Image

---------------------------------------------------------------------------------------------------------------------------

#### 一、了解GraalVM Native Image的理论知识与简单实践

要想更好的使用 `Native Image`，首先就是要了解其理论知识，[点击进来看看吧](native-image/theory-practice.md)。


---------------------------------------------------------------------------------------------------------------------------

#### 二、准备环境，打包简单应用

由于 `native-image` 不支持跨平台，每个平台打包出来的镜像，基本上只能在该平台上运行。<br>
所以这里提供了 `Windows` 和 `Linux` 两个平台的打包方法：
1. [Windows环境打包简单应用](native-image/native-image-windows.md)
2. [Linux环境打包简单应用](native-image/native-image-linux.md)


---------------------------------------------------------------------------------------------------------------------------

#### 三、打包环境踩坑

在打包 `native-image` 时，会遇到很多环境问题，这里记录一下：[打包环境踩坑记录](native-image/environment-treading-pit-log.md)


---------------------------------------------------------------------------------------------------------------------------

#### 四、复杂应用踩坑

复杂应用打包的时候，也会遇到很多问题，这里记录一下：[复杂应用踩坑记录](native-image/treading-pit-log.md)


---------------------------------------------------------------------------------------------------------------------------

#### 五、参考资料

##### 5.1、强烈推荐一篇 Java AOT 的博文

本人在学习Java AOT时偶然发现了一偏写的非常不错的文章，推荐给大家。<br>
Java在云原生的破局利器——AOT：https://huaweicloud.csdn.net/63311d00d3efff3090b52913.html

##### 5.2、官方参考资料

1. Spring Boot官方文档：https://docs.spring.io/spring-boot/docs/current/reference/html/native-image.html
2. GraalVM官方文档：https://www.graalvm.org/latest/reference-manual/native-image/
3. GraalVM官方示例：https://github.com/graalvm/native-build-tools/blob/master/samples/java-application-with-reflection/pom.xml
