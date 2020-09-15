#!/bin/sh
. /lib/functions.sh

PIDFILE="/var/run/autowms/autowms.pid"
AUTOWMS_SDIR="/var/run/autowms"
AUTOWMS_SLOG="$AUTOWMS_SDIR/autowms.log"
AUTOWMS_PIPE="$AUTOWMS_SDIR/autowms.pipe"

msgMS="Wejengan: harus diisi!!"	#bingung mau kasi jadi msg sblh mana >:( 
msgIN="mohon aktifkan salah satu"
msgER="Wejengan: maaf ada yang error. selengkapnya, Hubungi Pengembang"

depend_list="libwolfssl24 libustream-wolfssl20150806 openssl-util"


#$active_user diganti $awmsAktif
#$cek_sek diganti $awmsEnable
getSistem="ubus call autowms.sistem getSistem.status"
getNetwork="ubus call luci-rpc getNetworkDevices"
getAkun="ubus call autowms.akun getAkun"
eval `$getSistem | jsonfilter -e 'awmsEnable=@.status.enabled'`
eval `$getSistem | jsonfilter -e 'awmsAktif=@.status.aktif'`
awmsAkun="$getAkun | jsonfilter -e "@.akun.$awmsAktif""



resolv_depend(){
	if ! command -v openssl &> /dev/null; then
		echo "depend's required did't installed yet"
		echo "try resolving | make sure connection is ok"
		echo "==============================[ update and install ]"
		opkg update
		opkg install $depend_list
		echo "done complete"
	fi
}

resolv_uci(){
	#recomend run each reboot
	if [ $(uci show autowms.status | wc -l) -eq 7 ]; then
		echo "====================[ system uci already installed ]"
	else
		uci set autowms.status=sistem &&\
		#uci set autowms.status.running='0' &&\
		#uci set autowms.status.register='0' &&\
		#uci set autowms.status.routerid='default' &&\
		#uci set autowms.status.keypatch='blank' &&\
		#uci set autowms.status.aktif='' &&\
		#uci set autowms.status.enabled='0' &&\
		uci commit &&\
		echo "==================================[ COMMIT SUCCESS ]"
	fi
}

fetch_all_user(){
	i=0; while [ $i -le $(($cek_sek-1)) ]; do
		arGet="autowms.@["$i"]"
		echo "$(uci show $arGet)"
		i=$(($i+1))
	done
}

user_info(){
	fill_msgIN(){
		akunCron=$msgIN
		akunNote=$msgIN
		akunUser=$msgIN
		akunPass=$msgIN
		akunGwid=$msgIN
		akunWlid=$msgIN
		akunWlid1=$msgIN
		akunCeklink=$msgIN
		akunLinkwms=$msgIN
		akunKey=$msgIN
	}

	akunKey=$(openssl rand -hex 2)

	if [[ $awmsEnable -eq 1 && ! -z $awmsAktif ]];then
		eval `eval $awmsAkun | jsonfilter -e "akunCron=@.cron"`
		eval `eval $awmsAkun | jsonfilter -e "akunNote=@.note"`
		eval `eval $awmsAkun | jsonfilter -e "akunUser=@.user"`
		eval `eval $awmsAkun | jsonfilter -e "akunPass=@.pass"`

		if [ ! -z `printf $awmsAktif | grep premium` ];then
			eval `eval $awmsAkun | jsonfilter -e "akunCeklink=@.ceklink"`
			eval `eval $awmsAkun | jsonfilter -e "akunLinkwms=@.linkwms"`

		elif [ ! -z `printf $awmsAktif | grep regular` ];then
			eval `eval $awmsAkun | jsonfilter -e "akunGwid=@.gwid"`
			eval `eval $awmsAkun | jsonfilter -e "akunWlid=@.wlid"`
			eval `eval $awmsAkun | jsonfilter -e "akunWlid1=@.wlid1"`
		fi
		TIMELOAD=$((60*60*$akunCron))
	elif [[ $awmsEnable -eq 0 || -z $awmsAktif ]];then
		fill_msgIN
		echo "=======================================[ ERROR COK ]"	
		echo "Wejengan: "$msgIN""
		echo 
	else
		echo $msgER 1>&2
	fi
}

network_info(){
	if [[ `ifconfig | grep -B2 eth0 | wc -l` -ne 0 ]];then
		IFACE_WAN="eth0"
		IPLAN=$(ifconfig | grep -A 2 $IFACE_WAN | awk '/inet addr/{print substr($2,6)}')
		MAC=$(ifconfig | grep -A 1 $IFACE_WAN | awk '/^[a-z]/ { mac=$NF; next } /inet addr:/ { print mac }')
	elif [[ `ifconfig | grep -B2 wlan0 | wc -l` -ne 0 ]];then
		IFACE_WAN="wlan0"
		IPLAN=$(ifconfig | grep -A 2 $IFACE_WAN | awk '/inet addr/{print substr($2,6)}')
		MAC=$(ifconfig | grep -A 1 $IFACE_WAN | awk '/^[a-z]/ { mac=$NF; next } /inet addr:/ { print mac }')
	else
		echo $msgER 1>&2
	fi
}

ping_internet(){
	TESTPING=`ping -c1 1.1.1.1 2>&1 | grep 100%`
}

update_runner(){

	runStat=$(uci get autowms.status.running)
	ping_internet
	if [ ! -z $TESTPING ]; then
		#jika isi/kurangdari 100%, maka network bermasalah
		#recomend dilakukan perestartan sistem otomatis

		uci set autowms.status.running=0 && uci commit
		runStat="AutoWMS Disconnect"
		
		#beta - smoga tidak bermasalah
		restart_koneksi
	else
		#jika kosong, maka tidak ada masalah

		uci set autowms.status.running=1 && uci commit
		runStat="AutoWMS Connected"
		
	fi
}

restart_koneksi(){
	echo  1>&2
	echo "================================[  restarting wwan ]" 1>&2
	echo "Try attempting to restart." 1>&2
	ifup wwan && echo "interface berhasil di restart" &&\
	sleep 5 && cek_koneksi || echo "interface gagal di restart." 1>&2
}

cek_koneksi(){
	echo "================================[ connection check ]" 1>&2
	ping_internet
	if [ ! -z "$TESTPING" ]; then
		restart_koneksi	
	else
		IPWAN=$(wget --timeout=5 "http://ipinfo.io/ip" -qO - )
		echo "Selamat, koneksi baik"
		echo "public GW: "$IPWAN
		echo "================================[ connection is ok ]"
	fi
}


get_info(){
	echo
	echo "========================================[ get info ]"
	network_info
	user_info
	echo user: $akunUser
	echo pass: $akunPass
	echo gwid: $akunGwid
	echo cron: "$akunCron"jam atau "$TIMELOAD"sekon
	echo MAC: $MAC
}

resolv_all(){
	if [ ! -d $AUTOWMS_SDIR ];then
		mkdir $AUTOWMS_SDIR &&\
		echo "============================[ autowms dir resolved ]"
	elif [ ! -f /etc/config/autowms ];then
		touch /etc/config/autowms &&\
		echo "==========================[ touch autowms complete ]"
	else
		echo "=============================[ autowms dir already ]"
	fi
	resolv_uci
	resolv_depend
}

autowms_connect(){
	echo
	echo "==========[ A U T O W M S__C O N N E C T ]=========="
	get_info
	if [[ $awmsEnable -eq 0 || -z $awmsAktif ]]; then
		echo 1>&2
		echo "further'more, sandiko <androxoss@hotmail.com>" 1>&2
		echo "https://github.com/mh4nx7net kopikonfig.com" 1>&2
	elif [[ $awmsEnable -eq 1 && ! -z $awmsAktif ]]; then
		wmsPOST="username=$akunUser.$akunKey@freeMS&password=$akunPass"
		wmsURI="https://welcome2.wifi.id/wms/auth/authnew/autologin/quarantine.php?ipc=$IPLAN&gw_id=$akunGwid&mac=$MAC&redirect=&wlan=$akunWlid/$akunWlid1"
		wget --post-data="$wmsPOST" "$wmsURI" -O /dev/null && echo "WGET REQUEST CONNECTED"
	else
		echo $msgER 1>&2
	fi
}
