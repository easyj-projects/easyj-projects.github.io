# 🚀更新日志：easyj-maven-plugin

##### 插件文档链接：

<a href="./docs/#/maven-plugin/simplify-pom" target="_blank">simplify-pom</a>&nbsp;&nbsp;&nbsp;&nbsp;
<a href="./docs/#/maven-plugin/spring-boot-extend" target="_blank">spring-boot-extend</a>&nbsp;&nbsp;&nbsp;&nbsp;
<a href="./docs/#/maven-plugin/spring-boot-release" target="_blank">spring-boot-release</a>

---------------------------------------------------------------------------------------------------------------------------

# v1.0.x（2022-07-11 ~ 至今）

##### 复制并改造第三方类

* 复制 `org.apache.maven.model.io.xpp3.MavenXpp3Writer` 类到项目中，方便进行各种改造，部分新特性是改造该类实现的。

##### 新特性🐣

* `simplify-pom` 插件：新增 `fileComment` 属性，用于添加简化后的POM文件的注释内容。
* `simplify-pom` 插件：新增 `useTabIndent` 属性，使用 `\t` 代替两个空格作为缩进符，可减小POM文件大小。
* `simplify-pom` 插件：新增 `artifactNameTemplate` 属性，用于统一所有模块POM中 `<name>` 规则。
* `simplify-pom` 插件：新增 `removeLocalProperties` 属性，用于移除不需要保留的 `properties`。
* `spring-boot-extend` 插件：新增 `additionalIncludeGroupIds` 属性，用于项目中增量配置，`includeGroupIds` 则用于公司框架中统一配置。
* `spring-boot-extend` 插件：新增 `createLibHistory` 属性，用于生成外置lib的历史信息文件 `lib.history.md`，主要作用是为了提醒开发人员，产生的外置lib与之前的外置lib是否一致，如果不一致，在打包时，插件会打印 `WARN` 日志警告开发人员更新外置lib。
* 新增 `replace-java` 插件：可通过模板文件 `*.java.template` 生成java文件，模板文件中，可设置占位符。（遗留问题：无法直接通过IDE编译功能生成class文件，且IDE的文件索引不会添加该template文件。）
* `spring-boot-release` 插件：新增 `sourceDirectories`，用于配置更多源文件夹，可复制更多资源到release文件夹下。

##### Bug修复🐞

* `spring-boot-release` 插件：修复发布路径下的冒号被移除的问题。

##### 优化

* `easyj-maven-plugin` 插件：兼容低版本 `maven`。
* `simplify-pom` 插件：会移除部分多余的空格，且部分TAG顺序调整，使内容顺序更加合理。
* `simplify-pom` 插件：会对 `properties` 进行排序了。
* `simplify-pom` 插件：会移除 `<modules>`，因为它们仅用于当前项目的解析，对于parent引用，并没有用处。
* `simplify-pom` 插件：在开源项目中，当 `<name>` 为空且未配置 `artifactNameTemplate` 时，会默认设置 `artifactId` 到 `<name>` 中。
* `simplify-pom` 插件：在开源项目中，当 `<description>` 为空时会提示警告信息，告知开发人员需要补充信息。
* `skip-install-deploy` 插件：支持配置 `properties` 来跳过 `install` 和 `deploy`，配置更简单。
* `spring-boot-extend` 插件：外置 `lib/` 的jar文件，其最近修改时间设置为其实际生成时间（即 `/META-INF/MANIFEST.MF` 文件生成时间）。
* `spring-boot-extend` 插件：调整 `startupScript` 的默认值，添加更多的参数，添加可配置项 `startupScriptAdditionalParameter` 和 `activeProfile`，同时在windows下的脚本，增加设置窗口标题的脚本 `title ${project.artifactId}`。
* `spring-boot-release` 插件：会将 `/target/classes` 目录下的 `properties`, `yml`, `yaml` 文件也复制到release文件夹下。
* 调整部分日志内容。

#### 过期插件

* 移除 `shade-compatible-flatten` 插件。
* 移除 `undeploy-spring-boot-jar` 插件。


---------------------------------------------------------------------------------------------------------------------------

# v0.7.x（2022-06-28 ~ 2022-07-11）

##### 新特性🐣

* `spring-boot-extend` 插件：新增可将多个应用共用的依赖从 `lib` 分离到 `lib-common` 中，减小需上传的文件大小，加快项目部署效率，且方便后期更新共用依赖的版本号。
* `spring-boot-extend` 插件：新增生成 `startup.bat` 和 `startup.sh` 文件，用于快速启用应用。
* 新增 `spring-boot-release` 插件：用于辅助发布 `spring-boot` 应用。

##### Bug修复🐞

* 修复 `spring-boot-extend`：将 `<optional>true</optional>` 的依赖也放入 `lib` 目录的问题。

##### 优化


---------------------------------------------------------------------------------------------------------------------------

# v0.6.x (2022-06-07 ~ 2022-06-28)

##### 新特性🐣

* 新增 `spring-boot-extend` 插件功能，提供的功能：

> 1. `includeGroupIds` 功能扩展，用于lib外置需求。
> 2. 提供跳过 `spring-boot` 应用的 `install` 和 `deploy` 两个插件功能，因为部分公司并不需要将 `spring-boot` 的 `jatJar`。

* 新增 `package-zip` 插件功能，用于将指定的单个或多个文件打包到 `*.zip` 文件中，方便上传和部署。

##### Bug修复🐞

##### 优化


---------------------------------------------------------------------------------------------------------------------------

# v0.5.x (2022-05-27 ~ 2022-06-07)

##### Bug修复🐞

* 修复 `simplify-pom` 在部分情况下，导致项目构建失败的问题。

##### 优化

* `simplify-pom` 插件：可将 `<revision></revision>` 给删除掉，因为留着也没用。
* `simplify-pom` 插件：可将与 `<parent>` 的相同的 `<groupId>` 与 `<version>` 给删除掉，因为可以继承下来。
* `simplify-pom` 插件：可将 `<scope>compile</scope>` 和 `<optional>false</optional>` 给删除掉，因为它们是默认值。
* `simplify-pom` 插件：可将 `<reports></reports>` 给删除掉。
* `simplify-pom` 插件：分成两个配置，用于控制 `skipScopeProvided` 和 `skipOptional`。
* `simplify-pom` 插件：优化日志打印。

##### 过期（Deprecated）

* 标记 `shade-compatible-flatten` 插件为已过期，建议使用 `simplify-pom` 插件。因为 `simplify-pom` 可代替 `flatten` 插件，并且与 `shade` 不存在冲突。。

---------------------------------------------------------------------------------------------------------------------------

# v0.4.x (2022-05-22 ~ 2022-05-27)

##### 新特性🐣

* 新增 `simplify-pom` 插件功能，用于统一版本管理 `${revision}`、简化 `pom.xml` 并代替 `flatten-maven-plugin` 插件。
* 新增 `clean-simplify-pom` 插件功能，用于清理 `simplify-pom` 生成的临时 POM 文件：`.simplified-pom.xml`.


---------------------------------------------------------------------------------------------------------------------------

# v0.3.9 (2022-05-21)（该插件首个版本）

##### 新特性🐣

* 新增 `shade-compatible-flatten` 插件功能，用于解决 `shade` 插件与 `flatten` 插件的冲突问题。


---------------------------------------------------------------------------------------------------------------------------

# EasyJ开源项目诞生（2021-06-23）