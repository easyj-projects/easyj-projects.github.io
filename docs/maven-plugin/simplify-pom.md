# easyj-maven-plugin:simplify-pom

代替 `org.codehaus.mojo:flatten-maven-plugin` 插件，简化pom。

解决了 `flatten` 与 `shade` 插件不兼容的问题。


```xml
<build>
    <plugins>
        <plugin>
            <groupId>icu.easyj.maven.plugins</groupId>
            <artifactId>easyj-maven-plugin</artifactId>
            <version>0.7.3</version>
            <executions>
                <!-- 清除扁平化后的pom文件 -->
                <execution>
                    <id>clean-simplify-pom</id>
                    <goals>
                        <goal>clean-simplify-pom</goal>
                    </goals>
                </execution>
                <!-- 扁平化，生成扁平化后的pom文件 -->
                <execution>
                    <id>simplify-pom</id>
                    <goals>
                        <goal>simplify-pom</goal>
                    </goals>
                </execution>
            </executions>
            <configuration>
              <!-- 扁平化后的pom文件名 -->
              <simplifiedPomFileName>.flattened-pom.xml</simplifiedPomFileName>
              <!-- 是否开源项目 -->
              <isOpenSourceProject>false</isOpenSourceProject>
            </configuration>
        </plugin>
    </plugins>
</build>
```