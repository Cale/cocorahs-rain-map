<?php

$state = $_GET['state'];
$date = $_GET['date'];

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, 'http://data.cocorahs.org/cocorahs/export/MapDataFeed.aspx?date='.$date.'&country=USA&state='.$state);
$result = curl_exec($ch);
curl_close($ch);

$obj = json_decode($result);
echo $result->access_token;

$data = $result; // json string

if(array_key_exists('callback', $_GET)){

    header('Content-Type: text/javascript; charset=utf8');
    header('Access-Control-Allow-Origin: http://www.example.com/');
    header('Access-Control-Max-Age: 3628800');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');

    $callback = $_GET['callback'];
    echo $callback.'('.$data.');';

}else{
    // normal JSON string
    header('Content-Type: application/json; charset=utf8');

    echo $data;
}
