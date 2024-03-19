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

function getMax(arr, prop) {
    var max;
    for (var i=0 ; i<arr.length ; i++) {
        if (max == null || parseInt(arr[i][prop]) > parseInt(max[prop]))
            max = arr[i];
    }
    return max;
}

function idr(n) {
    return String(n).replace(/(.)(?=(\d{3})+$)/g,'$1,')
}

function tp() {
    $('input.ztime-picker').timepicker({
        timeFormat: 'HH:mm',
        dynamic: false,
        interval: 10,
        minTime: '06',
        maxTime: '23',
        change: function() {
            var event = $(this);
            var id = event[0].parentElement.parentElement.parentElement.parentElement.id;
            var start = event[0].parentElement.parentElement.parentElement.children[0].getElementsByTagName('input')[0].id;
            var end = event[0].parentElement.parentElement.parentElement.children[1].getElementsByTagName('input')[0].id;
            var msg = event[0].parentElement.parentElement.parentElement.parentElement.children[1];
            var spot = event[0].parentElement.parentElement.parentElement.parentElement.children[2].id;
            var prefix = event[0].parentElement.parentElement.parentElement.parentElement.children[3].id;
            var result = event[0].parentElement.parentElement.parentElement.parentElement.children[4].id;
            var prc = event[0].parentElement.parentElement.parentElement.parentElement.children[5].id;

            if($('#'+start).val() !== '' && $('#'+end).val() !== '') {
                if($('#xstartdate').val() !== '' && $('#xenddate').val() !== '') {
                    msg.classList.remove("d-none");
                    $('#pre').prop('disabled', true);
                    msg.innerHTML = '<div class="progress mt-3" role="progressbar" aria-label="Animated striped example" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">\n' +
                        '  <div class="progress-bar progress-bar-striped progress-bar-animated bg-warning" style="width: 100%"></div>\n' +
                        '</div><div class="text-orange" style="margin-top: 5px; font-size: 14px">Please wait while we calculating available spots...</div>';
                    var displayId = $('#pid').val(),
                        startDate = $('#xstartdate').val(),
                        endDate = $('#xenddate').val(),
                        startTime = $('#'+start).val(),
                        endTime = $('#'+end).val();
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
                            var total = 0;
                            var res = [];
                            data.forEach(function (val) {
                                total += getMax(val.available_spots, 'total').total;
                                res.push({
                                    date: val.date,
                                    start_time: startTime,
                                    end_time: endTime,
                                    spot: getMax(val.available_spots, 'total').total,
                                    prefix: getMax(val.available_spots, 'total').prefix
                                });
                            });

                            if(Number(total) === 0) {
                                $('#add').addClass('d-none');
                                $('#pre').prop('disabled', true);
                                msg.innerHTML = '<span style="font-size: 15px" class="badge bg-primary text-white">Spots are not available. Please choose another date or time range.</span>';
                            } else {
                                $('#add').removeClass('d-none');
                                msg.innerHTML = '<span style="font-size: 15px" class="badge bg-primary text-white">Total '+total+' spots reserved for this time range.</span>';

                                if($('#displayType').val() == '1') {
                                    $('#'+prc).val(Number(total) * Number($('#priceDisplay').val()));
                                    $('#'+spot).val(Number(total));
                                    $('#tos').removeClass('d-none');

                                    var spt = 0;
                                    var tspt = document.querySelectorAll(".vspot");
                                    tspt.forEach(function (ts) {
                                        spt += Number(ts.value)
                                    })
                                    localStorage.setItem('totspot', spt);
                                    $('#totspot').text(spt)

                                    var tot = 0;
                                    var tt = document.querySelectorAll(".vprice");
                                    tt.forEach(function (vv) {
                                        tot += Number(vv.value)
                                    })

                                    $('#ctotal').removeClass('d-none');
                                    localStorage.setItem('totprice', tot);
                                    $('#cval').text(idr(tot));
                                }

                                $('#'+result).val(JSON.stringify(res));
                                $('#pre').prop('disabled', false);
                            }
                        }
                    });
                } else {
                    $('#checkDate').removeClass('d-none');
                }
            }
        }
    });
}

function random(len) {
    var charSet = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
}

$(document).on('click', '.remove', function (e) {
    var id = e.target.parentElement.parentElement.parentElement.id;
    var spotId = e.target.parentElement.parentElement.parentElement.children[2].id;
    var priceId = e.target.parentElement.parentElement.parentElement.children[5].id;
    var rmSpot = $('#'+spotId).val();
    var rmPrice = $('#'+priceId).val();
    var updateSpot = Number(localStorage.getItem('totspot')) - Number(rmSpot);
    var updatePrice = Number(localStorage.getItem('totprice')) - Number(rmPrice);
    $('#totspot').text(updateSpot)
    $('#cval').text(idr(updatePrice));
    $('#'+id).remove();
});

function add() {
    $(document).ready(function () {
        tp();
    });

    $('#sub').append('<div class="sub-campaign mb-3" id="'+random(7)+'">\n' +
        '                                    <div class="row">\n' +
        '                                        <div class="col-sm-5">\n' +
        '                                            <div class="form-control-wrap has-timepicker">\n' +
        '                                                <div class="form-icon form-icon-left">\n' +
        '                                                    <em class="icon ni ni-clock"></em>\n' +
        '                                                </div>\n' +
        '                                                <input data-date-start-date="" data-scrollbar data-time-format="HH:mm" id="'+random(7)+'" type="text" class="form-control ztime-picker" placeholder="Time Start" readonly required>\n' +
        '                                            </div>\n' +
        '                                        </div>\n' +
        '                                        <div class="col-sm-5">\n' +
        '                                            <div class="form-control-wrap has-timepicker">\n' +
        '                                                <div class="form-icon form-icon-left">\n' +
        '                                                    <em class="icon ni ni-clock"></em>\n' +
        '                                                </div>\n' +
        '                                                <input data-date-start-date="" data-scrollbar data-time-format="HH:mm" id="'+random(7)+'" type="text" class="form-control ztime-picker" placeholder="Time End" readonly required>\n' +
        '                                            </div>\n' +
        '                                        </div>\n' +
        '                                        <div class="col-sm-2">\n' +
        '                                            <button type="button" class="btn btn-outline-danger remove">Remove</button>\n' +
        '                                        </div>\n' +
        '                                    </div>\n' +
        '                                    <p class="reserve d-none" style="margin-top: 5px;"></p>\n' +
        '                                    <input class="vspot" type="number" id="'+random(7)+'" hidden>\n' +
        '                                    <input type="text" id="'+random(7)+'" hidden>\n' +
        '                                    <input type="text" id="'+random(7)+'" hidden>\n' +
        '                                    <input class="vprice" type="text" id="'+random(7)+'" hidden>\n' +
        '                                </div>');
}

function getDt(dt) {
    var day = dt.getDate();
    var month = dt.getMonth() + 1;
    var year = dt.getFullYear();
    if (day < 10) day = '0' + day;
    if (month < 10) month = '0' + month;
    return year + '-' + month + '-' + day;
}

function mod(n, d) {
    return ((n % d) + d) % d;
}

function submit() {
    var displayId = $('#pid').val();
    var displayPrice = $('#priceDisplay').val();
    // var campaignType = $('#xcamtype').val();
    // var campaignCategory = $('#xcamcategory').val();
    // var campaignName = $('#xtitle').val();
    var totalSpot = 0;
    var paketPrice = $('#pricePaket').val();
    var displayType = $('#displayType').val();
    var slotPerDay = $('#slotPerDay').val();
    var slotPaket = $('#slotPaket').val();
    var minimumSpot = $('#minimumSpot').val();
    var minimumMultiple = $('#minimumMultiple').val();

    var res = [];
    var diffDate = Number(moment($('#xenddate').val()).diff($('#xstartdate').val(), 'days'));
    var a = [];
    var len = $('#sub').children().length; // loop/length campaign time
    var b = [];
    var c = [];
    var d = [];

    if(displayType != '2') {
        for(var i=0; i<len; i++) {
            a.push(JSON.parse($('#'+$('#sub').children()[i].children[4].id).val()))
        }
        a.forEach(function (val) {
            val.forEach(function (ds) {
                b.push({
                    date: new Date(ds.date),
                    start_time: ds.start_time,
                    end_time: ds.end_time,
                    spot: ds.spot,
                    prefix: ds.prefix
                });
            })
        });

        b.sort((a, b) => a.date - b.date).forEach(function (val) {
            c.push({
                date: getDt(val.date),
                start_time: val.start_time,
                end_time: val.end_time,
                spot: val.spot,
                prefix: val.prefix
            });
            totalSpot += Number(val.spot)
        });
    } else {
        for(var i=0; i<=diffDate; i++) {
            d.push({
                date: moment($('#xstartdate').val()).add(i, 'd').format('YYYY-MM-DD'),
                start_time: $('#startHour').val(),
                end_time: $('#endHour').val(),
                spot: Number(slotPerDay),
                prefix: 'A'
            });
        }
    }

    res.push({
        display_id: displayId,
        // name: campaignName,
        // campaign_content_type_id: campaignType,
        // campaign_category_id: campaignCategory,
        start_date: $('#xstartdate').val(),
        end_date: $('#xenddate').val(),
        file: $('#image').val(),
        total_spot: (displayType != '2') ? totalSpot : Number(slotPaket),
        total_price: (displayType != '2') ? Number(displayPrice) * Number(totalSpot) : Number(paketPrice),
        subcampaign: (displayType != '2') ? c : d
    });

    var totalAllSpots = (displayType != '2') ? totalSpot : Number(slotPaket);
    var totalSpotDaily = (diffDate + 1) * Number($('#minimumSpot').val());

    if(totalAllSpots < totalSpotDaily) {
        $('#alert-spot').removeClass('d-none');
        $('#text-spot').text('Jumlah minimum pembelian untuk '+(diffDate + 1)+' hari adalah '+totalSpotDaily+' spots. Total pembelian kamu saat ini adalah '+totalAllSpots+' spots.');
    } else {
        if(minimumMultiple === 0 || minimumMultiple === '0') {
            alert(JSON.stringify(res))
        } else {
            var checkMultiple = mod(Number(totalAllSpots), (diffDate + 1) * Number(minimumMultiple));
            if(checkMultiple > 0) {
                $('#alert-spot').removeClass('d-none');
                $('#text-spot').text('Minimum pembelian spot harus '+(diffDate + 1) * minimumMultiple+' spot atau kelipatan '+(diffDate + 1) * minimumMultiple);
            } else { // skip --> modulo
                alert(JSON.stringify(res))
            }
        }
    }
}