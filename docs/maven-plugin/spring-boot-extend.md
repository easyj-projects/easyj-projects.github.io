# easyj-maven-plugin:spring-boot-extend

## 说明

与 `spring-boot-maven-plugin:repackage` 插件一起使用。

1. [spring-boot.issue#12794](https://github.com/spring-projects/spring-boot/issues/12794)（closed）
2. [spring-boot.pr#12813](https://github.com/spring-projects/spring-boot/pull/12813)（closed）

主要spring-boot官方竟然不给支持includeGroupIds。[捂脸哭]
无奈之下，只能自己开发一个了。


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
                    <id>spring-boot-extend</id>
                    <phase>prepare-package</phase>
                    <goals>
                        <goal>spring-boot-extend</goal>
                    </goals>
                    <configuration>
                        <!-- 以下groupId的JARs，会打包在spring-boot的fatJar中。 -->
                        <includeGroupIds>${project.groupIds}, com.aaa, com.bbb</includeGroupIds>
                        <!-- 是否打包外置lib到 /target/lib.zip 中，默认：true -->
                        <zipLib>true</zipLib>
                        <!-- 是否跳过install插件，默认：false -->
                        <skipInstall>false</skipInstall>
                        <!-- 是否跳过deploy插件，默认：false -->
                        <skipDeploy>false</skipDeploy>
                    </configuration>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```
