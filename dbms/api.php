<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// CHANGE THESE CREDENTIALS!
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "taskmaster";

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit();
}

// --- AUTH SECTION START ---
session_start();
if (isset($_GET['auth'])) {
    $data = json_decode(file_get_contents('php://input'), true);
    if ($_GET['auth'] === 'register') {
        if (!isset($data['username'], $data['password'])) {
            echo json_encode(["success" => false, "error" => "Missing fields"]);
            exit();
        }
        $username = $conn->real_escape_string($data['username']);
        $password = password_hash($data['password'], PASSWORD_DEFAULT);
        $result = $conn->query("SELECT id FROM users WHERE username='$username'");
        if ($result && $result->num_rows > 0) {
            echo json_encode(["success" => false, "error" => "Username already exists"]);
            exit();
        }
        $sql = "INSERT INTO users (username, password) VALUES ('$username', '$password')";
        if ($conn->query($sql)) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "error" => $conn->error]);
        }
        exit();
    }

    if ($_GET['auth'] === 'login') {
        if (!isset($data['username'], $data['password'])) {
            echo json_encode(["success" => false, "error" => "Missing fields"]);
            exit();
        }
        $username = $conn->real_escape_string($data['username']);
        $sql = "SELECT * FROM users WHERE username='$username'";
        $result = $conn->query($sql);
        if ($result && $result->num_rows === 1) {
            $user = $result->fetch_assoc();
            if (password_verify($data['password'], $user['password'])) {
                $_SESSION['user_id'] = $user['id'];
                echo json_encode(["success" => true, "username" => $user['username']]);
            } else {
                echo json_encode(["success" => false, "error" => "Invalid password"]);
            }
        } else {
            echo json_encode(["success" => false, "error" => "User not found"]);
        }
        exit();
    }

    if ($_GET['auth'] === 'logout') {
        session_destroy();
        echo json_encode(["success" => true]);
        exit();
    }
}
// --- AUTH SECTION END ---

// ... rest of your existing code ...
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
