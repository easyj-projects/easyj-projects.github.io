# Linux环境下打包Native Image

> 声明：此文章适用于简单应用，先把环境搭建出来，再针对复杂应用进行踩坑填坑：[复杂应用踩坑记录](native-image/treading-pit-log.md)

---------------------------------------------------------------------------------------------------------------------------


## 一、环境搭建

### 1.1、安装GraalVM

访问 https://www.graalvm.org/downloads/ 下载、解压、配置环境变量：

```shell
#解压 tar.gz 文件
tar -zxvf graalvm-ce-java17-linux-amd64-22.3.0.tar.gz

#编辑环境变量
vim /etc/profile

#修改环境变量
export JAVA_HOME=/usr/java/graalvm-ce-java17-22.3.0
export CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
export PATH=$PATH:$JAVA_HOME/bin
```

### 1.2、安装Maven

访问 https://maven.apache.org/download.cgi 下载、解压、配置环境变量：

```shell
#解压 tar.gz 文件
tar -zxvf apache-maven-3.8.6-bin.tar.gz

#编辑环境变量
vim /etc/profile

#修改环境变量
export MAVEN_HOME=/usr/maven/apache-maven-3.8.6/
export PATH=$PATH:$MAVEN_HOME/bin
```

### 1.3、安装gcc

```shell
yum install gcc
```

### 1.4、使环境变量生效

```shell
#使环境变量立即生效
source /etc/profile
```

执行完命令，最好重启系统一下，保证环境变量已经生效。
```shell
#重启系统命令
reboot
```

---------------------------------------------------------------------------------------------------------------------------


## 二、创建SpringBoot应用

### 2.1、示例代码：
可以先下载本人的示例代码，进行尝试：<br>
https://gitee.com/wangliang181230/study-spring-boot.git <br>
或<br>
https://github.com/wangliang181230/study-spring-boot.git <br>


<!-- tabs:start -->

<!-- tab:**SpringBoot2** -->

### 2.2、基于 springboot2：

| 名称                      |  版本号   | 说明                                                                                      |
|:------------------------|:------:|:----------------------------------------------------------------------------------------|
| springboot              | 2.7.7  | 问题：2.7.6+，与spring-native:0.12.1不兼容<br>解决：要么降低springboot到2.7.5，要么升级spring-native到0.12.2+ |
| native-maven-plugin     | 0.9.19 |                                                                                         |
| spring-native           | 0.12.2 | 因为是实验阶段产物，所以需要添加 Spring Releases 的 Repositories（见下面的pom.xml）                            |
| spring-aot-maven-plugin | 0.12.2 | 因为是实验阶段产物，所以需要添加 Spring Releases 的 Repositories（见下面的pom.xml）                            |


#### 2.2.1、配置pom.xml

> 注意：以下配置仅适用于简单应用，复杂应用可能还需要更多的配置，这里不详细说明。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.7.7</version>
        <relativePath/>
    </parent>

    <groupId>xxx.yyy</groupId>
    <artifactId>test-native-image-springboot2</artifactId>
    <version>x.x.x-SNAPSHOT</version>

    <properties>
        <spring-native.version>0.12.2</spring-native.version>
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

**打包完成后，会在 `./target/` 目录下生成一个可执行文件：**
```
# native-image：即本地镜像，可以直接运行，不依赖于JVM，该文件只能在linux系统下运行，不支持跨平台。
./target/test-native-image-springboot2

# 传统的spring-boot的fatJar包，依赖于JVM，支持跨平台。
./target/test-native-image-springboot2.jar
```

#### 2.2.5、运行native-image

直接执行该镜像文件（可在命令中添加参数）：
```bash
./test-native-image-springboot2 --server.port=8081
或
./test-native-image-springboot2 -Dserver.port=8081
```
> 如果不指定端口号，会默认使用8080端口，因为应用未在 `application.yml` 配置端口号。

```log
args: [--server.port=8081]

2022-12-28 16:15:51.775  INFO 3500 --- [           main] o.s.nativex.NativeListener               : AOT mode enabled

  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v2.7.7)

2022-12-28 16:15:51.776  INFO 3500 --- [           main] StudyNativeImageBySpringBoot2Application : Starting StudyNativeImageBySpringBoot2Application using Java 17.0.5 on localhost.localdomain with PID 3500 (/usr/test-native/study-spring-boot/study-native-image/study-native-image-with-springboot2/target/study-native-image-with-springboot2 started by root in /usr/test-native/study-spring-boot/study-native-image/study-native-image-with-springboot2/target)
2022-12-28 16:15:51.776  INFO 3500 --- [           main] StudyNativeImageBySpringBoot2Application : No active profile set, falling back to 1 default profile: "default"
2022-12-28 16:15:51.791  INFO 3500 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port(s): 8081 (http)
2022-12-28 16:15:51.791  INFO 3500 --- [           main] o.apache.catalina.core.StandardService   : Starting service [Tomcat]
2022-12-28 16:15:51.791  INFO 3500 --- [           main] org.apache.catalina.core.StandardEngine  : Starting Servlet engine: [Apache Tomcat/9.0.68]
2022-12-28 16:15:51.795  INFO 3500 --- [           main] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring embedded WebApplicationContext
2022-12-28 16:15:51.795  INFO 3500 --- [           main] w.s.c.ServletWebServerApplicationContext : Root WebApplicationContext: initialization completed in 18 ms
2022-12-28 16:15:51.814  INFO 3500 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8081 (http) with context path ''
2022-12-28 16:15:51.815  INFO 3500 --- [           main] StudyNativeImageBySpringBoot2Application : Started StudyNativeImageBySpringBoot2Application in 0.05 seconds (JVM running for 0.068)
```
可以看到启动时间只用了 `0.05` 秒，比传统的SpringBoot应用快30~40多倍。


<!-- tab:**SpringBoot3** -->

### 2.3、基于 springboot3：

| 名称                  |  版本号   | 说明  |
|:--------------------|:------:|:----|
| springboot          | 3.0.0+ |     |
| native-maven-plugin | 0.9.19 |     |

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
# native-image：即本地镜像，可以直接运行，不依赖于JVM，该文件只能在linux系统下运行，不支持跨平台。
./target/test-native-image-springboot3

# 传统的spring-boot的fatJar包，依赖于JVM，支持跨平台。
./target/test-native-image-springboot3.jar
```

#### 2.3.5、运行native-image

直接执行该镜像文件（可在命令中添加参数）：
```bash
./test-native-image-springboot3 --server.port=8081
或
./test-native-image-springboot3 -Dserver.port=8081
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

2022-12-28T16:14:34.320-05:00  INFO 3471 --- [           main] StudyNativeImageBySpringBoot3Application : Starting AOT-processed StudyNativeImageBySpringBoot3Application using Java 17.0.5 with PID 3471 (/usr/test-native/study-spring-boot/study-native-image/study-native-image-with-springboot3/target/study-native-image-with-springboot3 started by root in /usr/test-native/study-spring-boot/study-native-image/study-native-image-with-springboot3/target)
2022-12-28T16:14:34.320-05:00  INFO 3471 --- [           main] StudyNativeImageBySpringBoot3Application : No active profile set, falling back to 1 default profile: "default"
2022-12-28T16:14:34.337-05:00  INFO 3471 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port(s): 8081 (http)
2022-12-28T16:14:34.339-05:00  INFO 3471 --- [           main] o.apache.catalina.core.StandardService   : Starting service [Tomcat]
2022-12-28T16:14:34.339-05:00  INFO 3471 --- [           main] o.apache.catalina.core.StandardEngine    : Starting Servlet engine: [Apache Tomcat/10.1.4]
2022-12-28T16:14:34.344-05:00  INFO 3471 --- [           main] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring embedded WebApplicationContext
2022-12-28T16:14:34.344-05:00  INFO 3471 --- [           main] w.s.c.ServletWebServerApplicationContext : Root WebApplicationContext: initialization completed in 24 ms
2022-12-28T16:14:34.371-05:00  INFO 3471 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8081 (http) with context path ''
2022-12-28T16:14:34.372-05:00  INFO 3471 --- [           main] StudyNativeImageBySpringBoot3Application : Started StudyNativeImageBySpringBoot3Application in 0.061 seconds (process running for 0.08)
```

可以看到启动时间只用了 `0.061` 秒，比传统的SpringBoot应用快30~40多倍。

<!-- tabs:end -->


---------------------------------------------------------------------------------------------------------------------------

## 三、踩坑记录

1. 环境问题，请查阅<a href="./#native-image/environment-treading-pit-log.md" target="environment-treading-pit-log">打包环境踩坑记录</a>页面
2. 复杂应用，请查阅<a href="./#native-image/treading-pit-log.md" target="treading-pit-log">复杂应用踩坑记录</a>页面

