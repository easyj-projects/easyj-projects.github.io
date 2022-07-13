# easyj-maven-plugin : spring-boot-release


### 说明：

必须与 `spring-boot-maven-plugin` 插件一起使用，提供一些发布 `spring-boot` 应用所需的功能。


### 起始版本：

v0.7.4版本新增的插件。


### plugin配置：

```xml
<properties>
    <maven.spring-boot-release.dir>D:\\release\\{finalName}</maven.spring-boot-release.dir>
</properties>

<build>
    <plugins>
        <plugin>
            <groupId>icu.easyj.maven.plugins</groupId>
            <artifactId>easyj-maven-plugin</artifactId>
            <version>${easyj-maven-plugin.version}</version>
            <executions>
                <execution>
                    <id>spring-boot-release</id>
                    <phase>install</phase>
                    <goals>
                        <goal>spring-boot-release</goal>
                    </goals>
                    <configuration>
                        <!-- 发布文件夹，支持 {groupId}、{artifactId}、{version}、{finalName} 占位符配置 -->
                        <releaseDirectory>${maven.spring-boot-release.dir}</releaseDirectory>
                        <!-- 匹配 /target 一级目录下的文件，并将匹配到的文件复制到发布文件夹下。 -->
                        <filePatterns>
                            <pattern>{finalName}.jar</pattern>
                            <pattern>lib-*.zip</pattern>
                            <pattern>startup.*</pattern>
                        </filePatterns>
                    </configuration>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```
