# 试用支持达梦的seata-server版本

为了方便大家更早的试用 `Seata` 官方未发布的功能，EasyJ社区发布了 PR [#3672：feature: support Dameng database](https://github.com/seata/seata/pull/3672) 中的seata-server版本的镜像。

具体使用方式见下文。

---------------------------------------------------------------------------------------------------------------------------


## 1、拉取镜像

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

## 2、启用容器

```bash
# 创建并启动seata容器
# 根据实际情况，设置四个环境变量参数：DM_HOST、DM_PORT、DM_USER、DM_PASSWORD
docker run \
    --name seata-for-dm \
    -e DM_HOST=127.0.0.1 \
    -e DM_PORT=5236 \
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
