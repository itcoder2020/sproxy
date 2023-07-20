var table_name = "dt-dns";
$(function() {
    post('get_zone','xxx=xxx','get');
    lc_del('zone_active');
    lc_del('domain_active');
    var table1 = $('#' + table_name).DataTable({
        'iDisplayLength': 5,
        'pageLength': 100,
        // "paging": false,
        // "scrollX": "200px",
        "autoWidth": false,
        "fixedHeader": true,
        "scrollY": "580px",
        "scrollCollapse": true,
        // "responsive": true,
        "serverSide": true,
        "processing": true,
        "bInfo": false,
        fade: true,
        dom: 'Bfrtip',
        select: true,
        searching: false,
        ajax: {
            url: '/ajax/empty_dnscf',
            dataSrc: function(json) {
                return json.data;
            }
        },
        buttons: [{
            text: '<i class="fa fa-plus"></i> ADD',
            className: 'btn-add',
            titleAttr: 'Add Record',
            action: function() {
                if(!lc_get('domain_active')){
                    toastr["error"]('Please select Zone before');
                }else{
                    $('#a_name').val('xxx.'+lc_get('domain_active'));
                    $('#a_proxied').attr('src','data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA5MC41IDU5Ij48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6IzkyOTc5Yjt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPkFzc2V0IDI8L3RpdGxlPjxnIGlkPSJMYXllcl8yIiBkYXRhLW5hbWU9IkxheWVyIDIiPjxnIGlkPSJMYXllcl8xLTIiIGRhdGEtbmFtZT0iTGF5ZXIgMSI+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNDksMTMuNVYxOUw1OSw5LjUsNDksMFY1LjVINDAuNzhhMTIuNDMsMTIuNDMsMCwwLDAtOS41LDQuNDJMMTcuNjUsMjcuMTZhOC44Myw4LjgzLDAsMCwxLTYuOTEsMy4zNEg1bC01LDhIMTMuMzlhMTEuMjcsMTEuMjcsMCwwLDAsOS00LjQ4TDM1LjA1LDE3LjE4YTkuODEsOS44MSwwLDAsMSw3LjY2LTMuNjhaIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNODAuNSwzOUExMCwxMCwwLDAsMCw3Niw0MC4wOWExOSwxOSwwLDAsMC0zNy4zLTQuNTdBOSw5LDAsMCwwLDI0LDQyLjVhOC40Nyw4LjQ3LDAsMCwwLC4wNiwxLDcuNSw3LjUsMCwwLDAsLjQ0LDE1YzQsMCw1MS44OS41LDU2LC41YTEwLDEwLDAsMCwwLDAtMjBaIi8+PC9nPjwvZz48L3N2Zz4=');
                    $('#m_add_record').modal();
                }
            },
        },{
            text: '<i class="icofont icofont-network"></i> Auto DNS',
            className: "btn-autodns",
            titleAttr: 'Auto update IP for domain',
            action: function() {
                var checked = listport();
                if (checked.length < 1){
                    toastr["error"]('Please select at least 1 row');
                }else{
                    if(!lc_get('zone_active')){
                        toastr["error"]('Please select Zone');
                    }else{
                        var run = true;
                        for (var i = 0; i < checked.length; i++) {
                            var get = get_one_row(checked[i]);
                              if(get['type'] != 'A'){
                                run = false;
                                break;
                              }
                        }
                        if(run == true){
                            post('auto_dns',{'zoneid':lc_get('zone_active'),'record_id':checked},'post');
                        }else{
                            toastr["error"]('Auto DNS only Support Type A');
                        }
                    }
                }
            }
        },{
            text: '<i class="ti-trash"></i> Delete',
            className: "btn-delete",
            titleAttr: 'Delete Record',
            action: function() {
                var checked = listport();
                if (checked.length < 1){
                    toastr["error"]('Please select at least 1 row');
                }else{
                    if(!lc_get('zone_active')){
                        toastr["error"]('Please select Zone');
                    }else{
                        delete_record(listport());
                    }
                }
            }
        }, {
            text: '<i class="fa fa-refresh fa-spin"></i> Refresh',
            className: 'btn-reload',
            titleAttr: 'Reload List',
            action: function() {
                refresh_list();
                toastr["success"]('Reload list success');
            },
        },{
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
                return '<div class="checkbox-fade fade-in-primary"><label><input type="checkbox" id="primary_' + row.id + '" value="' + row.id + '" name="box" onClick="cache_select()"><span class="cr"><i class="cr-icon icofont icofont-ui-check txt-primary"></i></span><span class="text-inverse">' + row.num + '</span></label></div>';
            }
        }, {
            data: null,
            render: function(data, type, row, meta) {
                return '<span id="t_'+row.id+'">'+row.type+'</span>';
            }
        }, {
            data: null,
            render: function(data, type, row, meta) {
                return '<span id="n_'+row.id+'">'+row.name+'</span>';
            }
        }, {
            data: null,
            render: function(data, type, row, meta) {
                return '<span id="c_'+row.id+'">'+row.content+'</span>';
            }
        }, {
            data: null,
            render: function(data, type, row, meta) {
                var ttl = (row.ttl == 1) ? 'Auto' : row.ttl;
                return '<span id="ttl_'+row.id+'">'+ttl+'</span>';
            }
        }, {
            data: null,
            render: function(data, type, row, meta) {
                var proxied = (row.proxied == false) ? '<img height="32" width="32" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA5MC41IDU5Ij48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6IzkyOTc5Yjt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPkFzc2V0IDI8L3RpdGxlPjxnIGlkPSJMYXllcl8yIiBkYXRhLW5hbWU9IkxheWVyIDIiPjxnIGlkPSJMYXllcl8xLTIiIGRhdGEtbmFtZT0iTGF5ZXIgMSI+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNDksMTMuNVYxOUw1OSw5LjUsNDksMFY1LjVINDAuNzhhMTIuNDMsMTIuNDMsMCwwLDAtOS41LDQuNDJMMTcuNjUsMjcuMTZhOC44Myw4LjgzLDAsMCwxLTYuOTEsMy4zNEg1bC01LDhIMTMuMzlhMTEuMjcsMTEuMjcsMCwwLDAsOS00LjQ4TDM1LjA1LDE3LjE4YTkuODEsOS44MSwwLDAsMSw3LjY2LTMuNjhaIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNODAuNSwzOUExMCwxMCwwLDAsMCw3Niw0MC4wOWExOSwxOSwwLDAsMC0zNy4zLTQuNTdBOSw5LDAsMCwwLDI0LDQyLjVhOC40Nyw4LjQ3LDAsMCwwLC4wNiwxLDcuNSw3LjUsMCwwLDAsLjQ0LDE1YzQsMCw1MS44OS41LDU2LC41YTEwLDEwLDAsMCwwLDAtMjBaIi8+PC9nPjwvZz48L3N2Zz4=">' : '<img height="32" width="32" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDQgMzkuNSI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOiM5OTk7fS5jbHMtMntmaWxsOiNmNjhhMWQ7fS5jbHMtM3tmaWxsOiNmZmY7fTwvc3R5bGU+PC9kZWZzPjx0aXRsZT5Bc3NldCAxPC90aXRsZT48ZyBpZD0iTGF5ZXJfMiIgZGF0YS1uYW1lPSJMYXllciAyIj48ZyBpZD0iTGF5ZXJfMS0yIiBkYXRhLW5hbWU9IkxheWVyIDEiPjxwb2x5Z29uIGNsYXNzPSJjbHMtMSIgcG9pbnRzPSIxMDQgMjAuMTIgOTQgMTAuNjIgOTQgMTYuMTIgMCAxNi4xMiAwIDI0LjEyIDk0IDI0LjEyIDk0IDI5LjYyIDEwNCAyMC4xMiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTc0LjUsMzljLTIuMDgsMC0xNS40My0uMTMtMjguMzQtLjI1LTEyLjYyLS4xMi0yNS42OC0uMjUtMjcuNjYtLjI1YTgsOCwwLDAsMS0xLTE1LjkzYzAtLjE5LDAtLjM4LDAtLjU3YTkuNDksOS40OSwwLDAsMSwxNC45LTcuODEsMTkuNDgsMTkuNDgsMCwwLDEsMzguMDUsNC42M0ExMC41LDEwLjUsMCwxLDEsNzQuNSwzOVoiLz48cGF0aCBjbGFzcz0iY2xzLTMiIGQ9Ik01MSwxQTE5LDE5LDAsMCwxLDcwLDE5LjU5LDEwLDEwLDAsMSwxLDc0LjUsMzguNWMtNC4xMSwwLTUyLS41LTU2LS41YTcuNSw3LjUsMCwwLDEtLjQ0LTE1QTguNDcsOC40NywwLDAsMSwxOCwyMmE5LDksMCwwLDEsMTQuNjgtN0ExOSwxOSwwLDAsMSw1MSwxbTAtMUEyMCwyMCwwLDAsMCwzMi4xMywxMy40MiwxMCwxMCwwLDAsMCwxNywyMnYuMTRBOC41LDguNSwwLDAsMCwxOC41LDM5YzIsMCwxNSwuMTMsMjcuNjYuMjUsMTIuOTEuMTIsMjYuMjYuMjUsMjguMzQuMjVhMTEsMTEsMCwxLDAtMy42MS0yMS4zOUEyMC4xLDIwLjEsMCwwLDAsNTEsMFoiLz48L2c+PC9nPjwvc3ZnPg==">';
                return '<span id="ps_'+row.id+'">'+proxied+'</span>';
            }
        }, {
            data: null,
            render: function(data, type, row, meta) {
                var edit = '<a href="#!" class="m-r-15 text-muted" title="Edit" onClick="show_edit_record(\''+row.id+'\')"><i class="icofont icofont-ui-edit"></i></a>';
                var del = '<a href="#!" class="m-r-15 text-muted" title="Delete" onClick="delete_record(\''+row.id+'\')"><i class="icofont icofont-delete-alt"></i></a>';
                return edit+del;
            }
        }],
        columnDefs: [
            { targets: [0,1,2,3,4,5,6], orderable: false, searchable: false},
            { targets: [0,1,2,5,6],  width: '2%'},
            { targets: [],  width: '10%'},
        ],
        rowCallback: function(row, data) {
            setTimeout(() => {
              reselected_row();
            }, 200)
        }
    });
    if (!lc_get('timereloaddns')){
    lc_set('timereloaddns',30000)
    }
    function refresh_list() {
        table1.ajax.reload();
    }
    var anchorTags = document.getElementsByClassName("port");
    for (var i = 0; i < anchorTags.length; i++) {
        anchorTags[i].onclick = function() {
            alert(this.innerHTML);
        }
    }
    setInterval(() => {
      refresh_list();
    }, lc_get('timereloaddns'))
    
})
function renew_url(zoneid,domain) {
    var new_url = '../../ajax/list_record/' + zoneid+'/';
    $('#'+table_name).dataTable().api().ajax.url(new_url).load();
    JSON.parse(lc_get('all_zone')).forEach((item) => {
      $('#list_'+item).attr('class','');
    })
    lc_set('domain_active',domain);
    lc_set('zone_active',zoneid);
    $('#list_'+zoneid).attr('class','active');
}
function render_zone(data){
        var all_zone = [];
        $('#list_zone').html("");
    data.forEach((item) => {
        all_zone.push(item.id);
        if (item.status == 'active')var icon = 'text-success ti-check';
        else if (item.status == 'pending')var icon = 'text-info icofont icofont-refresh';
        else var icon = item.status;
      $('#list_zone').append('<li class="" id="list_'+item.id+'" name="zone"><div class="mail-section"><a href="#"onClick="renew_url(\''+item.id+'\',\''+item.name+'\')""><i class="ti-arrow-right"></i>Domain: '+item.name+' <span class="'+icon+'"></span> </a></div></li>');
    })
    lc_set('all_zone',JSON.stringify(all_zone));
}
function checkall2(source) {
  checkboxes = document.getElementsByName('check');
  for(var i=0, n=checkboxes.length;i<n;i++) {
    checkboxes[i].checked = source.checked;
  }
}
function listport2(){
checkboxes = document.getElementsByName('check');
var arr = [];
checkboxes.forEach((item) => {
    if(item.checked == true){
        arr.push(item.value);
    }
})
return arr;
}
function config_table(){
    lc_set('timereloaddns',$('#time_rl').val()*1000);
    toastr["success"]('Thành Công');
    setTimeout(() => {
      location.reload();
    }, 2000)
}
function save_cf(){
    var email = $('#cf_email').val(), token = $('#cf_token').val(), certtoken = $('#cf_certtoken').val();
    if (email.split('@').length != 2){
        toastr["error"]('Invalid email');
        return false;
    }else if (token.length < 32){
        toastr["error"]('Invalid Token');
        return false;
    }else if (token.certtoken < 120){
        toastr["error"]('Invalid Certtoken');
        return false;
    }else{
        post('save_cf',{'email':email,'token':token,'certtoken':certtoken},'post');
    }
}
function delete_record(rid){
    if(!Array.isArray(rid))rid = rid.split(',');
    if(!lc_get('zone_active')){
        toastr["error"]('Please select Zone');
        return false;
    }else if(rid.length < 1){
        toastr["error"]('Please select Record');
        return false;        
    }else{
        post('delete_record',{'zoneid':lc_get('zone_active'),'record_id':rid},'post');
        setTimeout(() => {
          $('#'+table_name).dataTable().api().ajax.reload();
        }, 2000)
    }
}
function get_one_row(rid){
    var all = all_datatble(),data = false;
    for (var i = 0; i < all['data'].length; i++) {
        var item = all['data'][i];
          if(item.id == rid){
             data = item;
             break;
          }
    }
    return data;
}
function show_edit_record(rid){
var rows = get_one_row(rid);
if (rows) {
    $('#r_type').val(rows.type);
    $('#r_name').val(rows.name);
    $('#r_content').val(rows.content);
    $('#r_ttl').val(rows.ttl);
    $('#u_rid').val(rid);
    if (rows.proxied == false){
        $('#r_proxied').attr('src','data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA5MC41IDU5Ij48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6IzkyOTc5Yjt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPkFzc2V0IDI8L3RpdGxlPjxnIGlkPSJMYXllcl8yIiBkYXRhLW5hbWU9IkxheWVyIDIiPjxnIGlkPSJMYXllcl8xLTIiIGRhdGEtbmFtZT0iTGF5ZXIgMSI+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNDksMTMuNVYxOUw1OSw5LjUsNDksMFY1LjVINDAuNzhhMTIuNDMsMTIuNDMsMCwwLDAtOS41LDQuNDJMMTcuNjUsMjcuMTZhOC44Myw4LjgzLDAsMCwxLTYuOTEsMy4zNEg1bC01LDhIMTMuMzlhMTEuMjcsMTEuMjcsMCwwLDAsOS00LjQ4TDM1LjA1LDE3LjE4YTkuODEsOS44MSwwLDAsMSw3LjY2LTMuNjhaIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNODAuNSwzOUExMCwxMCwwLDAsMCw3Niw0MC4wOWExOSwxOSwwLDAsMC0zNy4zLTQuNTdBOSw5LDAsMCwwLDI0LDQyLjVhOC40Nyw4LjQ3LDAsMCwwLC4wNiwxLDcuNSw3LjUsMCwwLDAsLjQ0LDE1YzQsMCw1MS44OS41LDU2LC41YTEwLDEwLDAsMCwwLDAtMjBaIi8+PC9nPjwvZz48L3N2Zz4=');
        $('#u_proxied').val('0');
    }else{
        $('#r_proxied').attr('src','data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDQgMzkuNSI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOiM5OTk7fS5jbHMtMntmaWxsOiNmNjhhMWQ7fS5jbHMtM3tmaWxsOiNmZmY7fTwvc3R5bGU+PC9kZWZzPjx0aXRsZT5Bc3NldCAxPC90aXRsZT48ZyBpZD0iTGF5ZXJfMiIgZGF0YS1uYW1lPSJMYXllciAyIj48ZyBpZD0iTGF5ZXJfMS0yIiBkYXRhLW5hbWU9IkxheWVyIDEiPjxwb2x5Z29uIGNsYXNzPSJjbHMtMSIgcG9pbnRzPSIxMDQgMjAuMTIgOTQgMTAuNjIgOTQgMTYuMTIgMCAxNi4xMiAwIDI0LjEyIDk0IDI0LjEyIDk0IDI5LjYyIDEwNCAyMC4xMiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTc0LjUsMzljLTIuMDgsMC0xNS40My0uMTMtMjguMzQtLjI1LTEyLjYyLS4xMi0yNS42OC0uMjUtMjcuNjYtLjI1YTgsOCwwLDAsMS0xLTE1LjkzYzAtLjE5LDAtLjM4LDAtLjU3YTkuNDksOS40OSwwLDAsMSwxNC45LTcuODEsMTkuNDgsMTkuNDgsMCwwLDEsMzguMDUsNC42M0ExMC41LDEwLjUsMCwxLDEsNzQuNSwzOVoiLz48cGF0aCBjbGFzcz0iY2xzLTMiIGQ9Ik01MSwxQTE5LDE5LDAsMCwxLDcwLDE5LjU5LDEwLDEwLDAsMSwxLDc0LjUsMzguNWMtNC4xMSwwLTUyLS41LTU2LS41YTcuNSw3LjUsMCwwLDEtLjQ0LTE1QTguNDcsOC40NywwLDAsMSwxOCwyMmE5LDksMCwwLDEsMTQuNjgtN0ExOSwxOSwwLDAsMSw1MSwxbTAtMUEyMCwyMCwwLDAsMCwzMi4xMywxMy40MiwxMCwxMCwwLDAsMCwxNywyMnYuMTRBOC41LDguNSwwLDAsMCwxOC41LDM5YzIsMCwxNSwuMTMsMjcuNjYuMjUsMTIuOTEuMTIsMjYuMjYuMjUsMjguMzQuMjVhMTEsMTEsMCwxLDAtMy42MS0yMS4zOUEyMC4xLDIwLjEsMCwwLDAsNTEsMFoiLz48L2c+PC9nPjwvc3ZnPg==');
        $('#u_proxied').val('1');
    }
    // $('#r_type').val(rows.type);
    $('#m_edit_record').modal();
}else{
    toastr["error"]('Row not found');
}
}
function change_proxied(id,arr){
    id = id.substring(2);
    arr = arr.split(',');
    var state = $('#'+arr[1]+'_'+id).val();
    if (state == '0') {
        $('#'+arr[0]+'_'+id).attr('src','data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDQgMzkuNSI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOiM5OTk7fS5jbHMtMntmaWxsOiNmNjhhMWQ7fS5jbHMtM3tmaWxsOiNmZmY7fTwvc3R5bGU+PC9kZWZzPjx0aXRsZT5Bc3NldCAxPC90aXRsZT48ZyBpZD0iTGF5ZXJfMiIgZGF0YS1uYW1lPSJMYXllciAyIj48ZyBpZD0iTGF5ZXJfMS0yIiBkYXRhLW5hbWU9IkxheWVyIDEiPjxwb2x5Z29uIGNsYXNzPSJjbHMtMSIgcG9pbnRzPSIxMDQgMjAuMTIgOTQgMTAuNjIgOTQgMTYuMTIgMCAxNi4xMiAwIDI0LjEyIDk0IDI0LjEyIDk0IDI5LjYyIDEwNCAyMC4xMiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTc0LjUsMzljLTIuMDgsMC0xNS40My0uMTMtMjguMzQtLjI1LTEyLjYyLS4xMi0yNS42OC0uMjUtMjcuNjYtLjI1YTgsOCwwLDAsMS0xLTE1LjkzYzAtLjE5LDAtLjM4LDAtLjU3YTkuNDksOS40OSwwLDAsMSwxNC45LTcuODEsMTkuNDgsMTkuNDgsMCwwLDEsMzguMDUsNC42M0ExMC41LDEwLjUsMCwxLDEsNzQuNSwzOVoiLz48cGF0aCBjbGFzcz0iY2xzLTMiIGQ9Ik01MSwxQTE5LDE5LDAsMCwxLDcwLDE5LjU5LDEwLDEwLDAsMSwxLDc0LjUsMzguNWMtNC4xMSwwLTUyLS41LTU2LS41YTcuNSw3LjUsMCwwLDEtLjQ0LTE1QTguNDcsOC40NywwLDAsMSwxOCwyMmE5LDksMCwwLDEsMTQuNjgtN0ExOSwxOSwwLDAsMSw1MSwxbTAtMUEyMCwyMCwwLDAsMCwzMi4xMywxMy40MiwxMCwxMCwwLDAsMCwxNywyMnYuMTRBOC41LDguNSwwLDAsMCwxOC41LDM5YzIsMCwxNSwuMTMsMjcuNjYuMjUsMTIuOTEuMTIsMjYuMjYuMjUsMjguMzQuMjVhMTEsMTEsMCwxLDAtMy42MS0yMS4zOUEyMC4xLDIwLjEsMCwwLDAsNTEsMFoiLz48L2c+PC9nPjwvc3ZnPg==');
        $('#'+arr[1]+'_'+id).val('1');
    }else{
        $('#'+arr[0]+'_'+id).attr('src','data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA5MC41IDU5Ij48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6IzkyOTc5Yjt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPkFzc2V0IDI8L3RpdGxlPjxnIGlkPSJMYXllcl8yIiBkYXRhLW5hbWU9IkxheWVyIDIiPjxnIGlkPSJMYXllcl8xLTIiIGRhdGEtbmFtZT0iTGF5ZXIgMSI+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNDksMTMuNVYxOUw1OSw5LjUsNDksMFY1LjVINDAuNzhhMTIuNDMsMTIuNDMsMCwwLDAtOS41LDQuNDJMMTcuNjUsMjcuMTZhOC44Myw4LjgzLDAsMCwxLTYuOTEsMy4zNEg1bC01LDhIMTMuMzlhMTEuMjcsMTEuMjcsMCwwLDAsOS00LjQ4TDM1LjA1LDE3LjE4YTkuODEsOS44MSwwLDAsMSw3LjY2LTMuNjhaIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNODAuNSwzOUExMCwxMCwwLDAsMCw3Niw0MC4wOWExOSwxOSwwLDAsMC0zNy4zLTQuNTdBOSw5LDAsMCwwLDI0LDQyLjVhOC40Nyw4LjQ3LDAsMCwwLC4wNiwxLDcuNSw3LjUsMCwwLDAsLjQ0LDE1YzQsMCw1MS44OS41LDU2LC41YTEwLDEwLDAsMCwwLDAtMjBaIi8+PC9nPjwvZz48L3N2Zz4=');
        $('#'+arr[1]+'_'+id).val('0');
    }
}
function update_dnscf(){
    var type = $('#r_type').val(),name = $('#r_name').val(),content = $('#r_content').val(),ttl = $('#r_ttl').val(),rid = $('#u_rid').val(),proxied = $('#u_proxied').val();
      if(!lc_get('zone_active')){
        toastr["error"]('Please select Zone');
        return false;
    }else if(rid.length < 30){
        toastr["error"]('Please select Record');
        return false;        
    }else{
       post('update_record',{'zoneid':lc_get('zone_active'),'record_id':rid,'type':type,'name':name,'content':content,'ttl':ttl,'proxied':proxied},'post'); 
        setTimeout(() => {
          $('#'+table_name).dataTable().api().ajax.reload();
        }, 1000)
    } 
}
function add_dnscf(){
    var type = $('#a_type').val(),name = $('#a_name').val(),content = $('#a_content').val(),ttl = $('#a_ttl').val(),proxied = $('#s_proxied').val();
      if(!lc_get('zone_active')){
        toastr["error"]('Please select Zone');
        return false;
    }else{
       post('add_record',{'zoneid':lc_get('zone_active'),'type':type,'name':name,'content':content,'ttl':ttl,'proxied':proxied},'post'); 
        setTimeout(() => {
          $('#'+table_name).dataTable().api().ajax.reload();
        }, 1000)
        $('#f_add_dns')[0].reset();
    } 
}
function turn_sw(id,sw){
// if ($('#'+id+'2').val() == '1'){
if (sw != $('#'+id).prop('checked')){
$('#'+id).click();
}
// }
}
function dnscf_change(){
    var sw = $('#switch_cf')[0].checked;
if($('#switch_cf2').val() == "1"){
  if(sw){
    post('dnscf', {'switch':'on'},'post');
  }else{
    post('dnscf', {'switch':'off'},'post');
  }
}
}