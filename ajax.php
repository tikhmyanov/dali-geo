<?php

//require_once '../../mysql.php';

mysql_connect("localhost", "root", "") or die (mysql_error());
mysql_select_db("dali-irk") or die (mysql_error());

mysql_query("set character_set_client ='utf8'");
mysql_query("set character_set_results  ='utf8'");
mysql_query("set collation_connection ='utf8_general_ci'");


$query = "SELECT `prefix` from `m_users` WHERE `login` <> 'admin'";

$sql = mysql_query($query) or die(mysql_error());

$agents = array();
while($row = mysql_fetch_assoc($sql))
  array_push($agents, $row['prefix']);


$date = strval($_GET['date']);
$agent = strval($_GET['agent']);

$query = "SELECT m_history.prefix, m_history.date, m_history.summ, m_history.contragent, m_geo.lat, m_geo.lon
  FROM m_history, m_geo
  WHERE m_history.id = m_geo.order_id
    AND m_history.prefix = '{$agent}'
    AND m_history.date = '{$date}'
  ORDER BY m_history.id ASC";

$sql = mysql_query($query) or die(mysql_error());

$orders = array();
while($row = mysql_fetch_assoc($sql))
  array_push($orders, $row);


$json = array(
  'agents' => $agents,
  'orders' => $orders
);


header('Content-Type: application/json');
echo json_encode($json);

?>