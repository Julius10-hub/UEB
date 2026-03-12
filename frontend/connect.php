<?php

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
