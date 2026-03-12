<?php
// Lightweight PHP endpoint used by the admin dashboard forms.
// Handles basic CRUD inserts and read operations for schools, events and jobs.

header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "", "school_system");
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Connection failed: ' . $conn->connect_error]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

// Helpers
function json_success($data = [], $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

function move_upload($fileInfo, $destDir) {
    if (!isset($fileInfo['name']) || $fileInfo['name'] === '') return null;
    if (!is_dir($destDir)) {
        mkdir($destDir, 0755, true);
    }
    $cleanName = time() . "_" . preg_replace('/[^A-Za-z0-9_.-]/', '_', $fileInfo['name']);
    $destPath = rtrim($destDir, '/') . '/' . $cleanName;
    move_uploaded_file($fileInfo['tmp_name'], $destPath);
    return $destPath;
}

if ($method === 'GET') {
    $type = $_GET['type'] ?? '';

    if ($type === 'schools') {
        $schools = [];
        $sql = "SELECT id, name, category, location, students, contact_email, contact_phone FROM schools ORDER BY id DESC";
        if ($result = $conn->query($sql)) {
            while ($row = $result->fetch_assoc()) {
                $schools[] = $row;
            }
            $result->close();
        }
        json_success(['schools' => $schools]);
    }

    if ($type === 'events') {
        $events = [];
        $result = $conn->query("SELECT id, event_name, event_date, event_location, event_type, event_attendees FROM events ORDER BY id DESC");
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $events[] = $row;
            }
            $result->close();
        }
        json_success(['events' => $events]);
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
        json_success(['jobs' => $jobs]);
    }

    json_success(['error' => 'Unsupported type'], 400);
}

if ($method === 'POST') {
    /* =========================
       1. SAVE SCHOOL
       ========================= */
    if (isset($_POST['name']) && isset($_POST['category'])) {
        $name        = $conn->real_escape_string($_POST['name']);
        $category    = $conn->real_escape_string($_POST['category']);
        $location    = $conn->real_escape_string($_POST['location'] ?? '');
        $students    = intval($_POST['students'] ?? 0);
        $email       = $conn->real_escape_string($_POST['contact_email'] ?? '');
        $phone       = $conn->real_escape_string($_POST['contact_phone'] ?? '');
        $description = $conn->real_escape_string($_POST['description'] ?? '');
        $logoPath = move_upload($_FILES['schoolLogo'] ?? [], "uploads/schools");

        // Match minimal schema if description/logo columns are missing
        $hasDescLogo = $conn->query("SHOW COLUMNS FROM schools LIKE 'description'")->num_rows > 0
                        && $conn->query("SHOW COLUMNS FROM schools LIKE 'logo'")->num_rows > 0;

        if ($hasDescLogo) {
            $sql = "INSERT INTO schools (name, category, location, students, contact_email, contact_phone, description, logo)
                    VALUES ('$name', '$category', '$location', '$students', '$email', '$phone', '$description', '$logoPath')";
        } else {
            $sql = "INSERT INTO schools (name, category, location, students, contact_email, contact_phone)
                    VALUES ('$name', '$category', '$location', '$students', '$email', '$phone')";
        }

        if (!$conn->query($sql)) {
            json_success(['error' => 'Failed to save school: ' . $conn->error], 500);
        }

        $school_id = $conn->insert_id;

        // School Images (optional table)
        if (isset($_FILES['schoolImages']['name'][0]) && $_FILES['schoolImages']['name'][0] !== '') {
            $hasImagesTable = $conn->query("SHOW TABLES LIKE 'school_images'")->num_rows > 0;
            if ($hasImagesTable) {
                foreach ($_FILES['schoolImages']['tmp_name'] as $key => $tmp_name) {
                    $imagePath = move_upload(
                        [
                            'name' => $_FILES['schoolImages']['name'][$key],
                            'tmp_name' => $tmp_name
                        ],
                        "uploads/schools"
                    );
                    if ($imagePath) {
                        $conn->query("INSERT INTO school_images (school_id, image_path) VALUES ('$school_id', '$imagePath')");
                    }
                }
            }
        }

        // School Videos (optional table)
        if (isset($_FILES['schoolVideos']['name'][0]) && $_FILES['schoolVideos']['name'][0] !== '') {
            $hasVideosTable = $conn->query("SHOW TABLES LIKE 'school_videos'")->num_rows > 0;
            if ($hasVideosTable) {
                foreach ($_FILES['schoolVideos']['tmp_name'] as $key => $tmp_name) {
                    $videoPath = move_upload(
                        [
                            'name' => $_FILES['schoolVideos']['name'][$key],
                            'tmp_name' => $tmp_name
                        ],
                        "uploads/videos"
                    );
                    if ($videoPath) {
                        $conn->query("INSERT INTO school_videos (school_id, video_path) VALUES ('$school_id', '$videoPath')");
                    }
                }
            }
        }

        json_success([
            'success' => true,
            'id' => $school_id,
            'logo' => $logoPath,
            'school' => [
                'id' => $school_id,
                'name' => $name,
                'category' => $category,
                'location' => $location,
                'students' => $students,
                'contact_email' => $email,
                'contact_phone' => $phone,
                'description' => $description,
                'logo' => $logoPath
            ]
        ]);
    }

    /* =========================
       2. SAVE EVENT
       ========================= */
    if (isset($_POST['event_name'])) {
        $event_name      = $conn->real_escape_string($_POST['event_name']);
        $event_date      = $conn->real_escape_string($_POST['event_date']);
        $event_location  = $conn->real_escape_string($_POST['event_location'] ?? '');
        $event_type      = $conn->real_escape_string($_POST['event_type'] ?? '');
        $event_attendees = intval($_POST['event_attendees'] ?? 0);

        $sql = "INSERT INTO events (event_name, event_date, event_location, event_type, event_attendees)
                VALUES ('$event_name', '$event_date', '$event_location', '$event_type', '$event_attendees')";

        if (!$conn->query($sql)) {
            json_success(['error' => 'Failed to save event: ' . $conn->error], 500);
        }

        $event_id = $conn->insert_id;

        if (isset($_FILES['eventImages']['name'][0]) && $_FILES['eventImages']['name'][0] !== '') {
            foreach ($_FILES['eventImages']['tmp_name'] as $key => $tmp_name) {
                $imagePath = move_upload(
                    [
                        'name' => $_FILES['eventImages']['name'][$key],
                        'tmp_name' => $tmp_name
                    ],
                    "uploads/events"
                );
                if ($imagePath) {
                    $conn->query("INSERT INTO event_images (event_id, image_path) VALUES ('$event_id', '$imagePath')");
                }
            }
        }

        json_success(['success' => true, 'id' => $event_id]);
    }

    /* =========================
       3. SAVE JOB
       ========================= */
    if (isset($_POST['job_title'])) {
        $job_title = $conn->real_escape_string($_POST['job_title']);
        $job_org   = $conn->real_escape_string($_POST['job_organization']);
        $job_loc   = $conn->real_escape_string($_POST['job_location'] ?? '');
        $job_sal   = $conn->real_escape_string($_POST['job_salary'] ?? '');
        $job_desc  = $conn->real_escape_string($_POST['job_description'] ?? '');

        $sql = "INSERT INTO jobs (job_title, job_organization, job_location, job_salary, job_description)
                VALUES ('$job_title', '$job_org', '$job_loc', '$job_sal', '$job_desc')";

        if (!$conn->query($sql)) {
            json_success(['error' => 'Failed to save job: ' . $conn->error], 500);
        }

        $job_id = $conn->insert_id;

        if (isset($_FILES['jobImages']['name'][0]) && $_FILES['jobImages']['name'][0] !== '') {
            foreach ($_FILES['jobImages']['tmp_name'] as $key => $tmp_name) {
                $imagePath = move_upload(
                    [
                        'name' => $_FILES['jobImages']['name'][$key],
                        'tmp_name' => $tmp_name
                    ],
                    "uploads/jobs"
                );
                if ($imagePath) {
                    $conn->query("INSERT INTO job_images (job_id, image_path) VALUES ('$job_id', '$imagePath')");
                }
            }
        }

        json_success(['success' => true, 'id' => $job_id]);
    }

    json_success(['error' => 'No recognized payload'], 400);
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
exit;
