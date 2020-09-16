<h2 align="center">
 <img src="https://raw.githubusercontent.com/mh4nx7net/luci-app-autowms/master/preview/preview1.png" alt="Clash" width="600">
  <br>Luci App For Autowms<br>Seamless autologin<br>
</h2>

  <p align="center">
  a simple Openwrt LuCI app for managing autowms portal profile
  <p align="center">
  <a target="_blank" href="https://github.com/mh4nx7net/luci-app-autowms">
    <img src="https://img.shields.io/badge/LuCIautowms-v1.1-blue.svg"> 	  
  </a>
  <a href="https://github.com/mh4nx7net/luci-app-autowms/releases" target="_blank">
        <img src="https://img.shields.io/github/downloads/mh4nx7net/luci-app-autowms/total.svg?style=flat-square"/>
   </a>
  </p>
  
  ## Install
- Upload ipk file to tmp folder
- cd /tmp
- opkg update
- opkg install luci-app-autowms_v1.1_all.ipk
- opkg install luci-app-autowms_v1.1_all.ipk --force-depends

 ## Uninstall
- opkg remove luci-app-autowms
- opkg remove luci-app-autowms --force-remove

## Features
- Regular: ✅ autowms ✅ cron scheduler ✅ free support ✅ sistem status
- Premium: ✔️ any regular ✔️ simple add akun ✔️ key sharing ✔️ full support

## Dependency
- openssl-util
- libwolfssl24
- libustream-wolfssl



## compile
---

 - Download [SDK](https://wiki.openwrt.org/doc/howto/obtain.firmware.sdk), and it's depends:
   ```bash
   sudo apt-get install gawk libncurses5-dev libz-dev zlib1g-dev  git ccache
   ```
 
 - Download your own SDK

   ```bash
   # Untar ar71xx platform
   tar xjf OpenWrt-SDK-15.05-ar71xx-generic_gcc-4.8-linaro_uClibc-0.9.33.2.Linux-x86_64.tar.bz2
   cd OpenWrt-SDK-*
   # update feeds
   ./scripts/feeds update packages
   # Clone
   git clone https://github.com/mh4nx7net/luci-app-autowms.git package/luci-app-autowms
   # select this package
   make menuconfig
     
   # Compile
    make package/luci-app-autowms/compile V=99
   ```
   
## License  
Luci App For Autowms - OpenWrt is released under the kopikonfig.com license
