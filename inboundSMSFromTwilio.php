<?php

require('config.php');

error_reporting(E_ALL);
ini_set('display_errors', 1);

// This script recieves new messages from Twilio, looks up if the WebSanitize toggle is enabled and either passes the raw message to Twilio Sync or
$rawMessageBody = $_POST['Body'];

use Twilio\Rest\Client;
$syncClient = new Client($TwilioAPIKey, $TwilioAPISecret);

// Read the contents of WebSanitize.txt
$handle = fopen( __DIR__ .'/websanitize.txt', 'r+') or die('Wasnt able to read the file');
$websanitizeState =  fgets($handle);
fclose($handle);

// If disable pass the raw message to sync
if($websanitizeState == 'disable'){
  //$data = '{newMessage:Hello TV!,alert:false}'
  $data = array('newMessage' => $rawMessageBody,'alert' => false);
} else {
  // If WebSanitize is enabled then pass the text to WebSanitize for cleaning
  $client = new GuzzleHttp\Client(['headers' => ['x-api-key' => $WebSanitizeAPIKey, 'Accept' => 'application/json']]);

  // Make a request to WS with the message body
  $response = $client->request('POST', 'https://api.websanitize.com/message', ['json' => ['filter' => 'word','message' => $rawMessageBody]]);

    $body = $response->getBody();
    // Implicitly cast the body to a string and echo it
    //echo $body;
    // Turn the response into a JSON array so we can read 'CleanerMessage'
    $WebSanitizeResponse = json_decode($body, true);
    $websanitizeCleanerMessage = $WebSanitizeResponse['CleanerMessage'];
    //echo $websanitizeCleanerMessage;

    // Assemble the response to push to the Sync
    $data = array('newMessage' => $websanitizeCleanerMessage ,'alert' => true);
}

// Assemble the Sync response
$doc = $syncClient->sync
  ->services($TwilioSyncInstance)
  ->documents("smsSyncWebSanitize")->update($data);
