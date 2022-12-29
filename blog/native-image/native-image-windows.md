# Windows环境下打包Native Image

> 声明：此文章适用于简单应用，主要是先把环境搭建出来，然后针对复杂应用进行踩坑填坑：[复杂应用踩坑记录](native-image/treading-pit-log.md)。

---------------------------


## 一、环境搭建

### 1.1、安装GraalVM

访问 https://www.graalvm.org/downloads/ 下载、解压、配置环境变量：
```properties
JAVA_HOME=C:\Program Files\Java\graalvm-ce-java17-22.3.0
PATH=%JAVA_HOME%\bin;
```

### 1.2、安装Maven

访问 https://maven.apache.org/download.cgi 下载、解压、配置环境变量：

```properties
MAVEN_HOME=C:\Program Files\apache\maven\apache-maven-3.8.6
PATH=%MAVEN_HOME%\bin;
```

### 1.3、安装Visual Studio

访问 https://visualstudio.microsoft.com/zh-hans/downloads/ 下载。<br/>
本人下载的是 Enterprise 版本：`Visual Studio Enterprise 2022 - 17.4.3` <br/>
在安装前勾选 `.NET 桌面开发` 或 `使用 C++ 的桌面开发`，在安装详情信息里勾选 `MSVC v143 - VS 2022 C++ x64/x86 生成工具` 和 `Windows 11 SDK`，再开始安装。<br/>
环境变量配置：

```properties
# 这三项直接复制
LIB=%KIT_PATH%\Lib\%KIT_VERSION%\um\x64;%KIT_PATH%\Lib\%KIT_VERSION%\ucrt\x64;%VS_MSVC_PATH%\lib\x64
INCLUDE=%KIT_PATH%\Include\%KIT_VERSION%\ucrt;%KIT_PATH%\Include\%KIT_VERSION%\um;%KIT_PATH%\Include\%KIT_VERSION%\shared;%VS_MSVC_PATH%\include
PATH=%VS_MSVC_PATH%\bin\HostX64\x64;

# 这三项为上面配置中的3个变量，根据实际情况进行配置
KIT_PATH=C:\Program Files (x86)\Windows Kits\10
KIT_VERSION=10.0.22000.0
VS_MSVC_PATH=C:\Program Files\Microsoft Visual Studio\2022\Enterprise\VC\Tools\MSVC\14.34.31933
```

---------------------------


## 二、创建SpringBoot应用

### 2.1、示例代码：
可以先下载本人的示例代码，进行尝试：<br>
https://gitee.com/wangliang181230/study-spring-boot.git <br>
或<br>
https://github.com/wangliang181230/study-spring-boot.git <br>


<!-- tabs:start -->

<!-- tab:**SpringBoot2** -->

### 2.2、基于 springboot2：

| 名称                      |  版本号   | 说明                                                                                                                        |
|:------------------------|:------:|:--------------------------------------------------------------------------------------------------------------------------|
| springboot              | 2.7.5  | 2.7.6及以上版本，与spring-native:0.12.1不兼容。<br>关注issue：https://github.com/spring-projects-experimental/spring-native/issues/1740 |
| native-maven-plugin     | 0.9.19 |                                                                                                                           |
| spring-native           | 0.12.1 | 需要添加 Spring Releases 的 Repositories                                                                                       |
| spring-aot-maven-plugin | 0.12.1 | 需要添加 Spring Releases 的 Repositories                                                                                       |


#### 2.2.1、配置pom.xml

> 注意：以下配置仅适用于简单应用，复杂应用可能还需要更多的配置，这里不详细说明。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.7.5</version>
        <relativePath/>
    </parent>

    <groupId>xxx.yyy</groupId>
    <artifactId>test-native-image-springboot2</artifactId>
    <version>x.x.x-SNAPSHOT</version>

    <properties>
        <spring-native.version>0.12.1</spring-native.version>
        <native-build-tools-plugin.version>0.9.19</native-build-tools-plugin.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.experimental</groupId>
            <artifactId>spring-native</artifactId>
            <version>${spring-native.version}</version>
        </dependency>
    </dependencies>

    <build>
        <finalName>${project.artifactId}</finalName>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

    <profiles>
        <!--
            由于 org.springframework.boot:spring-boot-starter-parent:2.x.x.pom 中，
            没有id=native的profile，所以需要手动配置所需插件的所有信息。
            springboot3.0.x的pom中，添加过id=native的profile，所以不需要手动配置那么多的信息。
        -->
        <profile>
            <id>native</id>
            <build>
                <pluginManagement>
                    <plugins>
                        <plugin>
                            <groupId>org.springframework.boot</groupId>
                            <artifactId>spring-boot-maven-plugin</artifactId>
                            <configuration>
                                <image>
                                    <builder>paketobuildpacks/builder:tiny</builder>
                                    <env>
                                        <BP_NATIVE_IMAGE>true</BP_NATIVE_IMAGE>
                                    </env>
                                </image>
                            </configuration>
                        </plugin>
                        <plugin>
                            <groupId>org.graalvm.buildtools</groupId>
                            <artifactId>native-maven-plugin</artifactId>
                            <version>${native-build-tools-plugin.version}</version>
                            <configuration>
                                <classesDirectory>${project.build.outputDirectory}</classesDirectory>
                                <metadataRepository>
                                    <enabled>true</enabled>
                                </metadataRepository>
                                <requiredVersion>22.3</requiredVersion>
                            </configuration>
                            <executions>
                                <execution>
                                    <id>add-reachability-metadata</id>
                                    <goals>
                                        <goal>add-reachability-metadata</goal>
                                    </goals>
                                </execution>
                            </executions>
                        </plugin>
                    </plugins>
                </pluginManagement>
                <plugins>
                    <plugin>
                        <groupId>org.springframework.experimental</groupId>
                        <artifactId>spring-aot-maven-plugin</artifactId>
                        <version>${spring-native.version}</version>
                        <executions>
                            <execution>
                                <id>generate</id>
                                <goals>
                                    <goal>generate</goal>
                                </goals>
                            </execution>
                        </executions>
                    </plugin>
                    <plugin>
                        <groupId>org.graalvm.buildtools</groupId>
                        <artifactId>native-maven-plugin</artifactId>
                        <version>${native-build-tools-plugin.version}</version>
                        <executions>
                            <execution>
                                <id>build-native</id>
                                <goals>
                                    <goal>compile-no-fork</goal>
                                    <!--<goal>build</goal>--><!-- 该插件低版本时使用的是这个goal，高版本时已过时，改为使用compile-no-fork -->
                                </goals>
                                <phase>package</phase>
                            </execution>
                        </executions>
                    </plugin>
                </plugins>
            </build>
        </profile>
    </profiles>

    <!-- spring-native 还处于实验阶段，未发布到中央仓库，需要添加Spring Release仓库的repository -->
    <repositories>
        <repository>
            <id>spring-release</id>
            <name>Spring release</name>
            <url>https://repo.spring.io/release</url>
        </repository>
    </repositories>
    <pluginRepositories>
        <pluginRepository>
            <id>spring-release</id>
            <name>Spring release</name>
            <url>https://repo.spring.io/release</url>
        </pluginRepository>
    </pluginRepositories>
</project>
```

#### 2.2.2、添加 Application 启动类

```java
import java.util.Arrays;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TestNativeImageSpringBoot2Application {

    public static String[] ARGS;

    public static void main(String[] args) {
        ARGS = args;
        System.out.println("\r\n\r\n\r\nargs: " + Arrays.toString(args) + "\r\n");
        SpringApplication.run(TestNativeImageSpringBoot2Application.class, args);
    }
}
```

#### 2.2.3、添加测试用的 Controller

```java
import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/")
    public Object test() {
        Map<String, Object> map = new HashMap<>();
        map.put("args", TestNativeImageSpringBoot2Application.ARGS);
        map.put("env", System.getenv());
        map.put("properties", System.getProperties());
        return map;
    }
}
```

#### 2.2.4、开始打包

**执行打包命令:**
> 这个过程会消耗几分钟时间，不同性能的PC耗时也不同：
```bash
mvn clean package -Pnative -e
```

**打包完成后，会在 `./target` 目录下生成一个可执行文件：**
```
# native-image：即本地镜像，可以直接双击运行，不依赖于JVM，该文件只能在windows系统下运行，不支持跨平台。
./target/test-native-image-springboot3.exe

# 传统的spring-boot的fatJar包，依赖于JVM，支持跨平台。
./target/test-native-image-springboot3.jar
```

#### 2.2.5、运行native-image

直接双击exe文件运行，或者在命令行中执行（可在命令中添加参数）：
```bash
start test-native-image-springboot2.exe --server.port=8081
或
start test-native-image-springboot2.exe -Dserver.port=8081
```
> 如果不指定端口号，会默认使用8080端口，因为应用未在 `application.yml` 配置端口号。

```log
args: [--server.port=8081]

2022-12-28 20:03:16.819  INFO 19280 --- [           main] o.s.nativex.NativeListener               : AOT mode enabled

  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v2.7.5)

2022-12-28 20:03:16.821  INFO 19280 --- [           main] StudyNativeImageBySpringBoot2Application : Starting StudyNativeImageBySpringBoot2Application using Java 17.0.5 on LAPTOP-WangLiang with PID 19280 (E:\Workspace_Java\wangliang181230\study-spring-boot\study-native-image\study-native-image-with-springboot2\target\study-native-image-with-springboot2.exe started by new in E:\Workspace_Java\wangliang181230\study-spring-boot\study-native-image\study-native-image-with-springboot2\target)
2022-12-28 20:03:16.821  INFO 19280 --- [           main] StudyNativeImageBySpringBoot2Application : No active profile set, falling back to 1 default profile: "default"
2022-12-28 20:03:16.892  INFO 19280 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port(s): 8081 (http)
2022-12-28 20:03:16.892  INFO 19280 --- [           main] o.apache.catalina.core.StandardService   : Starting service [Tomcat]
2022-12-28 20:03:16.892  INFO 19280 --- [           main] org.apache.catalina.core.StandardEngine  : Starting Servlet engine: [Apache Tomcat/9.0.68]
2022-12-28 20:03:16.902  INFO 19280 --- [           main] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring embedded WebApplicationContext
2022-12-28 20:03:16.902  INFO 19280 --- [           main] w.s.c.ServletWebServerApplicationContext : Root WebApplicationContext: initialization completed in 81 ms
2022-12-28 20:03:16.936  INFO 19280 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8081 (http) with context path ''
2022-12-28 20:03:16.936  INFO 19280 --- [           main] StudyNativeImageBySpringBoot2Application : Started StudyNativeImageBySpringBoot2Application in 0.135 seconds (JVM running for 0.136)
```
可以看到启动时间只用了 `0.135` 秒，比传统的SpringBoot应用快10多倍。


<!-- tab:**SpringBoot3** -->

### 2.3、基于 springboot3：

| 名称                  |     版本号     | 说明  |
|:--------------------|:-----------:|:----|
| springboot          | 3.0.1或3.0.0 |     |
| native-maven-plugin |   0.9.19    |     |

#### 2.3.1、配置pom.xml

> 注意：以下配置仅适用于简单应用，复杂应用可能还需要更多的配置，这里不详细说明。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.0.1</version>
        <relativePath/>
    </parent>

    <groupId>xxx.yyy</groupId>
    <artifactId>test-native-image-springboot3</artifactId>
    <version>x.x.x-SNAPSHOT</version>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
    </dependencies>

    <build>
        <finalName>${project.artifactId}</finalName>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

    <profiles>
        <!--
            org.springframework.boot:spring-boot-starter-parent:3.0.x.pom 中，
            已经添加了一个id=native的profile，包含了很多插件配置，所以自建项目中，需要配置的内容会比较少。
            在springboot2项目中，需要手动配置的内容会更多一些。
        -->
        <profile>
            <id>native</id><!-- 此ID和parent中的profile的ID保持一致，执行打包时，maven命令会更加简短一些。 -->
            <build>
                <plugins>
                    <plugin>
                        <groupId>org.graalvm.buildtools</groupId>
                        <artifactId>native-maven-plugin</artifactId><!-- springboot3.0.1时，此插件为0.9.19版本 -->
                        <extensions>true</extensions>
                        <executions>
                            <execution>
                                <id>build-native</id>
                                <phase>package</phase>
                                <goals>
                                    <goal>compile-no-fork</goal>
                                    <!--<goal>build</goal>--><!-- 该插件低版本时使用的是这个goal，高版本时已过时，改为使用compile-no-fork -->
                                </goals>
                            </execution>
                        </executions>
                    </plugin>
                </plugins>
            </build>
        </profile>
    </profiles>
</project>
```

#### 2.3.2、添加 Application 启动类

```java
import java.util.Arrays;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TestNativeImageSpringBoot3Application {

    public static String[] ARGS;

    public static void main(String[] args) {
        ARGS = args;
        System.out.println("\r\n\r\n\r\nargs: " + Arrays.toString(args) + "\r\n");
        SpringApplication.run(TestNativeImageSpringBoot3Application.class, args);
    }
}
```

#### 2.3.3、添加测试用的 Controller

```java
import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/")
    public Object test() {
        Map<String, Object> map = new HashMap<>();
        map.put("args", TestNativeImageSpringBoot3Application.ARGS);
        map.put("env", System.getenv());
        map.put("properties", System.getProperties());
        return map;
    }
}
```

#### 2.3.4、开始打包

**执行打包命令:**
> 这个过程会消耗几分钟时间，不同性能的PC耗时也不同：
```bash
mvn clean package -Pnative -e
```

**打包完成后，会在 `./target/` 目录下生成一个可执行文件：**
```
# native-image：即本地镜像，可以直接双击运行，不依赖于JVM，该文件只能在windows系统下运行，不支持跨平台。
./target/test-native-image-springboot3.exe

# 传统的spring-boot的fatJar包，依赖于JVM，支持跨平台。
./target/test-native-image-springboot3.jar
```

#### 2.3.5、运行native-image

直接双击exe文件运行，或者在命令行中执行（可在命令中添加参数）：
```bash
start test-native-image-springboot3.exe --server.port=8081
或
start test-native-image-springboot3.exe -Dserver.port=8081
```
> 如果不指定端口号，会默认使用8080端口，因为应用未在 `application.yml` 配置端口号。

```log
args: [--server.port=8081]

  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.0.1)

2022-12-28T18:53:00.824+08:00  INFO 18420 --- [           main] co.TestNativeImageSpringBoot3Application : Starting AOT-processed StudyNativeImageBySpringBoot3Application using Java 17.0.5 with PID 18420 (E:\Workspace_Java\wangliang181230\study-spring-boot\study-native-image\study-native-image-with-springboot3\target\study-native-image-with-springboot3.exe started by new in E:\Workspace_Java\wangliang181230\study-spring-boot\study-native-image\study-native-image-with-springboot3\target)
2022-12-28T18:53:00.824+08:00  INFO 18420 --- [           main] co.TestNativeImageSpringBoot3Application : No active profile set, falling back to 1 default profile: "default"
2022-12-28T18:53:00.896+08:00  INFO 18420 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port(s): 8081 (http)
2022-12-28T18:53:00.911+08:00  INFO 18420 --- [           main] o.apache.catalina.core.StandardService   : Starting service [Tomcat]
2022-12-28T18:53:00.911+08:00  INFO 18420 --- [           main] o.apache.catalina.core.StandardEngine    : Starting Servlet engine: [Apache Tomcat/10.1.4]
2022-12-28T18:53:00.920+08:00  INFO 18420 --- [           main] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring embedded WebApplicationContext
2022-12-28T18:53:00.920+08:00  INFO 18420 --- [           main] w.s.c.ServletWebServerApplicationContext : Root WebApplicationContext: initialization completed in 96 ms
2022-12-28T18:53:00.941+08:00  INFO 18420 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8081 (http) with context path ''
2022-12-28T18:53:00.942+08:00  INFO 18420 --- [           main] StudyNativeImageBySpringBoot3Application : Started StudyNativeImageBySpringBoot3Application in 0.127 seconds (process running for 0.131)
```

可以看到启动时间只用了 `0.127` 秒，比传统的SpringBoot应用快10多倍。

<!-- tabs:end -->


---------------------------


## 三、打包失败问题处理（踩过的坑）

### 3.1、问题1：`native-maven-plugin` 打包插件自动执行 `gu install native-image` 时报错：
#### 3.1.1、错误日志：
```log
......省略其他日志
C:\Users\administrator> gu install native-image
......省略其他日志
Downloading: Component catalog from www.graalvm.org
Processing Component: Native Image
Downloading: Component native-image: Native Image from github.com
I/O error occurred: PKIX path building failed: sun.security.provider.certpath.SunCertPathBuilderException: unable to find valid certification path to requested target
......省略其他日志
```

#### 3.1.2、解决方案：
执行 <a href="#/native-image/native-image-windows?id=_41、附件1：installcertjava">第四章节附件1</a> 的java程序，生成证书文件：
```shell
#javac 生成InstallCert.class
javac InstallCert.java

#java 执行InstallCert.class，生成证书文件
java InstallCert www.graalvm.org
```
然后将生成的 `jssecacerts` 证书文件复制到 `%JAVA_HOME%/lib/security` 目录下即可。



### 3.2、问题2：打包时抛异常 `java.lang.NoClassDefFoundError: org/springframework/boot/ApplicationServletEnvironment`
#### 3.2.1、错误日志：
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

#### 3.2.2、解决方案：
这个就是上面提到的 `springboot2.7.6` 及以上版本与 `spring-native:0.12.1` 不兼容导致的，将 `springboot` 版本降低到 `2.7.5` 即可。



---------------------------


## 四、附件

### 4.1、附件1：`InstallCert.java`
解决 <a href="#/native-image/native-image-windows?id=_31、问题1：native-maven-plugin-打包插件自动执行-gu-install-native-image-时报错：">问题1</a> 时使用。
```java
import java.io.*;
import java.security.*;
import java.security.cert.*;
import javax.net.ssl.*;

public class InstallCert {

    public static void main(String[] args) throws Exception {
        String host;
        int port;
        char[] passphrase;
        if ((args.length == 1) || (args.length == 2)) {
            String[] c = args[0].split(":");
            host = c[0];
            port = (c.length == 1) ? 443 : Integer.parseInt(c[1]);
            String p = (args.length == 1) ? "changeit" : args[1];
            passphrase = p.toCharArray();
        } else {
            System.out.println("Usage: java InstallCert <host>[:port] [passphrase]");
            return;
        }

        File file = new File("jssecacerts");
        if (file.isFile() == false) {
            char SEP = File.separatorChar;
            File dir = new File(System.getProperty("java.home") + SEP
                    + "lib" + SEP + "security");
            file = new File(dir, "jssecacerts");
            if (file.isFile() == false) {
                file = new File(dir, "cacerts");
            }
        }
        System.out.println("Loading KeyStore " + file + "...");
        InputStream in = new FileInputStream(file);
        KeyStore ks = KeyStore.getInstance(KeyStore.getDefaultType());
        ks.load(in, passphrase);
        in.close();

        SSLContext context = SSLContext.getInstance("TLS");
        TrustManagerFactory tmf =
                TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
        tmf.init(ks);
        X509TrustManager defaultTrustManager = (X509TrustManager)tmf.getTrustManagers()[0];
        SavingTrustManager tm = new SavingTrustManager(defaultTrustManager);
        context.init(null, new TrustManager[]{tm}, null);
        SSLSocketFactory factory = context.getSocketFactory();

        System.out.println("Opening connection to " + host + ":" + port + "...");
        SSLSocket socket = (SSLSocket)factory.createSocket(host, port);
        socket.setSoTimeout(10000);
        try {
            System.out.println("Starting SSL handshake...");
            socket.startHandshake();
            socket.close();
            System.out.println();
            System.out.println("No errors, certificate is already trusted");
        } catch (SSLException e) {
            System.out.println();
            e.printStackTrace(System.out);
        }

        X509Certificate[] chain = tm.chain;
        if (chain == null) {
            System.out.println("Could not obtain server certificate chain");
            return;
        }

        BufferedReader reader =
                new BufferedReader(new InputStreamReader(System.in));

        System.out.println();
        System.out.println("Server sent " + chain.length + " certificate(s):");
        System.out.println();
        MessageDigest sha1 = MessageDigest.getInstance("SHA1");
        MessageDigest md5 = MessageDigest.getInstance("MD5");
        for (int i = 0; i < chain.length; i++) {
            X509Certificate cert = chain[i];
            System.out.println
                    (" " + (i + 1) + " Subject " + cert.getSubjectDN());
            System.out.println("   Issuer  " + cert.getIssuerDN());
            sha1.update(cert.getEncoded());
            System.out.println("   sha1    " + toHexString(sha1.digest()));
            md5.update(cert.getEncoded());
            System.out.println("   md5     " + toHexString(md5.digest()));
            System.out.println();
        }

        System.out.println("Enter certificate to add to trusted keystore or 'q' to quit: [1]");
        String line = reader.readLine().trim();
        int k;
        try {
            k = (line.length() == 0) ? 0 : Integer.parseInt(line) - 1;
        } catch (NumberFormatException e) {
            System.out.println("KeyStore not changed");
            return;
        }

        X509Certificate cert = chain[k];
        String alias = host + "-" + (k + 1);
        ks.setCertificateEntry(alias, cert);

        OutputStream out = new FileOutputStream("jssecacerts");
        ks.store(out, passphrase);
        out.close();

        System.out.println();
        System.out.println(cert);
        System.out.println();
        System.out.println
                ("Added certificate to keystore 'jssecacerts' using alias '"
                        + alias + "'");
    }

    private static final char[] HEXDIGITS = "0123456789abcdef".toCharArray();

    private static String toHexString(byte[] bytes) {
        StringBuilder sb = new StringBuilder(bytes.length * 3);
        for (int b : bytes) {
            b &= 0xff;
            sb.append(HEXDIGITS[b >> 4]);
            sb.append(HEXDIGITS[b & 15]);
            sb.append(' ');
        }
        return sb.toString();
    }

    private static class SavingTrustManager implements X509TrustManager {

        private final X509TrustManager tm;
        private X509Certificate[] chain;

        SavingTrustManager(X509TrustManager tm) {
            this.tm = tm;
        }

        public X509Certificate[] getAcceptedIssuers() {
            throw new UnsupportedOperationException();
        }

        public void checkClientTrusted(X509Certificate[] chain, String authType)
                throws CertificateException {
            throw new UnsupportedOperationException();
        }

        public void checkServerTrusted(X509Certificate[] chain, String authType)
                throws CertificateException {
            this.chain = chain;
            tm.checkServerTrusted(chain, authType);
        }
    }

}
```