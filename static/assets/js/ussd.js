var table_name = "dt-ussd";
$(function() {
    post('allport','ussd','get');
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
            url: '/ajax/allussd',
            dataSrc: function(json) {
                return json.data;
            }
        },
        buttons: [{
            text: '<i class="fa fa-refresh fa-spin"></i> Refresh',
            className: 'btn-reload',
            titleAttr: 'Reload List',
            action: function() {
                refresh_list();
                toastr["success"]('Reload list success');
            },
        }, {
            text: '<i class="fad fa-sync fa-spin"></i> Reload List Port',
            className: 'btn-rllistport',
            titleAttr: 'Reload List',
            action: function() {
                post('allport','sms','get')
                toastr["success"]('Reload list success');
            },
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
                return '<span id="u_'+row.port+'">'+row.usb+':'+row.port+'</span>';
            }
        }, {
            data: null,
            render: function(data, type, row, meta) {
                var sp = (row.ussd_support == 1) ? '<span class="text-success ti-check"' : '<span class="text-danger ti-close"';
                return '<span id="i_'+row.port+'">'+row.imei+'  '+sp+'</span>';
            }
        }, {
            data: null,
            render: function(data, type, row, meta) {
                return timestamps_to_date(row.ussd_time);
            }
        }, {
            data: null,
            render: function(data, type, row, meta) {
                return '<span id="n_'+row.port+'">'+row.ussd_cmd+'</span>';
            }
        },{
            data: null,
            render: function(data, type, row, meta) {
                return '<a id="content_'+row.port+'" href="#" onClick="view_ussd(\''+row.port+'\')">'+row.ussd_content+'</a>';
            }
        }],
        columnDefs: [
            { targets: [0,1,2,3,4], orderable: false, searchable: false},
            { targets: [0,1,2,3,4],  width: '5%'},
        ],
        rowCallback: function(row, data) {
            setTimeout(() => {
              reselected_row();
            }, 200)
        }
    });
    if (lc_get('selected_ussd')){
    reselected_row();
    }
    if (!lc_get('timereload_ussd')){
    lc_set('timereload_ussd',30000)
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
    }, lc_get('timereload_ussd'))
    //
})
function render_port(data){
    if(data['error_code'] === 1){
    toastr["error"](data['message']);
    }else{
        var lport = [];
        // $('#list_port').html("");
        $('#s_port').html("");
    data['data'].forEach((item) => {
        lport.push(item.port);
      $('#s_port').append('<div class="checkbox-fade fade-in-primary"><label><input type="checkbox" id="c_port_' + item.port + '" value="' + item.port + '" name="check"><span class="cr"><i class="cr-icon icofont icofont-ui-check txt-primary"></i></span><span class="text-inverse">' + item.port + '</span></label></div>');
    })
    lc_set('list_port_ussd',JSON.stringify(lport));
    }
}
function cache_select(){
setTimeout(() => {
      lc_del('selected_ussd');
    lc_set('selected_ussd', JSON.stringify(listport()))
}, 200)
}
function reselected_row(){
var box = document.getElementsByName('box'), cache = lc_get('selected_ussd');
if(cache){
box.forEach((item) => {
  if(cache.indexOf(item.value) > -1) item.checked = true;
  else item.checked = false;
})
}
}
function view_ussd(id){
    $('#view_ussd').modal();
    $('#u_cmd').val($('#n_'+id).text());
    $('#u_port').val($('#u_'+id).text()+':'+$('#p_'+id).text()+' - '+$('#i_'+id).text());
    $('#res').val($('#content_'+id).text());
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
function send_ussd(){
    var checked = listport2(),cmd = $('#s_command').val();
    if (checked.length < 1)toastr["error"]('Please select at least 1 row');
    else if (cmd.length < 3)toastr["error"]('invalid command');
    else 
        post('sendussd',{'port':checked,'cmd':cmd},'post');
    for (var i = 1; i < 5; i++) {
        setTimeout(() => {
          $('#'+table_name).dataTable().api().ajax.reload();
        }, i*2000)
    }
}
function res_send_ussd(data){
    data['data'].forEach((item) => {
      if (item.error_code === 0) toastr["success"]('Port : '+item.port+' '+item.message);
      else toastr["error"](item.message);
    })
}
function config_table(){
    lc_set('timereload_ussd',$('#time_rl').val()*1000);
    toastr["success"]('Thành Công');
    setTimeout(() => {
      location.reload();
    }, 2000)
}