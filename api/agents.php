<?php

/**
 * Agents API Handler
 * Handles all agent-related API endpoints
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

// Sample agents data
$sampleAgents = [
    [
        'id' => 1,
        'name' => 'John Mukama',
        'email' => 'john@edubridge.com',
        'phone' => '+256 700 123456',
        'region' => 'Kampala',
        'specialization' => 'Primary & Secondary Schools',
        'rating' => 4.8
    ],
    [
        'id' => 2,
        'name' => 'Sarah Nakato',
        'email' => 'sarah@edubridge.com',
        'phone' => '+256 700 234567',
        'region' => 'Jinja & Eastern Uganda',
        'specialization' => 'Islamic Schools',
        'rating' => 4.9
    ],
    [
        'id' => 3,
        'name' => 'David Okello',
        'email' => 'david@edubridge.com',
        'phone' => '+256 700 345678',
        'region' => 'Western Uganda',
        'specialization' => 'Technical Institutes',
        'rating' => 4.7
    ]
];

// Route requests
if ($method === 'GET' && $id) {
    getAgent($id);
} elseif ($method === 'GET') {
    getAgents();
} elseif ($method === 'POST') {
    registerAgent();
} else {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

function getAgents()
{
    global $sampleAgents;

    $db = Database::getConnection();
    if ($db) {
        $agents = getAll('agents');
        if (count($agents) > 0) {
            jsonResponse([
                'success' => true,
                'agents' => $agents,
                'total' => count($agents)
            ]);
        }
    }

    jsonResponse([
        'success' => true,
        'agents' => $sampleAgents,
        'total' => count($sampleAgents)
    ]);
}

function getAgent($id)
{
    global $sampleAgents;

    foreach ($sampleAgents as $a) {
        if ($a['id'] == $id) {
            jsonResponse([
                'success' => true,
                'agent' => $a
            ]);
        }
    }

    $db = Database::getConnection();
    if ($db) {
        $agent = getById('agents', $id);
        if ($agent) {
            jsonResponse([
                'success' => true,
                'agent' => $agent
            ]);
        }
    }

    jsonResponse(['error' => 'Agent not found'], 404);
}

function registerAgent()
{
    $data = getJsonInput();

    if (empty($data['name']) || empty($data['email'])) {
        jsonResponse(['error' => 'Name and email are required'], 400);
    }

    $db = Database::getConnection();

    if ($db) {
        $data['created_at'] = date('Y-m-d H:i:s');
        $data['status'] = 'active';

        $id = insert('agents', $data);

        if ($id) {
            jsonResponse([
                'success' => true,
                'message' => 'Agent registered successfully',
                'id' => $id
            ], 201);
        }
    }

    jsonResponse([
        'success' => true,
        'message' => 'Agent registered successfully (demo mode)'
    ], 201);
}
