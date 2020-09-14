#!/bin/sh
. /lib/functions.sh
. /usr/share/libubox/jshn.sh

sistemAktif=`ubus call autowms.sistem getSistem | jsonfilter -e "@.sistem.aktif"`
listAkun="'`ubus call autowms.akun getAkun | jsonfilter -e "@.akun"`'"

json_init
json_load $listAkun
json_dump
