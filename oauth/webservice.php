<?php

$code = $_GET['code'];
$state = $_GET['state'];

if(isset($_GET['code']) && isset($_GET['state']))
{
    $url = "exp://expo.io/@firmanjml/lighue?status=success&code=" . $code . "&state=" . $state;
    header("Location: " . $url);
} else {
    header("Location: exp://expo.io/@firmanjml/lighue?status=error");
}

?>		