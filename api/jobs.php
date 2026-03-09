<?php

/**
 * Jobs API Handler
 * Handles all job-related API endpoints
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

// Sample jobs data
$sampleJobs = [
    [
        'id' => 1,
        'title' => 'Mathematics Teacher',
        'company' => 'Greenfield High',
        'location' => 'Jinja',
        'type' => 'Full-time',
        'description' => 'Teach Mathematics to secondary school students',
        'requirements' => 'Bachelor\'s in Mathematics, teaching experience',
        'salary' => 'UGX 1,500,000 - 2,000,000',
        'deadline' => '2026-05-30'
    ],
    [
        'id' => 2,
        'title' => 'School Counselor',
        'company' => 'Sunshine Academy',
        'location' => 'Kampala',
        'type' => 'Full-time',
        'description' => 'Provide academic and career counseling',
        'requirements' => 'Degree in Psychology or Counseling',
        'salary' => 'UGX 1,200,000 - 1,500,000',
        'deadline' => '2026-06-15'
    ],
    [
        'id' => 3,
        'title' => 'IT Support Specialist',
        'company' => 'Kampala Tech Institute',
        'location' => 'Kampala',
        'type' => 'Contract',
        'description' => 'Maintain school IT infrastructure',
        'requirements' => 'Diploma in IT, network management skills',
        'salary' => 'UGX 800,000 - 1,000,000',
        'deadline' => '2026-05-20'
    ]
];

// Route requests
if ($method === 'GET' && $id) {
    getJob($id);
} elseif ($method === 'GET') {
    getJobs();
} elseif ($method === 'POST') {
    applyJob();
} else {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

function getJobs()
{
    global $sampleJobs;

    $db = Database::getConnection();
    if ($db) {
        $jobs = getAll('jobs');
        if (count($jobs) > 0) {
            jsonResponse([
                'success' => true,
                'jobs' => $jobs,
                'total' => count($jobs)
            ]);
        }
    }

    jsonResponse([
        'success' => true,
        'jobs' => $sampleJobs,
        'total' => count($sampleJobs)
    ]);
}

function getJob($id)
{
    global $sampleJobs;

    foreach ($sampleJobs as $j) {
        if ($j['id'] == $id) {
            jsonResponse([
                'success' => true,
                'job' => $j
            ]);
        }
    }

    $db = Database::getConnection();
    if ($db) {
        $job = getById('jobs', $id);
        if ($job) {
            jsonResponse([
                'success' => true,
                'job' => $job
            ]);
        }
    }

    jsonResponse(['error' => 'Job not found'], 404);
}

function applyJob()
{
    $data = getJsonInput();

    if (empty($data['job_id']) || empty($data['email'])) {
        jsonResponse(['error' => 'Job ID and email are required'], 400);
    }

    $db = Database::getConnection();

    if ($db) {
        $data['applied_at'] = date('Y-m-d H:i:s');
        $data['status'] = 'pending';

        $id = insert('job_applications', $data);

        if ($id) {
            jsonResponse([
                'success' => true,
                'message' => 'Job application submitted successfully'
            ], 201);
        }
    }

    jsonResponse([
        'success' => true,
        'message' => 'Job application submitted (demo mode)'
    ], 201);
}
