# KO-ON Bot



搬运于https://github.com/Gunale0926/KO-ON-Bot 的仓库，对部分bug进行修复，完善文档。



## Windows部署

1. 直接下载Release版本的Win_with_environment.zip并解压
2. 修改`config.json`文件,完善各平台cookie(可选)，默认网易云平台可不用修改
   - `token*`: KOOK Bot token for bot *
   - `default_platform*` (Optional): Default Platform for Bot *
   - `n_*`: configs for Netease Music
   - `b_*`: configs for Bilibili
   - `qq_enable`: ~1~ or ~0~
   - `q_*`: configs for QQ Music
   - `schedule_*`: configs for scheduler(refer to the template)

3. 启动

```shell
./run.bat
```

---



## Linux下部署

Linux下部署，各系统具体基础环境有差异，这里以阿里云centos7.9为例。

#### 前置环境

1. 安装Python3.10、nodejs、pip、yarn等前置环境

   ```shell
   yum install -y python3.10  //必须安装3.10版本，如未能成功安装，请自行搜索安装python3.10
   yum install -y pip
   yum install -y nodejs
   
    curl -sL https://dl.yarnpkg.com/rpm/yarn.repo -o /etc/yum.repos.d/yarn.repo
    
    yum install -y yarn
   ```

2. 手动编译安装FFmpeg、libopus、libzmq（ffmpeg库不自带opus编码器和zmq，需手动编译安装）

   * libops 

     ```shell
     wget https://archive.mozilla.org/pub/opus/opus-1.3.1.tar.gz
          
        tar xzvf opus-1.3.1.tar.gz  
        
        cd opus-1.3.1  
        
        ./configure  
        
        make && make install  
     ```

   * libzmq

     ```shell
     wget https://github.com/zeromq/libzmq/releases/download/v4.3.4/zeromq-4.3.4.tar.gz
     
       tar xzvf zeromq-4.3.4.tar.gz
       
       cd zeromq-4.3.4
       
       ./configure
       
       make && make install
     ```

   * ffmpeg

     ```shell
     wget http://www.ffmpeg.org/releases/ffmpeg-4.3.2.tar.gz
     
         tar -xvf ffmpeg-4.3.2.tar.gz
     
         cd ffmpeg-4.3.2/
     
         ./configure --enable-libopus --enable-libzmq
     
         make && make install
     ```

   * 下载咪咕、QQ音乐、网易云所需环境
   切换到对应的目录`NeteaseCloudMusicApi`   `QQMusicApi`  ` MiguMusicApi`,执行`yarn install`

     ```shell
     cd NeteaseCloudMusicApi
     yarn install
     
     cd QQMusicApi
     yarn install
     
     cd MiguMusicApi
     yarn install
     ```


#### 启动

1. 修改`config.json`文件,完善各平台cookie(可选)，默认网易云平台可不用修改
2. 启动`./run.sh`


---
备注：
1. 如出现`ERROR: opus not found using pkg-config`的报错，输入`PKG_CONFIG_PATH="/usr/local/lib/pkgconfig"`然后再继续。

