# Twilio SMS to Dashboard via Sync with WebSanitize to filter messages

This demo uses Twilio Sync to present new inbound SMS messages in real time.
Message comes into Twilio via SMS and is passed to a script which then passes it into a Sync document.

Connected to the Sync document is a dashboard HTML page waiting for new messages.
Each time a new message is received the page is updated with the message body from the SMS.

Great! But given this is live what happens if someone swears at the dashboard which is live??

## Filtering live messages using WebSanitize
WebSanitize (https://www.websanitize.com) is a lightweight API that scans and replaces profanity and swearwords in text bodies.

Using WebSanitize we can pass the raw message to the API and if the  message has any swearwords in the text it will return a cleaner version.
In this example the request happens server side, but you could do this client side, IE pass the message to the browser and then use JS to reach out to WebSanitize.

To demonstrate both filtered and unfiltered messages a toggle is provided to enable/disable on the fly.

## Connecting SMS -> Sync -> WebSanitize -> Dashboard

Users can text in to a Twilio number which then passes the message to 'inboundSMSFromTwilio.php', this script then looks to see if WebSanitize is enabled or not.

If WebSanitize is not enabled then pass the message into the Sync channel
If WebSanitize is enabled, pass the message to the WebSanitize API and then if the returning messageAlert flag is true pass the cleaned message into the Sync channel

The Sync channel is connected to a HTML page that updates the UI with new messages as they arrive.


# Links and external documentation
Twilio Sync - https://www.twilio.com/sync
Twilio SMS - https://www.twilio.com/sms
WebSanitize - https://www.websanitize.com
