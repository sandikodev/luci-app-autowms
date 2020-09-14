'use strict';
'require fs';
'require ui';
'require uci';
'require rpc';
'require baseclass';

function itter_link(item){
	var head_ori = document.querySelector('head');
	head_ori.appendChild(item);
};
const uri_autowms = [L.media()+"autowms.css"];
var meta_autowms = [E('link',{rel:'stylesheet',href: uri_autowms[0]})];
meta_autowms.forEach(itter_link);
var wmsOpt1, wmsOpt2, wmsOpt3, wmsOpt4,
	_init = null,
	_state = null;

var loadData = {
	wmsGetAkun: rpc.declare({
		object: 'autowms.akun',
		method: 'getAkun'
	}),
	wmsGetSistem: rpc.declare({
		object: 'autowms.sistem',
		method: 'getSistem'
	}),
	wmsGetLogs: fs.read_direct('/var/run/autowms/autowms.log','JSON').catch(function(err){
		ui.addNotification(null, E('p', {}, _('Unable to load log data: ' + err.message)));
		return '';
	}),
	wmsSistem_status: rpc.declare({
		object: 'autowms.sistem',
		method: 'getSistem.status'
	}),
	wmsSistem_family: rpc.declare({
		object: 'autowms.sistem',
		method: 'getSistem.family'
	}),
	wmsIsRUN: fs.exec_direct('/usr/sbin/autowms',['isPIDRUN']).catch(function(err){
		console.log(err);
		return '';
	}),
	wmsUciLoad: Promise.all([uci.load('autowms')])
};
var TasksData = [loadData.wmsGetAkun(), loadData.wmsGetSistem(), loadData.wmsGetLogs, loadData.wmsUciLoad, loadData.wmsIsRUN];

function resolvMe(param){
	if (_state == null || param){
		_init = _init || Promise.all(TasksData).then(function(data){
			var jalAkun = data[0],
				jalSistem = data[1],
				jalLogs = data[2],
				jalLoad = data[3];
			_init = null;
		});
	}
	else{
		console.log("_state already! pass to param, choice as go as yourown!")
	}
	return (_state != null ? Promise.resolve(_state) : _init);
}
/*
function enumAutowms(){
	var uciAutowms = uci.sections('autowms','akun'),
		autowms = {};

	for(var i = 0; i < uciAutowms.length; i++){
		autowms[uciAutowms[i]['.name']] = this.resolvMe(uciAutowms[i]['.name']);

	}
	for(){
		if(){
			networks[] = this.resolvMe()
		}
	}
	var rv = [];
	for(){

	}
	rv.sort();
	return rv;
}
*/
/*
var dt_secSistem, dt_secAkun;
resolvMe().then(function(){
	dt_secSistem = uci.sections('autowms','sistem')[0];
	console.log(uci.sections('autowms','sistem')[0]);
	console.log(dt_secSistem);
});
*/

var main = baseclass.extend({
	__name__: "RPCAutowms",
	getAutowms: function(){
		return resolvMe().then(L.bind(enumerateAutowms, this));
	},
	wmsSlide1: function(wmsOpt1, wmsOpt2=150, wmsOpt3=null) {/**for smooth slide**/
		if (wmsOpt1 === undefined || wmsOpt1 === null){
			console.log("please define getElementById first");
		}
		else{
			window.clearInterval(wmsOpt3);
			var mdiv = document.getElementById(wmsOpt1);
			if(wmsOpt4) {
				var h = wmsOpt2;
				wmsOpt4 = false;
				wmsOpt3 = setInterval(function(){
				h--;
				mdiv.style.height = h + 'px';
					if(h <= 0)
						window.clearInterval(wmsOpt3);
					}, 1
				);
			}
			else {
				var h = 0;
				wmsOpt4 = true;
				wmsOpt3 = setInterval(function(){
					h++;
					mdiv.style.height = h + 'px';
					if(h >= wmsOpt2)
						window.clearInterval(wmsOpt3);
				}, 1
				);
			}
		}
	},
	wmsSlide2: function(wmsOpt1){/**for instant slide**/
		if (wmsOpt1 === undefined || wmsOpt1 === null){
			console.log("please define getElementById first");
		}
		else{
			var x = document.getElementById(wmsOpt1);
			if (x.style.display === "none"){
				x.style.display = "block";
			}
			else{
				x.style.display = "none";
			}
		}
	},

	awmsCtrl: function(wmsOpt1){
		function writeStatus(elem, msg='noMessage', type='noType'){
			var getTarget = document.getElementById(elem);
			var writeSpace = "=".repeat(52-(msg.length+type.length+5));
			if(getTarget != null){
				getTarget.innerHTML = "\n%s[ %s %s ]\n".format(writeSpace, msg, type);
			}
		}
		switch(wmsOpt1){
			case "start":
				fs.exec_direct('/etc/init.d/autowms', ['start']);
				writeStatus('awmslogs', 'START', 'SUCCESS');
				alert("Service start success");
				break;
			case "stop":
				fs.exec_direct('/etc/init.d/autowms', ['stop']);
				writeStatus('awmslogs', 'STOP', 'SUCCESS');
				alert("Service stop success");
				break;
			case "clearlogs":
				fs.exec_direct('/usr/sbin/autowms', ['clean']);
				writeStatus('awmslogs', 'CLEARLOG', 'SUCCESS');
				alert("log Cleared");
				break;
			case "enable":
				fs.exec_direct('/etc/init.d/autowms', ['enable']);
				break;
			case "disable":
				fs.exec_direct('/etc/init.d/autowms', ['disable']);
				break;

			default:
				console.log('no wmsOpt1 defined');
		}
	},
	fetchData: TasksData,
});
return main;
