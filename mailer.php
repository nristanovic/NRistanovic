<?php
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];

    //add in a blank error message the error count, and the return array
    $errors = 0;
    $errorMessage = "";
    $resposne = array();
    $response['errors']  = false; //initialize the response boolean



    if (empty($name)){
        $errorMessage .= 'Please tell me your name<br>';
    }
    if(!preg_match("/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/", $email)){
        $errorMessage .= 'Please enter a valid email address<br>';
    }
    if(empty($message)){
        $errorMessage .= 'Please select project type<br>';
    }
    if(empty($budget)){
        $errorMessage .= 'Please select your budget.<br>';
    }
    if(empty($details) || strlen($details) < 10){
        $errorMessage .= "Please make sure your message is at least 10 characters long<br>";
    }

    if(!empty($errorMessage)){
        $response['errors'] = true;
        $response['errorMessage'] = "There were some errors when processing your form <br> $errorMessage";
    } else {
        $to = "nristanovic@protonmail.com";
        $headers = "From: $email";
        $subject= "I'd like to discuss";
        $mail = "Name: $name\nEmail: $email\nProject Type: $message";

        mail($to, $subject, $message, $headers);
    }

    echo json_encode($resposne) // this is needed inorder for the ajax to retrieve the data from the server

?>