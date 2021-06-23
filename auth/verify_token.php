<?php

function verify_token($db) {
    $headers = getallheaders();
    $token = $headers["authorization"];

    if (preg_match("/Bearer (.*)/", $token, $tab))
        $token = $tab[1];

    $login = $db->verify_user_token($token);
    if (!$login)
        send_response(null, 401);

    return $login;
}

?>
