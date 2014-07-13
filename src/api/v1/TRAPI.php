<?php
require_once 'API.php';
require_once '../../config.php';

class TRAPI extends API
{
    protected function photos($args) {
        if ($this->method == 'GET') {
            $page = $args[0];
            $perPage = 10;
            $range = (string)((int)$page * $perPage) . ',' . (string)($perPage);

            $db = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, 'tomaszrogucki');
            
            $query = 'SELECT name, description, date, country, place, aperture, shutter, zoom, iso, img, ratio FROM photos LIMIT ' . $range;
            $result = mysqli_query($db, $query);
            
            $rows = array();
            while($row = mysqli_fetch_assoc($result)){
                $rows[] = $row;
            }
            
            mysqli_close($db);

            return $rows;

        } else {
            return 'Only accepts GET requests';
        }
    }
}


try {
    $API = new TRAPI($_REQUEST['request']);
    echo $API->processAPI();
} catch (Exception $e) {
    echo json_encode(Array('error' => $e->getMessage()));
}
?>