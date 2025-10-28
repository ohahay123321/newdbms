<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// CHANGE THESE CREDENTIALS!
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "taskmaster";

// Connect to MySQL
$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit();
}

// GET: fetch all tasks
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $result = $conn->query("SELECT * FROM tasks");
    $tasks = [];
    while ($row = $result->fetch_assoc()) {
        $tasks[] = $row;
    }
    echo json_encode($tasks);
    exit();
}

// POST: add a new task
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!isset($data['subject_id']) || !isset($data['content'])) {
        echo json_encode(["success" => false, "error" => "Missing fields"]);
        exit();
    }
    $subject_id = intval($data['subject_id']);
    $content = $conn->real_escape_string($data['content']);
    $sql = "INSERT INTO tasks (subject_id, content, completed) VALUES ($subject_id, '$content', 0)";
    if ($conn->query($sql)) {
        echo json_encode(["success" => true, "id" => $conn->insert_id]);
    } else {
        echo json_encode(["success" => false, "error" => $conn->error]);
    }
    exit();
}

$conn->close();
?>