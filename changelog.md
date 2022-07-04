# 🚀更新日志


# v0.2.x（2021-10-22 ~ 至今）


---------------------------------------------------------------------------------------------------------------------------

## v0.2.7 (2022-02-10)

##### 新特性🐣

* 【spring-boot】 新增 时间函数式配置，获取当前时间并可配置格式化：`${easyj.time.now('yyyy-MM-dd HH:mm:ss.SSS')}`。
* 【core】 `EnhancedServiceLoad`，新增服务的工厂接口，可在注解 `@LoadLevel(factory = Xxxx.class)` 上自定义服务的实例化逻辑。

##### 依赖升级

* `spring-boot`：v2.6.2 -> v2.6.3

---------------------------------------------------------------------------------------------------------------------------

## v0.2.6 (2022-01-13)

##### 新特性🐣

* 【core】 新增 `StringUtils.indexOf(String str, char targetChar, int n)` 方法，用于获取第N个目标字符在字符串中的索引值。

##### Bug修复🐞

* 【logging】 `logback-spring.xml` 中的 `scan` 改为 `false`，避免 `logback` 漏洞利用。

##### 优化

* 【core】 优化 `JarUtils` 工具类，能够读取到更多JAR的 `groupId` 了。
* 【config】 `GlobalConfig` 拆分为 `EnvironmentConfigs` 和 `AppConfigs`。
* 【springboot】 `easyj.global` 拆分为 `easyj.app` 、 `easyj.env`、 `easyj.crypto` 。

##### 构建

* easyj会自动上传JAR到OSS了。
* 将所有依赖的版本在 `easyj-dependency` 中统一管理。

---------------------------------------------------------------------------------------------------------------------------

## v0.2.5 (2021-12-16)

##### 新特性🐣

* 【boot】 fastjson及log4j2的漏洞检测功能和警告功能。可配置开启存在漏洞时抛出异常来阻止项目启动，默认：不开启。
* 【boot】 可配置是否在项目启动时，打印当前项目所有依赖，包括：所属组、jar包名称、版本号、jar文件路径。默认：不打印。
* 【core】 JarInfo，增加group属性及相应的解析程序，用于区分同名jar。

##### Bug修复🐞

* 【core】 修复JarUtils工具类，在springboot打的包时，获取不到jar列表的问题。
* 【core】 修复VersionInfo的版本号比较功能当存在后缀版本信息时，结果有误的问题。

---------------------------------------------------------------------------------------------------------------------------

## v0.2.4 (2021-12-13)

##### 新特性🐣

* 【excel】 ExcelUtils工具类，列表数据转excel时，新增勾子onBeforeCreateHeadRow和onAfterCreateDataRows，可自定义插入首行和尾行内容。
* 【boot】 环境增强功能新特性：增加标准环境目录（dev、test、sandbox、prod），可以添加某类环境的统一配置文件。

---------------------------------------------------------------------------------------------------------------------------

## v0.2.3 (2021-12-06)

##### 新特性🐣

* 【core】 增强类加载器：`@DependsOnClass` 注解，新增校验策略：
  * 1）全部类都存在时加载
  * 2）只要有一个类存在就加载
* 【boot】 增加`easyj-spring-boot-logging`模块，主要用于将`logback.xml`配置转换为yaml配置。同时集成两个appender：`kafka-appender`、`logstash-appender`，最终目的是为了快速集成`ELK`。
* 【boot】 网络函数配置变更：${easyj.localIp.pattern}更名为${easyj.net.matchIp}，同时增加一个方法：${easyj.net.getIp()}
* 【boot】 增加一个函数式配置：类函数，包含以下两个方法：
  * 1）判断是否所有类都存在，返回true或false：`${easyj.class.isExist('类名1', '类名2', ..., '类名n')}`
  * 2）按顺序获取存在的一个类：`${easyj.class.getExistingOne('类名1', '类名2', ..., '类名n')}`
* 【boot】 基于类函数配置${easyj.class.getExistingOne}方法，新增三个可引用配置，用于同时兼容高低版本的数据库驱动包：
  * 1）`MySQL`数据库驱动类：`${easyj.datasource.mysql.driver-class-name}`
  * 2）`Oracle`数据库驱动类：`${easyj.datasource.oracle.driver-class-name}`
  * 3）`MS Sql Server`数据库驱动类：`${easyj.datasource.mssql.driver-class-name}`

##### Bug修复🐞

* 【core】 修复“StringUtils.toString(obj)方法，当obj为基础数据类型数组时（如：int[]、long[]），会报ClassCastException异常”的问题。
* 【boot】 部分自动装配的条件优化，避免依赖引用不足但自动装配生效导致项目启动失败。
* 兼容1.1.x~2.6.x的所有spring-boot中版本下的最新小版本。

##### Test

* `.github/workflows/build.yml`: 为了兼容1.1.x~2.6.x的所有spring-boot版本。同时在github/actions上增加了以上所有版本的自动化测试。（只测试最高小版本，如1.1.x只测试1.1.12.RELEASE版本）

---------------------------------------------------------------------------------------------------------------------------

## v0.2.2 (2021-11-10)

##### 新特性🐣

* 【core】 序列化服务新增实现类：AtomicLongSequenceServiceImpl

##### Bug修复🐞

* 【core】 Fastjson存在BUG，添加一些修复BUG后的序列化类，并封装了一个修复BUG所需的方便使用的工具类：EasyjFastjsonBugfixUtils
* 【boot】 部分工具类中所需的实例，在开启延迟初始化功能时，不会生效的BUG修复。

##### 优化

* 【core】 可自动刷新记号时钟：定时刷新时间间隔由10秒改为10分钟。
* 【core】 高精准记号时钟：修改精准判断策略，提高时间精准度。

##### 构建

* 优化代码模块：合并了一些模块、重命名部分模块的groupId（引用对应的包时，需要注意groupId的变动）、调整了一些包名。

---------------------------------------------------------------------------------------------------------------------------

## v0.2.1 (2021-11-03)

##### 新特性🐣

* 【middleware】 新增EasyJ自研短链接服务中间件及其配套的客户端SDK。（与第三方云服务SDK调用方式一致 IDwzTemplate，使用配置切换。）
* 【web】 新增HttpClientUtils：目前默认实现为Spring的RestTemplate，并且几种SDK的调用方式改为此工具类来调用。
* 【core】 记号时钟：新增可刷新记号时钟、高精准可刷新记号时钟、可自动刷新高精准记号时钟的实现；
* 【core】 ShortCodeUtils: 新增几种实现，并简化工具类的代码。
* 【core】 新增序列服务接口：ISequenceService，目前已有基于db、reids两种实现。
* 【config】 新增ServerConfigs配置类：可配置当前服务的host(当前服务的ip)、domain（当前服务的外网根地址）、workerId和dataCenterId（用于生成当前服务的雪花算法）
* 【db】 使用可自动刷新高准记号时钟，优化DbClockUtils的实现，使数据库记号时钟的准度更高，且可自动校准时钟；
* 【db】 IDbDialect（数据库方言）：支持数据库序列值的获取（currval、nextval、setval）

##### Bug修复🐞

* 【core】 DateUtils.parseAll方法，解析分和解析秒的代码写反了，现已修复。
* 【core】 JarUtils获取的JarInfo中的url不是jar地址的BUG修复。
* 【boot】 部分bean标记为@Lazy(false)，避免启用延迟加载功能时，导致部分功能无法使用。

##### 优化

* 【test】 TestUtils，会打印单次执行的耗时了。
* 【test】 添加更多单元测试。
* 【log】 日志打印优化。
* 【script】 新增/src/script目录，用于存放easyj部分功能所需的脚本。

---------------------------------------------------------------------------------------------------------------------------

## v0.2.0 (2021-10-22)

##### 新特性🐣

* 【core】 新增JSONUtils：目前会根据项目所引用的依赖，使用对应的实现。优先级：fastjson、jackson、gson、hutool
* 【core】 新增VersionUtils：用于解析版本号。
* 【core】 新增JarUtils：用于获取运行时，lib下的所有jar信息。
* 【core】
  EnhancedServiceLoader：增加@DependsOnClass、@DependsOnJavaVersion、@DependsOnJarVersion，分别用于校验当前服务依赖的类、java版本、jar版本。（用于增加开源项目对于广大开源组件的兼容性，同时也考虑性不同版本采用不同实现，以获取更高性能的考虑）
* 【core】 新增ShortCodeUtils：将long型ID生成短字符串，用途：邀请码、短链接码等等。
* 【db】 增加数据库方言，同时添加DbUtils和DbClockUtils，目前支持根据入参数据源，获取对应的数据库类型、数据库版本号、生成数据库记号时钟（高性能获取数据库时间方法，有一定的时间偏差）。现在已支持MySql、Oracle、MS_SQL_Server
* 【test】 TestUtils：增加多线程并发测试功能，主要是为了各功能的线程安全问题以及并发性能问题。

##### 优化

* 【core】 优化Base64Utils的性能：采用了EnhancedServiceLoader的新特性，不同java版本，不同实现，性能最优化。
* 【sdk】 优化额外参数的传递方式。方便业务开发时，通过配置切换调用接口所使用的SDK账号其他参数。
* 其他一些异常处理优化、日志打印优化、代码重构等。

##### Test

* `.github/workflows/build.yml`: github/actions上，增加Java17的自动化测试。

---------------------------------------------------------------------------------------------------------------------------


# v0.1.x（2021-06-23 ~ 2021-10-21）


---------------------------------------------------------------------------------------------------------------------------

## v0.1.7~v0.1.9 (2021-09-30)

##### 新特性🐣

* 【sdk】 新增SDK模块：目前有短链接服务（已实现百度云（收费，有一定免费额度）、S-3（免费））、和身份证图片识别的接口（已实现腾讯云接口）
* 【config】 GlobalConfigs增加inUnitTest属性，用于判断当前是否处于单元测试中，可做一些特殊处理。
* 【core】 新增ConvertUtils数据转换工具类，基于Spring的DefaultConversionService及部分自定义Converter实现，支持addConverter自定义扩展转换器。
* 【core】 springboot环境增强功能，约定配置文件功能，支持同名文件的加载。
* 【core】 @Cache304注解，添加useCacheIfException属性，支持当get接口异常时，如果客户端存在缓存，则允许客户端继续使用缓存。
* 【core】 新增了很多当前项目所需的工具类。

##### 优化

* 多处的异常处理优化，增加了很多异常类。
* 内存消耗及部分工具类的性能优化。

---------------------------------------------------------------------------------------------------------------------------

## v0.1.6 (2021-08-06)

##### 新特性🐣

* 【boot】 优化和增强测试MockMvc的封装方法，可快速测试文件上传、文件下载、下载的excel文件的内容校验功能。
* 【boot】 约定配置文件，新增加on-class条件加载功能。

---------------------------------------------------------------------------------------------------------------------------

# EasyJ开源项目诞生（2021-06-23）