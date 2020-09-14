'use strict';
'require fs';
'require ui';
'require rpc';
'require dom';
'require uci';
'require view';
'require form';
'require autowms';
var develAlert = function(msg="tambahkan pesan disini",head="C A U T I O N",headclass="alert-message warning",msg2=''){
	return E('div',{class:'autowms-status-table'},[
		E('div',{class:'ifacebox autowms-info',id:'autowms-info'},[
			E('div',{class:headclass},[
				E('strong',[head])
			]),
			E('div',{class:'ifacebox-body autowms-info'},[
				msg, E('br'), msg2 ? msg2 : ''
			]),E('br'),
			E('a',{href:'https://github.com/mh4nx7net/luci-app-autowms'},[
				E('button',{class:'cbi-button cbi-button-edit'},["SELENGKAPNYA"])
			]),E('br')
		])
	]);
};


var akunAutoTry = E('div',{class:'autowms-status-table'},[
	E('div',{class:'ifacebox autowms-info'},[
		E('button',{class:'ifacebox-head active', style:'height:40px',onclick:"L.autowms.wmsSlide2('autoAwms_demo')"},[
			E('strong',["KLIK UNTUK LIHAT DEMO"])
		]),
		E('br'),
		E('div',{class:'ifacebox-body autowms-info', style:'display:none', id:'autoAwms_demo'},[
			E('div',{class:'table'},[
				E('tr',[
					E('label',{class:'td right'},["USERNAME"]),
					E('input',{class:'td center',placeholder:'mh4nx7net'})
				]),
				E('tr',[
					E('label',{class:'td right'},["PASSWORD"]),
					E('input',{class:'td center',placeholder:'kangkopas'})
				]),
				E('tr',[
					E('label',{class:'td right'},["CRON"]),
					E('select',[
						E('option',['6 Jam']),
						E('option',['8 Jam']),
						E('option',['12 Jam']),
						E('option',['24 Jam'])
					])
				])
			])
		]),
	])
]);

var keyshareInfo = form.DummyValue.extend({
	renderWidget: function(){
		/*
		if(this.LoadData[0].akun.length != 0){
			var domEnd = E('div');

			var coba = function(data){
				for(i=0; i =< this.LoadData[0].akun.length; i++){
				}
			};

			domEnd.appendChild(develAlert('gunakan dengan bijak!','P E R H A T I A N ! !','ifacebox-head active','akun ilegal tidak diperkenankan'));
			return domEnd;

		}
		else{
			return develAlert("Berdonasi untuk turut aktif dalam Kontribusi?","BERSAMA DAPATKAN LAYANAN PREMIUM!!","ifacebox-head active",'buka tab "Tentang" atau hubungi "Kopikonfig.com');
		}
		*/
		var mapKeyshare, secKeyshare, optKeyshare;
		mapKeyshare = new form.Map('autowms');
		secKeyshare = mapKeyshare.section(form.TypedSection, 'sistem',null);
		secKeyshare.tab('akun',_('Akun'));
		secKeyshare.taboption('akun', awmsRegister,'_coba_');

		secKeyshare = mapKeyshare.section(form.GridSection, 'akun');
		secKeyshare.addremove = false;
		optKeyshare = secKeyshare.option(form.DummyValue, '_akunstat');
		optKeyshare.modalonly = false;
		optKeyshare.textvalue = function(section_id) {
			var node = E('div', { 'id': '%s-akun-status'.format(section_id) });
			function cobagan(node){
				return L.itemlist(node, [
					_('Username'),      true ? uci.get('autowms', section_id, 'user') :"kosong",
					_('Password'),    true ? uci.get('autowms', section_id, 'pass') : "kosong",
					_('Gateway ID'), true ? uci.get('autowms', section_id, 'gwid') : "kosong",
					_('Wireless ID'),       true ? uci.get('autowms', section_id, 'wlid') : "kosong",
					_('Wireless1 ID'),       true ? uci.get('autowms', section_id, 'wlid1') : "kosong",
					_('Cron'),       true ? uci.get('autowms', section_id, 'cron') : "kosong",
					_('LinkWMS'),       true ? String(uci.get('autowms', section_id, 'linkwms')).substr(null,28) : "kosong"
				])
			};
			cobagan(node);
			return node;
		};
		if(true){
			return E('div',["coba"]),mapKeyshare.render();
		}
	}
});

var guideInfo = form.DummyValue.extend({
	renderWidget: function(section_id, option_id, cfgvalue){
		return develAlert('FITUR INI MASIH DALAM PENGEMBANGAN');
	}
});
var awmsController = form.DummyValue.extend({
	renderWidget: function(section_id, option_id, cfgvalue){
		return E('div',{class:'autowms-status-table'},[
				E('div',{class:'awmsControl'},[
					E('button',{class:'cbi-button cbi-button-edit wmsbtn',onclick:"L.autowms.awmsCtrl('start')"},"START"),
					E('button',{class:'cbi-button cbi-button-neutral reconnect wmsbtn',onclick:"L.autowms.awmsCtrl('clearlogs')"},"CLEAR LOGS"),
					E('button',{class:'cbi-button cbi-button-remove wmsbtn',onclick:"L.autowms.awmsCtrl('stop')"},"STOP"),
				])
		]);
	}
});
var awmsRegister = form.DummyValue.extend({
	renderWidget: function(section_id, option_id, cfgvalue){
		return E('div',{class:'autowms-status-table'},[
				E('div',{class:'awmsControl'},[
					E('button',{class:'cbi-button cbi-button-edit wmsbtn',onclick:"alert('regular')"},"REGULAR"),
					E('button',{class:'cbi-button cbi-button-remove wmsbtn',onclick:"alert('premium')"},"PREMIUM"),
				])
		]);
	}
});


var aboutMemberInfo = form.DummyValue.extend({
	renderWidget: function(section_id, option_id, cfgvalue){
		return E('div',{class:'autowms-status-table'},[
			E('div',{class:'ifacebox autowms-info',id:'autowms-info'},[
				E('div',{class:'ifacebox-head active'},[
					E('strong',["K O N T R I B U S I ❤️"])
				]),
				E('div',{class:'ifacebox-body autowms-info'},[
					"donasi dari anda akan menjadi bagian dari kontribusi anda",
					E('br'),
					"kepada tool ini sehingga dapat digunakan scr bersama",
					E('br'),
					"dengan dukungan penuh",
					E('br'),
					E('br'),
					E('div', { id:'awms_buyme' },[
						E('button',{ onclick:"L.autowms.wmsSlide1('awmsBuymeInfo')"},[
							E('img', {
								'src': L.resource('icons/awms-ovologo.png'),
								'style': 'width:128px; height:128px'
							}),E('br'),
							E('i',["BUY ME A COFFE or TEACUP"]),E('br'),
							E('span',['"asal jangan starbak 😡 "'])
						])
					]),E('br'),
					E('div', { id:'awmsBuymeInfo'},[
						E('span',["RAQHNI SANDIKO"]), E('br'),
						E('span',["IG: @rsandi18"]), E('br'),
						E('span',["OVO: 0896-4924-6450"]), E('br'),
						E('span',["REK: DM/EMAIL/INBOX"]), E('br'),
						E('span',["SITE: KOPIKONFIG.COM"]), E('br'),
						E('span',["EMAIL: androxoss@hotmail.com"]),E('br'),E('br'),
						E('a',{href:'https://github.com/mh4nx7net/luci-app-autowms'},[
							E('button',{class:'cbi-button cbi-button-edit'},["SELENGKAPNYA"])
						]),E('br')
					]),
					E('div', { class:'table' },[
						E('div', { class:'tr' },[
							E('div', { class:'th center'},["REGULAR"]),
							E('div', { class:'th center'},["PREMIUM"])
						]),
						E('div', { class:'tr' },[
							E('div', { class:'td center' },[
									E('span',["✅ autowms"]), E('br'),
									E('span',["✅ cron scheduler"]), E('br'),
									E('span',["✅ free support"]), E('br'),
									E('span',["✅ sistem status"])
							]),
							E('div', { class:'td center' },[
									E('span',["✔️  any regular"]), E('br'),
									E('span',["✔️  simple add akun"]), E('br'),
									E('span',["✔️  key sharing"]), E('br'),
									E('span',["✔️  full support"])
							])
						]),

					])
				]),
			])
		]);

	}
});

function resolvData(LoadData, isAkunAlready){
	function uciCommit(){
		uci.save();
		uci.apply();
	}
	function awmsStart(){
		autowms.awmsCtrl('enable');
		autowms.awmsCtrl('start');
	}
	function awmsStop(){
		autowms.awmsCtrl('disable');
		autowms.awmsCtrl('stop');
	}
	var secSistem = uci.sections('autowms','sistem')[0];
	var secSistemAktif = secSistem.aktif;
	if(secSistem.enabled == 1 && secSistemAktif == null){
		if(isAkunAlready == 0)
			console.log('kosong, buat dan aktifkan akun');
		alert("pilih akun");
		uci.set('autowms','status','enabled',0);
		uciCommit();
		awmsStop();
	}
	else if(secSistemAktif != null && LoadData[0].akun[secSistemAktif] == null){
		uci.set('autowms','status','enabled',0);
		uci.set('autowms','status','aktif',null);
		uciCommit();
		awmsStop();
	}
	else if(secSistem.enabled == 1 && secSistemAktif != null && LoadData[4] != 'true'){
		awmsStart();
	}
	else if(secSistem.enabled != 1 && secSistemAktif == null && LoadData[4] == 'true'){
		awmsStop();
	}
}

function statusTable(dataAkun){
	var whatAktif = uci.get('autowms','status','aktif');
	var renderMe = whatAktif != null ? E('div',{class:'table'},[
		E('div',{class:'tr'},[
			E('div',{class:'td center'},["Catatan"]),
			E('div',{class:'td',id:'awms_note'},[dataAkun[whatAktif].note]),
		]),
		E('div',{class:'tr'},[
			E('div',{class:'td center'},["Restart/Cron"]),
			E('div',{class:'td',id:'awms_cron'},[dataAkun[whatAktif].cron]),
		]),
		E('div',{class:'tr'},[
			E('div',{class:'td center'},["Username"]),
			E('div',{class:'td',id:'awms_user'},[dataAkun[whatAktif].user]),
		]),
		E('div',{class:'tr'},[
			E('div',{class:'td center'},["Password"]),
			E('div',{class:'td',id:'awms_pass'},[dataAkun[whatAktif].pass]),
		]),
		E('div',{class:'tr'},[
			E('div',{class:'td center'},["Gateway ID"]),
			E('div',{class:'td',id:'awms_gwid'},[dataAkun[whatAktif].gwid]),
		]),
		E('div',{class:'tr'},[
			E('div',{class:'td center'},["Wireless ID"]),
			E('div',{class:'td',id:'awms_wlid'},[dataAkun[whatAktif].wlid]),
		]),
		E('div',{class:'tr'},[
			E('div',{class:'td center'},["Wireless ID-1"]),
			E('div',{class:'td',id:'awms_wlid1'},[dataAkun[whatAktif].wlid1]),
		])
		]) : E([],[
			E('div',{id:'awms_buyme'},[
				E('img', {
					'src': L.resource('icons/awms-kk1.png'),
					'style': 'width:380px'
				}),E('br'),E('br'),
				"Enable Service First !!"
			]),
			E('div',{class:'spinning'},[""])
		]);

	return E([],[
		E('div',{class:'autowms-status-table'},[
			E('div',{class:'ifacebox autowms-info',id:'autowms-info'},[
				E('div',{class:'ifacebox-head center active'},[
					E('strong',["AUTOWMS STATUS"])
				]),
				E('div',{class:'ifacebox-body autowms-info',id:'awms_enab'},[
					renderMe
				])
			])
		]), E('br')
	]);
}

return view.extend({
	load: function(){
		var fetchData = autowms.fetchData;
		fetchData.push(L.resolveDefault(fs.list(L.resource('view/autowms')), []).then(function(entries) {
			return Promise.all(entries.filter(function(e) {
				return (e.type == 'file' && e.name.match(/\.js$/));
			}).map(function(e) {
				return 'view.autowms.' + e.name.replace(/\.js$/, '');
			}).sort().map(function(n) {
				return L.require(n);
			}));
		}));
		return Promise.all(fetchData).catch((err) =>
			ui.addNotification(null, E('p', {}, _('Unable to fetch data: ' + err.message)))
		);
	},
	render: function(LoadData) {
		var isAkunAlready = uci.sections('autowms','akun').length;
		resolvData(LoadData, isAkunAlready);
		var mapAwms, mainReg,sub_mainReg, subsub, secReg;
		var isReg;
		var dataAkun = LoadData[0].akun;
		var loglines = LoadData[2].trim().split(/\n/).map(function(line) {
			return line.replace(/^<\d+>/, '');
		});
		console.log(dataAkun);
		mapAwms = new form.Map('autowms');
		mainReg = mapAwms.section(form.TypedSection,'sistem');
		mainReg.anonymous = true;
		mainReg.addremove = false;
		mainReg.tab('akun',_('Akun'));
		mainReg.tab('keyshare',_('KeySharing'));
		mainReg.tab('guide',_('Panduan'));
		mainReg.tab('about',_('Tentang'));
		mainReg.tab('logs',_('Logs'));
		if(isAkunAlready >= 1){
			mainReg.taboption('akun', awmsController, '__controller__');
			mainReg.taboption('akun',form.Flag, 'enabled',_('enable autowms')).optional=false;
			sub_mainReg = mainReg.taboption('akun',form.Value, 'aktif',_('gunakan akun'));
			sub_mainReg.optional = false;
			sub_mainReg.depends('enabled','1');
			sub_mainReg.placeholder = 'pilih salah satu [wajib]';
			L.sortedKeys(dataAkun).forEach(function(id) {
				sub_mainReg.value(id, '%s =>[%s]'.format(
					dataAkun[id].note, dataAkun[id].user
				));
			});
		}

		sub_mainReg = mainReg.taboption('akun', form.SectionValue, 'akun', form.GridSection, 'akun',_("Registered"));
		secReg = sub_mainReg.subsection;
		secReg.anonymous = true;
		secReg.addremove = true;
		secReg.sortable = true;
		secReg.addbtntitle = _('Tambahkan akun...');
		
		secReg.tab('manual', _('MANUAL'));
		secReg.tab('auto', _('AUTO'));
		secReg.modaltitle = function(section_id){
			return _('Konfigurasi untuk Akun ') + section_id.toUpperCase();
		}
		secReg.addModalOptions = function(s){
			if(isReg == 'regular' || /^(regular)/.test(s.section)){
				subsub = s.taboption('manual', form.Value, 'user', _('USERNAME'));
				subsub.placeholder = '44456674323';

				subsub = s.taboption('manual', form.Value, 'pass', _('PASSWORD'));
				subsub.placeholder = '66778904544';

				subsub = s.taboption('manual', form.Value, 'gwid', _('GATEWAY-ID'));
				subsub.placeholder = 'WAG-D2-JT';

				subsub = s.taboption('manual', form.Value, 'wlid', _('WIRELESS-ID'));
				subsub.placeholder = 'BKSKLB00173-N';

				subsub = s.taboption('manual', form.Value, 'wlid1', _('WIRELESS-ID1'));
				subsub.placeholder = 'TLK-CX-38906';

				subsub = s.taboption('manual', form.ListValue, 'cron', _('CRON'));
				subsub.value('6',_('6 Jam'));
				subsub.value('8',_('8 Jam'));
				subsub.value('12',_('12 Jam'));
				subsub.value('24',_('24 Jam'));

			}
			else if(isReg == 'premium' || /^(premium)/.test(s.section)){
				//check wheter is you registered?
				//subsub = modalSection.taboption('auto', akunAutoTry);

				subsub = s.taboption('auto', form.Value, 'user', _('USERNAME'));
				subsub.placeholder = '44456674323';

				subsub = s.taboption('auto', form.Value, 'pass', _('PASSWORD'));
				subsub.placeholder = '66778904544';
				
				subsub = s.taboption('auto', form.ListValue, 'cron', _('CRON'));
				subsub.value('6',_('6 Jam'));
				subsub.value('8',_('8 Jam'));
				subsub.value('12',_('12 Jam'));
				subsub.value('24',_('24 Jam'));

				subsub = s.taboption('auto', form.Flag, 'ceklink',_('Pastikan dengan Link?'));
				subsub.optional = false;
				subsub = s.taboption('auto', form.Value, 'linkwms',_('masukan link wms'));
				subsub.depends('ceklink','1');
				subsub.optional = false;
				subsub.placeholder = 'https://welcome2.wifi.id/wms/au...';
			}

			isReg = null;
		};

		/*
		secReg.renderUCISection =  function(section_id){
			//console.log(section_id,this,this.renderOptions);
			return this.renderOptions(null, section_id);
		};
		secReg.handleAdd = function(ev,name){
			var config_name = this.uciconfig || this.map.config,
				section_id = this.map.data.add(config_name, this.sectiontype, name);
			this.addedSection = section_id;
			return this.renderMoreOptionsModal(section_id);
		};
		*/
		secReg.handleAdd = function(ev){
			function bindForm(arg1){
				if(isAkunAlready == 0){
					return L.bind(mapAwms.children[0].children[0].subsection.renderMoreOptionsModal, mapAwms.children[0].children[0].subsection, arg1);
				}
				else if(isAkunAlready >= 1){
					return L.bind(mapAwms.children[0].children[3].subsection.renderMoreOptionsModal, mapAwms.children[0].children[3].subsection, arg1);
				}
			}


			var m2 = new form.Map('autowms'),
				s2 = m2.section(form.NamedSection, '_new_');
			s2.render = function(){
				return Promise.all([
					{},
					this.renderUCISection('_new_')
				]).then(this.renderContents.bind(this));
			};
			name = s2.option(form.Value, 'note', _('Inisial/Note'));
			name.rmempty = false;
			name.placeholder = 'bebas, ex:paijo';

			var register_switch = s2.option(form.Button, '_switch_register');
			register_switch.modalonly  = true;
			register_switch.title      = _('Lakukan secara manual?');
			register_switch.inputtitle = _('REGULAR');
			register_switch.inputstyle = 'apply';
			register_switch.onclick = L.bind(function(ev) {
				var nameval = name.isValid('_new_') ? 'regular_%s'.format(name.formvalue('_new_')): null;
				isReg = 'regular';
				if (nameval == null || nameval == '')
					return;
				mapAwms.save(function(){
					var section_id = uci.add('autowms','akun',nameval);
					uci.set('autowms',section_id,'note',name.formvalue('_new_'));
				}).then(bindForm(nameval));
			}, this);

			var register_switch = s2.option(form.Button, '_switch_register');
			register_switch.modalonly  = true;
			register_switch.title      = _('Coba yang lebih mudah?');
			register_switch.inputtitle = _('PREMIUM');
			register_switch.inputstyle = 'remove';
			register_switch.onclick = L.bind(function(ev) {
				var isPremium = uci.get('autowms','status','register');
				var nameval = name.isValid('_new_') ? 'premium_%s'.format(name.formvalue('_new_')): null;
				isReg = 'premium';
				if (nameval == null || nameval == '')
					return;
				if(isPremium == 1){
					mapAwms.save(function(){
						var section_id = uci.add('autowms','akun',nameval);
						uci.set('autowms',section_id,'note',name.formvalue('_new_'));
					}).then(bindForm(nameval));
				}
				else if(isPremium == 0 || isPremium == null || isPremium =='undefined'){
					ui.showModal(_('Tambahkan akun...'), [
						E('div', { 'class': 'right' }, [
							develAlert('mari berkontribusi dan aktifkan layanan Premium'),
							E('br'),
							akunAutoTry,
							E('button', {
								'class': 'btn',
								'click': ui.hideModal
							}, _('Cancel'))
						])
					], 'cbi-modal');
				}
			}, this);


			
			m2.render().then(L.bind(function(nodes){
				ui.showModal(_('choose services'), [
					nodes,
					E('div', { 'class': 'right' }, [
						nodes,
						E('button', {
							'class': 'btn',
							'click': ui.hideModal
						}, _('Cancel'))
					])
				], 'cbi-modal');
				nodes.querySelector('[id="%s"] input[type="text"]'.format(name.cbid('_new_'))).focus();
			}, this));
		};

		subsub = secReg.option(form.DummyValue, '_akunrunning');
		subsub.modalonly = false;
		subsub.textvalue = function(section_id) {
			var whatAktif = uci.get('autowms','status','aktif');
			var node = E('div',
				{ 'class': 'ifacebox' },
				[
					E('div', {
						'class': 'ifacebox-head',
						'style': 'background-color:%s; color: white'.format(/^(regular)/.test(section_id) ? '#0069d6' : '#ff0032'),
					},
						E('span', section_id)),
						E('div', {
							'class': 'ifacebox-body',
							'id': '%s-autowms'.format(section_id),
							'style': 'background-color:%s; color: white'.format(section_id == whatAktif ? /^(regular)/.test(section_id) ? '#78b5ff' : '#ff3333' : '#ffffff'),
							'data-autowms': section_id
						}, [
							E('img', {
								'src': L.resource('icons/tunnel%s.png'.format(section_id == whatAktif ? '':'_disabled' )),
								'style': 'width:16px; height:16px'
							}),
							E('br'),
							E('small', '%s'.format(section_id == whatAktif ? 'Enabled':''))
						])
				]);
			return node;
		};

		subsub = secReg.option(form.DummyValue, '_akunstat');
		subsub.modalonly = false;
		subsub.textvalue = function(section_id) {
			var node = E('div', { 'id': '%s-akun-status'.format(section_id) });
			var servData = [
				_('Cron'), dataAkun[section_id].cron != '' ? uci.get('autowms', section_id, 'cron') : "Mohon untuk dilengkapi!",
				_('Username'), dataAkun[section_id].user != '' ? uci.get('autowms', section_id, 'user') :"Mohon untuk dilengkapi!",
				_('Password'), dataAkun[section_id].pass != '' ? uci.get('autowms', section_id, 'pass') : "Mohon untuk dilengkapi!"
			];

			if(/^(regular)/.test(section_id)){
				servData.push(
					_('Gateway ID'), dataAkun[section_id].gwid != '' ? uci.get('autowms', section_id, 'gwid') : "Mohon untuk dilengkapi!",
					_('Wireless ID'), dataAkun[section_id].wlid != '' ? uci.get('autowms', section_id, 'wlid') : "Mohon untuk dilengkapi!",
					_('Wireless1 ID'), dataAkun[section_id].wlid1 != '' ? uci.get('autowms', section_id, 'wlid1') : "Mohon untuk dilengkapi!"
				);
			}
			else if(/^(premium)/.test(section_id)){
				servData.push(
					_('LinkWMS'), dataAkun[section_id].linkwms != '' ? String(uci.get('autowms', section_id, 'linkwms')).substr(null,28) : "Mohon untuk dilengkapi!"
				);
			}

			function cobagan(node){
			};

			return L.itemlist(node, servData)

		};
		sub_mainReg = mainReg.taboption('keyshare', keyshareInfo, '__keyshare__');
		sub_mainReg.load = function(){
			return Promise.all(autowms.fetchData).then(L.bind(function(data){
				this.LoadData = data;
			}, this));
		};

		sub_mainReg = mainReg.taboption('guide', guideInfo, '__guide__');
		sub_mainReg = mainReg.taboption('about', aboutMemberInfo, '__about__');
		mainReg.taboption('about',form.Flag, 'register', _('Premium')).optional=true;
			sub_mainReg = mainReg.taboption('about', form.Value, 'routerid', _('Router ID'));
			sub_mainReg.depends('register', '1');
			sub_mainReg.placeholder = 'mr3020v1.2';
			sub_mainReg = mainReg.taboption('about', form.Value, 'keypatch', _('Key-Patch'));
			sub_mainReg.depends('register', '1');
			sub_mainReg.placeholder = 'mh4nx7net';
		sub_mainReg = mainReg.taboption('logs', awmsController, '__controller__');
		sub_mainReg = mainReg.taboption('logs', form.DummyValue.extend({
			renderWidget: function(section_id, option_id, cfgvalue){
				return E('div',{class:'autowms-status-table'},[
					E('div',{class:'autowms-info',id:'autowms-info'},[
						E('div', { id: 'content_awmslogs' }, [
							E('textarea', {
								id: 'awmslogs',
								style: 'font-size:12px; resize: horizontal; min-width: 380px',
								readonly: 'readonly',
								rows: 15,
							}, [loglines.join('\n') ])
						])
					])
				]);
			}
		}), '__logs__');
		var promAutowms = [statusTable(dataAkun), mapAwms.render()];
		return Promise.all(promAutowms);
	}
});
