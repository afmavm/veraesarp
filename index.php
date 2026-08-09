<?php
// VERA EŞARP cPanel Native PHP Proxy Handler
// Bypasses Apache mod_proxy restrictions on cPanel shared hosts

$requestUri = $_SERVER['REQUEST_URI'];
$nodeServerUrl = 'http://127.0.0.1:3000' . $requestUri;

$ch = curl_init($nodeServerUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);

// Forward client headers
$requestHeaders = array();
if (function_exists('getallheaders')) {
    foreach (getallheaders() as $name => $value) {
        if (strtolower($name) !== 'host') {
            $requestHeaders[] = "$name: $value";
        }
    }
}
$requestHeaders[] = 'Host: ' . $_SERVER['HTTP_HOST'];
curl_setopt($ch, CURLOPT_HTTPHEADER, $requestHeaders);

// Forward POST / PUT payload
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents('php://input'));
}

$response = curl_exec($ch);

if (curl_errno($ch)) {
    http_response_code(502);
    echo "<h1>Vera Eşarp Sunucusu Başlatılıyor...</h1><p>Lütfen sayfayı yenileyiniz.</p>";
    curl_close($ch);
    exit;
}

$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$headerText = substr($response, 0, $headerSize);
$body = substr($response, $headerSize);

http_response_code($httpCode);

// Output headers safely
$headers = explode("\r\n", $headerText);
foreach ($headers as $header) {
    if (!empty($header) && strpos($header, 'HTTP/') !== 0 && !headers_sent()) {
        header($header, false);
    }
}

echo $body;
?>
