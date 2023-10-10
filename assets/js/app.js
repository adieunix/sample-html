tp();
$('.campaign-dp').datepicker({
    // todayHighlight: true,
    autoclose: true,
    startDate: new Date(),
})
    .on('changeDate', function(e) {
        if($('#xstartdate').val() !== '' && $('#xenddate').val() !== '') {
            $('#subWrapper').removeClass('d-none');
        }
    });

function rad(prefix, date, total, startTime, endTime) {
    $('#x-'+date+'-'+prefix).prop('checked', true);
    $('#z-'+date+'-'+prefix).keyup(function () {
        var val = this.value;
        if(val > Number(total)) {
            $('#i-'+date+'-'+prefix).removeClass('d-none');
        } else {
            $('#i-'+date+'-'+prefix).addClass('d-none')
        }

        if(val !== '' && Number(val) <= Number(total)) {
            var res = [];
            res.push({
                date: date,
                start_time: startTime,
                end_time: endTime,
                spot: val,
                prefix: prefix
            });
            // console.log('RES: ', res);
            $('#pre').prop('disabled', false);
            $('#xy-'+date+'-'+prefix).val(JSON.stringify(res));
        } else {
            $('#pre').prop('disabled', true);
        }
    })
}

function tp() { // time picker
    $('input.ztime-picker').timepicker({
        timeFormat: 'HH:mm',
        dynamic: false,
        interval: 1,
        minTime: '06',
        maxTime: '10',
        change: function() {
            var event = $(this);
            var start = event[0].parentElement.parentElement.parentElement.children[0].getElementsByTagName('input')[0].id;
            var end = event[0].parentElement.parentElement.parentElement.children[1].getElementsByTagName('input')[0].id;
            var msg = event[0].parentElement.parentElement.parentElement.parentElement.children[1];

            if($('#'+start).val() !== '' && $('#'+end).val() !== '') {
                if($('#xstartdate').val() !== '' && $('#xenddate').val() !== '') {

                    $('#check-adv').removeClass('d-none');
                    /* calling ajax */
                    var displayId = 83,
                        startDate = $('#xstartdate').val(),
                        endDate = $('#xenddate').val(),
                        startTime = $('#xstart').val(),
                        endTime = $('#xend').val();
                    $.ajax({
                        url: 'https://stg-dashboard.lightbridge.id/api/check_campaign_available_spot',
                        type: 'post',
                        data: {
                            displayId: displayId,
                            startDate: startDate,
                            endDate: endDate,
                            startTime: startTime,
                            endTime: endTime,
                        },
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        dataType: 'json',
                        success: function (data) {
                            // console.log(data)
                            $('#xsubmit').removeClass('d-none');
                            $('.tb').removeClass('d-none');
                            $('#check-adv').addClass('d-none');
                            data.forEach((xval, i) => {
                                $('#appx').append('<tr><td style="padding-left: 0; color: green" colspan="3"><strong>'+xval.date+'</strong></td></tr>')
                                data[i].available_spots.forEach((val) => {
                                    $('#appx').append('<tr>\n' +
                                        '                                                <td>\n' +
                                        '                                                    <input id="x-'+xval.date+'-'+val.prefix+'" class="form-check-input rds" type="radio" name="radioSpot-'+xval.date+'" value="'+val.prefix+'">\n' +
                                        '                                                </td>\n' +
                                        '                                                <td><strong>'+val.prefix+'</strong></td>\n' +
                                        '                                                <td><input id="z-'+xval.date+'-'+val.prefix+'" onclick="rad(`'+val.prefix+'`,`'+xval.date+'`,`'+val.total+'`,`'+startTime+'`,`'+endTime+'`)" type="number" max="'+val.total+'" class="form-control" placeholder="input spot"><input value="" class="xy-result" type="text" id="xy-'+xval.date+'-'+val.prefix+'" hidden><div id="i-'+xval.date+'-'+val.prefix+'" class="text-danger d-none" style="font-size: 12px;margin-top: 5px;">Insufficient available spots. Please input lesser desired spots.</div></td>\n' +
                                        '                                                <td><span class="text-danger">'+val.total+' spots available.</span></td>\n' +
                                        '                                            </tr>')
                                })
                            })
                        }
                    })
                } else {
                    $('#checkDate').removeClass('d-none');
                }
            }
        }
    });
}