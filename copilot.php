<?php
// Payload data you want to send to Android device(s)
// (it will be accessible via intent extras)    
$data = array( 'message' => 'Hello World!' );

// The recipient registration tokens for this notification
// http://developer.android.com/google/gcm/ 
$ids = array( 'abc', 'def' );

// Send a GCM push
sendGoogleCloudMessage(  $data, $ids );
echo "hi there".$ids[0];

function sendGoogleCloudMessage( $data, $ids )
{
    // Insert real GCM API key from Google APIs Console
    // https://code.google.com/apis/console/        
    $apiKey = 'AIzaSyBe6RSXBWWsuGNWSOkO_j4ULUNzXv8BfK4';

    // Define URL to GCM endpoint
    $url = 'https://gcm-http.googleapis.com/gcm/send';

    // Set GCM post variables (device IDs and push payload)     
    $post = array(
                    'registration_ids'  => $ids,
                    'data'              => $data,
                    );

    // Set CURL request headers (authentication and type)       
    $headers = array( 
                        'Authorization: key=' . $apiKey,
                        'Content-Type: application/json'
                    );

    // Initialize curl handle       
    $ch = curl_init();

    // Set URL to GCM endpoint      
    curl_setopt( $ch, CURLOPT_URL, $url );

    // Set request method to POST       
    curl_setopt( $ch, CURLOPT_POST, true );

    // Set our custom headers       
    curl_setopt( $ch, CURLOPT_HTTPHEADER, $headers );

    // Get the response back as string instead of printing it       
    curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );

    // Set JSON post data
    curl_setopt( $ch, CURLOPT_POSTFIELDS, json_encode( $post ) );

    // Actually send the push   
    $result = curl_exec( $ch );

    // Error handling
    if ( curl_errno( $ch ) )
    {
        echo 'GCM error: ' . curl_error( $ch );
    }

    // Close curl handle
    curl_close( $ch );

    // Debug GCM response       
    echo $result;
}
?>
