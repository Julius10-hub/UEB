<?php
// Database connection
$conn = new mysqli("localhost", "root", "", "school_system");

if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
}

$conn->set_charset("utf8");

// Handle school form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sanitize and validate inputs
    $name = isset($_POST['schoolName']) ? htmlspecialchars(trim($_POST['schoolName'])) : '';
    $category = isset($_POST['schoolCategory']) ? htmlspecialchars(trim($_POST['schoolCategory'])) : '';
    $district = isset($_POST['schoolDistrict']) ? htmlspecialchars(trim($_POST['schoolDistrict'])) : '';
    $students = isset($_POST['schoolStudents']) ? intval($_POST['schoolStudents']) : 0;
    $email = isset($_POST['schoolEmail']) ? htmlspecialchars(trim($_POST['schoolEmail'])) : '';
    $phone = isset($_POST['schoolPhone']) ? htmlspecialchars(trim($_POST['schoolPhone'])) : '';
    $address = isset($_POST['schoolAddress']) ? htmlspecialchars(trim($_POST['schoolAddress'])) : '';

    // Validate required fields
    if (empty($name) || empty($category) || empty($district)) {
        echo json_encode(['error' => 'Please fill in all required fields']);
        exit;
    }

    $logoName = '';

    // Handle logo upload
    if (isset($_FILES['schoolLogo']) && $_FILES['schoolLogo']['error'] === UPLOAD_ERR_OK) {
        $targetDir = 'uploads/';
        
        // Create directory if it doesn't exist
        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0755, true);
        }

        $fileName = $_FILES['schoolLogo']['name'];
        $fileType = $_FILES['schoolLogo']['type'];
        $fileTmpName = $_FILES['schoolLogo']['tmp_name'];
        $fileSize = $_FILES['schoolLogo']['size'];

        // Validate file type
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (in_array($fileType, $allowedTypes) && $fileSize < 5000000) {
            $logoName = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', $fileName);
            $targetFile = $targetDir . $logoName;
            move_uploaded_file($fileTmpName, $targetFile);
        }
    }

    // Use prepared statement to prevent SQL injection
    $stmt = $conn->prepare("INSERT INTO schools (schoolName, schoolCategory, schoolDistrict, schoolStudents, schoolEmail, schoolPhone, schoolAddress, schoolLogo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    
    if ($stmt) {
        $stmt->bind_param("sssissss", $name, $category, $district, $students, $email, $phone, $address, $logoName);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'School added successfully', 'id' => $stmt->insert_id]);
        } else {
            echo json_encode(['error' => 'Database error: ' . $stmt->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(['error' => 'Prepare failed: ' . $conn->error]);
    }
} else {
    echo json_encode(['error' => 'Invalid request method']);
}

$conn->close();
?>