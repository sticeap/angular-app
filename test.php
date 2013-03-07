<?
ob_start ();
header("Connection: Keep-alive");
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT"); // Date in the past

echo "First echo and prepare for sleep: " . date("H:i:s") . "<br>";

ob_flush();
flush();
sleep(5);

echo "This is after sleep(5) " . date("H:i:s") . "<br>";

ob_flush();
flush();
sleep(5);

echo "This is after another sleep(5) " . date("H:i:s") . "<br>";



ob_end_flush();
?>