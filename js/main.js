$(document).ready(function() {
    console.log( "Twilio Sync with SMS & WebSanitize Ready!" );

    // Use syncDebug to keep the user informed of Sync Status
    var $syncDebug = $('#syncDebug');
    var $naughtyMessages = $('#naughtyMessages');
    var $webSanitizeDebug = $('#webSanitizeDebug');

    // Interface to the Sync service
    var syncClient;

    var syncDoc;

    // Get a Sync Token
    $.getJSON('syncToken.php', function (tokenResponse) {
      //Initialize the Sync client
      syncClient = new Twilio.Sync.Client(tokenResponse.token, { logLevel: 'info' });

      //Let's pop a message on the screen to show that Sync is ready
      $syncDebug.html('Sync initialized!');

      //This code will create and/or open a Sync document
      //Note the use of promises
      syncClient.document('smsSyncWebSanitize').then(function(doc) {
        //Lets store it in our global variable
        syncDoc = doc;
        var data = syncDoc.get();
        if (data.newMessage) {
          //console.log('Update: '+data);
          gotNewMessage(data);
        }

        //Let's subscribe to changes on this document, so when something
        //changes on this document, we can trigger our UI to update
        syncDoc.on('updated', gotNewMessage);

      });

    });

    // Get the details of WebSanitize Status
    $.get('websanitize.txt', function (websanitizeText) {
      var webSanitizeState = 'Web Sanitize is currently '+websanitizeText+'. Click to toggle';
      if(websanitizeText == 'disable'){
        var webSanitizeState = '<a id="myLink" href="#" onclick="toggleWebSanitizeState(\'enable\');return false;">'+webSanitizeState+'</a>';
      } else {
        var webSanitizeState = '<a id="myLink" href="#" onclick="toggleWebSanitizeState(\'disable\');return false;">'+webSanitizeState+'</a>';
      }
      //  var webSanitizeState = ''+webSanitizeState+'</a>';
      $('#webSanitizeDebug').html(webSanitizeState);
    });
});


function addNewMessage(newMessage, alert){
  if(alert == true){
    $('#naughtyMessages').append('<p><Strong><i class="fa fa-ban" aria-hidden="true"></i></Strong> '+newMessage+'</p>');
  } else {
    $('#naughtyMessages').append('<p>'+newMessage+'</p>');
  }
  $('#naughtyMessages').scrollTop($('#naughtyMessages')[0].scrollHeight);
}

function gotNewMessage(data){
  console.log('Sync got a new message');
  // Read from the data object the message and if message has an alert appended to it
  addNewMessage(data.newMessage, data.alert);
  console.log(data);
}

function toggleWebSanitizeState(newState){
  console.log('Toggling the state of WebSanitize filter');
  $.get('toggleWebSanitize.php?websanitize='+newState, function () {
    var webSanitizeState = 'Web Sanitize is currently '+newState+'. Click to toggle';
    if(newState == 'disable'){
      var webSanitizeState = '<a id="myLink" href="#" onclick="toggleWebSanitizeState(\'enable\');return false;">'+webSanitizeState+'</a>';
    } else {
      var webSanitizeState = '<a id="myLink" href="#" onclick="toggleWebSanitizeState(\'disable\');return false;">'+webSanitizeState+'</a>';
    }
    //  var webSanitizeState = ''+webSanitizeState+'</a>';
    $('#webSanitizeDebug').html(webSanitizeState);
  });
}
