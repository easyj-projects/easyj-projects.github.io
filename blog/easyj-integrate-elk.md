# EasyJ + SpringBoot + LogBack + ELK - 快速实现分布式日志

分布式日志系统是分布式系统中非常重要的组件之一，它是快速定位问题的关键组件。

本文提供的是通过EasyJ简化后的快速集成ELK的方案，其他详细内容请参考：https://blog.csdn.net/jushisi/article/details/108795657


---------------------------


## 一、部署ELK（如已部署，请跳过该步骤）

### 1.1、下载ELK镜像：

EasyJ社区在 `sebp/elk:7.12.1` 镜像的基础上，调整了部分内容，并上传了 `easyj/elk:7.12.1` 镜像，用于快速集成。

（ 具体调整内容请查看：https://hub.docker.com/repository/docker/easyj/elk ）

```bash
#拉取镜像
docker pull easyj/elk:7.12.1

```

### 1.2、启用ELK容器：

```bash
#创建并启动容器
docker run --name elk \
    -p 5601:5601 \
    -p 9200:9200 \
    -p 9300:9300 \
    -p 5044:5044 \
    -p 4560:4560 \
    --restart=always \
    --privileged \
    -dit \
    easyj/elk:7.12.1

#启动容器
docker start elk

#查看启动日志
docker logs -f elk

```

### 1.3、验证容器：

在浏览器中访问： http://xxx.xxx.xxx.xxx:5601 ，并展示出 `Kibana` 的界面，就说明部署成功。

### 1.4、添加 `Index patterns` （索引模式配置）：

点击 `菜单栏` ➝ `Stack Management` ➝ `Index Patterns`

进入 http://xxx.xxx.xxx.xxx:5601/app/management/kibana/indexPatterns 界面

> 1. 点击进入 `Create index pattern` 界面
> 2. Step 1: 填写 Index pattern name 输入框: `logs*` （可在界面下方实时查看到关联到的索引），点击 `Next step` 按钮；
> 3. Step 2: Time field 选择 `@timestamp`，点击 `Create index pattern` 按钮，完成添加。

### 1.5、配置 `Index Lifecycle Policies`（索引生命周期策略）：

点击 `菜单栏` ➝ `Stack Management` ➝ `Index Lifecycle Policies`

进入 http://xxx.xxx.xxx.xxx:5601/app/management/data/index_lifecycle_management/policies 界面

> 1. 选择 `logstash-policy`
> 2. 根据自己的需求调整 `Hot phase`、`Warm phase`、`Cold phase`、`Delete phase` 的配置，最主要配置的是过时自动删除。


---------------------------


## 二、使用 `easyj-spring-boot-starter-logging` 快速集成 `ELK`

### 2.1、引用依赖：

```xml
<dependency>
    <groupId>icu.easyj.boot</groupId>
    <artifactId>easyj-spring-boot-starter-logging</artifactId>
    <version>0.7.5</version>
</dependency>
```

### 2.2、添加配置：

在 yaml 配置文件中，添加以下配置：

```yaml
logging:
  #`easyj-spring-boot-logging.jar`中内置了已设置好的配置文件，可直接引用
  #如果项目自己已经配置了 `logback-spring.xml`，那么请将相关配置复制到自己的配置文件中
  config: "classpath:easyj/logging/logback/logback-spring.xml"
  #或
  #config: "${easyj.logging.logback.config}" #值是一样的

  #path: "logs/${server.port:80}" #file-appender所需配置，*.log文件存放路径，与集成ELK无关
easyj.logging.logback:
  logstash-appender:
    enabled: true #启用logstash-appender，用于将日志上传到logstash
    destination: "xxx.xxx.xxx.xxx:4560" #部署的ELK中，logstash开放的TCP通道地址
    #destination: "xxx.xxx.xxx.xxx:4560,xxx.xxx.xxx.xxx:4560" #可配置多个地址，用逗号隔开
```

### 2.3、验证配置是否正确：

启动应用，产生日志。然后进入 `Kibana` 页面，点击 `菜单栏` ➝ `Discover` 进入日志查看界面，查看是否成功将日志上传了。


---------------------------


## 三、进阶：上下文关联日志

为了更快的检索到相关的日志信息，往往需要将一些日志信息与业务ID等关联起来。这时候，就需要设置一些上下文。


### 3.1、先设置上下文

**下面提供两种上下文设置方式：**

<!-- tabs:start -->

<!-- tab:**slf4j提供的MDC** -->

可调用调用 slf4j-api 提供的工具类来设置上下文：`org.slf4j.MDC`

```java
package icu.easyj.spring.boot.test;

import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class TestELK {

    @Test
    public void testContextRelationLog() {
        Logger log = LoggerFactory.getLogger(TestELK.class);
        try {
            // 设置上下文
            MDC.put("id", "1234567890");
            // 记录日志，上下文会与这些日志一起被上传到ELK中
            log.info("测试info日志信息");
            log.error("测试error日志信息", new RuntimeException("模拟异常"));
        } finally {
            // 清理单个上下文
            MDC.remove("id");

            // 在部分程序结束的地方可以清空所有上下文
            //MDC.clear();
        }
    }

}
```

<!-- tab:**EasyJ提供的TraceUtils** -->

调用EasyJ专门提供了追踪类来设置上下文：`icu.easyj.core.trace.TraceUtils`

该工具类使用了 `门面模式`，主要用于追踪请求或日志或其他更多内容；

默认情况下，该工具类实现了 `zipkin` 和 `slf4j` 上下文追踪内容，开发者可通过 `SPI机制` 自定义增加实现类；

推荐使用该工具类代替`org.slf4j.MDC`，代码如下：

```java
package icu.easyj.spring.boot.test;

import icu.easyj.core.trace.TraceUtils;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class TestELK {

    @Test
    public void testContextRelationLog() {
        Logger log = LoggerFactory.getLogger(TestELK.class);
        try {
            // 设置上下文
            TraceUtils.put("id", "1234567890");
            // 记录日志，上下文会与这些日志一起被上传到ELK中
            log.info("测试info日志信息");
            log.error("测试error日志信息", new RuntimeException("模拟异常"));
        } finally {
            // 清理单个上下文
            TraceUtils.remove("id");

            // 在部分程序结束的地方可以清空所有上下文
            //TraceUtils.clear();
        }
    }

}
```

<!-- tabs:end -->


### 3.2、再筛选出关联的日志

设置了上下文后，在上下文作用范围内，进行写日志时，上下文也会和日志一起被上传到 `ELK` 中。

然后我们就可以在 `Kibana` 日志查看界面中，输入筛选条件 `1234567890` 或 `"id":"1234567890"`，来查找与该数据相关的日志信息。

如果应用集成了 `zipkin` 链路跟踪，那么也可以通过它的 `traceId` 来查找日志。因为 `traceId` 也是设置到上下文中的。


---------------------------


## 四、问题处理

### 问题1：内存权限太小导致ELK启动失败

#### 4.1.1、错误日志：

```log
[ERROR] max virtual memory areas vm.max_map_count [65530] is too low, increase to at least [262144]
```

#### 4.1.2、解决方法：

（引用自 https://blog.csdn.net/qq_43655835/article/details/104633359 ）

```bash
#启动容器
docker start elk 
#快速进入容器
docker exec -it elk bash

```

```bash
#修改参数
sysctl -w vm.max_map_count=262144
#查看参数
sysctl -a|grep vm.max_map_count

#修改配置文件
vim /etc/sysctl.conf

```

在 `/etc/sysctl.conf` 文件最后添加一行：

```properties
vm.max_map_count=262144
```

再输入以下命令使配置生效：

```bash
sysctl -p

```

#### 4.1.3、补充说明：
在 `easyj/elk:7.12.1` 镜像中，其实已设置过 `vm.max_map_count=262144` 参数，不会碰到该问题。
