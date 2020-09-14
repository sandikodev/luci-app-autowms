'use strict';
'require view';
'require rpc';
'require form';
return view.extend({
    callHostHints: rpc.declare({
        object: 'luci-rpc',
        method: 'getHostHints',
        expect: {
            '': {}
        }
    }),
    load: function() {
        return this.callHostHints();
    },
    render: function(hosts) {
        var map_autowms, sec_info;
        map_autowms = new form.Map('autowms', _('Beranda'));
        sec_info = map_autowms.section(form.GridSection, 'register', _('INFO /registered'));
        sec_info.addremove = true;
        sec_info.anonymous = true;
        sec_info.sortable = true;
        return m.render();
    }
});
