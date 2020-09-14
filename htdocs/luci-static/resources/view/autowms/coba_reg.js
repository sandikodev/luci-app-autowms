'use strict';
'require view';
'require form';
'require uci';
'require dom';
'require rpc';
'require autowmss';
function count_changes(section_id) {
        var changes = ui.changes.changes, n = 0;

        if (!L.isObject(changes))
                return n;

        if (Array.isArray(changes.network))
                for (var i = 0; i < changes.network.length; i++)
                        n += (changes.network[i][1] == section_id);

        if (Array.isArray(changes.dhcp))
                for (var i = 0; i < changes.dhcp.length; i++)
                        n += (changes.dhcp[i][1] == section_id);
        return n;
}

function render_iface(dev, alias) {
        var type = dev ? dev.getType() : 'ethernet',
            up   = dev ? dev.isUp() : false;

        return E('span', { class: 'cbi-tooltip-container' }, [
                E('img', { 'class' : 'middle', 'src': L.resource('icons/%s%s.png').format(
                        alias ? 'alias' : type,
                        up ? '' : '_disabled') }),
                E('span', { 'class': 'cbi-tooltip ifacebadge large' }, [
                        E('img', { 'src': L.resource('icons/%s%s.png').format(
                                type, up ? '' : '_disabled') }),
                        L.itemlist(E('span', { 'class': 'left' }), [
                                _('Type'),      dev ? dev.getTypeI18n() : null,
                                _('Device'),    dev ? dev.getName() : _('Not present'),
                                _('Connected'), up ? _('yes') : _('no'),
                                _('MAC'),       dev ? dev.getMAC() : null,
                                _('RX'),        dev ? '%.2mB (%d %s)'.format(dev.getRXBytes(), dev.getRXPackets(), _('Pkts.')) : null,
                                _('TX'),        dev ? '%.2mB (%d %s)'.format(dev.getTXBytes(), dev.getTXPackets(), _('Pkts.')) : null
                        ])
                ])
        ]);
}

function render_status(node, ifc, with_device) {
        var desc = null, c = [];

        if (ifc.isDynamic())
                desc = _('Virtual dynamic interface');
        else if (ifc.isAlias())
                desc = _('Alias Interface');
        else if (!uci.get('network', ifc.getName()))
                return L.itemlist(node, [
                        null, E('em', _('Interface is marked for deletion'))
                ]);

        var i18n = ifc.getI18n();
        if (i18n)
                desc = desc ? '%s (%s)'.format(desc, i18n) : i18n;

        var changecount = with_device ? 0 : count_changes(ifc.getName()),
            ipaddrs = changecount ? [] : ifc.getIPAddrs(),
            ip6addrs = changecount ? [] : ifc.getIP6Addrs(),
            errors = ifc.getErrors(),
            maindev = ifc.getL3Device() || ifc.getDevice(),
            macaddr = maindev ? maindev.getMAC() : null;

        return L.itemlist(node, [
                _('Protocol'), with_device ? null : (desc || '?'),
                _('Device'),   with_device ? (maindev ? maindev.getShortName() : E('em', _('Not present'))) : null,
                _('Uptime'),   (!changecount && ifc.isUp()) ? '%t'.format(ifc.getUptime()) : null,
                _('MAC'),      (!changecount && !ifc.isDynamic() && !ifc.isAlias() && macaddr) ? macaddr : null,
                _('RX'),       (!changecount && !ifc.isDynamic() && !ifc.isAlias() && maindev) ? '%.2mB (%d %s)'.format(maindev.getRXBytes(), maindev.getRXPackets(), _('Pkts.')) : null,
                _('TX'),       (!changecount && !ifc.isDynamic() && !ifc.isAlias() && maindev) ? '%.2mB (%d %s)'.format(maindev.getTXBytes(), maindev.getTXPackets(), _('Pkts.')) : null,
                _('IPv4'),     ipaddrs[0],
                _('IPv4'),     ipaddrs[1],
                _('IPv4'),     ipaddrs[2],
                _('IPv4'),     ipaddrs[3],
                _('IPv4'),     ipaddrs[4],
                _('IPv6'),     ip6addrs[0],
                _('IPv6'),     ip6addrs[1],
                _('IPv6'),     ip6addrs[2],
                _('IPv6'),     ip6addrs[3],
                _('IPv6'),     ip6addrs[4],
                _('IPv6'),     ip6addrs[5],
                _('IPv6'),     ip6addrs[6],
                _('IPv6'),     ip6addrs[7],
                _('IPv6'),     ip6addrs[8],
                _('IPv6'),     ip6addrs[9],
                _('IPv6-PD'),  changecount ? null : ifc.getIP6Prefix(),
                _('Information'), with_device ? null : (ifc.get('auto') != '0' ? null : _('Not started on boot')),
                _('Error'),    errors ? errors[0] : null,
                _('Error'),    errors ? errors[1] : null,
                _('Error'),    errors ? errors[2] : null,
                _('Error'),    errors ? errors[3] : null,
                _('Error'),    errors ? errors[4] : null,
                null, changecount ? E('a', {
                        href: '#',
                        click: L.bind(ui.changes.displayChanges, ui.changes)
                }, _('Interface has %d pending changes').format(changecount)) : null
        ]);
}

function render_modal_status(node, ifc) {
        var dev = ifc ? (ifc.getDevice() || ifc.getL3Device() || ifc.getL3Device()) : null;

        dom.content(node, [
                E('img', {
                        'src': L.resource('icons/%s%s.png').format(dev ? dev.getType() : 'ethernet', (dev && dev.isUp()) ? '' : '_disabled'),
                        'title': dev ? dev.getTypeI18n() : _('Not present')
                }),
                ifc ? render_status(E('span'), ifc, true) : E('em', _('Interface not present or not connected yet.'))
        ]);

        return node;
}


function render_ifacebox_status(node, ifc) {
        var dev = ifc.getL3Device() || ifc.getDevice(),
            subdevs = ifc.getDevices(),
            c = [ render_iface(dev, ifc.isAlias()) ];

        if (subdevs && subdevs.length) {
                var sifs = [ ' (' ];

                for (var j = 0; j < subdevs.length; j++)
                        sifs.push(render_iface(subdevs[j]));

                sifs.push(')');

                c.push(E('span', {}, sifs));
        }

        c.push(E('br'));
        c.push(E('small', {}, ifc.isAlias() ? _('Alias of "%s"').format(ifc.isAlias())
                                            : (dev ? dev.getName() : E('em', _('Not present')))));

        dom.content(node, c);

        return firewall.getZoneByNetwork(ifc.getName()).then(L.bind(function(zone) {
                this.style.backgroundColor = zone ? zone.getColor() : '#EEEEEE';
                this.title = zone ? _('Part of zone %q').format(zone.getName()) : _('No zone assigned');
        }, node.previousElementSibling));
}


return view.extend({
	awms_akun: rpc.declare({
		object: 'autowms.akun',
		method: 'getAkun'
	}),
	readSysInfo: rpc.declare({
		object: 'autowms.sistem',
		method: 'getSistem'
	}),
	awms_sistemStatus: rpc.declare({
		object: 'autowms.sistem',
		method: 'getSistem.status'
	}),
	awms_sistemFamily: rpc.declare({
		object: 'autowms.sistem',
		method: 'getSistem.family'
	}),


	poll_status: function(map, akuns) {
		for (var i = 0; i < akuns.length; i++) {
			var awmsAkun = akuns[i],
				row = map.querySelector('.cbi-section-table-row[data-sid="%s"]'.format(awmsAkun.getName()));
			//males nerusin, besok aja klo bner2 kepake
		}
	},
	load: function() {
		return Promise.all([
			uci.load('autowms')
		]);
		/*
		return this.awms_sistemStatus().then(function(memory){
			console.log(memory)
		});
		*/
	},
	render: function(data) {
		var mapReg, secReg, opAkun, mStat, opStat, secStat;
		mapReg = new form.Map('autowms');
		secStat = mapReg.section(form.NamedSection, 'coba');
		opStat = secStat.option(form.DummyValue, 'jajal');
		/*
		opStat.textvalue = function(jajal){
			var node0 = E('div',
				{ 'class':'ifacebox'},
				[
					E('div',
						{ 'title':jajal }
					)
				]);
			return node0
		};*/

		secReg = mapReg.section(form.GridSection, 'akun', _('Registered'));
		secReg.addremove = true;
		secReg.anonymous = true;
		secReg.sortable = true;
		secReg.addbtntitle = _('tambahkan akun...');
		var section_id= "cfg0216f4";
		//untuk title opsi proto
		/*
		secReg.modaltitle = function(section_id){
			return this.networks.map(function(n) { return n.getName() });
			//return _("konfigurasi >> ")+section_id.toUpperCase();
		};*/
		console.log(data);
		opAkun = secReg.option(form.DummyValue, '_akunrunning');
		opAkun.modalonly = false;
		opAkun.textvalue = function(section_id) {
			var node0 = E('div',
				{ 'class': 'ifacebox' },
				[
					E('div', {
						'class': 'ifacebox-head',
						'style': 'background-color:%s'.format(true ? '#FFF000' : '#EEEEEE'),
						'title': true ? _('Part of zone %q').format("coba") : _('No zone assigned')
					},
						E('strong', "sek")),
						E('div', {
							'class': 'ifacebox-body',
							'id': '%s-ifc-devices'.format(section_id),
							'data-network': section_id
						}, [
							E('img', {
								'src': L.resource('icons/ethernet_disabled.png'),
								'style': 'width:16px; height:16px'
							}),
							E('br'),
							E('small', '?')
						])
				]);

			var node = E('div', { 'id': '%s-akun-running'.format(section_id), 'class': 'ifacebadge large' });
			function okjal(node){
				dom.content(node, [
					E('img', {
						'src': L.resource('icons/%s%s.png').format("your","image"),
						'title': uci.get('autowms', section_id, 'note')
					}),
					//false ? E('span') : E('en',_('akun not present nor connected yet.'))
				]);
				return node;
			}

			okjal(node);
			return node;
		};

		opAkun = secReg.option(form.DummyValue, '_akunstat');
		opAkun.modalonly = false;
		opAkun.textvalue = function(section_id) {
			var node = E('div', { 'id': '%s-akun-status'.format(section_id) });
			function cobagan(node){
				return L.itemlist(node, [
					_('Username'),      true ? uci.get('autowms', section_id, 'user') :"",
					_('Password'),    true ? uci.get('autowms', section_id, 'pass') : "bisa",
					_('Gateway ID'), true ? uci.get('autowms', section_id, 'gwid') : "bisa",
					_('Wireless ID'),       true ? uci.get('autowms', section_id, 'wlid') : "bisa",
					_('Wireless1 ID'),       true ? uci.get('autowms', section_id, 'wlid1') : "bisa",
					_('Cron'),       true ? uci.get('autowms', section_id, 'cron') : "bisa"
				])
			};
			cobagan(node);
			return node;

		};


		opAkun = secReg.option(form.Value, 'note', _('initial'));
		opAkun.rmempty = true;
		opAkun = secReg.option(form.Value, 'user', _('username'));
		opAkun.datatype = 'username';
		opAkun.rmempty = true;
		opAkun = secReg.option(form.Value, 'pass', _('password'));
		opAkun.datatype = 'password';
		opAkun.rmempty = true;
		opAkun = secReg.option(form.Value, 'gwid', _('gateway ID'));
		opAkun.rmempty = true;
		opAkun = secReg.option(form.Value, 'wlid', _('Wireless ID'));
		opAkun.rmempty = true;
		opAkun = secReg.option(form.Value, 'wlid1', _('Wireless-1 ID'));
		opAkun.rmempty = true;
		opAkun = secReg.option(form.ListValue, 'cron', _('Cron'));
		opAkun.value('6', _("6 Jam"));
		opAkun.value('8', _("8 Jam"));
		opAkun.value('12', _("12 Jam"));
		opAkun.value('24', _("24 Jam"));
		/*
		*/
		return mapReg.render();
	}
});

