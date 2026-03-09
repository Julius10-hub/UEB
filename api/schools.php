<?php

/**
 * Schools API Handler
 * Handles all school-related API endpoints
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;
$category = $_GET['category'] ?? '';
$city = $_GET['city'] ?? '';
$search = $_GET['search'] ?? '';

// Sample data for demo mode
$sampleSchools = [
    [
        'id' => 1,
        'name' => 'Springfield International School',
        'location' => 'Kampala',
        'city' => 'Kampala',
        'country' => 'Uganda',
        'category' => 'secondary',
        'description' => 'A leading international school in Kampala',
        'students' => 450,
        'faculty' => 35,
        'is_verified' => true,
        'rating' => 4.8
    ],
    [
        'id' => 2,
        'name' => 'Kampala Technical Institute',
        'location' => 'Industrial Area, Kampala',
        'city' => 'Kampala',
        'country' => 'Uganda',
        'category' => 'technical',
        'description' => 'Premier technical institution in Uganda',
        'students' => 680,
        'faculty' => 42,
        'is_verified' => true,
        'rating' => 4.9
    ],
    [
        'id' => 3,
        'name' => 'Al-Noor Islamic Academy',
        'location' => 'Jinja',
        'city' => 'Jinja',
        'country' => 'Uganda',
        'category' => 'tahfidh',
        'description' => 'Quality Islamic education with Quran memorization',
        'students' => 320,
        'faculty' => 28,
        'is_verified' => true,
        'rating' => 5.0
    ],
    [
        'id' => 4,
        'name' => 'Mbarara Girls High School',
        'location' => 'Mbarara',
        'city' => 'Mbarara',
        'country' => 'Uganda',
        'category' => 'secondary',
        'description' => 'Excellent girls\' secondary school in western Uganda',
        'students' => 520,
        'faculty' => 38,
        'is_verified' => true,
        'rating' => 4.9
    ],
    [
        'id' => 5,
        'name' => 'Sunshine Kindergarten',
        'location' => 'Kampala',
        'city' => 'Kampala',
        'country' => 'Uganda',
        'category' => 'kindergarten',
        'description' => 'A nurturing environment for early learners',
        'students' => 150,
        'faculty' => 15,
        'is_verified' => true,
        'rating' => 4.7
    ]
];

// Route requests
if ($method === 'GET' && $id) {
    getSchool($id);
} elseif ($method === 'GET') {
    getSchools();
} elseif ($method === 'POST') {
    createSchool();
} elseif ($method === 'PUT' && $id) {
    updateSchool($id);
} elseif ($method === 'DELETE' && $id) {
    deleteSchool($id);
} else {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

function getSchools()
{
    global $sampleSchools, $category, $city, $search;

    $schools = $sampleSchools;

    // Apply filters
    if ($category) {
        $schools = array_filter($schools, function ($s) use ($category) {
            return $s['category'] === $category;
        });
    }

    if ($city) {
        $schools = array_filter($schools, function ($s) use ($city) {
            return strtolower($s['city']) === strtolower($city);
        });
    }

    if ($search) {
        $searchLower = strtolower($search);
        $schools = array_filter($schools, function ($s) use ($searchLower) {
            return strpos(strtolower($s['name']), $searchLower) !== false;
        });
    }

    // Try database
    $db = Database::getConnection();
    if ($db) {
        $schools = getAll('schools');
        if ($category) {
            $cat = $db->real_escape_string($category);
            $schools = query("SELECT * FROM schools WHERE category = '$cat'");
        }
        if ($city) {
            $cityEsc = $db->real_escape_string($city);
            $schools = query("SELECT * FROM schools WHERE city = '$cityEsc'");
        }
        if ($search) {
            $searchEsc = $db->real_escape_string($search);
            $schools = query("SELECT * FROM schools WHERE name LIKE '%$searchEsc%'");
        }
    }

    jsonResponse([
        'success' => true,
        'schools' => array_values($schools),
        'total' => count($schools)
    ]);
}

function getSchool($id)
{
    $school = null;

    // Try sample data first
    global $sampleSchools;
    foreach ($sampleSchools as $s) {
        if ($s['id'] == $id) {
            $school = $s;
            break;
        }
    }

    // Try database
    if (!$school) {
        $db = Database::getConnection();
        if ($db) {
            $school = getById('schools', $id);
        }
    }

    if ($school) {
        jsonResponse([
            'success' => true,
            'school' => $school
        ]);
    }

    jsonResponse(['error' => 'School not found'], 404);
}

function createSchool()
{
    $data = getJsonInput();

    if (empty($data['name'])) {
        jsonResponse(['error' => 'School name is required'], 400);
    }

    $db = Database::getConnection();

    if ($db) {
        $data['created_at'] = date('Y-m-d H:i:s');
        $data['is_verified'] = 0;

        $id = insert('schools', $data);

        if ($id) {
            jsonResponse([
                'success' => true,
                'message' => 'School created successfully',
                'id' => $id
            ], 201);
        }

        jsonResponse(['error' => 'Failed to create school'], 500);
    }

    // Demo mode
    jsonResponse([
        'success' => true,
        'message' => 'School created successfully (demo mode)'
    ], 201);
}

function updateSchool($id)
{
    $data = getJsonInput();

    $db = Database::getConnection();

    if ($db) {
        if (update('schools', $id, $data)) {
            jsonResponse([
                'success' => true,
                'message' => 'School updated successfully'
            ]);
        }

        jsonResponse(['error' => 'Failed to update school'], 500);
    }

    jsonResponse([
        'success' => true,
        'message' => 'School updated successfully (demo mode)'
    ]);
}

function deleteSchool($id)
{
    $db = Database::getConnection();

    if ($db) {
        if (delete('schools', $id)) {
            jsonResponse([
                'success' => true,
                'message' => 'School deleted successfully'
            ]);
        }

        jsonResponse(['error' => 'Failed to delete school'], 500);
    }

    jsonResponse([
        'success' => true,
        'message' => 'School deleted successfully (demo mode)'
    ]);
}
