<?php

require_once('xmlHandler.php');

// create the chatroom xml file handler
$xmlh = new xmlHandler("chatroom.xml");
if (!$xmlh->fileExist()) {
    header("Location: error.html");
    exit;
}

// open the existing XML file
$xmlh->openFile();

// save the XML file
$xmlh->saveFile();


// Cookie done, redirect to client.php (to avoid reloading of page from the client)
header("Location: login.html");

?>
