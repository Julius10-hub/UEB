<?php

/**
 * Past Papers API Handler
 * Handles all past paper-related API endpoints
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

// Sample past papers data
$samplePapers = [
    [
        'id' => 1,
        'title' => 'PLE Mathematics Past Papers 2025',
        'description' => 'Primary Leaving Examination Mathematics papers',
        'subject' => 'Mathematics',
        'level' => 'Primary',
        'year' => 2025,
        'downloads' => 1250,
        'file_url' => '#'
    ],
    [
        'id' => 2,
        'title' => 'UCE Physics Past Papers 2024',
        'description' => 'Uganda Certificate of Education Physics papers',
        'subject' => 'Physics',
        'level' => 'Secondary',
        'year' => 2024,
        'downloads' => 890,
        'file_url' => '#'
    ],
    [
        'id' => 3,
        'title' => 'UACE Biology Past Papers 2024',
        'description' => 'Uganda Advanced Certificate of Education Biology',
        'subject' => 'Biology',
        'level' => 'Advanced',
        'year' => 2024,
        'downloads' => 567,
        'file_url' => '#'
    ],
    [
        'id' => 4,
        'title' => 'Mathematics KCSE Past Papers',
        'description' => 'Kenya Certificate of Secondary Education Math',
        'subject' => 'Mathematics',
        'level' => 'Secondary',
        'year' => 2025,
        'downloads' => 2100,
        'file_url' => '#'
    ]
];

// Route requests
if ($method === 'GET' && $id) {
    getPastPaper($id);
} elseif ($method === 'GET') {
    getPastPapers();
} elseif ($method === 'POST') {
    uploadPastPaper();
} else {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

function getPastPapers()
{
    global $samplePapers;

    $db = Database::getConnection();
    if ($db) {
        $papers = getAll('past_papers');
        if (count($papers) > 0) {
            jsonResponse([
                'success' => true,
                'past_papers' => $papers,
                'total' => count($papers)
            ]);
        }
    }

    jsonResponse([
        'success' => true,
        'past_papers' => $samplePapers,
        'total' => count($samplePapers)
    ]);
}

function getPastPaper($id)
{
    global $samplePapers;

    foreach ($samplePapers as $p) {
        if ($p['id'] == $id) {
            jsonResponse([
                'success' => true,
                'past_paper' => $p
            ]);
        }
    }

    $db = Database::getConnection();
    if ($db) {
        $paper = getById('past_papers', $id);
        if ($paper) {
            jsonResponse([
                'success' => true,
                'past_paper' => $paper
            ]);
        }
    }

    jsonResponse(['error' => 'Past paper not found'], 404);
}

function uploadPastPaper()
{
    $data = getJsonInput();

    if (empty($data['title']) || empty($data['subject'])) {
        jsonResponse(['error' => 'Title and subject are required'], 400);
    }

    $db = Database::getConnection();

    if ($db) {
        $data['created_at'] = date('Y-m-d H:i:s');
        $data['downloads'] = 0;

        $id = insert('past_papers', $data);

        if ($id) {
            jsonResponse([
                'success' => true,
                'message' => 'Past paper uploaded successfully',
                'id' => $id
            ], 201);
        }
    }

    jsonResponse([
        'success' => true,
        'message' => 'Past paper uploaded (demo mode)'
    ], 201);
}
