<?php
<<<<<<< HEAD

$conn = new mysqli("localhost","root","","school_system");

if($conn->connect_error){
    die("Connection failed: " . $conn->connect_error);
}

// Basic GET endpoints for frontend data loading
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $type = isset($_GET['type']) ? $_GET['type'] : '';

    if ($type === 'events') {
        $events = [];
        $result = $conn->query("SELECT id, event_name, event_date, event_location, event_type, event_attendees FROM events ORDER BY id DESC");
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $events[] = $row;
            }
            $result->close();
        }
        header('Content-Type: application/json');
        echo json_encode(['events' => $events]);
        $conn->close();
        exit;
    }

    if ($type === 'jobs') {
        $jobs = [];
        $result = $conn->query("SELECT id, job_title, job_organization, job_location, job_salary, job_description FROM jobs ORDER BY id DESC");
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $jobs[] = $row;
            }
            $result->close();
        }
        header('Content-Type: application/json');
        echo json_encode(['jobs' => $jobs]);
        $conn->close();
        exit;
    }

    // Default: no data
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Unsupported type']);
    $conn->close();
    exit;
}

/* =========================
   1. SAVE SCHOOL
   ========================= */

if(isset($_POST['name'])){

    $name = $_POST['name'];
    $category = $_POST['category'];
    $location = $_POST['location'];
    $students = $_POST['students'];
    $email = $_POST['contact_email'];
    $phone = $_POST['contact_phone'];
    $description = $_POST['description'];

    $logoPath = "";

    if(isset($_FILES['schoolLogo']) && $_FILES['schoolLogo']['name']!=""){
        $logoName = time()."_".$_FILES['schoolLogo']['name'];
        $logoPath = "uploads/schools/".$logoName;
        move_uploaded_file($_FILES['schoolLogo']['tmp_name'],$logoPath);
    }

    $sql = "INSERT INTO schools (name,category,location,students,contact_email,contact_phone,description,logo)
            VALUES ('$name','$category','$location','$students','$email','$phone','$description','$logoPath')";

    $conn->query($sql);

    $school_id = $conn->insert_id;


    /* School Images */

    if(isset($_FILES['schoolImages']['name'][0])){

        foreach($_FILES['schoolImages']['tmp_name'] as $key => $tmp_name){

            $imageName = time()."_".$_FILES['schoolImages']['name'][$key];
            $imagePath = "uploads/schools/".$imageName;

            move_uploaded_file($tmp_name,$imagePath);

            $conn->query("INSERT INTO school_images (school_id,image_path)
                          VALUES ('$school_id','$imagePath')");
        }
    }


    /* School Videos */

    if(isset($_FILES['schoolVideos']['name'][0])){

        foreach($_FILES['schoolVideos']['tmp_name'] as $key => $tmp_name){

            $videoName = time()."_".$_FILES['schoolVideos']['name'][$key];
            $videoPath = "uploads/videos/".$videoName;

            move_uploaded_file($tmp_name,$videoPath);

            $conn->query("INSERT INTO school_videos (school_id,video_path)
                          VALUES ('$school_id','$videoPath')");
        }
    }

}



/* =========================
   2. SAVE EVENT
   ========================= */

if(isset($_POST['event_name'])){

    $event_name = $_POST['event_name'];
    $event_date = $_POST['event_date'];
    $event_location = $_POST['event_location'];
    $event_type = $_POST['event_type'];
    $event_attendees = $_POST['event_attendees'];

    $sql = "INSERT INTO events (event_name,event_date,event_location,event_type,event_attendees)
            VALUES ('$event_name','$event_date','$event_location','$event_type','$event_attendees')";

    $conn->query($sql);

    $event_id = $conn->insert_id;


    /* Event Images */

    if(isset($_FILES['eventImages']['name'][0])){

        foreach($_FILES['eventImages']['tmp_name'] as $key => $tmp_name){

            $imageName = time()."_".$_FILES['eventImages']['name'][$key];
            $imagePath = "uploads/events/".$imageName;

            move_uploaded_file($tmp_name,$imagePath);

            $conn->query("INSERT INTO event_images (event_id,image_path)
                          VALUES ('$event_id','$imagePath')");
        }
    }

}



/* =========================
   3. SAVE JOB
   ========================= */

if(isset($_POST['job_title'])){

    $job_title = $_POST['job_title'];
    $job_org = $_POST['job_organization'];
    $job_location = $_POST['job_location'];
    $job_salary = $_POST['job_salary'];
    $job_desc = $_POST['job_description'];

    $sql = "INSERT INTO jobs (job_title,job_organization,job_location,job_salary,job_description)
            VALUES ('$job_title','$job_org','$job_location','$job_salary','$job_desc')";

    $conn->query($sql);

    $job_id = $conn->insert_id;


    /* Job Images */

    if(isset($_FILES['jobImages']['name'][0])){

        foreach($_FILES['jobImages']['tmp_name'] as $key => $tmp_name){

            $imageName = time()."_".$_FILES['jobImages']['name'][$key];
            $imagePath = "uploads/jobs/".$imageName;

            move_uploaded_file($tmp_name,$imagePath);

            $conn->query("INSERT INTO job_images (job_id,image_path)
                          VALUES ('$job_id','$imagePath')");
        }
    }

}


echo "Data saved successfully";

$conn->close();

?>
=======
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
>>>>>>> 5710faf97e106a1112c5597148d8d239d116b58c
