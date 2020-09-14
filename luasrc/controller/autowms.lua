module("luci.controller.autowms", package.seeall)

sys = require "luci.sys"
ut = require "luci.util"


function index()
	local page
        if not nixio.fs.access("/etc/config/autowms") then
                return
        end

	entry({"admin","autowms"},alias("admin","autowms","beranda"),_("Auto WMS"))
	entry({"admin","autowms","beranda"},cbi("autowms/mainconfig"),_("Beranda"),50).leaf = true
	--entry({"admin","autowms","beranda"},template("autowms/a0.autowms_main"),_("Beranda"),50).leaf = true
	entry({"admin","autowms","tentang"},template("autowms/b0.autowms_tentang"),_("Tentang"), 60).leaf = true

	entry({"admin","autowms","informasi"},call("autowms_info"))
	
	page = node("admin", "autowms", "host") --menu located
        page.target = view("network/hosts") --url located
        page.title  = _("Hostnames") --title named
        page.order  = 10 --order sequence

	page = node("admin", "autowms", "coba_reg") --menu located
	page.target = view("autowms/coba_reg") --url located
	page.title  = _("form reg") --title named
	page.order  = 20 --order sequence
	
	page = node("admin", "autowms", "embuh") --menu located
	page.target = view("autowms/embuh") --url located
	page.title  = _("embuh") --title named
	page.order  = 20 --order sequence

	page = node("admin", "autowms", "network") --menu located
	page.target = view("network/coba") --url located
	page.title  = _("network") --title named
	page.order  = 20 --order sequence


	entry({"admin","autowms","jal"},template("autowms/coba"),_("cobacoba"))
end


function autowms_info()
	local dumpApiAwms , apiAwmsSistem, apiAwmsAkun = {}, ut.ubus("autowms.sistem", "getSistem", {}), ut.ubus("autowms.akun", "getAkun", {})
	dumpApiAwms["sistem"] = apiAwmsSistem["sistem"]
	dumpApiAwms["akun"] = apiAwmsAkun["akun"]

	luci.http.prepare_content("application/json")
	if (apiAwmsSistem ~= nil and apiAwmsAkun ~= nil) then
		luci.http.write_json(dumpApiAwms)
		--luci.http.write_json({})
	else
		luci.http.write_json({"ada yang bermasalah kayae"})
	end
end
