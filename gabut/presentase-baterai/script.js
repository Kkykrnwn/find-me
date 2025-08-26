navigator.getBattery().then(function(battery) {
    $('.progress-bar').css('width', battery.level * 100 + '%');
    $('#level').html('Battery level: ' + (battery.level * 100).toFixed() + '%')
    battery.onlevelchange = function() {
        $('#level').html('Battery level: ' + (this.level * 100).toFixed() + '%')
        $('.progress-bar').css('width', this.level * 100 + '%');
    };
});