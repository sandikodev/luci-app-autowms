#
# Copyright (C) 2020-2027 kopikonfig.com <androxoss@hotmail.com>
#
# This is free software, licensed under the GPL and kopikonfig License, Version 2.0 .
#

include $(TOPDIR)/rules.mk

LUCI_TITLE:=LuCI App for Autowms/seamless support
LUCI_DEPENDS:=+openssl-util +libwolfssl24 +libustream-wolfssl20150806
LUCI_PKGARCH:=all

PKG_LICENSE:=GPLv2
PKG_VERSION:=1.1.20200804
PKG_RELEASE:=1
PKG_MAINTAINER:=Sandiko <androxoss@hotmail.com>

include ../../luci.mk

# call BuildPackage - OpenWrt buildroot signature
