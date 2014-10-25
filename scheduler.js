var INTERVAL = 300000; //5 min

var SCHEDULE_REGEXP = /Phobia\.Views\.Schedule\(([.\s\S]*)\).render\(\);/g;

var http = require('http');

var SENDGRID_USERNAME = 'app31003475@heroku.com';

var SENDGRID_PASSWORD = '93lq0xvs';

var sendgrid  = require('sendgrid')(SENDGRID_USERNAME, SENDGRID_PASSWORD);

var email = 'djkp9ik@gmail.com';

var url = 'http://phobia.ru/30/';

var lastId = 20141112;

exports.setEmail = function(newEmail) {
    console.log('Email changed from [' + email + '] to ' + newEmail);
    email = newEmail;
};

exports.getEmail = function() {
    return email;
};

exports.setUrl = function(neWurl) {
    if (!neWurl.match('^http(s)?:\/\/.*')) {
        neWurl = 'http://' + neWurl;
    }
    url = neWurl;
};

exports.getUrl = function() {
    return url;
};

function crawlTask() {
    console.log(new Date().toDateString() + ': starting crawl task');
    http.get(url, function(res) {
        console.log(new Date().toDateString() + ': Got response: ' + res.statusCode);
        var data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function() {
            var match = SCHEDULE_REGEXP.exec(data);
            if (match && match[1]) {
                //var schedule = JSON.parse(match[1]);
                eval("var sc = " + match[1]);// Not safe but JSON.parse doesn't work here
                if (sc && sc.schedule && sc.schedule.length > 0) {
                    var maxId = sc.schedule[sc.schedule.length - 1].id;
                    var sendEmail = lastId != null && lastId < maxId;
                    //console.log(lastId + ' ' + maxId + ' ' + sendEmail);
                    var prevLastId = lastId;
                    lastId = maxId;
                    if (sendEmail) {
                        var emailText = 'Phobia timetable has been updated on url: ' + url + '\n';
                        for(var i = 0; i < sc.schedule.length; i++) {
                            var scheduleItem = sc.schedule[i];
                            if (scheduleItem.id > prevLastId) {
                                var quests = scheduleItem.quests[0];
                                var timeslots = quests.timeslots;
                                emailText += 'Date: ' + scheduleItem.date + '\n';
                                for(var j = 0; j < timeslots.length; j++) {
                                    var timeslotItem = timeslots[j];
                                    emailText += timeslotItem.tm + ' - ' + (timeslotItem.av ? 'free': 'busy') + ' | '
                                }
                                emailText += '\n';
                            }
                        }

                        sendgrid.send({
                            to:       email,
                            from:     SENDGRID_USERNAME,
                            subject:  'Phobia timetable update',
                            text:     emailText
                        }, function(err, json) {
                            if (err) { return console.error(err); }
                            console.log(json);
                        });
                    }
                }
            }
        });
    }).on('error', function(e) {
        console.error(new Date().toDateString() + ': Got error: ' + e.message);
    });
}

setInterval(crawlTask, INTERVAL);
crawlTask();
