setInterval(function () {
    require('child_process').exec('node main.js', function (err, stdout, stderr) {
    });
    console.log("REINICIANDO");
}, 60000);

require('child_process').exec('node main.js', function (err, stdout, stderr) {
});

