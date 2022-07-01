# easyj-maven-plugin

## 功能

`easyj-maven-plugin`插件，提供了以下几个goal:

1. [simplify-pom](/docs/#/maven-plugin/simplify-pom)
2. [spring-boot-extend](/docs/#/maven-plugin/spring-boot-extend)


## plugin配置

```xml
<build>
    <plugins>
        <plugin>
            <groupId>icu.easyj.maven.plugins</groupId>
            <artifactId>easyj-maven-plugin</artifactId>
            <version>0.7.3</version>
            <executions>
                <execution>
                    <id>clean-simplify-pom</id>
                    <goals>
                        <goal>clean-simplify-pom</goal><!-- 清除扁平化后的pom文件 -->
                    </goals>
                </execution>
                <execution>
                    <id>simplify-pom</id>
                    <goals>
                        <goal>simplify-pom</goal><!-- 扁平化，生成扁平化后的pom文件 -->
                    </goals>
                    <configuration>
                        
                    </configuration>
                </execution>
                <execution>
                    <id>spring-boot-extend</id>
                    <phase>prepare-package</phase>
                    <goals>
                        <goal>spring-boot-extend</goal>
                    </goals>
                </execution>
            </executions>
            <configuration>
                <!-- 以下groupId的JARs，会打包在spring-boot的fatJar中。 -->
                <includeGroupIds>${project.groupIds}, com.aaa, com.bbb</includeGroupIds>
                <!-- 是否打包外置lib到 /target/lib.zip 中（默认值：true） -->
                <zipLib>true</zipLib>
            </configuration>
        </plugin>
    </plugins>
</build>
```
