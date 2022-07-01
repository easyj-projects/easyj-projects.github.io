# easyj-maven-plugin:spring-boot-extend

### 说明

与 `spring-boot-maven-plugin` 插件一起使用，提供一些 `spring-boot` 应用所需的功能。

> 1. 主要 `spring-boot-maven-plugin` 官方竟然不给支持 `includeGroupIds`，无奈之下，只好自己开发该功能。
> 2. 外置 `lib` 打包成 `lib.zip` 功能，同时提供共用lib分离到 `lib-common\` 目录下的功能。

### 关联spring-boot官方issue和PR

> 1. [spring-boot.issue#12794](https://github.com/spring-projects/spring-boot/issues/12794)（Closed）：The `spring-boot-maven-plugin` not provide `includeGroupIds`.
> 2. [spring-boot.pr#12813](https://github.com/spring-projects/spring-boot/pull/12813)（Closed）：Add support for `includeGroupIds`.


### plugin配置

```xml
<build>
    <plugins>
        <plugin>
            <groupId>icu.easyj.maven.plugins</groupId>
            <artifactId>easyj-maven-plugin</artifactId>
            <version>${easyj-maven-plugin.version}</version>
            <configuration>
                <!-- 是否跳过install插件，默认：false -->
                <skipInstall>false</skipInstall>
                <!-- 是否跳过deploy插件，默认：false -->
                <skipDeploy>false</skipDeploy>
                
                <!-- 以下groupId的JARs，会打包在spring-boot的fatJar中。 -->
                <includeGroupIds>${project.groupIds}, com.aaa, com.bbb</includeGroupIds>
                <!-- 是否打包外置lib到 /target/lib.zip 中，默认：true -->
                <zipLib>true</zipLib>
                <!--  -->
                <commonDependencyPatternSet>
                    <pattern></pattern>
                </commonDependencyPatternSet>
                
                <!-- 是否创建 startup.bat 和 startup.sh 文件 -->
                <needCreateStartupFile>true</needCreateStartupFile>
                <!-- startup脚本，可用变量：{loaderPath}、{finalName}、{artifactId}，注意变量前面没有 '$'. -->
                <startupScript>java -jar {loaderPath} {finalName}.jar</startupScript>
            </configuration>
            <executions>
                <execution>
                    <id>spring-boot-extend</id>
                    <!-- 或 `<phase>package</phase>`，如果晚于 `spring-boot-maven-plugin:repackage`，则使用prepare-package -->
                    <phase>prepare-package</phase>
                    <goals>
                        <goal>spring-boot-extend</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
        <!-- 必须与spring-boot-maven-plugin一起使用，建议easyj插件配置在前面 -->
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <version>${spring-boot.version}</version>
            <configuration>
                <skip>${maven.boot.skip}</skip>
                <attach>false</attach>
                <mainClass>${start-class}</mainClass>
            </configuration>
            <executions>
                <execution>
                    <id>repackage</id>
                    <goals>
                        <goal>repackage</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```
