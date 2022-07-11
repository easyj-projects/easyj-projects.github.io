# EasyJ + SpringBoot + LogBack + ELK - 快速实现分布式日志

分布式日志系统是分布式系统中非常重要的组件之一，它是快速定位问题的关键组件。

本文提供的是通过EasyJ简化后的快速集成ELK的方案，其他详细内容请参考：https://blog.csdn.net/jushisi/article/details/108795657


---------------------------


### 一、部署ELK

EasyJ社区在 `sebp/elk:7.12.1` 镜像的基础上，调整了部分内容，用于快速集成。

（ 具体调整内容请查看：https://hub.docker.com/repository/docker/easyj/elk ）

#### 1.1、下载ELK镜像：

```shell
docker pull easyj/elk:7.12.1
```

#### 1.2、启用ELK容器：

```shell
#启用容器
docker run --name elk \
    -p 5601:5601 \
    -p 9200:9200 \
    -p 9300:9300 \
    -p 5044:5044 \
    -p 4560:4560 \
    --privileged \
    --restart=always \
    -dit easyj/elk:7.12.1

#查看日志
docker logs -f elk
```

#### 1.3、验证容器：

在浏览器中访问： http://xxx.xxx.xxx.xxx:5601 ，并展示出 `Kibana` 的界面，就说明部署成功。

#### 1.4、添加 `Index patterns` （索引模式配置）：

点击 `菜单栏` ➝ `Stack Management` ➝ `Index Patterns`

进入 http://xxx.xxx.xxx.xxx:5601/app/management/kibana/indexPatterns 界面

> 1. 点击进入 `Create index pattern` 界面
> 2. Step 1: 填写 Index pattern name 输入框: `logs*` （可在界面下方实时查看到关联到的索引），点击 `Next step` 按钮；
> 3. Step 2: Time field 选择 `@timestamp`，点击 `Create index pattern` 按钮，完成添加。

#### 1.5、配置 `Index Lifecycle Policies`（索引生命周期策略）：

点击 `菜单栏` ➝ `Stack Management` ➝ `Index Lifecycle Policies`

进入 http://xxx.xxx.xxx.xxx:5601/app/management/data/index_lifecycle_management/policies 界面

> 1. 选择 `logstash-policy`
> 2. 根据自己的需求调整 `Hot phase`、`Warm phase`、`Cold phase`、`Delete phase` 的配置。


---------------------------


### 二、使用EasyJ快速集成和配置

#### 2.1、引用依赖：

```xml
<dependency>
    <groupId>icu.easyj.boot</groupId>
    <artifactId>easyj-spring-boot-starter-logging</artifactId>
    <version>0.7.4</version>
</dependency>
```

#### 2.2、添加配置：

在 yaml 配置文件中，添加以下配置：

```yaml
logging:
  # `easyj-spring-boot-logging`中内置了该配置文件，可直接配置使用
  # 如果项目自己已经配置了 `logback-spring.xml`，那么请将相关配置复制到自己的配置文件中
  config: classpath:easyj/logging/logback/logback-spring.xml

  #path: logs/${server.port:80} #file-appender所需配置，*.log文件存放路径，与ELK无关

easyj.logging.logback:
  logstash-appender:
    enabled: true #启用logstash-appender，用于将日志上传到logstash
    destination: xxx.xxx.xxx.xxx:4560 #部署的ELK中，logstash开放的TCP通道地址
```

#### 2.3、验证配置是否正确：

启动应用，产生日志。然后进入 `Kibana` 页面，点击 `菜单栏` ➝ `Discover` 进入日志查看界面，查看是否成功将日志上传了。


---------------------------


### 三、开发者进阶

#### 3.1、上下文关联日志

为了更快的检索到相关的日志信息，往往需要将一些日志信息与业务ID等关联起来。这时候，就需要设置一些上下文。

调用logback提供的工具类：`org.slf4j.MDC`

```java
@SpringBootTest
public class Test {

    private static final Logger LOGGER = LoggerFactory.getLogger(Test.class);

    @Test
    public void test() {
        try {
            // 设置上下文
            MDC.put("id", "1234567890");
            LOGGER.info("日志信息");
            LOGGER.error("异常日志信息", new RuntimeException("模拟异常"));
        } finally {
            // 清理单个上下文
            MDC.remove("id");
        }


        // 在部分程序结束的地方清空所有上下文
        //MDC.clear();
    }

}
```

EasyJ专门提供了追踪类：`icu.easyj.core.trace.TraceUtils`

该工具类使用了门面模式，主要用于追踪请求或日志或其他更多内容。

目前该工具类实现了 `zipkin` 和 `slf4j` 上下文追踪内容.

推荐使用该工具类代替`MDC`

```java
@SpringBootTest
public class Test {

    private static final Logger LOGGER = LoggerFactory.getLogger(Test.class);

    @Test
    public void test() {
        try {
            // 设置上下文
            TraceUtils.put("id", "1234567890");
            LOGGER.info("日志信息");
            LOGGER.error("异常日志信息", new RuntimeException("模拟异常"));
        } finally {
            // 清理单个上下文
            TraceUtils.remove("id");
        }


        // 在部分程序结束的地方清空所有上下文
        //TraceUtils.clear();
    }

}
```

设置了上下文后，在上下文作用范围内，进行写日志时，上下文也会和日志一起被上传。
然后我们就可以在 `Kibana` 日志查看界面中，输入筛选条件 `1234567890` 或 `"id":"1234567890"`，来查找与该数据相关的日志信息。


---------------------------


### 四、问题处理

#### 问题一、内存权限太小导致ELK启动失败

错误日志：

```log
max virtual memory areas vm.max_map_count [65530] is too low, increase to at least [262144]
```

解决方法：

（引用自 https://blog.csdn.net/qq_43655835/article/details/104633359 ）

```shell
#启动容器
docker start elk 
#快速进入容器
docker exec -it elk bash

#修改参数
sysctl -w vm.max_map_count=262144
#查看参数
sysctl -a|grep vm.max_map_count

#修改配置文件
vim /etc/sysctl.conf
```

在 `/etc/sysctl.conf` 文件最后添加一行：

```config
vm.max_map_count=262144
```

再输入以下命令使配置生效：

```shell
sysctl -p
```
