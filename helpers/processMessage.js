const PAGE_ACCESS_TOKEN = 'EAAHlZBhj45pIBAGkKYj3935WvGXQWIMmw0qZAgBWdCNNFuHMFVIQ0rBJHYzrfJurO8TnTEtxZCi0LTqG6iV07gfEfILAEvOfkkGp8qZAp7ePBwc75uZBJy3Sb7USBBt6YUIIomZB3DhBDZCivP5zpQus5BxdfcT9TJCad6HBw2s7AZDZD';
const API_AI_TOKEN = 'e323adbe775e4efc9f1952c690d52ebe';
const apiAiClient = require('apiai')(API_AI_TOKEN);

const request = require('request');

const sendTextMessage = (senderId, text) => {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: senderId },
            message: { text },
        }
    });
};

module.exports = (event) => {
    const senderId = event.sender.id;
    const message = event.message.text;
    console.dir(message);
    const apiaiSession = apiAiClient.textRequest(message, {
        sessionId: 'botcube_co'
    });

    apiaiSession.on('response', (response) => {
        const result = response.result.fulfillment.speech;

        sendTextMessage(senderId, result);
    });

    apiaiSession.on('error', error => console.log(error));
    apiaiSession.end();
};