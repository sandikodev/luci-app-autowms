module("luci.controller.autowms", package.seeall)

sys = require "luci.sys"
ut = require "luci.util"


function index()
	local page
        if not nixio.fs.access("/etc/config/autowms") then
                return
        end

	entry({"admin","autowms"},alias("admin","autowms","beranda"),_("seamless/Autowms"))
	--entry({"admin","autowms","beranda"},cbi("autowms/mainconfig"),_("Beranda"),50).leaf = true
	--entry({"admin","autowms","beranda"},template("autowms/a0.autowms_main"),_("Beranda"),50).leaf = true
	--entry({"admin","autowms","tentang"},template("autowms/b0.autowms_tentang"),_("Tentang"), 60).leaf = true

	entry({"admin","autowms","informasi"},call("autowms_info"))
	
	page = node("admin", "autowms", "beranda") --menu located
	page.target = view("autowms/utama") --url located
	page.title  = _("Beranda") --title named
	page.order  = 10 --order sequence
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
