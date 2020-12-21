<?php


/*********submit the user image*********/
if (!isset($_FILES["picture"])) {
    header("Location: error.html");
    exit;
}

// $dir = dirname(__FILE__);


$file = $_FILES["picture"];
$fileName = $_FILES["picture"]["name"];
$fileTmpName = $_FILES["picture"]["tmp_name"];
$fileType= $_FILES["picture"]["type"];
$fileExt = explode('.', $fileName);
$fileActExt = strtolower(end($fileExt));
$fileNewName = uniqid('', true).".".$fileActExt;
$fileDes = 'img/'.$fileNewName;
move_uploaded_file($fileTmpName, $fileDes);


/*******submit the user info *********/



// if name is not in the post data, exit

if (!isset($_POST["name"])) {
    header("Location: error.html");
    exit;
}

require_once('xmlHandler.php');

// create the chatroom xml file handler
$xmlh = new xmlHandler("chatroom.xml");
if (!$xmlh->fileExist()) {
    header("Location: error.html");
    exit;
}

// open the existing XML file
$xmlh->openFile();

// get the 'users' element
$users_element = $xmlh->getElement("users");

// create a 'user' element
$user_element = $xmlh->addElement($users_element, "user");

// add the user name
$xmlh->setAttribute($user_element, "name", $_POST["name"]);

// add the user imag
$xmlh->setAttribute($user_element, "log", "On");

$xmlh->setAttribute($user_element, "imgid", $fileDes);

// save the XML file
$xmlh->saveFile();

// set the name to the cookie
setcookie("name", $_POST["name"]);

// Cookie done, redirect to client.php (to avoid reloading of page from the client)
header("Location: client.php");

?>
