<?php

$webhook_url = 'https://hooks.slack.com/services/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';

// Slackに投稿するメッセージ
$msg = array(
    'username' => 'task',
    'text' => 'イラストの仕事状況だドン!  \n　http://datobs.herokuapp.com/#/'
);
$msg = json_encode($msg);
$msg = 'payload=' . urlencode($msg);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $webhook_url);
curl_setopt($ch, CURLOPT_HEADER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $msg);
curl_exec($ch);
curl_close($ch);
?>
