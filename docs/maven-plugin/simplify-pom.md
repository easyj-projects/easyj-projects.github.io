# easyj-maven-plugin:simplify-pom

### 功能

1. 统一版本号管理：${revision}
2. 代替 `org.codehaus.mojo:flatten-maven-plugin` 插件，简化pom，同时解决了 `flatten` 与 `shade` 插件不兼容的问题。


```xml
<build>
    <plugins>
        <plugin>
            <groupId>icu.easyj.maven.plugins</groupId>
            <artifactId>easyj-maven-plugin</artifactId>
            <version>${easyj-maven-plugin.version}</version>
            <configuration>
                <!-- 扁平化模式，可选值：BOM，映射properties：<maven.simplify.mode>BOM</maven.simplify.mode>} -->
                <simplifyMode>AUTO</simplifyMode>
                <!-- 扁平化后的pom文件名 -->
                <simplifiedPomFileName>.flattened-pom.xml</simplifiedPomFileName>
                <!-- 是否开源项目，开源项目下，部分信息标签必须 -->
                <isOpenSourceProject>false</isOpenSourceProject>
                <!-- 引用依赖中，是否保留scope=provided的依赖 -->
                <keepProvidedDependencies>false</keepProvidedDependencies>
                <!-- 引用依赖中，是否保留scope=test的依赖 -->
                <keepTestDependencies>false</keepTestDependencies>
                <!-- 引用依赖中，是否保留optional=true的依赖 -->
                <keepOptionalDependencies>false</keepOptionalDependencies>
                <!-- 需移除的依赖，支持配置完整groupId:artifactId、通配符、正则表达式。 -->
                <excludeDependencies>
                    <exclude>icu.easyj:easyj-all</exclude>
                    <exclude>icu.easyj:*</exclude>
                    <exclude>^icu\.easyj\:easyj\-.*$</exclude>
                </excludeDependencies>
                <!-- 在生成的pom中，插入properties，用于子模块。（当该property在当前模块的pom.xml中直接配置时，会影响当前模块的mvn运行时才使用此配置。） -->
                <createProperties>
                    <propertyKey1>propertyValue1</propertyKey1>
                    <propertyKey2>propertyValue2</propertyKey2>
                </createProperties>
            </configuration>
            <executions>
                <!-- 清除扁平化后的pom文件 -->
                <execution>
                    <id>clean-simplify-pom</id>
                    <phase>clean</phase>
                    <goals>
                        <goal>clean-simplify-pom</goal>
                    </goals>
                </execution>
                <!-- 扁平化，生成扁平化后的pom文件 -->
                <execution>
                    <id>simplify-pom</id>
                    <phase>process-resources</phase>
                    <goals>
                        <goal>simplify-pom</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```
