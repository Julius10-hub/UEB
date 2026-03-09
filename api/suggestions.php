<?php

/**
 * Suggestions API Handler
 * Handles all suggestion-related API endpoints
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

// Sample suggestions data
$sampleSuggestions = [
    [
        'id' => 1,
        'name' => 'Mary Wanjiku',
        'email' => 'mary@email.com',
        'category' => 'school',
        'subject' => 'Add more schools in Northern Uganda',
        'message' => 'Please consider adding more schools from Gulu, Lira, and other northern regions.',
        'status' => 'pending',
        'created_at' => '2026-01-15'
    ],
    [
        'id' => 2,
        'name' => 'James Odhiambo',
        'email' => 'james@email.com',
        'category' => 'bursary',
        'subject' => 'More scholarship information',
        'message' => 'It would be helpful to have more details about scholarship requirements.',
        'status' => 'reviewed',
        'created_at' => '2026-02-10'
    ]
];

// Route requests
if ($method === 'GET' && $id) {
    getSuggestion($id);
} elseif ($method === 'GET') {
    getSuggestions();
} elseif ($method === 'POST') {
    submitSuggestion();
} else {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

function getSuggestions()
{
    global $sampleSuggestions;

    $db = Database::getConnection();
    if ($db) {
        $suggestions = getAll('suggestions');
        if (count($suggestions) > 0) {
            jsonResponse([
                'success' => true,
                'suggestions' => $suggestions,
                'total' => count($suggestions)
            ]);
        }
    }

    jsonResponse([
        'success' => true,
        'suggestions' => $sampleSuggestions,
        'total' => count($sampleSuggestions)
    ]);
}

function getSuggestion($id)
{
    global $sampleSuggestions;

    foreach ($sampleSuggestions as $s) {
        if ($s['id'] == $id) {
            jsonResponse([
                'success' => true,
                'suggestion' => $s
            ]);
        }
    }

    $db = Database::getConnection();
    if ($db) {
        $suggestion = getById('suggestions', $id);
        if ($suggestion) {
            jsonResponse([
                'success' => true,
                'suggestion' => $suggestion
            ]);
        }
    }

    jsonResponse(['error' => 'Suggestion not found'], 404);
}

function submitSuggestion()
{
    $data = getJsonInput();

    if (empty($data['name']) || empty($data['message'])) {
        jsonResponse(['error' => 'Name and message are required'], 400);
    }

    $db = Database::getConnection();

    if ($db) {
        $data['created_at'] = date('Y-m-d H:i:s');
        $data['status'] = 'pending';

        $id = insert('suggestions', $data);

        if ($id) {
            jsonResponse([
                'success' => true,
                'message' => 'Suggestion submitted successfully',
                'id' => $id
            ], 201);
        }
    }

    jsonResponse([
        'success' => true,
        'message' => 'Suggestion submitted (demo mode)'
    ], 201);
}
