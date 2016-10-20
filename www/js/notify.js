var gcm = require('node-gcm');

// Create a message 
// ... with default values 
var message = new gcm.Message();

// ... or some given values 
var message = new gcm.Message({
    collapseKey: 'demo',
    priority: 'high',
    contentAvailable: true,
    delayWhileIdle: true,
    // timeToLive: 3,
    restrictedPackageName: "com.goodeedplus.goodeedplus",
    // dryRun: true,
    // data: {
    //     title: "Hello, World Android",
    //     body: "This is a notification that will be displayed ASAP.",
    //     sound: "default",
    //     additionalData:{
    //         type: 'reward',
    //         id : 53
    //     }
    // },
    notification: {
        title: "Hello, World iOS",
        body: "This is a notification that will be displayed ASAP.",
        sound: "default",
        // click_action:'test',
        additionalData:{
            type: 'event',
            id : 58
        }
    }
});

// Change the message data 
// ... as key-value 
// message.addData('key1', 'message1');
// message.addData('key2', 'message2');

// ... or as a data object (overwrites previous data object) 
// message.addData({
//     key1: 'message1',
//     key2: 'message2'
// });

// Set up the sender with you API key 
var sender = new gcm.Sender('AIzaSyA_9V_4sR8ihvR_xAaonRBbJceloiyCcr4');

// Add the registration tokens of the devices you want to send to 
var registrationTokens = [];
// registrationTokens.push('kzSU4vyAoFQ:APA91bEKXyVOyh0BdwjZMjefHis-EXhd4ZGfELbFxQ1O1fBl_3feajNrBFwUIdFo8-IYpIfgPd_brNOL03lKf26VdnzdP7upW79PP37Zgc4tp-fIx7gJdVEVGlLKrIhIhn_zKUkhIr6T');
registrationTokens.push('mFIiu5tSjb8:APA91bHg6fgunLw8i569XWjtF_P8plug9ehoWMrJGtkPhtQSfZDxcuRz7PJYRkN9ps9zEsKY-7cO4K9LKwLngOEW9fbkO4wzAK1FhbqUfMbAH_sJi6OAcqgabLiTzqRrnuIYMpon4_ev');



// Send the message 
// ... trying only once 
// sender.sendNoRetry(message, {
//     registrationTokens: registrationTokens
// }, function(err, response) {
//     if (err) console.error(err);
//     else console.log(response);
// });

// ... or retrying 
sender.send(message, {
    registrationTokens: registrationTokens
}, function(err, response) { 
    if (err) console.error(err);
    else console.log(response);
});
/*
// ... or retrying a specific number of times (10) 
sender.send(message, {
    registrationTokens: registrationTokens
}, 10, function(err, response) {
    if (err) console.error(err);
    else console.log(response);
});
*/