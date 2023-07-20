var table_name = "";
var path_name = window.location.pathname;
var mode = path_name.split('/')[3];
function change_range(type) {
    if (type == 'default') {
        var port_start = parseInt($('#port_start').val());
        var port_end = parseInt($('#port_end').val());
    } else {
        var port_start = parseInt($('#port_usb_start').val());
        var port_end = parseInt($('#port_usb_end').val());
    }
    if (port_start > port_end) {
        toastr["error"]('The start port must not be greater than the end port');
        return false;
    } else if (port_end - port_start < 30 || port_end - port_start > 150) {
        toastr["error"]('The port range is too short or long will cause the device to run slowly, please set the port length between 30 and 100 ports');
        return false;
    } else if (port_start < 1000 || port_start > 63555) {
        toastr["error"]('Start port should be in the range 1000-63555');
        return false;
    } else if (port_end < 1000 || port_end > 63555) {
        toastr["error"]('End port should be in the range 1000-63555');
        return false;
    } else if (22222 > port_start && 22222 < port_end) {
        toastr["error"]('This range port contains app port, you cannot add this range port');
        return false;
    } else {
        post('change_range', {
            'port_start': port_start,
            'port_end': port_end,
            'type': type
        }, 'post');
    }
}

function res_verify_account() {
    lc_set('verify_account', 1);
    $('#login_user_current').hide();
    $('#set_new_user').show();
}

function res_set_account() {
    lc_del('verify_account');
    $('#login_user_current').show();
    $('#set_new_user').hide();
}

function switches(switch_elem, on) {
    if (on) {
        if ($(switch_elem)[0].checked) {} else {
            $(switch_elem).trigger('click').attr("checked", "checked");
        }
    } else {
        if ($(switch_elem)[0].checked) {
            $(switch_elem).trigger('click').removeAttr("checked");
        } else {}
    }
}

function turn_sw(id, sw) {
    if ($('#switch_api2').val() == '1') {
        if (sw != $('#' + id).prop('checked')) {
            $('#' + id).click();
        }
    }
}

function api_change() {
    var state = (api_protect == 'on') ? true : false;
    var sw = $('#switch_api')[0].checked;
    console.log($('#switch_api2').val());
    if ($('#switch_api2').val() == "1") {
        if (sw) {
            post('api_protect', {
                'switch': 'on'
            }, 'post');
        } else {
            post('api_protect', {
                'switch': 'off'
            }, 'post');
        }
    }
}

function res_api(data) {
    if (data.error_code == 0) {
        if (data.switch == 'on') {
            turn_sw('switch_api', true);
            $('#tokens').val(data.token);
            $('#form-token').show();
        } else {
            turn_sw('switch_api', false);
            $('#form-token').hide();
        }
        $('#switch_api2').val('1');
    }
}

function get_account(data) {
    if (data.error_code == 0) {
        data['data'].forEach((item) => {
            $('#proxypass').append(item + '\r\n');
        })
    }
}

function set_account(t, data = '') {
    if (t == 'post') {
        post('setproxy_account', {
            'line': $('#proxypass').val().split('\n')
        }, 'post');
    } else {
        data['data'].forEach((item) => {
            if (item.error_code == 0) {
                toastr["success"](item.row + ' : ' + item.message);
            } else {
                toastr["error"](item.row + ' : ' + item.message);
            }
        })
    }
}

function res_autoip(data) {
    data['data'].forEach((item) => {
        $('#autoch').append(item + '\r\n');
    })
}

function repl(rows) {
    var row = rows.split(':'),
        new_row = '';
    for (var i = 0; i < row.length; i++) {
        new_row += row[i].replace(/([^0-9])/g, '') + ':';
    }
    return new_row;
}

function remove_char() {
    var data = $('#autoch').val(),
        text = '';
    $('#autoch').val('');
    var lines = data.split("\n");
    for (var i = 0; i < lines.length; i++) {
        var rp = repl(lines[i]);
        rp = rp.substring(0, rp.length - 1)
        if (rp.length > 5) {
            text += rp + "\r\n";
        }
    }
    $('#autoch').val(text);
}

function set_autoip(t, data = '') {
    if (t == 'post') {
        post('set_autoip', {
            'line': $('#autoch').val().split('\n')
        }, 'post');
    } else {
        data['data'].forEach((item) => {
            if (item.error_code == 0) {
                toastr["success"](item.row + ' : ' + item.message);
            } else {
                toastr["error"](item.row + ' : ' + item.message);
            }
        })
    }
}

$(".color-1").click(function() {
    $("#color").attr("href", "/static/assets/css/color/color-1.css");
    update_color('color-1');
    return false;
});
$(".color-2").click(function() {
    $("#color").attr("href", "/static/assets/css/color/color-2.css");
    update_color('color-2');
    return false;
});
$(".color-3").click(function() {
    $("#color").attr("href", "/static/assets/css/color/color-3.css");
    update_color('color-3');
    return false;
});
$(".color-4").click(function() {
    $("#color").attr("href", "/static/assets/css/color/color-4.css");
    update_color('color-4');
    return false;
});
$(".color-5").click(function() {
    $("#color").attr("href", "/static/assets/css/color/color-5.css");
    update_color('color-5');
    return false;
});
$(".color-6").click(function() {
    $("#color").attr("href", "/static/assets/css/color/color-6.css");
    update_color('color-6');
    return false;
});

function update_color(color) {
    post('color', {
        'color': color
    }, 'post');
}

$(function() {
    $('#des_newvs').hide();
})

function check_new_version() {
    post('check_update', {}, 'post');
}

function update_proxy() {
    swal({
        title: 'Are you sure you want to update?',
        text: 'Please do not power off the device or disconnect from the network',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Agree'
    }).then((result) => {
        if (result.value) {
            post('update_proxy', {}, 'post');
        } else {
            toastr["warning"]('You have refused to update Sproxy');
        }
    });
}

function res_check_update(data) {
    $('#des_newvs').show();
    $('#new_vs').text(data.vs);
    $('#des_vs').text(data.des);
}

function reboot(tit, path) {
    swal({
        title: 'Are you sure you want to Reboot ' + tit + ' ?',
        text: 'are you sure yet ?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Agree'
    }).then((result) => {
        if (result.value) {
            post('reboot', {
                'type': path
            }, 'post');
        } else {
            toastr["warning"]('You have refused to Reboot ' + tit);
        }
    });
}
$(function() {
  if (mode == 'general') {
    var switchery = new Switchery(document.querySelector('.js-alive'), {
        color: '#1abc9c',
        jackColor: '#fff'
    });
    if (alive == 'on') {
        CherySwitch('#alive', true);
    } else {
        CherySwitch('#alive', false);
    }
      setTimeout(() => {
          $('#alive2').val('1');
      }, 2000)
    if (u90rs == 1) {
      $("#u90_normal").attr('checked',true);
    }else if (u90rs == 2) {
      $("#u90_deep").attr('checked',true);
    }
    if (document.querySelector('input[name="rs_u90"]')) {
      document.querySelectorAll('input[name="rs_u90"]').forEach((elem) => {
        elem.addEventListener("change", function(event) {
          var item = event.target.value;
          post('method_resetip', {
              'model': 'u90',
              'value': item
          }, 'post');
        });
      });
  }
  }

})

function turn_al(id, sw) {
    // if ($('#'+id+'2').val() == '1'){
    if (sw != $('#' + id).prop('checked')) {
        $('#' + id).click();
    }
    // }
}

function alive_change() {
    var sw = $('#alive')[0].checked;
    if ($('#alive2').val() == "1") {
        if (sw) {
            post('alive', {
                'switch': 'on'
            }, 'post');
        } else {
            post('alive', {
                'switch': 'off'
            }, 'post');
        }
    }
}

function CherySwitch(switch_elem, on) {
    if (on) {
        if ($(switch_elem)[0].checked) {} else {
            $(switch_elem).trigger('click').attr("checked", "checked");
        }
    } else {
        if ($(switch_elem)[0].checked) {
            $(switch_elem).trigger('click').removeAttr("checked");
        } else {}
    }
}

function set_timeout(){
  var tseconds = parseInt($('#time_delay').val());
  if (tseconds > 2 && tseconds <= 10){
      post('set_timeout', {
          'set_timeout': tseconds
      }, 'post'); 
  }else{
    toastr["error"]('Time must be from 3 - 10');
  }
}