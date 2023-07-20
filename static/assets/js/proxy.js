    var host_name = location.hostname;
    var table_name = "tb-proxy";
    $(function() {
        var table1 = $('#' + table_name).DataTable({
            'iDisplayLength': 5,
            'pageLength': 100,
            "paging": false,
            // "scrollX": "200px",
            "autoWidth": false,
            "fixedHeader": true,
            // "scrollY": "580px",
            "scrollCollapse": true,
            // "responsive": true,
            "serverSide": true,
            "processing": false,
            "bInfo": false,
            fade: true,
            dom: 'Bfrtip',
            select: true,
            searching: false,
            ajax: {
                url: '/ajax/allport',
                dataSrc: function(json) {
                    return json.data;
                }
            },
            buttons: [{
                text: '<i class="icofont icofont-refresh fa fa-spin"></i> Reset IP',
                className: "btn-resetip",
                titleAttr: 'Reset IP',
                action: function() {
                    var checked = listport();
                    if (checked.length < 1) {
                        toastr["error"]('Please select at least 1 row');
                    } else {
                        send2('reset_ip', checked);
                    }
                }
            }, {
                extend: 'collection',
                text: '<i class="ti-view-grid"></i> Viewer',
                titleAttr: 'View and Get more infomation',
                autoClose: true,
                buttons: [{
                    text: '<i class="ti-view-list-alt"></i> More Infomation',
                    className: "btn-moreinfo",
                    titleAttr: 'View More Infomation',
                    action: function() {
                        $('#detail_proxy').modal();
                        detail_proxy();
                    }
                }, {
                    text: '<i class="ti-loop"></i> GET Proxy',
                    className: "btn-getproxyformat",
                    titleAttr: 'GET Proxy , Sock5 Port to use',
                    action: function() {
                        $('#view_proxy').modal();
                        exp();
                    }
                }],
            }, {
                extend: 'collection',
                text: '<i class="ti-panel"></i> Action',
                titleAttr: 'View and Get more infomation',
                autoClose: true,
                buttons: [{
                    text: '<i class="fa fa-exchange"></i> Change Mode to 3G <==> 4G',
                    className: "btn-changemode",
                    titleAttr: 'Change mode work',
                    action: function() {
                        var checked = listport();
                        if (checked.length < 1) {
                            toastr["error"]('Please select at least 1 row');
                        }else{
                            var net_html = '',net_value = ['Auto','GSM only','UMTS only','LTE only','LTE -> UMTS','LTE -> GSM','UMTS -> GSM'];
                            $('#mode_nw').html('');
                            for (var i = 0; i < net_value.length; i++) {
                                var net = net_value[i];
                                $('#mode_nw').append('<option value="'+i+'">'+net+'</option>');
                            }
                            $('#f_nwmode').modal();
                        }
                    }
                }, {
                    text: '<i class="ti-trash"></i> Clear Count Data',
                    className: "btn-cleardatacount",
                    titleAttr: 'Clear Count Data',
                    action: function() {
                        var checked = listport();
                        if (checked.length < 1) {
                            toastr["error"]('Please select at least 1 row');
                        } else {
                            send2('clear_count_data', checked);
                            setTimeout(() => {
                                refresh_list();
                            }, 6000)
                        }
                    }
                }, {
                    text: '<i class="fa fa-spinner fa-spin"></i> Reboot USB',
                    className: "btn-rebootusb",
                    titleAttr: 'Reboot Usb',
                    action: function() {
                        var checked = listport();
                        if (checked.length < 1) {
                            toastr["error"]('Please select at least 1 row');
                        } else {
                            send2('reboot_usb', checked);
                            for (var i = 1; i < 6; i++) {
                                setTimeout(() => {
                                    refresh_list();
                                }, i * 6000)
                            }
                        }
                    }
                }],
            }, {
                extend: 'collection',
                text: '<i class="fal fa-location-arrow"></i> Gateway',
                titleAttr: 'Change Gateway USB',
                autoClose: true,
                buttons: {
                    text: '<i class="fad fa-usb-drive"></i> Build Gateway USB Selected',
                    className: "btn-buildgw",
                    titleAttr: 'Build Gateway USB Selected',
                    action: function() {
                        var checked = listport();
                        if (checked.length < 2) {
                            toastr["error"]('Please select at least 2 row');
                        } else {
                            $('#gws_total').val(checked.length + ' USB');
                            $('#gw_multi').modal();
                        }
                    }
                },
            }, {
                text: '<i class="fa fa-refresh fa-spin"></i> Refresh',
                className: 'btn-reload',
                titleAttr: 'Reload List',
                action: function() {
                    refresh_list();
                    toastr["success"]('Reload list success');
                },
            }, {
                extend: 'collection',
                text: '<i class="ti-export"></i> Export File',
                titleAttr: 'Xuất Danh Sách ra File',
                autoClose: true,
                buttons: [{
                    extend: "excel",
                    className: "btn-primary",
                }, {
                    extend: "csv",
                    className: "btn-primary"
                }, {
                    extend: "pdf",
                    className: "btn-primary"
                }, {
                    extend: "copy",
                    className: "btn-primary"
                }, {
                    extend: "print",
                    className: "btn-primary"
                }],
            }, {
                text: '<i class="ti-settings"></i> Config Table',
                className: "btn-config",
                titleAttr: 'Config Table',
                action: function() {
                    $('#config_tb').modal();
                }
            }],
            columns: [{
                    data: null,
                    render: function(data, type, row, meta) {
                        return '<div class="checkbox-fade fade-in-primary"><label><input type="checkbox" id="primary_' + row.port + '" value="' + row.port + '" name="box" onClick="cache_select()"><span class="cr"><i class="cr-icon icofont icofont-ui-check txt-primary"></i></span><span class="text-inverse">' + row.id + '</span></label></div>';
                    }
                }, {
                    data: null,
                    render: function(data, type, row, meta) {
                        var rsip = '<a class="dropdown-item" href="#" title="Reset IP to get ip new" onclick="send2(\'reset_ip\',\'' + row.port + '\')"><i class="icofont icofont-refresh fa fa-spin"></i> Reset IP</a>';
                        var phttp = '<a class="dropdown-item" href="#" title="Copy Proxy HTTP" onclick="cp(\'' + host_name + ':' + row.port + '\',\'Proxy HTTP\')"> Copy HTTP Port</a>';
                        var phttpv6 = (row.ipv6_support == 1) ? '<a class="dropdown-item" href="#" title="Copy Proxy HTTP IPV6" onclick="cp(\'' + host_name + ':' + row.http_v6 + '\',\'Proxy HTTP IPV6\')"> Copy HTTP IPV6 Port</a>' : '';
                        var psock5 = '<a class="dropdown-item" href="#" title="Copy Proxy Sock5" onclick="cp(\'' + host_name + ':' + row.sock5 + '\',\'Proxy Sock5\')"> Copy Sock5 Port</a>';
                        var psock5v6 = (row.ipv6_support == 1) ? '<a class="dropdown-item" href="#" title="Copy Proxy Sock5 IPV6" onclick="cp(\'' + host_name + ':' + row.sock5_v6 + '\',\'Proxy Sock5 IPV6\')"> Copy Sock5 IPV6 Port</a>' : '';
                        var cp_gw = '<a class="dropdown-item" href="#" title="Copy IPv4 Gateway" onclick="cp(\'' + row.ipv4_route +'\',\'IPv4 Gateway\')"> Copy IPv4 Gateway</a>';
                        var cp_gw6 = '<a class="dropdown-item" href="#" title="Copy IPv6 Gateway" onclick="cp(\'' + row.ipv6_route +'\',\'IPv6 Gateway\')"> Copy IPv6 Gateway</a>';
                        var rbusb = '<a class="dropdown-item" href="#" title="Restart USB Hilink" onclick="send2(\'reboot_usb\',\'' + row.port + '\')"><i class="fa fa-spinner fa-spin"></i> Reboot USB</a>';
                        var btn_rs = '&nbsp;<label class="label label-inverse-primary" onClick="send2(\'reset_ip\',[\'' + row.port + '\'])" title="Reset to get ip New">Reset IP</label>';
                        var btn_rb = '&nbsp;<div class="dropdown-info dropdown open"><label class="label label-inverse-primary dropdown-toggle waves-effect waves-light" id="dropdown-4" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Func</label><div class="dropdown-menu" aria-labelledby="dropdown-4" data-dropdown-in="fadeIn" data-dropdown-out="fadeOut"><a class="dropdown-item waves-light waves-effect" href="#" onclick="change_dhcp(\''+ row.usb +'\',\''+row.port+'\')"><i class="fad fa-exchange"></i>Gateway/DHCP</a></div></div>';
                        // var btn_rb = '&nbsp;<label class="label label-inverse-info" onClick="confirm_reboot(\'' + row.port + '\')" title="restart the usb when the usb has a network connection error, or replace the sim card">Reboot</label>';
                        return '<div class="input-group"><div class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown">' + row.usb + ':' + row.port + '</a><div class="dropdown-menu">' + phttp + phttpv6 + psock5 + psock5v6 + cp_gw + cp_gw6 + '</div></div>' + btn_rs + btn_rb + '</div>';
                    }
                }, {
                    data: "device_name"
                }, {
                    data: null,
                    render: function(data, type, row, meta) {
                        var signal = parseInt(row.quality);
                        var sg = 'fad fa-signal';
                        if (signal == '0') sg = 'fas fa-signal-alt-1';
                        else if (signal == '1') sg = 'fad fa-signal-1';
                        else if (signal == '2') sg = 'fad fa-signal-2';
                        else if (signal == '3') sg = 'fad fa-signal-3';
                        else if (signal == '4') sg = 'fad fa-signal-4';
                        else if (signal == '5') sg = 'fad fa-signal';
                        return row.mobile_name +' <i class="'+sg+' text-primary"></i>';
                    }
                }, {
                    data: null,
                    render: function(data, type, row, meta) {
                        let model = row.device_name.split(' ')[0]
                        if (model == "Huawei" || model != "Olax"){
                        var net_html = '',net_value = ['Auto','GSM Only','UMTS Only','LTE Only','LTE -> UMTS','LTE -> GSM','UMTS -> GSM'];
                        for (var i = 0; i < net_value.length; i++) {
                            var net = net_value[i];
                            net_html+='<a class="dropdown-item" href="#" title="Change Work Mode to '+net+'" onclick="send_data(\'changemode\',\'' + row.port + '\',\'' + i + '\')"><i class="fa fa-exchange"></i> '+net+'</a>';
                        }
                    }else if (model == "Olax"){
                        var net_html = '',net_value = ['Auto','3G Only','4G Only'];
                        for (var i = 0; i < net_value.length; i++) {
                            var net = net_value[i];
                            net_html+='<a class="dropdown-item" href="#" title="Change Work Mode to '+net+'" onclick="send_data(\'changemode\',\'' + row.port + '\',\'' + i + '\')"><i class="fa fa-exchange"></i> '+net+'</a>';
                        }
                    }
                        return '<div class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown">' + row.currentmode + '</a><div class="dropdown-menu">'+net_html+'<a class="dropdown-item" href="#" title="USB Mode Support" ports="' + row.port + '"><i class="ti-list"></i>USB Support ' + row.support_mode + '</a></div></div>';
                    }
                }, {
                    data: null,
                    render: function(data, type, row, meta) {
                        var sp = (row.ipv6_support == 1) ? '<span class="text-success ti-check"' : '<span class="text-danger ti-close"';
                        return '<span id="i_' + row.imei + '">' + row.imei + '  ' + sp + '</span>';;
                    }
                },
                {
                    data: null,
                    render: function(data, type, row, meta) {
                        if(row.ipv6_public.length > 5){
                            var ip = row.ip_public + '<br>' + row.ipv6_public; 
                        }else{
                            var ip = row.ip_public;
                        }
                        return ip;
                    }
                }, {
                    data: "CurrentConnectTime"
                }, {
                    data: null,
                    render: function(data, type, row, meta) {
                        let total = '<div class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown">' + row.TotalDownload + ' / ' + row.TotalUpload + ' / ' + row.Total_All + '</a><div class="dropdown-menu"><a class="dropdown-item" href="#" title="Reset count DATA use" onclick="send2(\'clear_count_data\',\'' + row.port + ' \')"><i class="icofont ui-network"></i> Reset Count DATA</a></div></div>';
                        return row.CurrentDownload + '/' + row.CurrentUpload + '<br>' + total;
                    }
                }, {
                    data: "status_proxy"
                },
            ],
            columnDefs: [{
                    targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                    orderable: false,
                    searchable: false
                },
                // { targets: [2,4,7],  width: '8%'},
                // { targets: [8,9],  width: '10%'},
            ],
            language: {
                "lengthMenu": "Display _MENU_ records per page",
                "zeroRecords": "Nothing found - sorry",
                "info": "Showing page _PAGE_ of _PAGES_",
                "infoEmpty": "No records available",
                "infoFiltered": "(filtered from _MAX_ total records)"
            },
            rowCallback: function(row, data) {
                render_status(row, data);
                setTimeout(() => {
                    reselected_row();
                    render_dashbroad();
                    // check_duplicate();
                }, 200)
            }
        });
        setTimeout(() => {check_duplicate();}, 200)
        if (lc_get('selected_proxy')) {
            reselected_row();
        }
        if (!lc_get('timereload_proxy')) {
            lc_set('timereload_proxy', 5000)
        }
        function refresh_list() {
            table1.ajax.reload();
            setTimeout(() => {check_duplicate();}, 200)
        }
        setInterval(() => {
                refresh_list();
            }, lc_get('timereload_proxy'))
            //
    })
    function get_one_row(port){
        var row = false;
        var table = all_datatble();
        if (table.data.length > 0){
            for (var i = 0; i < table.data.length; i++) {
                var rows = table.data[i];
                if (parseInt(port) == parseInt(rows.port)){
                    return rows;
                    break;
                }
            }
            return row;
        }
    }
    function timeload(time) {
        lc_set('timereloadlist', time * 1000)
    }
    function render_status(node, data) {
        var status = data['status_proxy'];
        if (status == 'RESETING') {
            $(node).attr('style', 'background-color: #ceb9256b;');
        } else if (status == 'CONNECTED') {
            $(node).attr('style', 'background-color: #8eea776b;');
        } else if (status == 'SIM_NETWORK_ERROR') {
            $(node).attr('style', 'background-color: #ff000030;');
        } else if (status == 'PROXY_ERROR') {
            $(node).attr('style', 'background-color: #ff000030;');
        } else if (status == 'USB_ERROR') {
            $(node).attr('style', 'background-color: #ff000030;');
        } else if (status == 'NO_SIM_CARD') {
            $(node).attr('style', 'background-color: #ff000030;');
        } else if (status == 'DISCONNECTED') {
            $(node).attr('style', 'background-color: #ff000030;');
        }
    }
    function render_dashbroad() {
        var data = all_datatble();
        if (parseInt(data.sysinfo.sys_load.substring(0, 3)) >= 3) {
            $('#load').text(data.sysinfo.sys_load);
            $('#load').attr('class', 'text-danger');
        } else {
            $('#load').text(data.sysinfo.sys_load);
            $('#load').attr('class', 'text-success');
        }
        if (parseInt(data.sysinfo.ram_use) > 49) {
            $('#ram').text(data.sysinfo.ram_use);
            $('#ram').attr('class', 'text-danger');
        } else {
            $('#ram').text(data.sysinfo.ram_use + ' % of ' + data.sysinfo.ram_total);
            $('#ram').attr('class', 'text-success');
        }
        var cpu_temp1 = data.sysinfo.cpu_temp.substring(0, 2),
            cpu_temp2 = data.sysinfo.cpu_temp.substring(2);
        if (parseInt(cpu_temp1) > 49) {
            $('#cpu_temp').text(data.sysinfo.cpu_temp);
            $('#cpu_temp').attr('class', 'text-danger');
        } else {
            $('#cpu_temp').text(data.sysinfo.cpu_temp);
            $('#cpu_temp').attr('class', 'text-info');
        }
        var stg = data.sysinfo.storage.substring(0, 2);
        if (parseInt(stg) > 49) {
            $('#storage').text(data.sysinfo.storage);
            $('#storage').attr('class', 'text-danger');
        } else {
            $('#storage').text(data.sysinfo.storage);
            $('#storage').attr('class', 'text-success');
        }
        $('#uptime').text(data.sysinfo.up_time);
        var arr = [
            ['total_usb_error', 'total_usb_disconnect', 'total_usb_connecting', 'usb_connected', 'total_usb'],
            ['usb_fail', 'usb_disconect', 'usb_connecting', 'total_usb', 'total_usb']
        ];
        for (var i = 0; i < arr[0].length; i++) {
            var rows = arr[0][i];
            var nod = arr[1][i];
            $('#' + rows).text(data.default[nod]);
        }
        $('#range_port').text(String(data.default.port_start) + ' - ' + String(data.default.port_end)+', '+String(data.default.port_usb_start) + ' - ' + String(data.default.port_usb_end));
        $('#lan_primary').text(data.default.host_name);
    }
    function check_duplicate(){
        var usb_list = [];
        var table = all_datatble();
        if (table.data.length > 0){
            for (var i = 0; i < table.data.length; i++) {
                var rows = table.data[i];
                if (usb_list.indexOf(rows.usb) < 0){
                    usb_list.push(rows.usb);
                }else{
                    toastr["error"]('USB '+ rows.usb +' was duplicated');
                }
            }
        }
    }
    function send2(pa, data) {
        var s = (!Array.isArray(data)) ? data.split(',') : data;
        post(pa, {
            'port': s
        }, 'post');
    }
    function send_data(pa, data,value) {
        var s = (!Array.isArray(data)) ? data.split(',') : data;
        post(pa, {
            'port': s,
            'value': value
        }, 'post');
    }
    function res_clear_data(data) {
        data['data'].forEach((item) => {
            if (item.error_code === 0) toastr["success"]('Clear count data Port ' + item.port + ' success');
            else toastr["error"]('Clear count data Port ' + item.port + ' failed');
        })
    }
    $(function() {
        var table2 = $('#tb_px_detail').DataTable({
            'iDisplayLength': 5,
            // 'pageLength': 10,
            // "scrollX": "200px",
            fixedHeader: true,
            "scrollY": "580px",
            "scrollCollapse": true,
            "paging": false,
            "bInfo": false,
            dom: 'Bfrtip',
            buttons: [
                'excel', 'copy', 'print',
            ],
            language: {
                "lengthMenu": "Display _MENU_ records per page",
                "zeroRecords": "Nothing found - sorry",
                "info": "Showing page _PAGE_ of _PAGES_",
                "infoEmpty": "No records available",
                "infoFiltered": "(filtered from _MAX_ total records)"
            }
        });
    })
    function detail_proxy() {
        $("#tb_px_detail").DataTable().clear();
        var tb = all_datatble();
        tb['data'].forEach((row) => {
            var xnxx = '<div class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown">' + host_name + ':' + row.port + '</a><div class="dropdown-menu"><a class="dropdown-item" href="#" title="Reset IP to get ip new" onclick="send2(\'reset_ip\',\'' + row.port + '\')"><i class="icofont icofont-refresh fa fa-spin"></i> Reset IP</a><a class="dropdown-item" href="#" title="Restart USB Hilink" onclick="send2(\'reboot_usb\',\'' + row.port + '\')"><i class="fa fa-spinner fa-spin"></i> Reboot USB</a></div></div>';
            $("#tb_px_detail").dataTable().fnAddData([
                row.id, xnxx, row.device_name, row.seri_sim, row.imsi, row.serial, row.mac_usb
            ]);
        })
    }
    function cache_select() {
        setTimeout(() => {
            lc_del('selected_proxy');
            lc_set('selected_proxy', JSON.stringify(listport()))
        }, 200)
    }
    function reselected_row() {
        var box = document.getElementsByName('box'),
            cache = lc_get('selected_proxy');
        if (cache) {
            box.forEach((item) => {
                if (cache.indexOf(item.value) > -1) item.checked = true;
                else item.checked = false;
            })
        }
    }
    function exp() {
        var type = $('#px_type').val(),formatby = $('input[name="formatby"]:checked').val(),res = '';
        if (formatby == 'maxcare'){
            $('.link_sv').show();
            $('#px_link').val(location.origin+'/api/v1/');
        }else{
          $('.link_sv').hide();  
        }
        all_datatble()['data'].forEach((rows) => {
            if (formatby == 'fplus'){
            if (type == 'http')
                res += host_name + ':' + rows.port + ':'+location.origin+'/api/v1/reset?proxy='+rows.port + '\r\n';
            else if (type == 'http_v6')
                res += host_name + ':' + rows.http_v6 + ':'+location.origin+'/api/v1/reset?proxy='+rows.http_v6 + '\r\n';
            else if (type == 'sock5')
                res += host_name + ':' + rows.sock5 + ':'+location.origin+'/api/v1/reset?proxy='+rows.sock5 + '\r\n';
            else if (type == 'sock5_v6')
                res += host_name + ':' + rows.sock5_v6 + ':'+location.origin+'/api/v1/reset?proxy='+rows.sock5_v6 + '\r\n';
        }else{
            if (type == 'http')
                res += host_name + ':' + rows.port + '\r\n';
            else if (type == 'http_v6')
                res += host_name + ':' + rows.http_v6 + '\r\n';
            else if (type == 'sock5')
                res += host_name + ':' + rows.sock5 + '\r\n';
            else if (type == 'sock5_v6')
                res += host_name + ':' + rows.sock5_v6 + '\r\n';  
        }
        })
        $('#res').val(res.substring(0, res.length - 2));
    }
if (document.querySelector('input[name="formatby"]')) {
  document.querySelectorAll('input[name="formatby"]').forEach((elem) => {
    elem.addEventListener("change", function(event) {
      var item = event.target.value;
      exp();
    });
  });
}
    function res_change_switch(data) {
        data['data'].forEach((item) => {
            if (item.error_code === 0) toastr["success"](item.message);
            else toastr["error"](item.message);
        })
    }
    function cp(text, t) {
        copytext(text);
        toastr["success"]('Copy ' + t + ' to clipbroad success');
    }
    function config_table() {
        lc_set('timereload_proxy', $('#time_rl').val() * 1000);
        toastr["success"]('Success');
        setTimeout(() => {
            location.reload();
        }, 2000)
    }
    function checking() {
        for (var i = 1; i < 12; i++) {
            setTimeout(() => {
                $('#' + table_name).dataTable().api().ajax.reload();
            }, i * 2000)
        }
    }
    function confirm_reboot(port) {
        swal({
            title: 'Are you sure you want to do a usb reboot?',
            text: "the process will take up to 30-40 seconds",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK'
        }).then((result) => {
            if (result.value) {
                send2('reboot_usb', port);
            }
        });
    }
    function change_one_gw(){
        var num = $('#gw_new').val(),port = $('#gw_port').val();
        if (num >= 5 && num <= 255){
            post('change_one_gateway', {'port': port,'new':num}, 'post');
        }else{
            toastr["error"]('Gateway invalid');
        }
    }
    function change_multi_gw(){
        var num = $('#gws_start').val(),checked = listport();
        if (checked.length < 2) {
            toastr["error"]('Please select at least 2 row');
        } else {
            var max = 255 - checked.length;
            if (num > max){
                toastr["error"]('Maximum starting port must be '+String(max));
            }else if (num >= 5 && num <= max){
                post('change_multi_gateway', {'port': checked,'start':num}, 'post');
            }else{
                toastr["error"]('Gateway invalid');
            }
        }
    }
    function change_modenw(){
        var nw = $('#mode_nw').val(),checked = listport();
        if (checked.length < 1) {
            toastr["error"]('Please select at least 1 row');
        }else if (parseInt(nw) > 6 || parseInt(nw) < 0){
            toastr["error"]('mode selected invalid');
        } else {
            send_data('changemode', checked,nw);
            for (var i = 1; i < 10; i++) {
                setTimeout(() => {
                    refresh_list();
                }, i * 2000)
            }
        }
    }
    function change_dhcp(usb, port){
        $('#gw_old').val('192.168.'+usb+'.1');
        $('#gw_port').val(port);
        $('#gw_one').modal();
    }