-- Copyright 2008 Steven Barth <steven@midlink.org>
-- Licensed to the public under the Apache License 2.0.

local wa = require "luci.tools.webadmin"
local fs = require "nixio.fs"
local uci = require "luci.model.uci" 


map_autowms = Map("autowms", translate("Auto WMS"), "proyek embuh.. intine ngono")

sec_info = map_autowms:section(NamedSection,"akun","akun")
sec_info.addremove=true
sec_info:option(Button,"btN","btn")
lisval_coba = sec_info:option(ListValue, "xxx", "whatever");         
map_autowms.uci:foreach("autowms","akun",                            
        function(i)                                                  
                lisval_coba:value(i['.name'], i['.name'])            
        end)    

--sec_info = map_autowms:section(TypedSection, "info", translate("INFO / Registered"))
--sec_info.addremove=true



sec_regis = map_autowms:section(TypedSection, "akun",translate("DAFTAR / Register"),translate("masukan akun aktif"))
sec_regis.anonymous = true
                                            
sec_regis.addremove = true                                                                                                                                                  

enab = sec_regis:option(Flag, "enabled", translate("Aktif"))
enab.rmempty = false
note = sec_regis:option(Value, "note", translate("Inisial"))
user = sec_regis:option(Value, "user", translate("Username"))
pass = sec_regis:option(Value, "pass", translate("Password"))
gwid = sec_regis:option(Value, "gwid", translate("GatewayID"))
wlid = sec_regis:option(Value, "wlid", translate("Wlan ID"))
wlid1 = sec_regis:option(Value, "wlid1", translate("Wlan ID-1"))
cron = sec_regis:option(MultiValue, "cron", translate("Cron"))
cron:value("6","6 Jam")
cron:value("8","8 Jam")
cron:value("12","12 Jam")
cron:value("24","24 Jam")

return map_autowms
