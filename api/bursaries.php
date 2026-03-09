<?php

/**
 * Bursaries API Handler
 * Handles all bursary-related API endpoints
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

// Sample bursaries data
$sampleBursaries = [
    [
        'id' => 1,
        'name' => 'Uganda Government Bursary Scheme',
        'provider' => 'Ministry of Education',
        'description' => 'Government-funded bursary for students from disadvantaged backgrounds',
        'amount' => 'Up to UGX 2,000,000',
        'deadline' => '2026-03-31',
        'eligibility' => 'Secondary school students with good academic performance',
        'category' => 'government'
    ],
    [
        'id' => 2,
        'name' => 'MTN Foundation Scholarship',
        'provider' => 'MTN Uganda',
        'description' => 'Full scholarship for bright students pursuing STEM courses',
        'amount' => 'Full tuition + stipend',
        'deadline' => '2026-04-15',
        'eligibility' => 'University students in STEM fields',
        'category' => 'private'
    ],
    [
        'id' => 3,
        'name' => 'Islamic Development Bank Scholarship',
        'provider' => 'IsDB',
        'description' => 'Scholarship for Muslim students pursuing higher education',
        'amount' => 'Full tuition + living allowance',
        'deadline' => '2026-05-01',
        'eligibility' => 'Muslim students with academic excellence',
        'category' => 'international'
    ]
];

// Route requests
if ($method === 'GET' && $id) {
    getBursary($id);
} elseif ($method === 'GET') {
    getBursaries();
} elseif ($method === 'POST') {
    applyBursary();
} else {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

function getBursaries()
{
    global $sampleBursaries;

    $db = Database::getConnection();
    if ($db) {
        $bursaries = getAll('bursaries');
        if (count($bursaries) > 0) {
            jsonResponse([
                'success' => true,
                'bursaries' => $bursaries,
                'total' => count($bursaries)
            ]);
        }
    }

    jsonResponse([
        'success' => true,
        'bursaries' => $sampleBursaries,
        'total' => count($sampleBursaries)
    ]);
}

function getBursary($id)
{
    global $sampleBursaries;

    foreach ($sampleBursaries as $b) {
        if ($b['id'] == $id) {
            jsonResponse([
                'success' => true,
                'bursary' => $b
            ]);
        }
    }

    $db = Database::getConnection();
    if ($db) {
        $bursary = getById('bursaries', $id);
        if ($bursary) {
            jsonResponse([
                'success' => true,
                'bursary' => $bursary
            ]);
        }
    }

    jsonResponse(['error' => 'Bursary not found'], 404);
}

function applyBursary()
{
    $data = getJsonInput();

    $db = Database::getConnection();

    if ($db) {
        $data['applied_at'] = date('Y-m-d H:i:s');
        $data['status'] = 'pending';

        $id = insert('bursary_applications', $data);

        if ($id) {
            jsonResponse([
                'success' => true,
                'message' => 'Bursary application submitted successfully'
            ], 201);
        }
    }

    jsonResponse([
        'success' => true,
        'message' => 'Bursary application submitted (demo mode)'
    ], 201);
}
