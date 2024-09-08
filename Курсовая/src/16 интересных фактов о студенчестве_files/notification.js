var config = {
    apiKey: "AIzaSyB-c2G-qqDGFawwCINNHR6rgy4d0CUKi9E",
    authDomain: "vmrupush.firebaseapp.com",
    databaseURL: "https://vmrupush.firebaseio.com",
    projectId: "vmrupush",
    storageBucket: "vmrupush.appspot.com",
    messagingSenderId: "774836971050",
    appId: "1:774836971050:web:923d4232c209c955340553"
};


if (window.location.protocol === 'https:' &&
    'Notification' in window &&
    'serviceWorker' in navigator &&
    'localStorage' in window &&
    'fetch' in window &&
    'postMessage' in window
) {

    console.log('Is HTTPS', window.location.protocol === 'https:');
    console.log('Support Notification', 'Notification' in window);
    console.log('Support ServiceWorker', 'serviceWorker' in navigator);
    console.log('Support LocalStorage', 'localStorage' in window);
    console.log('Support fetch', 'fetch' in window);
    console.log('Support postMessage', 'postMessage' in window);
    if (window.firebase) {
        getToken();
    } else {
        var d = setInterval(function () {
            if (window.firebase) {
                clearInterval(d);
                getToken();
            }
        }, 500);
    }
} else {
    if (window.location.protocol !== 'https:') {
        console.error('Is not from HTTPS');
    } else if (!('Notification' in window)) {
        console.error('Notification not supported');
    } else if (!('serviceWorker' in navigator)) {
        console.error('ServiceWorker not supported');
    } else if (!('localStorage' in window)) {
        console.error('LocalStorage not supported');
    } else if (!('fetch' in window)) {
        console.error('fetch not supported');
    } else if (!('postMessage' in window)) {
        console.error('postMessage not supported');
    }

    console.warn('This browser does not support desktop notification.');

}


function getToken() {
    firebase.initializeApp(config);
    var messaging = firebase.messaging();
    messaging.requestPermission()
        .then(function (permission) {
            console.log('get token permissions', permission);
            messaging.getToken()
                .then(function (token) {
                    var topic = window.VM_NOTIFICATIONS || "vmru";
                    var data = {
                        fcm_token: token,
                        topic_subscribe: topic,
                    };
                    fetch('/subscribe/push', {
                        method: "POST",
                        body: JSON.stringify(data),
                        headers: {'Content-type': 'application/json'}
                    }).then(function (res) {
                        return res.json()
                    }).then(function (data) {
                        localStorage.setItem(`fcmtoken`, token);
                        if (data && data.data && data.data.id) {
                            localStorage.setItem(`fcm_id`, data.data.id);
                        }
                    }).catch(function (err) {
                        console.error('error subscribe user: ', err);
                    });
                });
        }).catch(function (error) {
        console.error('Unable to get permission to notify.', error);
    });
}