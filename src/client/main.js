
function urlB64ToUint8Array(base64String) { const padding = '='.repeat((4 - base64String.length % 4) % 4); const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/'); const rawData = window.atob(base64); const outputArray = new Uint8Array(rawData.length); for (let i = 0; i < rawData.length; ++i) { outputArray[i] = rawData.charCodeAt(i); } return outputArray; }


if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/webpush/sw.js');
}

const triggerPush = document.querySelector('.trigger-push');
let triggerSave = document.querySelector('.trigger-push2');
let triggerType = document.querySelector('.trigger-push3');
const checkBlock = document.querySelector('.check_block');

var userDeviceArray = [
    { device: 'Android', platform: /Android/ },
    { device: 'iPhone', platform: /iPhone/ },
    { device: 'iPad', platform: /iPad/ },
    { device: 'Symbian', platform: /Symbian/ },
    { device: 'Windows Phone', platform: /Windows Phone/ },
    { device: 'Tablet OS', platform: /Tablet OS/ },
    { device: 'Linux', platform: /Linux/ },
    { device: 'Windows', platform: /Windows NT/ },
    { device: 'Macintosh', platform: /Macintosh/ }
];

var platform = navigator.userAgent;

function getPlatform() {
    for (var i in userDeviceArray) {
        if (userDeviceArray[i].platform.test(platform)) {
            return userDeviceArray[i].device;
        }
    }
    return 'Неизвестная платформа!' + platform;
}

function get_browser() {
    var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return { name: 'IE', version: (tem[1] || '') };
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR|Edge\/(\d+)/)
        if (tem != null) { return { name: 'Opera', version: tem[1] }; }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) { M.splice(1, 1, tem[1]); }
    return {
        name: M[0],
        version: M[1]
    };
}


const checkPlatform = getPlatform()
const browser = get_browser()


async function triggerPushNotification() {
    const register = await navigator.serviceWorker.ready;


    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array('BInsROoOVgvqpiLbe2MkEIc00PkhCt8G9Q1J4xMohCzeqeWlTjeNxvOa_pkZfNdABJhOdjDutS6knI2vSYBqZ4E'),
    });

    let payload = {

        language: navigator.language,
    }

    const sub = subscription.toJSON()

    payload.auth = sub.keys.auth
    payload.p256dh = sub.keys.p256dh
    payload.endpoint = subscription.endpoint

    if (checkPlatform) {
        payload.platform = checkPlatform
    } else {
        payload.platform = ''
    }

    if (browser) {
        payload.browser = browser
    } else {
        payload.browser = ''
    }



    await fetch('http://localhost:3000/api/push/subscribe', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    checkBlock.classList.remove('hide')
    triggerSave = document.querySelector('.trigger-push2');

}

async function triggerSendNotify() {
    await fetch('http://localhost:3000/api/push/send-push', {
        method: 'POST',
        body: JSON.stringify({
            types: [],
            payload: {
                title: "Уведомление от Andrei Dev",
                body: "Это очень важное уведомление прочтите это 45486456486486 4654 86 48 64 684 65",
                expirationTime: 10,
                icon: "https://phonoteka.org/uploads/posts/2021-05/1621991911_24-phonoteka_org-p-merilin-monro-pop-art-krasivo-29.jpg"
            }
        }),
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

triggerPushNotification().catch(error => console.error(error));

triggerPush.addEventListener('click', () => {
    triggerSendNotify().catch(error => console.error(error));
});

const saveNotifyType = async (subscription) => {
    const check = document.querySelectorAll('.type_check:checked')

    if (check.length) {
        let notify_type = []
        let payload = {}
        check.forEach(item => {
            notify_type.push(item.value)
        })

        const sub = subscription.toJSON()

        payload.auth = sub.keys.auth
        payload.p256dh = sub.keys.p256dh
        payload.endpoint = subscription.endpoint

        await fetch('http://localhost:3000/api/push/update-subscribe', {
            method: 'POST',
            body: JSON.stringify({
                notify_type,
                ...payload
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } else {
        alert('Вы не выбрали тип')
    }
}

const sendNotifyTypes = async () => {
    const check = document.querySelectorAll('.type_check:checked')

    if (check.length) {
        let formArray = []

        check.forEach(item => {
            formArray.push(item.value)
        })

        await fetch('http://localhost:3000/api/push/send-push', {
            method: 'POST',
            body: JSON.stringify({
                types: formArray,
                payload: {
                    title: "Уведомление от Andrei Dev",
                    body: "Это очень важное уведомление прочтите это 45486456486486 4654 86 48 64 684 65",
                    expirationTime: 1,
                    icon: "https://phonoteka.org/uploads/posts/2021-05/1621991911_24-phonoteka_org-p-merilin-monro-pop-art-krasivo-29.jpg"
                }
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        });
    } else {
        alert('Вы не выбрали тип')
    }
}

navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
    serviceWorkerRegistration.pushManager.getSubscription()
        .then((subscription) => {
            if (subscription) {
                checkBlock.classList.remove('hide')

                triggerSave.addEventListener('click', () => {
                    saveNotifyType(subscription)
                })

                triggerType.addEventListener('click', () => {
                    sendNotifyTypes()
                })
            }
        })
        .catch((err) => {
            console.log(err)
        });
})