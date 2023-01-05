# 复杂应用踩坑记录

复杂应用打包的时候，会遇到很多问题，在这里一一记录下来，并给出解决方案。

------------------------------------------------------------------

### Java语法相关问题：

1. ~~问题描述：包含 `Lambda` 语法的类代码，默认不会被本地化。~~<br>
   ~~解决方案：暂无，先绕过处理。~~<br>
   <font color="red">经过测试，本人并未出现该问题。</font><br>

2. 问题描述：`Charset.forName("BIG5")` 在 `native-image` 抛异常。 <br>
   解决方案：暂无 <br>
   关注issue：https://github.com/spring-projects/spring-framework/issues/29769

------------------

### 资源文件相关问题：（如：配置文件）
 
1. 问题描述：资源文件的路径长度如果超过 `150` 个字符，该资源文件无法被本地化。<br>
   解决方案：缩短资源文件的路径长度。

------------------

### Spring配置相关问题：

1. ~~问题描述：`@Value("${xxx.yyy.zzz:0}")` 注解无法注入配置值。~~<br>
   ~~解决方案：暂无~~ <br>
   ~~关注issue：https://github.com/spring-projects/spring-boot/issues/33637~~ <br>
   <font color="red">经过测试，本人并未出现该问题。</font><br>

------------------

### SpringBoot相关问题：

1. 问题描述：`@ConditionalOnProperty` 配置值条件装配注解不生效。 <br>
   解决方案：`native-image` 是在打包时，读取配置值判断是否装配，并生成机器码。所以，先修改好配置值，再开始打包，然后发布运行。不能先打包好再修改配置后运行。 <br>

------------------

### Spring各组件相关问题：

1. 问题描述：`@Aspect` 在 `native-image` 中不工作。 <br>
   解决方案：暂无 <br>
   关注issue：https://github.com/spring-projects/spring-framework/issues/28711 <br>

------------------

### 打包时，出现解析异常问题：

1. 异常信息：`Fatal error: com.oracle.graal.pointsto.util.AnalysisError$ParsingError: Error encountered while parsing reactor.netty.http.client.HttpClientConnect$$Lambda$acc7a0c687f2afec7708a4742f9f900f329034c5.get()` <br>
   解决方案：暂无 <br>
   关注issue：https://github.com/oracle/graal/issues/5678 （已被标记为BUG） <br>


