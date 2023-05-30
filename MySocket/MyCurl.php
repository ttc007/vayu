<?php
namespace MySocket;

class MyCurl {
  public function postRequest($url, $data) {
    $curl = curl_init($url);

    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($curl);

    curl_close($curl);

    return $response;
  }

  public function getRequest($url, $params) {
    $url .= '?' . http_build_query($params);

    $curl = curl_init($url);

    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($curl);

    curl_close($curl);

    return $response;
  }
}
?>
