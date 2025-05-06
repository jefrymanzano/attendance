<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $employee_id = $conn->real_escape_string($data['employee_id']);
    $type = $conn->real_escape_string($data['type']); // 'in' or 'out'
    $current_time = date('Y-m-d H:i:s');
    
    if ($type === 'in') {
        $sql = "INSERT INTO attendance (employee_id, check_in_time) 
                VALUES ('$employee_id', '$current_time')";
    } else {
        $sql = "UPDATE attendance 
                SET check_out_time = '$current_time' 
                WHERE employee_id = '$employee_id' 
                AND DATE(check_in_time) = DATE('$current_time') 
                AND check_out_time IS NULL";
    }
    
    if ($conn->query($sql)) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Attendance recorded successfully'
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to record attendance'
        ]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $employee_id = $_GET['employee_id'] ?? null;
    $start_date = $_GET['start_date'] ?? date('Y-m-d', strtotime('-30 days'));
    $end_date = $_GET['end_date'] ?? date('Y-m-d');
    
    $sql = "SELECT * FROM attendance 
            WHERE employee_id = '$employee_id' 
            AND DATE(check_in_time) BETWEEN '$start_date' AND '$end_date'
            ORDER BY check_in_time DESC";
    
    $result = $conn->query($sql);
    $attendance = [];
    
    while ($row = $result->fetch_assoc()) {
        $attendance[] = $row;
    }
    
    echo json_encode([
        'status' => 'success',
        'data' => $attendance
    ]);
}
?>