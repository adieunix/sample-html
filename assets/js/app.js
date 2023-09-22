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
                    msg.classList.remove("d-none");
                    msg.textContent = 'Calculating..';

                    /* calling ajax */
                    setTimeout(function () { // replace the timeout with ajax
                        $('#add').removeClass('d-none');
                        msg.textContent = 'Total 10 spots reserved.';
                    }, 1000)
                } else {
                    $('#checkDate').removeClass('d-none');
                }
            }
        }
    });
}

$(document).on('click', '.remove', function (e) {
    var id = e.target.parentElement.parentElement.parentElement.id;
    $('#'+id).remove();
});

function add() {
    tp();
    $('#sub').append('<div class="sub-campaign mb-3" id="'+random(7)+'">\n' +
        '                                    <div class="row">\n' +
        '                                        <div class="col">\n' +
        '                                            <div class="form-control-wrap has-timepicker">\n' +
        '                                                <div class="form-icon form-icon-left">\n' +
        '                                                    <em class="icon ni ni-clock"></em>\n' +
        '                                                </div>\n' +
        '                                                <input data-date-start-date="" data-scrollbar data-time-format="HH:mm" id="'+random(7)+'" type="text" class="form-control ztime-picker" placeholder="Time Start" readonly required>\n' +
        '                                            </div>\n' +
        '                                        </div>\n' +
        '                                        <div class="col">\n' +
        '                                            <div class="form-control-wrap has-timepicker">\n' +
        '                                                <div class="form-icon form-icon-left">\n' +
        '                                                    <em class="icon ni ni-clock"></em>\n' +
        '                                                </div>\n' +
        '                                                <input data-date-start-date="" data-scrollbar data-time-format="HH:mm" id="'+random(7)+'" type="text" class="form-control ztime-picker" placeholder="Time End" readonly required>\n' +
        '                                            </div>\n' +
        '                                        </div>\n' +
        '                                        <div class="col">\n' +
        // '                                            <button type="button" class="btn btn-dark check" ng-click="check()" id="'+random(7)+'">Check</button> &nbsp;&nbsp;\n' +
        '                                            <button type="button" class="btn btn-danger remove" >Remove</button>\n' +
        '                                        </div>\n' +
        '                                    </div>\n' +
        '                                    <p class="reserve d-none" style="font-size: 12px;color: red;margin-top: 5px;"></p>\n' +
        '                                    <input type="number" id="'+random(7)+'" hidden>\n' +
        '                                    <input type="text" id="'+random(7)+'" hidden>\n' +
        '                                    <input type="text" id="'+random(7)+'" hidden>\n' +
        '                                </div>')
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