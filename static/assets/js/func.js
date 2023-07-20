var paths = window.location.pathname;
var path = paths.split("/");
var dateobj = new Date();
var month = dateobj.getMonth()+1;
var dauthang = '01/' + month + '/' + dateobj.getFullYear(); 
var homnay = dateobj.getDate() + '/' + month + '/' + dateobj.getFullYear(); 
function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
function post(urls, datas='',method = 'post') {
   $.ajax({
        type: method.toUpperCase(),
        url: '/ajax/'+ urls,
        data: JSON.stringify(datas),
        contentType: "application/json",
        beforeSend: function() {
            $("#loading").show();
        },
        success: function(data){
    	if (data.error_code === 0) {
    		toastr["success"](data.message);
    		if(urls == 'clear_count_data') res_clear_data(data);
    		else if(urls == 'changemode') res_change_switch(data);
    		else if(urls == 'allport') render_port(data);
    		else if(urls == 'sendsms') res_send_sms(data);
    		else if(urls == 'sendussd') res_send_ussd(data);
    		else if(urls == 'verify_account') res_verify_account();
    		else if(urls == 'set_account') res_set_account();
    		else if(urls == 'api_protect') res_api(data);
    		else if(urls == 'get_account') get_account(data);
    		else if(urls == 'setproxy_account') set_account('get',data);
    		else if(urls == 'get_autoip') res_autoip(data);
    		else if(urls == 'set_autoip') set_autoip('get',data);
    		else if(urls == 'check_update') res_check_update(data);
            else if(urls == 'reset_ip') checking();
            else if(urls == 'update_record') $('#m_edit_record').modal('hide');
    		else if(urls == 'get_zone' || urls == 'save_cf') render_zone(data.data);
//			
        }else{
          toastr["error"](data.message)
        }
        },
        error: function(data) {
            $("#loading").hide();
            toastr["error"]('Có lỗi xảy ra. Vui lòng thử lại sau!');
        },
        complete: function() {
            $("#loading").hide();
        }
    });
    
}
function VietChar(str){
    let vietChar = 'á|à|ả|ã|ạ|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ|é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ|ó|ò|ỏ|õ|ọ|ơ|ớ|ờ|ở|ỡ|ợ|ô|ố|ồ|ổ|ỗ|ộ|ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự|í|ì|ỉ|ĩ|ị|ý|ỳ|ỷ|ỹ|ỵ|đ|Á|À|Ả|Ã|Ạ|Ă|Ắ|Ằ|Ẳ|Ẵ|Ặ|Â|Ấ|Ầ|Ẩ|Ẫ|Ậ|É|È|Ẻ|Ẽ|Ẹ|Ê|Ế|Ề|Ể|Ễ|Ệ|Ó|Ò|Ỏ|Õ|Ọ|Ơ|Ớ|Ờ|Ở|Ỡ|Ợ|Ô|Ố|Ồ|Ổ|Ỗ|Ộ|Ú|Ù|Ủ|Ũ|Ụ|Ư|Ứ|Ừ|Ử|Ữ|Ự|Í|Ì|Ỉ|Ĩ|Ị|Ý|Ỳ|Ỷ|Ỹ|Ỵ|Đ'.split('|');
    let engChar = 'a|a|a|a|a|a|a|a|a|a|a|a|a|a|a|a|a|e|e|e|e|e|e|e|e|e|e|e|o|o|o|o|o|o|o|o|o|o|o|o|o|o|o|o|o|u|u|u|u|u|u|u|u|u|u|u|i|i|i|i|i|y|y|y|y|y|d|A|A|A|A|A|A|A|A|A|A|A|A|A|A|A|A|A|E|E|E|E|E|E|E|E|E|E|E|O|O|O|O|O|O|O|O|O|O|O|O|O|O|O|O|O|U|U|U|U|U|U|U|U|U|U|U|I|I|I|I|I|Y|Y|Y|Y|Y|D'.split('|');
    for (var i = 0; i < vietChar.length; i++) {
      str = str.replaceAll(vietChar[i],engChar[i]);
    }
    return str;
}
function convert_time(totalSeconds){
let days = Math.floor(totalSeconds / 86400);
totalSeconds %= 86400;
let hours = Math.floor(totalSeconds / 3600);
totalSeconds %= 3600;
let minutes = Math.floor(totalSeconds / 60);
let seconds = totalSeconds % 60;
minutes = String(minutes).padStart(2, "0");
hours = String(hours).padStart(2, "0");
seconds = String(seconds).padStart(2, "0");
var times = days + ":" + hours + ":" + minutes + ":" + seconds;
return times;
}
function Upper_first(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function get_string(s, a, b) {
    var p = s.indexOf(a) + a.length;
    return s.substring(p, s.indexOf(b, p));
}
function SmoothScrollTo(id, timelength){
    var timelength = timelength || 1000;
    $('html, body').animate({
        scrollTop: $(id).offset()
    }, timelength, function(){
        window.location.hash = id;
    });
}
function timestamps_to_date(times){
var ts_ms = times * 1000;
var date_ob = new Date(ts_ms);
var year = date_ob.getFullYear();
var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
var date = ("0" + date_ob.getDate()).slice(-2);
var hours = ("0" + date_ob.getHours()).slice(-2);
var minutes = ("0" + date_ob.getMinutes()).slice(-2);
var seconds = ("0" + date_ob.getSeconds()).slice(-2);
return hours + ':'+ minutes + ':'+ seconds + ' ' + date + '/'+ month;
}
function time_stamp(){
  return Math.floor(Date.now() / 1000);
}
function all_datatble(){
return $('#'+table_name).dataTable().api().ajax.json();
}
function refresh_list_api(){
    $('#'+table_name).dataTable().api().ajax.reload();
}
function checkall(source) {
  checkboxes = document.getElementsByName('box');
  for(var i=0, n=checkboxes.length;i<n;i++) {
    checkboxes[i].checked = source.checked;
  }
}
function listport(){
checkboxes = document.getElementsByName('box');
var arr = [];
checkboxes.forEach((item) => {
    if(item.checked == true){
		arr.push(item.value);
	}
})
return arr;
}
function listchecked(){
checkboxes = document.getElementsByName('box');
var arr = [],list = [];
checkboxes.forEach((item) => {
    if(item.checked == true){
		arr.push(item.value);
	}
})
if (arr.length > 0){
all_datatble()['data'].forEach((item2) => {
  if(arr.indexOf(String(item2.port)) > -1){
 list.push(item2);
}
})
}
return list;
}
function lc_clear() {
    localStorage.clear();
}
function lc_set(id , value) {
  localStorage.setItem(id, value);
}
function lc_get(id) {
  return localStorage.getItem(id);
}
function lc_del(id) {
  var x = localStorage.removeItem(id);
}
function copytext(str){
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(str).select();
    document.execCommand("copy");
    $temp.remove();
}