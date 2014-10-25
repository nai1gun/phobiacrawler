var email = 'test@test.org';

exports.setEmail = function(newEmail) {
    console.log('Email changed from [' + email + '] to ' + newEmail);
    email = newEmail;
};

exports.getEmail = function() {
    return email;
};