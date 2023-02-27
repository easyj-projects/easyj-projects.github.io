# 复杂应用踩坑记录

复杂应用除了会用到各种Java语言动态特性以外，还会遇到其他很多问题，在这里记录下来，并给出解决方案。

---------------------------------------------------------------------------------------------------------------------------

### Java语法相关问题：

1. **问题描述：** 包含 `Lambda` 语法的类代码，默认不会被本地化。<br>
   **解决方案：** 暂无，先绕过处理。<br>
   <font color="red">经测试，本人并未出现该问题。据说一些复杂情况，会存在该问题。</font><br>

2. **问题描述：** `Charset.forName(String charsetName)` 在 `native-image` 中抛异常。 <br>
   **解决方案：** 添加一项插件参数`-H:+AddAllCharsets` 即可。 <br>
   **示例配置：**
   ```xml
   <plugin>
       <groupId>org.graalvm.buildtools</groupId>
       <artifactId>native-maven-plugin</artifactId>
       <configuration>
           <buildArgs>
               -H:+AddAllCharsets
           </buildArgs>
       </configuration>
   </plugin>
   ```

3. **问题描述：** JDK代理对象的类型，调用 `getMethod` 方法会抛出 `NoSuchMethodException`，即使被代理的接口有该方法。 <br>
   **示例代码：** `proxyObj.getClass().getMethod(methodName)` 在 `native-image` 中，将抛出异常。 <br>
   **解决方案：** 暂无 <br>
   **关注issue：** https://github.com/oracle/graal/issues/6079 <br>


---------------------------------------------------------------------------------------------------------------------------

### 资源文件相关问题：（如：配置文件）

1. **问题描述：** 资源文件的路径长度如果超过 `150` 个字符，该资源文件无法被本地化。<br>
   **解决方案：** 缩短资源文件的路径长度。

---------------------------------------------------------------------------------------------------------------------------

### Spring或SpringBoot相关问题：

1. ~~**问题描述：**`@Value("${xxx.yyy.zzz:0}")` 注解无法注入配置值。~~<br>
   ~~**解决方案：**暂无~~ <br>
   ~~**关注issue：**https://github.com/spring-projects/spring-boot/issues/33637~~ <br>
   <font color="red">经测试，本人并未出现该问题，上面的issue也暂时被关闭了。</font><br>

2. **问题描述：** `@Aspect` 部分情况下，在 `native-image` 中不工作。 <br>
   **解决方案：** 暂无 <br>
   **关注issue：** https://github.com/spring-projects/spring-framework/issues/28711 <br>

3. **问题描述：** `@ConditionalOnProperty` 配置值条件装配注解不生效。 <br>
   **解决方案：** `native-image` 是在打包时，读取配置值判断是否装配，并生成机器码。所以，先修改好配置值，再开始打包，然后发布运行。不能先打包好再修改配置后运行。 <br>
   **规避方案：** 要想继续在运行时，也能根据配置切换功能，可以通过SPI的方式，根据配置的值加载对应的实现，作为`SpringBean`，但需要添加更多可达性元数据配置，这会导致打出来的native-image包会更大。<br>

4. **问题描述：** 基于 `springboot2.7.x` 打包时抛异常 `java.lang.NoClassDefFoundError: org/springframework/boot/ApplicationServletEnvironment`<br>
   **错误日志：**
   ```log
   ......省略其他日志
   Exception in thread "main" java.lang.NoClassDefFoundError: org/springframework/boot/ApplicationServletEnvironment
       at org.springframework.boot.AotApplicationContextFactory.getOrCreateEnvironment(AotApplicationContextFactory.java:80)
       at org.springframework.boot.AotApplicationContextFactory.loadEnvironment(AotApplicationContextFactory.java:61)
       at org.springframework.boot.AotApplicationContextFactory.createApplicationContext(AotApplicationContextFactory.java:52)
       at org.springframework.aot.build.ContextBootstrapContributor.contribute(ContextBootstrapContributor.java:76)
       at org.springframework.aot.build.BootstrapCodeGenerator.generate(BootstrapCodeGenerator.java:91)
       at org.springframework.aot.build.BootstrapCodeGenerator.generate(BootstrapCodeGenerator.java:71)
       at org.springframework.aot.build.GenerateBootstrapCommand.call(GenerateBootstrapCommand.java:107)
       at org.springframework.aot.build.GenerateBootstrapCommand.call(GenerateBootstrapCommand.java:42)
       at picocli.CommandLine.executeUserObject(CommandLine.java:1953)
       at picocli.CommandLine.access$1300(CommandLine.java:145)
       at picocli.CommandLine$RunLast.executeUserObjectOfLastSubcommandWithSameParent(CommandLine.java:2352)
       at picocli.CommandLine$RunLast.handle(CommandLine.java:2346)
       at picocli.CommandLine$RunLast.handle(CommandLine.java:2311)
       at picocli.CommandLine$AbstractParseResultHandler.execute(CommandLine.java:2179)
       at picocli.CommandLine.execute(CommandLine.java:2078)
       at org.springframework.aot.build.GenerateBootstrapCommand.main(GenerateBootstrapCommand.java:112)
   Caused by: java.lang.ClassNotFoundException: org.springframework.boot.ApplicationServletEnvironment
       at java.base/jdk.internal.loader.BuiltinClassLoader.loadClass(BuiltinClassLoader.java:641)
       at java.base/jdk.internal.loader.ClassLoaders$AppClassLoader.loadClass(ClassLoaders.java:188)
       at java.base/java.lang.ClassLoader.loadClass(ClassLoader.java:520)
       ... 16 more
   ......省略其他日志
   ```
   **问题原因：** `springboot:2.7.6` 及以上版本与 `spring-native:0.12.1` 不兼容导致的；<br>
   **解决方案：** 将 `springboot` 版本降低到 `2.7.5`，或升级 `spring-native` 到 `0.12.2` 或更高版本。<br>

5. **问题描述：** `RootBeanDefinition.getSource()` 在 `native-image` 或 `spring-aot模式` 下运行时，为 `null` <br>
   **解决方案：** 暂无 <br>
   **规避方案：** 如果你是想解析Bean的注解，当source为空时，可直接从类、方法或属性上获取注解。 <br>
   **关注issue：** https://github.com/spring-projects/spring-framework/issues/30017 <br>


---------------------------------------------------------------------------------------------------------------------------

### SpringCloud相关问题：

1. **问题描述：** 当项目中同时存在 `@FeignClient` 和 `@Aspect` 时，项目启动会抛异常。 <br>
   **解决方案：** 暂无 <br>
   **关注issue：** https://github.com/spring-projects/spring-boot/issues/34388 <br>
   **关注issue：** https://github.com/oracle/graal/issues/6079 <br>


---------------------------------------------------------------------------------------------------------------------------

### 打包时，出现解析异常问题：

1. **异常信息：** `Fatal error: com.oracle.graal.pointsto.util.AnalysisError$ParsingError: Error encountered while parsing reactor.netty.http.client.HttpClientConnect$$Lambda$acc7a0c687f2afec7708a4742f9f900f329034c5.get()` <br>
   **解决方案：** 暂无 <br>
   **关注issue：** https://github.com/oracle/graal/issues/5678 （已被标记为BUG） <br>


---------------------------------------------------------------------------------------------------------------------------

### Java Agent相关问题：

1. **问题描述：** 在 `native-image` 中，无法使用 `-javaagent` <br>
   **解决方案：** 非常遗憾，目前还不支持。<br>
   **关注issue：** https://github.com/oracle/graal/issues/1065 <br>

