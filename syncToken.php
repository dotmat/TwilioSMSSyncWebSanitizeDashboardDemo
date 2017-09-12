<?php
// Sync Token issuing body for WebSanitize PHP Demo
include 'config.php';

use Twilio\Jwt\AccessToken;
use Twilio\Jwt\Grants\SyncGrant;

// Create access token, which we will serialize and send to the client
$token = new AccessToken($TwilioAccountSID,$TwilioAPIKey,$TwilioAPISecret,43200,$AppIdentity);
$syncGrant = new SyncGrant();
$syncGrant->setServiceSid($TwilioSyncInstance);
$token->addGrant($syncGrant);


// return serialized token and the user's randomly generated ID
header('Content-type:application/json;charset=utf-8');
echo json_encode(array(
    'identity' => $AppIdentity,
    'token' => $token->toJWT(),
));
