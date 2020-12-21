<?php


print "<?xml version=\"1.0\" encoding=\"utf-8\"?>";

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>User List Page</title>
        <link rel="stylesheet" type="text/css" href="style.css" />
        <script language="javascript" type="text/javascript">
        var loadTimer = null;
        var request;
        var datasize;
        var lastMsgID;
        var prevMessageLen = 0;
        var y_temp = 100;

        function load() {
       
            
            loadTimer = null;
            datasize = 0;
            lastMsgID = 0;
            
            var node = document.getElementById("userlist");
            node.style.setProperty("visibility", "visible", null);

            getUpdate();
        }

        function unload() {
            
            var userls = xmlDoc.getElementsByTagName("userls");
            var users = xmlDoc.getElementsByTagName("user");
            console.log(users);
            // create a string for the userls

            var username = document.getElementById("username");

            if (username.value != "") {

                request = new XMLHttpRequest();
                request.open("POST", "logout.php", true);
                request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                request.send(null);
                username.value = "";
                
            }
            if (loadTimer != null) {
                loadTimer = null;
                clearTimeout("load()", 100);
            }
        }

        function getUpdate() {
            request = new XMLHttpRequest();
            request.onreadystatechange = stateChange;
            request.open("POST", "server.php", true);
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            request.send("datasize=" + datasize);
        }

        function stateChange() {
            if (request.readyState == 4 && request.status == 200 && request.responseText) {
                var xmlDoc;
                var parser = new DOMParser();
                xmlDoc = parser.parseFromString(request.responseText, "text/xml");
                datasize = request.responseText.length;
                updateChat(xmlDoc);
                getUpdate();
            }
        }

        function updateChat(xmlDoc) {

            var users = xmlDoc.getElementsByTagName("user");
       
            var i;
            for (i = prevMessageLen; i < users.length; ++i) {
                var username = users[i].getAttribute("name");
                var userlog = users[i].getAttribute("log");
                var imgid = users[i].getAttribute("imgid");
                
                if(userlog=='On')
                    showMessage(username, imgid);
            }
            prevMessageLen = users.length;
        }

        function showMessage(nameStr, imgid) {
               
            var node = document.getElementById("chattext");
            // Create the name text span
            var nameNode = document.createElementNS("http://www.w3.org/2000/svg", "tspan");

            // Set the attributes and create the text
            nameNode.setAttribute("x", 300);
            nameNode.setAttribute("dy", 80);
            
            nameNode.appendChild(document.createTextNode(nameStr));

            node.appendChild(nameNode);



            var node = document.getElementById('svg1');
            var conetentNode = document.createElementNS('http://www.w3.org/2000/svg','image');

            conetentNode.setAttributeNS('http://www.w3.org/1999/xlink','href', imgid);
            // conetentNode.setAttributeNS(null,'x','10');
            conetentNode.setAttributeNS(null,'x','100');
            conetentNode.setAttributeNS(null,'y',y_temp);
            y_temp += 80;

            // conetentNode.setAttributeNS(null,'dy','80');

            conetentNode.setAttributeNS(null,'width','50');
            conetentNode.setAttributeNS(null,'height','50');

            conetentNode.setAttributeNS(null, 'visibility', 'visible');
            console.log(imgid);
            // var node = document.getElementById("ulis");

            node.appendChild(conetentNode);
            
        }

        </script>
    </head>

    <body style="text-align: left" onload="load()" onunload="unload()">
    <svg width="800px" height="2000px"
     xmlns="http://www.w3.org/2000/svg"
     xmlns:xhtml="http://www.w3.org/1999/xhtml"
     xmlns:xlink="http://www.w3.org/1999/xlink"
     xmlns:a="http://www.adobe.com/svg10-extensions" a:timeline="independent"
     >

        <g id="userlist" style="visibility:hidden">                
            <rect width="520" height="2000" style="fill:white;stroke:red;stroke-width:2"/>
            <text x="260" y="40" style="fill:red;font-size:30px;font-weight:bold;text-anchor:middle">User List</text> 
            <text id="chattext" y="45" style="font-size: 20px;font-weight:bold" />
            <!-- <g id="userlist" width="50" height="50" y="45" style="font-size: 20px;font-weight:bold"></g> -->
            <!-- <svg id="svg1" width="60" height="60" y="45" viewBox="0 0 360 1000"
                xmlns="http://www.w3.org/2000/svg" 
                xmlns:xlink="http://www.w3.org/1999/xlink">       
            </svg> -->
            <g id="svg1" y="45"/>
        </g>
    </svg>
  
    </body>
</html>


