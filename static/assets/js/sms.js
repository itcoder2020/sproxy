var table_name = "dt-sms";
$(function() {
    post('allport','sms','get');
    lc_del('port_active');
    var table1 = $('#' + table_name).DataTable({
        'iDisplayLength': 5,
        'pageLength': 20,
        // "paging": false,
        // "scrollX": "200px",
        "autoWidth": false,
        "fixedHeader": true,
        "scrollY": "580px",
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
            url: '/ajax/empty',
            dataSrc: function(json) {
                return json.data;
            }
        },
        buttons: [{
                extend: 'collection',
                text: '<i class="ti-trash"></i> Delete',
                titleAttr: 'Delete SMS',
                autoClose: true,
                buttons: [{
                    text: '<i class="ti-trash"></i> Delete',
                    className: "btn-delete-selected",
                    titleAttr: 'Delete SMS Selected',
                    action: function() {
                var checked = listport();
                if (checked.length < 1){
                    toastr["error"]('Please select at least 1 row');
                }else{
                    var selected_port = lc_get('port_active');
                    if (selected_port){
                    post('delete_sms_inbox',{'port':selected_port,'index':checked},'post');
                        setTimeout(() => {
                          refresh_list();
                        }, 1000)
                }else{
                   toastr["error"]('Port is not selected'); 
                }
                }
                    }
                }, {
                    text: '<i class="fal fa-trash"></i> Delete All Sms',
                    className: "btn-delete-all",
                    titleAttr: 'delete all sms current usb showing',
                    action: function() {
                    post('delete_sms_inbox_all',{'port':lc_get('port_active'),'boxtype':lc_get('boxtype')},'post');
                        setTimeout(() => {
                          refresh_list();
                        }, 1000)
                    }
                }, {
                    text: '<i class="fas fa-trash"></i> Delete All Sms of ALL USB',
                    className: "btn-delete-all",
                    titleAttr: 'delete all sms of All usb',
                    action: function() {
                    post('delete_sms_inbox_all_usb',{'boxtype':lc_get('boxtype')},'post');
                        setTimeout(() => {
                          refresh_list();
                        }, 1000)
                    }
                }]
        }, {
            text: '<i class="fas fa-refresh fa-spin"></i> Refresh',
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
                return '<div class="checkbox-fade fade-in-primary"><label><input type="checkbox" id="primary_' + row.index + '" value="' + row.index + '" name="box" onClick="cache_select()"><span class="cr"><i class="cr-icon icofont icofont-ui-check txt-primary"></i></span><span class="text-inverse">' + row.id + '</span></label></div>';
            }
        }, {
            data: null,
            render: function(data, type, row, meta) {
                return '<span id="u_'+row.index+'">'+row.usb+':'+row.port+'</span>';
            }
        }, {
            data: null,
            render: function(data, type, row, meta) {
                return '<a class="waves-effect waves-light" href="#" onclick="reply_one_sms(\''+row.index+'\')" title="Reply This Message"><i class="fad fa-reply text-info"></i></a><a class="btn-sm waves-effect waves-light" href="#" onclick="forward_one_sms(\''+row.index+'\')" title="Forward This Message"><i class="fa fa-mail-forward text-info"></i></a><a class="waves-effect waves-light" href="#" onclick="delete_one_sms(\''+row.index+'\')" title="Delete This Message"><i class="ti-trash text-danger"></i></a>';
            }
        }, {
            data: null,
            render: function(data, type, row, meta) {
                return '<span id="n_'+row.index+'">'+row.number+'</span>';
            }
        }, {
            data: null,
            render: function(data, type, row, meta) {
                return row.date;
            }
        }, {
            data: null,
            render: function(data, type, row, meta) {
                return '<a onmousemove="" id="content_'+row.index+'" href="#" onClick="view_sms(\''+row.index+'\')">'+row.content+'</a>';
            }
        }],
        columnDefs: [
            { targets: [0,1,2,3,4], orderable: false, searchable: false},
            { targets: [0,1,2],  width: '2%'},
            { targets: [3],  width: '5%'},
        ],
        rowCallback: function(row, data) {
            setTimeout(() => {
              reselected_row();
            }, 200)
        }
    });
    if (lc_get('selected_sms')){
    reselected_row();
    }
    if (!lc_get('timereload_sms')){
    lc_set('timereload_sms',5000)
    }
    if (lc_get('boxtype')){
    $("#boxtype").val(lc_get('boxtype'));
    }else{
        lc_set('boxtype','1');
        $("#boxtype").val('1');
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
    }, lc_get('timereload_sms'))
    //
})
function renew_url(port,emei,usb) {
    var typer = lc_get('boxtype');
    if(['1','2','3'].indexOf(typer) < 0){
        toastr["error"]('Boxtype Selected wrong');
        return false;
    }
    var new_url = '../../ajax/listsms/' + port+'/'+typer;
    $('#'+table_name).dataTable().api().ajax.url(new_url).load();
    JSON.parse(lc_get('list_port_sms')).forEach((item) => {
      $('#list_'+item).attr('class','');
    })
    lc_set('port_active',port);
    lc_set('emei_active',emei);
    lc_set('usb_active',usb);
    $('#list_'+port).attr('class','active');
    toastr["success"]('Get list sms Port '+ port + ' , USB '+usb+ 'success');
}
function render_port(data){
    if(data['error_code'] === 1){
    toastr["error"](data['message']);
    }else{
        var lport = [];
        $('#list_port').html("");
        $('#s_port').html("");
    data['data'].forEach((item) => {
        lport.push(item.port);
      $('#list_port').append('<li class="" id="list_'+item.port+'" name="port"><a href="#"onClick="renew_url(\''+item.port+'\',\''+item.imei+'\',\''+item.usb+'\')""><i class="ti-arrow-right"></i>USB: '+item.usb+':'+item.port+' - '+item.imei+' </a></li>');
      $('#s_port').append('<div class="checkbox-fade fade-in-primary"><label><input type="checkbox" id="c_port_' + item.port + '" value="' + item.port + '" name="check"><span class="cr"><i class="cr-icon icofont icofont-ui-check txt-primary"></i></span><span class="text-inverse">' + item.port + '</span></label></div>');
    })
    lc_set('list_port_sms',JSON.stringify(lport));
    }
}
function cache_select(){
setTimeout(() => {
      lc_del('selected_sms');
    lc_set('selected_sms', JSON.stringify(listport()))
}, 200)
}
function reselected_row(){
var box = document.getElementsByName('box'), cache = lc_get('selected_sms');
if(cache){
box.forEach((item) => {
  if(cache.indexOf(item.value) > -1) item.checked = true;
  else item.checked = false;
})
}
}
function check_port_active(){
var box = document.getElementsByName('check');
box.forEach((item) => {
  if(item.value == lc_get('port_active')) item.checked = true;
  else item.checked = false;
})
}
function view_sms(id){
    $('#view_sms').modal();
    $('#ms_fr').val($('#n_'+id).text());
    $('#res').val($('#content_'+id).text());
    if(lc_get('port_active')){
    $('#ms_port').val(lc_get('usb_active') + ':' +$('#p_'+id).text()+' - '+lc_get('emei_active'));
    }else{
        $('#ms_port').val($('#p_'+id).text());
    }
}
function reply_sms(){
  $('#view_sms').modal('hide');
  $('#send_sms').modal();
  $('#to_num').val($('#ms_fr').val());
  $('#message').val('');
  check_port_active();
}
function reply_one_sms(index){
  $('#send_sms').modal();
  $('#to_num').val($('#n_'+index).text());
  $('#message').val('');
  check_port_active();
}
function forward_sms(){
    var conttent = $('#res').val();
  $('#view_sms').modal('hide');
  $('#send_sms').modal();
  $('#to_num').val('');
  $('#message').val(conttent);
  check_port_active();
}
function forward_one_sms(index){
    var conttent = $('#content_'+index).text();
  $('#send_sms').modal();
  $('#to_num').val('');
  $('#message').val(conttent);
  check_port_active();
}
function delete_one_sms(index){
    if (lc_get('port_active') && index != '0'){
    post('delete_sms_inbox',{'port':lc_get('port_active'),'index':[index]},'post');
        setTimeout(() => {
          refresh_list_api();
        }, 1000)
    }else{
        toastr["error"]('Please select Usb Port');
    }
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
function sending_sms(){
    var checked = listport2(),to_num = $('#to_num').val(),message = $('#message').val();
    if (checked.length < 1)toastr["error"]('Please select at least 1 row');
    else if (String(to_num) < 3)toastr["error"]('invalid phone number');
    else 
        post('sendsms',{'port':checked,'number':to_num,'message':message},'post');    
}
function res_send_sms(data){
    data['data'].forEach((item) => {
      if (item.error_code === 0) toastr["success"]('Port : '+item.port+' '+item.message);
      else toastr["error"](item.message);
    })
}
function view_box_type(){
    var portat = lc_get('port_active');
    lc_set('boxtype',$('#boxtype').val());
    if(portat){
        renew_url(portat);
    }
}
function config_table(){
    lc_set('timereload_sms',$('#time_rl').val()*1000);
    toastr["success"]('Thành Công');
    setTimeout(() => {
      location.reload();
    }, 2000)
}
