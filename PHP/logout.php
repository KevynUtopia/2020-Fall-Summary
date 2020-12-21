<?php 

// $doc = new DOMDocument();
// $rp = realpath('chatroom.xml');
// $doc->load($rp);

// $books = $doc -> getElementsByTagName("user");

// $len = $books ->length;
// foreach ($books as $book) {
//     $len--;
//     if($len==0){
//         $book->setAttribute('log', 'Off');
//     }
// }


// $doc -> saveXML();


// $doc -> save($rp);

// header("Location: refresh.php");

require_once('xmlHandler.php');

if (!isset($_COOKIE["name"])) {
    header("Location: error.html");
    exit;
}

// create the chatroom xml file handler
$xmlh = new xmlHandler("chatroom.xml");
if (!$xmlh->fileExist()) {
    header("Location: error.html");
    exit;
}

// get user name from cookie
$name = $_COOKIE["name"];
print($name);

// open the existing XML file
$xmlh->openFile();

// get the 'users' element
$users_element = $xmlh->getElement("users");

// get all 'user' nodes
$user_element = $xmlh->getChildNodes("user");

if($user_element != null) {
    // $len = $books ->length;
// foreach ($books as $book) {
//     $len--;
//     if($len==0){
//         $book->setAttribute('log', 'Off');
//     }
// }
    // delete the current user from the users element
    $len = $user_element ->length;
    foreach ($user_element as $user) {
        $username = $xmlh->getAttribute($user, "name");
        $len--;
        if($len==0){
            $user->setAttribute('log', 'Off');
        }
        // if ($username == $name) {
        //     // Remove picture from our images folder
        //     $uploadpic = $xmlh->getAttribute($user, "pic-upload");
        //     unlink($uploadpic);

        //     // Remove the user element completely
        //     $xmlh->removeElement($users_element, $user);
        // }
    }
}

// save the XML file
$xmlh->saveFile();

// set the name to the cookie
setcookie("name","");

// Cookie done, redirect to client.php (to avoid reloading of page from the client)
header("Location: login.html");

?>
