# easyj-poi

## 一、Excel相关功能

### 1.1、引用依赖：

```xml
<dependency>
    <groupId>icu.easyj.boot</groupId>
    <artifactId>easyj-spring-boot-starter-poi-excel</artifactId>
    <version>${easyj.version}</version>
</dependency>
```

### 1.2、在类及其属性上添加映射注解 `@Excel` 和 `@ExcelCell`

```java
import lombok.Data;
import icu.easyj.poi.excel.annotation.Excel;
import icu.easyj.poi.excel.annotation.ExcelCell;

@Data
@Excel // TODO: 该注解属性很多，以后再补充说明文档
public class UserInfo {

    @ExcelCell(headName = "姓名", cellNum = 0)
    private String name;

    @ExcelCell(headName = "年龄", cellNum = 1)
    private Integer age;

    @ExcelCell(headName = "出生日期", cellNum = 2)
    private Date birthday;
}
```

### 1.3、在Controller上添加Excel导出功能注解 `@ExcelExport`

```java
import icu.easyj.web.poi.excel.ExcelExport;
import icu.easyj.web.util.HttpUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/japi/v1/user")
public class UserController {

    @Autowired
    private IUserService userService;


    /**
     * 查询用户列表
     *
     * @param param 查询参数
     * @return userList 用户信息列表
     */
    @ExcelExport(fileNamePre = "用户列表", dataType = MyEntity.class)
    //@ApiImplicitParam(name = "doExport", dataType = "Boolean", dataTypeClass = Boolean.class, defaultValue = "false", paramType = "query") // 添加swagger的该注解在swagger界面中显示出该隐式参数
    @GetMapping(value = "/list")
    public List<UserInfo> queryUserList(QueryParam param) {
        //region 重要：当此次请求为excel导出请求时，将分页参数清除（这段代码是此功能唯一的代码入侵）
        if (HttpUtils.isDoExportRequest()) {
            param.setPageSize(-999); // 假设，userService的实现里，`pageSize == -999`，表示不分页的话
        }
        //endregion

        return userService.findList(param); // 根据页码和每页记录数输出这一页的数据列表
    }

    /**
     * 分页查询用户数据
     * 
     * @param param 查询参数
     * @return userPaging 用户信息列表
     */
    @ExcelExport(fileNamePre = "用户列表", dataType = MyEntity.class,
        listFieldName = "list" // 重要：因为列表数据在出参的属性里，listFieldName设置列表数据的属性名即可（TODO: 以后再补充说明如何全局配置该属性名，而无需各注解上去配置。）
    )
    //@ApiImplicitParam(name = "doExport", dataType = "Boolean", dataTypeClass = Boolean.class, defaultValue = "false", paramType = "query") // 添加swagger的该注解在swagger界面中显示出该隐式参数
    @GetMapping(value = "/paging")
    public PageResult<UserInfo> queryUserPaging(QueryParam param) {
        //region 重要：当此次请求为excel导出请求时，将分页参数清除（这段代码是此功能唯一的代码入侵）
        if (HttpUtils.isDoExportRequest()) {
            param.setPageSize(-999); // 假设，userService的实现里，`pageSize == -999`，表示不分页的话
        }
        //endregion

        return userService.findPaging(param); // 分页查询
    }

}
```

```java
import lombok.Data;

/**
 * 查询参数类
 */
@Data
public class QueryParam {

    /**
     * 查询关键字
     */
    private String searchKey;

    /**
     * 页码
     */
    private Integer pageIndex;

    /**
     * 每页记录数
     */
    private Integer pageSize;
}
```

```java
import lombok.Data;

/**
 * 分页查询参数
 */
@Data
public class PageResult<T> {

    /**
     * 总记录数
     */
    private Integer total;

    /**
     * 列表数据
     */
    private T list;
}
```


### 1.4、发起普通请求 和 下载Excel请求

* 普通请求：http://ip:port/japi/v1/user/list?searchKey=xxxxx
* 下载请求：http://ip:port/japi/v1/user/list?searchKey=xxxxx&doExport=true

---

## 二、暂无其他类型文档相关功能...