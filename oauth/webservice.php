<?php

$code = isset($_GET['code']);
$state = isset($_GET['state']);

if($code && $state)
{
    header("Location: exp://expo.io/@firmanjml/lighue?status=success&code=<?php echo $code; ?>&state=<?php echo $state; ?>");
} else {
    header("Location: exp://expo.io/@firmanjml/lighue?status=error");
}

?>