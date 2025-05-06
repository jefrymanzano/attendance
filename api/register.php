<?php
// Always start with headers first
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Disable HTML errors
ini_set('display_errors', 0);
ini_set('log_errors', 1);

require_once 'config.php';

// Initialize response
$response = ['status' => 'error', 'message' => ''];

try {
    // Verify request method
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Only POST requests allowed', 405);
    }

    // Get raw input
    $json = file_get_contents('php://input');
    if (empty($json)) {
        throw new Exception('No input data received');
    }

    // Decode JSON
    $data = json_decode($json, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Invalid JSON format: ' . json_last_error_msg());
    }

    // Validate required fields
    $required = ['firstName', 'lastName', 'email', 'phone', 'department', 'position', 'password'];
    foreach ($required as $field) {
        if (empty($data[$field])) {
            throw new Exception("Missing required field: $field");
        }
    }

    // Validate email
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email format');
    }

    // Check email exists
    $stmt = $conn->prepare("SELECT id FROM employee WHERE email = ?");
    $stmt->bind_param("s", $data['email']);
    $stmt->execute();
    if ($stmt->get_result()->num_rows > 0) {
        throw new Exception('Email already registered');
    }

    // Insert user
    $stmt = $conn->prepare("INSERT INTO employee 
        (first_name, middle_name, last_name, email, phone_number, department, position, role, password)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    $role = in_array($data['role'] ?? 'user', ['user', 'admin']) ? $data['role'] : 'user';
    
    $stmt->bind_param("sssssssss",
        $data['firstName'],
        $data['middleName'] ?? null,
        $data['lastName'],
        $data['email'],
        $data['phone'],
        $data['department'],
        $data['position'],
        $role,
        password_hash($data['password'], PASSWORD_DEFAULT)
    );

    if (!$stmt->execute()) {
        throw new Exception('Database error: ' . $stmt->error);
    }

    $response = [
        'status' => 'success',
        'message' => 'Registration successful',
        'userId' => $conn->insert_id
    ];

} catch (Exception $e) {
    http_response_code(400);
    $response['message'] = $e->getMessage();
    error_log("REGISTRATION ERROR: " . $e->getMessage());
} finally {
    // Ensure JSON output
    echo json_encode($response);
    if (isset($conn)) $conn->close();
    exit;
}
?>