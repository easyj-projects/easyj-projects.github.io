# easyj-maven-plugin : simplify-pom


### 功能：

1. 统一版本号管理：${revision}
2. 代替 `org.codehaus.mojo:flatten-maven-plugin` 插件，简化pom，同时解决了 `flatten` 与 `shade` 插件不兼容的问题。


### 起始版本：

`v0.4.0` 版本新增的插件，推荐使用最新版本的该插件，功能比较齐全，BUG较少。


### 最新版本：

<a href="https://repo1.maven.org/maven2/icu/easyj/maven/plugins/easyj-maven-plugin" target="_blank">
  <img src="https://img.shields.io/maven-central/v/icu.easyj.maven.plugins/easyj-maven-plugin.svg" alt="easyj-maven-plugin.version">
</a>


### plugin配置：

```xml
<build>
    <plugins>
        <plugin>
            <groupId>icu.easyj.maven.plugins</groupId>
            <artifactId>easyj-maven-plugin</artifactId>
            <version>${easyj-maven-plugin.version}</version>
            <configuration>
                <!-- 是否跳过该插件（默认：false） -->
                <skip>false</skip>
                <!-- 扁平化模式，根据需求选择值：NONE | BOM | SHADE | DEPENDENCIES | JAR | POM（默认：AUTO；property: maven.simplify.mode） -->
                <simplifyMode>AUTO</simplifyMode>
                <!-- <dependencyManagement> 中是否展开import的依赖（默认：false） -->
                <expandImportDependencyManagement>false</expandImportDependencyManagement>
                <!-- 是否更新pom文件（默认：false） -->
                <updatePomFile>true</updatePomFile>
                <!-- 扁平化后的pom文件名（默认：.simplified-pom.xml） -->
                <simplifiedPomFileName>.flattened-pom.xml</simplifiedPomFileName>
                <!-- 是否移除parent，顺便将parent的部分信息复制到当前POM中（默认：null，表示根据不同的simplifier做不同的处理） -->
                <removeParent>null</removeParent><!-- Boolean类型 -->
                <!-- <name>内容模板，用于生成所有子模块的<name>，例：'${project.groupId}::${project.artifactId}' -->
                <artifactNameTemplate></artifactNameTemplate>
                <!-- 是否开源项目，开源项目下，部分信息标签必须（默认：true） -->
                <isOpenSourceProject>false</isOpenSourceProject>
                <!-- POM注释内容（v1.0.1新特性） -->
                <fileComment>POM注释内容</fileComment>
                <!-- 是否使用制表符`\t`代替两个空格进行缩进（v1.0.1新特性）（默认：false） -->
                <useTabIndent>true</useTabIndent>
                <!-- 引用依赖中，是否保留scope=provided的依赖（默认：false） -->
                <keepProvidedDependencies>false</keepProvidedDependencies>
                <!-- 引用依赖中，是否保留optional=true的依赖（默认：false） -->
                <keepOptionalDependencies>false</keepOptionalDependencies>
                <!-- 引用依赖中，是否保留scope=test的依赖（默认：false） -->
                <keepTestDependencies>false</keepTestDependencies>
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
                <!-- 移除不再需要的properties -->
                <removeLocalProperties>propertyKey1, propertyKey2</removeLocalProperties>
            </configuration>
            <executions>
                <!-- 扁平化，生成扁平化后的pom文件 -->
                <execution>
                    <id>simplify-pom</id>
                    <phase>process-resources</phase>
                    <goals>
                        <goal>simplify-pom</goal>
                    </goals>
                </execution>
                <!-- 清除扁平化后的pom文件 -->
                <execution>
                    <id>clean-simplify-pom</id>
                    <phase>clean</phase>
                    <goals>
                        <goal>clean-simplify-pom</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```
