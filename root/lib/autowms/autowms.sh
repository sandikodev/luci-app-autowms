#!/bin/sh
. /lib/functions.sh

PIDFILE="/var/run/autowms/autowms.pid"
AUTOWMS_SDIR="/var/run/autowms"
AUTOWMS_SLOG="$AUTOWMS_SDIR/autowms.log"
AUTOWMS_PIPE="$AUTOWMS_SDIR/autowms.pipe"

msgMS="Wejengan: harus diisi!!"	#bingung mau kasi jadi msg sblh mana >:( 
msgIN="mohon aktifkan salah satu"
msgER="Wejengan: maaf ada yang error. selengkapnya, Hubungi Pengembang"

active_user=$(uci show autowms | grep "].enabled='1" | awk -F'.' '{print $2}')
cek_sek=$(echo "$active_user" | wc -l)
depend_list="libwolfssl24 libustream-wolfssl20150806 openssl-util"

msgUciKosong="uci: Entry not found"











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
	KEY=$(openssl rand -hex 2)
	active_user=$(uci show autowms | grep "].enabled='1" | awk -F'.' '{print $2}')
	cek_sek=$(echo "$active_user" | wc -l)
	fill_msgIN(){
		        USER=$msgIN
                        PASS=$msgIN                                                                               
                        GWID=$msgIN                                                                         
                        WLID=$msgIN                                                                               
                        WLID1=$msgIN                                                                       
                        NOTE=$msgIN                                                                               
                        CRON=$msgIN                                                                                                            
                        KEY=$msgIN
	}
	if [[ -z "$active_user" || $cek_sek -ge 2 ]]; then
		
		fill_msgIN
		echo "=======================================[ ERROR COK ]"	
		echo "Wejengan: "$msgIN""
		echo 

	elif [ $cek_sek -eq 1 ]; then
		getval="uci get autowms.$active_user"
		for check in $(uci show autowms.$active_user | awk -vFS="[.|=]" '{print $3}'); do
			case $check in
				user) USER=$(echo `$getval.user`);;
				pass) PASS=$(echo `$getval.pass`);;
				gwid) GWID=$(echo `$getval.gwid`);;
				wlid) WLID=$(echo `$getval.wlid`);;
				wlid1) WLID1=$(echo `$getval.wlid1`);;
				note) NOTE=$(echo `$getval.note`);;
				cron) CRON=$(echo `$getval.cron`);;
			esac
		done
		TIMELOAD=$((60*60*$CRON))
	else
		echo $msgER 1>&2
	fi
}

network_info(){
	#changeme sesuai mac yang kamu mau pake
	IFACE_WAN="wlan0"
	IPLAN=$(ifconfig | grep -A 2 $IFACE_WAN | awk '/inet addr/{print substr($2,6)}')
	MAC=$(ifconfig | grep -A 1 $IFACE_WAN | awk '/^[a-z]/ { mac=$NF; next } /inet addr:/ { print mac }')
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
	echo user: $USER
	echo pass: $PASS
	echo gwid: $GWID
	echo cron: "$CRON"jam atau "$TIMELOAD"sekon
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
	if [[ -z "$active_user" || $cek_sek -ge 2 ]]; then
		echo 1>&2
		echo "further'more, sandiko <androxoss@hotmail.com>" 1>&2
		echo "https://github.com/mh4nx7net kopikonfig.com" 1>&2
	elif [ $cek_sek -eq 1 ]; then
		wmsPOST="username=$USER.$KEY@freeMS&password=$PASS"
		wmsURI="https://welcome2.wifi.id/wms/auth/authnew/autologin/quarantine.php?ipc=$IPLAN&gw_id=$GWID&mac=$MAC&redirect=&wlan=$WLID/$WLID1"
		wget --post-data="$wmsPOST" "$wmsURI" -O /dev/null && echo "WGET REQUEST CONNECTED"
	else
		echo $msgER 1>&2
	fi
}
