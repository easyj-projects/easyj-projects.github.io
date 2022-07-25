# 快速开始

### 导入BOM（依赖清单）

#### spring-boot项目

```xml
<dependencyManagement>
	<dependencies>
		<groupId>icu.easyj.boot</groupId>
		<artifactId>easyj-spring-boot-bom</artifactId>
		<version>${easyj.version}</version>
		<type>pom</type>
		<scope>import</scope>
	</dependencies>
</dependencyManagement>
```

#### 非spring-boot项目

```xml
<dependencyManagement>
	<dependencies>
		<groupId>icu.easyj</groupId>
		<artifactId>easyj-bom</artifactId>
		<version>${easyj.version}</version>
		<type>pom</type>
		<scope>import</scope>
	</dependencies>
</dependencyManagement>
```


### 引用依赖

导入 `BOM` 后，引用依赖时就不需要 `<version>` 了。

#### spring-boot项目

```xml
<!-- 按需引用依赖 -->
<dependencies>
	<!-- @Cache304 启动包 -->
	<dependency>
		<groupId>icu.easyj.boot</groupId>
		<artifactId>easyj-spring-boot-starter-web</artifactId>
	</dependency>
	<!-- @ExcelExport 启动包 -->
	<dependency>
		<groupId>icu.easyj.boot</groupId>
		<artifactId>easyj-spring-boot-starter-poi-excel</artifactId>
	</dependency>
	<dependency>
		<groupId>icu.easyj.boot</groupId>
		<artifactId>easyj-spring-boot-starter-poi-excel-afterturn</artifactId>
	</dependency>
	<!-- 分布式日志 启动包 -->
	<dependency>
		<groupId>icu.easyj.boot</groupId>
		<artifactId>easyj-spring-boot-starter-logging</artifactId>
	</dependency>
	<!-- 测试 启动包 -->
	<dependency>
		<groupId>icu.easyj.boot</groupId>
		<artifactId>easyj-spring-boot-test</artifactId>
		<scope>test</scope>
	</dependency>

	<!--
		其他需要的依赖
	-->
</dependencies>
```

#### 非spring-boot项目

```xml
<dependencies>
	<dependency>
		<groupId>icu.easyj</groupId>
		<artifactId>easyj-all</artifactId>
	</dependency>
</dependencies>
```
