<?php

if (!isset($_COOKIE["name"])) {
    header("Location: error.html");
    return;
}

// get the name from cookie
$name = $_COOKIE["name"];

print "<?xml version=\"1.0\" encoding=\"utf-8\"?>";

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>Add Message Page</title>
        <link rel="stylesheet" type="text/css" href="style.css" />
        <style>
            .div-color {
                position: absolute;
                width: 50px;
                height: 50px;
            }
        </style>
        <script type="text/javascript">
        function load() {
            var name = "<?php print $name; ?>";

            setTimeout("document.getElementById('msg').focus()", 100);
        }

        function select(color) {
            if (confirm('Are you sure to change your message color to ' + color + '?')) {
                document.getElementById("color").value = color;
            }
        }

        function logout() {
            if (window.XMLHttpRequest)
            {// code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp=new XMLHttpRequest();
            }
            else
            {// code for IE6, IE5
                xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlhttp.open("GET","chatroom.xml",false);
            xmlhttp.send();
            xmlDoc=xmlhttp.responseXML;
            //获取video2里的值：video2.mp4
            var users = xmlDoc.getElementsByTagName("user");
            // console.log(users[users.length-1].setAttribute('log','Off'));
            users[users.length-1].setAttribute('log','Off');
            console.log(users[users.length-1].getAttribute('log'));
            // for(var i=0; i<users.length;i++){
            //     console.log(users.lastChild.getAttribute('name'));
            // }
            // var xmlDoc = parser.parseFromString(request.responseText, "text/xml");
            // var users = xmlDoc.getElementsByTagName("user");
            // console.log(users);
        }
        </script>
    </head>

    <body style="text-align: left" onload="load()">
        <form action="logout.php" method="post">
            <input class="button" type="submit" value="Log out" style="width: 200px" />
            <!-- <button style="width:100px;height:30px">
                Log out
            </button> -->
        </form>

        <form action="users.php" method="post" target="_blank">
            <input class="button" type="submit" value="Show Online User List" style="width: 200px" />
            <!-- <button style="width:200px;height:30px" >
                Show Online User List
            </button> -->
        </form>

        <form action="add_message.php" method="post">
            <table border="0" cellspacing="5" cellpadding="0">
                <tr>
                    <td>What is your message?</td>
                </tr>
                <tr>
                    <td><input class="text" type="text" name="message" id="msg" style= "width: 780px" /></td>
                    
                </tr>
                <tr>
                    <td>
                        <input class="button" type="submit" value="Send Your Message" style="width: 200px" />
                        
                        <div style="position:relative">
                            Choose your color:
                            <div class="div-color" style="background-color:black;left:0px" onclick="select('black')"></div>
                            <div class="div-color" style="background-color:yellow;left:50px" onclick="select('yellow')"></div>
                            <div class="div-color" style="background-color:green;left:100px" onclick="select('green')"></div>
                            <div class="div-color" style="background-color:cyan;left:150px" onclick="select('cyan')"></div>
                            <div class="div-color" style="background-color:blue;left:200px" onclick="select('blue')"></div>
                            <div class="div-color" style="background-color:magenta;left:250px" onclick="select('magenta')"></div>
                        </div>
                        <input type="hidden" name="color" id="color" value="black" />
                    </td>
                </tr>
                <!-- <tr>
            
                <button action="login.html">

                    Log out
                </button>
                </tr> -->
            </table>
            
        </form>

    </body>
</html>
