# 复杂应用踩坑记录

复杂应用打包的时候，会遇到很多问题，在这里一一记录下来，并给出解决方案。

------------------------------------------------------------------

### 一、Java语法相关问题：

1. 问题描述：包含 `Lambda` 语法的类代码，默认不会被本地化。<br>
   解决方案：暂无，先绕过处理。

------------------

### 二、资源文件相关问题：（如：配置文件）
 
1. 问题描述：资源文件的路径长度如果超过 `150` 个字符，该资源文件无法被本地化。<br>
   解决方案：缩短资源文件的路径长度。

------------------

### 三、Spring依赖注入相关问题：

1. 问题描述：暂无 <br>
   解决方案：暂无 <br>

------------------

### 四、Spring配置相关问题：

1. 问题描述：`@Value("${xxx.yyy.zzz:0}")` 注解无法注入配置值。<br>
   解决方案：暂无 <br>
   关注issue：https://github.com/spring-projects/spring-boot/issues/33637 <br>

------------------

### 五、SpringBoot的Bean装配相关问题：

1. 问题描述：`@ConditionalOnProperty` 配置值条件装配注解不生效。 <br>
   解决方案：`native-image` 是在打包时，读取配置值判断是否装配，并生成机器码。所以，先修改好配置值，再开始打包，然后发布运行。不能先打包好再修改配置后运行。 <br>

------------------

### 六、打包时，出现解析异常问题：

1. 异常信息：`Fatal error: com.oracle.graal.pointsto.util.AnalysisError$ParsingError: Error encountered while parsing reactor.netty.http.client.HttpClientConnect$$Lambda$acc7a0c687f2afec7708a4742f9f900f329034c5.get()` <br>
   解决方案：暂无 <br>
   关注issue：https://github.com/oracle/graal/issues/5678 （已被标记为BUG） <br>

------------------

### 七、偶发的问题：

1. 异常信息：`Exception during JVMCI compiler initialization` <br>
```log
......省略部分日志
[1/7] Initializing...                                                                                    (9.1s @ 0.20GB)
......省略部分日志
Exception during JVMCI compiler initialization
#
# A fatal error has been detected by the Java Runtime Environment:
#
#  Internal Error (jvmciRuntime.cpp:1609), pid=20092, tid=3344
#  fatal error: Fatal exception in JVMCI: Exception during JVMCI compiler initialization
#
# JRE version: OpenJDK Runtime Environment GraalVM CE 22.3.0 (17.0.5+8) (build 17.0.5+8-jvmci-22.3-b08)
# Java VM: OpenJDK 64-Bit Server VM GraalVM CE 22.3.0 (17.0.5+8-jvmci-22.3-b08, mixed mode, tiered, jvmci, jvmci compiler, compressed oops, compressed class ptrs, parallel gc, windows-amd64)
# No core dump will be written. Minidumps are not enabled by default on client versions of Windows
#
# An error report file with more information is saved as:
# E:\Workspace_Java\wangliang181230\study-spring-boot\study-native-image\study-native-image-with-springboot3\hs_err_pid20092.log
#
# If you would like to submit a bug report, please visit:
#   https://github.com/oracle/graal/issues
#
Error: Image build request failed with exit status 1
```
   解决方案：猜测是内存不足导致，将不用的软件或进程关关掉，尽量空出内存，再重试就可以了。 <br>