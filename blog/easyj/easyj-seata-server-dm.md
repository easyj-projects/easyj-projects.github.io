# 试用支持达梦的seata-server版本

为了方便大家更早的试用 `Seata` 官方未发布的功能，EasyJ社区发布了 PR [#3672：feature: support Dameng database](https://github.com/seata/seata/pull/3672) 中的seata-server版本的镜像。

具体使用方式见下文。

---------------------------------------------------------------------------------------------------------------------------

## 1、准备数据库

### 1.1、创建模式

登录达梦数据库，并创建名为 `SEATA` 的模式。

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

INSERT INTO "SEATA"."DISTRIBUTED_LOCK" ("LOCK_KEY", "LOCK_VALUE", "EXPIRE") VALUES ('HandleAllSession', ' ', 0);
INSERT INTO "SEATA"."DISTRIBUTED_LOCK" ("LOCK_KEY", "LOCK_VALUE", "EXPIRE") VALUES ('RetryCommitting', ' ', 0);
INSERT INTO "SEATA"."DISTRIBUTED_LOCK" ("LOCK_KEY", "LOCK_VALUE", "EXPIRE") VALUES ('RetryRollbacking', ' ', 0);
INSERT INTO "SEATA"."DISTRIBUTED_LOCK" ("LOCK_KEY", "LOCK_VALUE", "EXPIRE") VALUES ('TxTimeoutCheck', ' ', 0);
```

## 2、拉取镜像

以下提供4个基于不同java版本的镜像，根据需求拉取对应的镜像吧：

```bash
# 基于java8
docker pull easyj/seata-server:1.7.1-DM-SNAPSHOT
docker pull easyj/seata-server:1.7.1-DM-SNAPSHOT-slim

# 基于java17
docker pull easyj/seata-server:1.7.1-DM-SNAPSHOT.jre17
docker pull easyj/seata-server:1.7.1-DM-SNAPSHOT.jre17-slim
```

<!-- 查看EasyJ发布的所有seata-server镜像：https://hub.docker.com/r/easyj/seata-server/tags -->

## 3、启用容器

```bash
# 创建并启动seata容器
# 根据实际情况，设置五个环境变量参数：
#   DM_HOST: 达梦数据库主机名或IP
#   DM_PORT: 达梦数据库端口号
#   DM_SCHEMA: 达梦数据库模式名
#   DM_USER: 达梦数据库用户名
#   DM_PASSWORD: 达梦数据库密码
docker run \
    --name seata-for-dm \
    -e DM_HOST=127.0.0.1 \
    -e DM_PORT=5236 \
    -e DM_SCHEMA=SEATA \
    -e DM_USER=SYSDBA \
    -e DM_PASSWORD=xxx \
    -p 7091:7091 \
    -p 8091:8091 \
    --restart=always \
    --privileged \
    -dit \
    easyj/seata-server:1.7.1-DM-SNAPSHOT

#查看seata日志
docker logs -f seata-for-dm
```
