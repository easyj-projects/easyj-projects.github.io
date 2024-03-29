# 试用支持达梦的 `seata-server`

> 说明：由于 `Seata社区` 发版较慢，但很多新特性可能是用户急需的。
> 为了方便大家更早更便捷的试用到 `Seata` 官方未发布的新特性，EasyJ社区会根据需求提前发布一些功能，让大家试用起来。

这次，我们发布了 Seata PR 
[#3672：feature: support Dameng database](https://github.com/seata/seata/pull/3672)
中的 兼容达梦数据库的 `seata-server` docker镜像 及 发布包，供大家提前试用。
如在试用过程中发现问题，欢迎在Seata各交流群中将问题反馈给 `wangliang181230`。

---------------------------------------------------------------------------------------------------------------------------

## 1、准备数据库

### 1.1、创建模式

登录达梦数据库，并创建名为 `SEATA` 的模式（即：`schema`）。

> 注：当然也可以自定义为其他模式名，但相应的要修改建表SQL中的模式名、及环境变量 `DM_SCHEMA` 值）。

### 1.2、创建表

```sql
-- the table to store GlobalSession data
CREATE TABLE "SEATA"."GLOBAL_TABLE"
(
    "XID"                       VARCHAR2(128) NOT NULL,
    "TRANSACTION_ID"            BIGINT,
    "STATUS"                    TINYINT       NOT NULL,
    "APPLICATION_ID"            VARCHAR2(32),
    "TRANSACTION_SERVICE_GROUP" VARCHAR2(32),
    "TRANSACTION_NAME"          VARCHAR2(128),
    "TIMEOUT"                   INT,
    "BEGIN_TIME"                BIGINT,
    "APPLICATION_DATA"          VARCHAR2(2000),
    "GMT_CREATE"                TIMESTAMP(0),
    "GMT_MODIFIED"              TIMESTAMP(0),
    PRIMARY KEY ("XID")
);

CREATE  INDEX "IDX_GMT_MODIFIED_STATUS" ON "SEATA"."GLOBAL_TABLE"("GMT_MODIFIED" ASC,"STATUS" ASC);
CREATE  INDEX "IDX_TRANSACTION_ID" ON "SEATA"."GLOBAL_TABLE"("TRANSACTION_ID" ASC);


-- the table to store BranchSession data
CREATE TABLE "SEATA"."BRANCH_TABLE"
(
    "BRANCH_ID"         BIGINT        NOT NULL,
    "XID"               VARCHAR2(128) NOT NULL,
    "TRANSACTION_ID"    BIGINT,
    "RESOURCE_GROUP_ID" VARCHAR2(32),
    "RESOURCE_ID"       VARCHAR2(256),
    "BRANCH_TYPE"       VARCHAR2(8),
    "STATUS"            TINYINT,
    "CLIENT_ID"         VARCHAR2(64),
    "APPLICATION_DATA"  VARCHAR2(2000),
    "GMT_CREATE" TIMESTAMP(0),
    "GMT_MODIFIED" TIMESTAMP(0),
    PRIMARY KEY ("BRANCH_ID")
);

CREATE INDEX "IDX_XID" ON "SEATA"."BRANCH_TABLE"("XID" ASC);


-- the table to store lock data
CREATE TABLE "SEATA"."LOCK_TABLE"
(
    "ROW_KEY"        VARCHAR2(128) NOT NULL,
    "XID"            VARCHAR2(128),
    "TRANSACTION_ID" BIGINT,
    "BRANCH_ID"      BIGINT        NOT NULL,
    "RESOURCE_ID"    VARCHAR2(256),
    "TABLE_NAME"     VARCHAR2(32),
    "PK"             VARCHAR2(36),
    "STATUS"         TINYINT       NOT NULL DEFAULT 0,
    "GMT_CREATE"     TIMESTAMP(0),
    "GMT_MODIFIED"   TIMESTAMP(0),
    PRIMARY KEY ("ROW_KEY")
);

COMMENT ON COLUMN "SEATA"."LOCK_TABLE"."STATUS" IS '0:locked ,1:rollbacking';

CREATE INDEX "IDX_BRANCH_ID" ON "SEATA"."LOCK_TABLE" ("BRANCH_ID" ASC);
CREATE INDEX "IDX_STATUS" ON "SEATA"."LOCK_TABLE" ("STATUS" ASC);

CREATE TABLE "SEATA"."DISTRIBUTED_LOCK"
(
    "LOCK_KEY"   VARCHAR2(20) NOT NULL,
    "LOCK_VALUE" VARCHAR2(20) NOT NULL,
    "EXPIRE"     BIGINT       NOT NULL,
    PRIMARY KEY ("LOCK_KEY")
);

INSERT INTO "SEATA"."DISTRIBUTED_LOCK" ("LOCK_KEY", "LOCK_VALUE", "EXPIRE") VALUES ('AsyncCommitting', ' ', 0);
INSERT INTO "SEATA"."DISTRIBUTED_LOCK" ("LOCK_KEY", "LOCK_VALUE", "EXPIRE") VALUES ('RetryCommitting', ' ', 0);
INSERT INTO "SEATA"."DISTRIBUTED_LOCK" ("LOCK_KEY", "LOCK_VALUE", "EXPIRE") VALUES ('RetryRollbacking', ' ', 0);
INSERT INTO "SEATA"."DISTRIBUTED_LOCK" ("LOCK_KEY", "LOCK_VALUE", "EXPIRE") VALUES ('TxTimeoutCheck', ' ', 0);
```


## 2、部署 `seata-server`

> 注：以下用于部署的 `seata-server` 的镜像及发布包，源码为 https://github.com/wangliang181230/seata/tree/release-image-for-dm 。

<!-- tabs:start -->

<!-- tab:**Docker部署** -->

### 2.1、Docker部署

#### 1）拉取镜像

点击链接查看所有可用镜像：https://hub.docker.com/r/easyj/seata-server/tags

以下提供8个基于不同java版本和Web容器的镜像，根据需求拉取对应的镜像吧：
> 注：以下镜像更新时间为：`2023-11-03 19:30`

```bash
# 基于java8
docker pull easyj/seata-server:1.8.0-DM-SNAPSHOT
docker pull easyj/seata-server:1.8.0-DM-SNAPSHOT-slim
# 基于java8，Web容器为普元
docker pull easyj/seata-server:1.8.0-DM-PUYUAN-SNAPSHOT
docker pull easyj/seata-server:1.8.0-DM-PUYUAN-SNAPSHOT-slim

# 基于java17
docker pull easyj/seata-server:1.8.0-DM-SNAPSHOT.jre17
docker pull easyj/seata-server:1.8.0-DM-SNAPSHOT.jre17-slim
# 基于java17，Web容器为普元
docker pull easyj/seata-server:1.8.0-DM-PUYUAN-SNAPSHOT.jre17
docker pull easyj/seata-server:1.8.0-DM-PUYUAN-SNAPSHOT.jre17-slim
```

<!-- 查看EasyJ发布的所有seata-server镜像：https://hub.docker.com/r/easyj/seata-server/tags -->

#### 2）启用容器

```bash
# 创建并启动 seata-server 容器
# 根据实际情况，设置以下环境变量：（注：标有星号的必须手动配置）
#   STORE_MODE：数据存储模式，可选值：db(默认)、file、redis
#   DB_DATASOURCE：数据源类型，可选值：druid(默认)、dbcp、hikari
#   DB_TYPE：数据库类型，可选值：dm(默认)、mysql、oracle、h2、postgresql、polardb-x、oceanbase、mariadb
#         注意：oracle、mariadb部分数据库需要自行添加驱动JAR包
#   DB_DRIVER_CLASS_NAME：数据库驱动类名，根据配置的DB_TYPE，设置对应的数据库驱动类
#   DB_URL：数据库连接URL，如果DB_TYPE配置为dm，也可以单独配置以下3个环境变量：
#     DM_HOST：达梦数据库主机名或IP，默认值：127.0.0.1
#     DM_PORT：达梦数据库端口号，默认值：5236
#     DM_SCHEMA：达梦数据库模式名，默认值：SEATA
#   *DB_USER：数据库用户名
#   *DB_PASSWORD：数据库密码
docker run \
    --name seata-for-dm \
    -e STORE_MODE=db \
    -e DB_DATASOURCE=druid \
    -e DB_TYPE=dm \
    -e DB_DRIVER_CLASS_NAME=dm.jdbc.driver.DmDriver \
    -e DM_HOST=127.0.0.1 \
    -e DM_PORT=5236 \
    -e DM_SCHEMA=SEATA \
    -e DB_USER=SYSDBA \
    -e DB_PASSWORD=xxx \
    -e SEATA_IP=127.0.0.1 \
    -e SEATA_HTTP_PORT=7091 \
    -e SEATA_PORT=8091 \
    -p 7091:7091 \
    -p 8091:8091 \
    --restart=always \
    --privileged \
    -dit \
    easyj/seata-server:1.8.0-DM-SNAPSHOT

#查看 seata-server 日志
docker logs -f seata-for-dm
```


<!-- tab:**发布包部署** -->

### 2.2、发布包部署

#### 1）下载发布包

> 注：以下发布包更新时间为：`2023-10-09 17:50`

1. <a href="https://gitee.com/wangliang181230/seata/releases/download/1.8.0-DM-SNAPSHOT/seata-server-1.8.0-DM-SNAPSHOT.tar.gz">seata-server-1.8.0-DM-SNAPSHOT.tar.gz</a>
2. <a href="https://gitee.com/wangliang181230/seata/releases/download/1.8.0-DM-SNAPSHOT/seata-server-1.8.0-DM-SNAPSHOT.zip">seata-server-1.8.0-DM-SNAPSHOT.zip</a>

#### 2）解压缩发布包

windows下就不多说了，一般都有解压软件，下面提供linux下的解压命令：

```bash
# 解压 *.tar.gz
tar -zxvf seata-server-1.8.0-DM-SNAPSHOT.tar.gz
# 或
# 解压 *.zip
unzip seata-server-1.8.0-DM-SNAPSHOT.zip

# 由于以上两个发布包是在windows下打包出来的，需要将'\r'（回车符）移除掉，否则，运行时会报 “$'\r': 未找到命令” 的错误。
# 运行以下两个命令，将两个 sh 文件的回车符都移除掉
sed -i 's/\r//' seata/bin/seata-server.sh
sed -i 's/\r//' seata/bin/seata-setup.sh
```

#### 3）修改 `seata-server` 的达梦数据库配置

修改 `seata/conf/application.yml` 配置文件：

> _注：这里仅介绍达梦数据库的配置，其他配置见 [seata官网：参数配置](https://seata.io/zh-cn/docs/user/configurations.html)。_

```yml
#...前面省略
seata:
  #...中间省略
  store:
    mode: db
    db:
      datasource: druid #数据库连接池，可选：druid、hikari、dbcp
      db-type: dm #数据库类型，支持：mysql、oracle、dm、h2、等等
      driver-class-name: dm.jdbc.driver.DmDriver #达梦数据库-驱动类
      url: jdbc:dm://127.0.0.1:5236?schema=SEATA #达梦数据库-URL
      user: SYSDBA # 达梦数据库-用户名
      password: xxxxxx # 达梦数据库-密码
#...后面省略
```

#### 4）启动 `seata-server`

1. windows下，运行 `seata/bin/seata-server.bat` 
2. linux下，运行 `seata/bin/seata-server.sh`

<!-- tabs:end -->


## 3、校验是否部署成功

通过以下方法都可以校验是否部署成功：
1. 直接在浏览器上访问 http://127.0.0.1:7091 ，显示登录页面；
2. 使用命令 `curl http://127.0.0.1:7091`，响应`HTML`代码并可以看到 `Copyright 1999-2019 Seata.io Group` 内容；
3. 使用 `telnet 127.0.0.1 8091`，成功连接上。

> 注：`7091` 为控制台HTTP端口，`8091` 为分布式事务接口的RPC端口。