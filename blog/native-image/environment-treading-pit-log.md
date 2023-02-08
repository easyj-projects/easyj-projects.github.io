# GraalVM Native Image打包环境踩坑记录

---------------------------------------------------------------------------------------------------------------------------

### 一、多环境共性问题：

#### 1.1、`native-maven-plugin` 打包插件自动执行 `gu install native-image` 时报错：

##### 错误日志：

```log
......省略其他日志
C:\Users\administrator> gu install native-image
......省略其他日志
Downloading: Component catalog from www.graalvm.org
Processing Component: Native Image
Downloading: Component native-image: Native Image from github.com
I/O error occurred: PKIX path building failed: sun.security.provider.certpath.SunCertPathBuilderException: unable to find valid certification path to requested target
......省略其他日志
```

##### 解决方案：
执行 <a href="#/native-image/environment-treading-pit-log?id=_41、附件1：installcertjava">第四章节附件1</a> 的java程序，生成证书文件：
```shell
#javac 生成InstallCert.class
javac InstallCert.java

#java 执行InstallCert.class，生成证书文件
java InstallCert www.graalvm.org
```
_注意：如果生成失败了，请尝试直接下载我生成好的：<a href="../downloads/native-image/jssecacerts">下载证书文件</a>_

然后将生成或下载的 `jssecacerts` 证书文件复制到 `%JAVA_HOME%/lib/security` 目录下即可。


---------------------------------------------------------------------------------------------------------------------------

### 二、Windows环境问题：
 
#### 2.1、`Exception during JVMCI compiler initialization`

##### 错误日志：

```log
......省略部分日志
[1/7] Initializing...                                                                                    (9.1s @ 0.20GB)
......省略部分日志
Exception during JVMCI compiler initialization
#
# A fatal error has been detected by the Java Runtime Environment:
#
#  Internal Error (jvmciRuntime.cpp:1609), pid=20092, tid=3344
#  fatal error: Fatal exception in JVMCI: Exception during JVMCI compiler initialization
#
# JRE version: OpenJDK Runtime Environment GraalVM CE 22.3.0 (17.0.5+8) (build 17.0.5+8-jvmci-22.3-b08)
# Java VM: OpenJDK 64-Bit Server VM GraalVM CE 22.3.0 (17.0.5+8-jvmci-22.3-b08, mixed mode, tiered, jvmci, jvmci compiler, compressed oops, compressed class ptrs, parallel gc, windows-amd64)
# No core dump will be written. Minidumps are not enabled by default on client versions of Windows
#
# An error report file with more information is saved as:
# E:\Workspace_Java\wangliang181230\study-spring-boot\study-native-image\study-native-image-with-springboot3\hs_err_pid20092.log
#
# If you would like to submit a bug report, please visit:
#   https://github.com/oracle/graal/issues
#
Error: Image build request failed with exit status 1
```
##### 解决方案：
内存不足导致的，将不用的软件或进程关掉，尽量空出内存，再重试就可以了。


---------------------------------------------------------------------------------------------------------------------------

### 三、Linux环境问题：

#### 3.2、问题2：Image build request failed with exit status 137

##### 错误日志：
```log
......省略其他日志
[2/7] Performing analysis...  [******Error: Image build request failed with exit status 137
......省略其他日志
```

##### 解决方案：
内存不足导致，加大内存即可。


---------------------------------------------------------------------------------------------------------------------------

### 四、附件

#### 4.1、附件1：`InstallCert.java`

解决 <a href="#/native-image/environment-treading-pit-log?id=_11、native-maven-plugin-打包插件自动执行-gu-install-native-image-时报错：">问题1.1</a> 时使用。
```java
import java.io.*;
import java.security.*;
import java.security.cert.*;
import javax.net.ssl.*;

public class InstallCert {

    public static void main(String[] args) throws Exception {
        String host;
        int port;
        char[] passphrase;
        if ((args.length == 1) || (args.length == 2)) {
            String[] c = args[0].split(":");
            host = c[0];
            port = (c.length == 1) ? 443 : Integer.parseInt(c[1]);
            String p = (args.length == 1) ? "changeit" : args[1];
            passphrase = p.toCharArray();
        } else {
            System.out.println("Usage: java InstallCert <host>[:port] [passphrase]");
            return;
        }

        File file = new File("jssecacerts");
        if (file.isFile() == false) {
            char SEP = File.separatorChar;
            File dir = new File(System.getProperty("java.home") + SEP
                    + "lib" + SEP + "security");
            file = new File(dir, "jssecacerts");
            if (file.isFile() == false) {
                file = new File(dir, "cacerts");
            }
        }
        System.out.println("Loading KeyStore " + file + "...");
        InputStream in = new FileInputStream(file);
        KeyStore ks = KeyStore.getInstance(KeyStore.getDefaultType());
        ks.load(in, passphrase);
        in.close();

        SSLContext context = SSLContext.getInstance("TLS");
        TrustManagerFactory tmf =
                TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
        tmf.init(ks);
        X509TrustManager defaultTrustManager = (X509TrustManager)tmf.getTrustManagers()[0];
        SavingTrustManager tm = new SavingTrustManager(defaultTrustManager);
        context.init(null, new TrustManager[]{tm}, null);
        SSLSocketFactory factory = context.getSocketFactory();

        System.out.println("Opening connection to " + host + ":" + port + "...");
        SSLSocket socket = (SSLSocket)factory.createSocket(host, port);
        socket.setSoTimeout(10000);
        try {
            System.out.println("Starting SSL handshake...");
            socket.startHandshake();
            socket.close();
            System.out.println();
            System.out.println("No errors, certificate is already trusted");
        } catch (SSLException e) {
            System.out.println();
            e.printStackTrace(System.out);
        }

        X509Certificate[] chain = tm.chain;
        if (chain == null) {
            System.out.println("Could not obtain server certificate chain");
            return;
        }

        BufferedReader reader =
                new BufferedReader(new InputStreamReader(System.in));

        System.out.println();
        System.out.println("Server sent " + chain.length + " certificate(s):");
        System.out.println();
        MessageDigest sha1 = MessageDigest.getInstance("SHA1");
        MessageDigest md5 = MessageDigest.getInstance("MD5");
        for (int i = 0; i < chain.length; i++) {
            X509Certificate cert = chain[i];
            System.out.println
                    (" " + (i + 1) + " Subject " + cert.getSubjectDN());
            System.out.println("   Issuer  " + cert.getIssuerDN());
            sha1.update(cert.getEncoded());
            System.out.println("   sha1    " + toHexString(sha1.digest()));
            md5.update(cert.getEncoded());
            System.out.println("   md5     " + toHexString(md5.digest()));
            System.out.println();
        }

        System.out.println("Enter certificate to add to trusted keystore or 'q' to quit: [1]");
        String line = reader.readLine().trim();
        int k;
        try {
            k = (line.length() == 0) ? 0 : Integer.parseInt(line) - 1;
        } catch (NumberFormatException e) {
            System.out.println("KeyStore not changed");
            return;
        }

        X509Certificate cert = chain[k];
        String alias = host + "-" + (k + 1);
        ks.setCertificateEntry(alias, cert);

        OutputStream out = new FileOutputStream("jssecacerts");
        ks.store(out, passphrase);
        out.close();

        System.out.println();
        System.out.println(cert);
        System.out.println();
        System.out.println
                ("Added certificate to keystore 'jssecacerts' using alias '"
                        + alias + "'");
    }

    private static final char[] HEXDIGITS = "0123456789abcdef".toCharArray();

    private static String toHexString(byte[] bytes) {
        StringBuilder sb = new StringBuilder(bytes.length * 3);
        for (int b : bytes) {
            b &= 0xff;
            sb.append(HEXDIGITS[b >> 4]);
            sb.append(HEXDIGITS[b & 15]);
            sb.append(' ');
        }
        return sb.toString();
    }

    private static class SavingTrustManager implements X509TrustManager {

        private final X509TrustManager tm;
        private X509Certificate[] chain;

        SavingTrustManager(X509TrustManager tm) {
            this.tm = tm;
        }

        public X509Certificate[] getAcceptedIssuers() {
            throw new UnsupportedOperationException();
        }

        public void checkClientTrusted(X509Certificate[] chain, String authType)
                throws CertificateException {
            throw new UnsupportedOperationException();
        }

        public void checkServerTrusted(X509Certificate[] chain, String authType)
                throws CertificateException {
            this.chain = chain;
            tm.checkServerTrusted(chain, authType);
        }
    }

}
```