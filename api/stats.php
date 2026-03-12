<?php

/**
 * Stats API Handler
 * Handles all statistics-related API endpoints
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$resource = $_GET['resource'] ?? null;

if ($method !== 'GET') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

// Statistics data
$statsData = [
    'schools' => [
        'total' => 156,
        'by_category' => [
            'kindergarten' => 45,
            'primary' => 52,
            'secondary' => 38,
            'technical' => 12,
            'university' => 9
        ],
        'by_region' => [
            'kampala' => 45,
            'jinja' => 18,
            'mbarara' => 15,
            'other' => 78
        ]
    ],
    'bursaries' => [
        'total' => 28,
        'active' => 15,
        'by_category' => [
            'government' => 8,
            'private' => 12,
            'international' => 8
        ]
    ],
    'agents' => [
        'total' => 24,
        'active' => 20
    ],
    'events' => [
        'total' => 12,
        'upcoming' => 5
    ],
    'jobs' => [
        'total' => 35,
        'open' => 18
    ],
    'past_papers' => [
        'total' => 156,
        'downloads' => 45200
    ],
    'users' => [
        'total' => 1250,
        'active' => 890
    ]
];

// Try to get real stats from database
$db = Database::getConnection();
if ($db) {
    // Get schools count
    $result = $db->query("SELECT COUNT(*) as total FROM schools");
    if ($result && $row = $result->fetch_assoc()) {
        $statsData['schools']['total'] = (int)$row['total'];
    }

    // Get bursaries count
    $result = $db->query("SELECT COUNT(*) as total FROM bursaries");
    if ($result && $row = $result->fetch_assoc()) {
        $statsData['bursaries']['total'] = (int)$row['total'];
    }

    // Get agents count
    $result = $db->query("SELECT COUNT(*) as total FROM agents");
    if ($result && $row = $result->fetch_assoc()) {
        $statsData['agents']['total'] = (int)$row['total'];
    }

    // Get events count
    $result = $db->query("SELECT COUNT(*) as total FROM events");
    if ($result && $row = $result->fetch_assoc()) {
        $statsData['events']['total'] = (int)$row['total'];
    }

    // Get jobs count
    $result = $db->query("SELECT COUNT(*) as total FROM jobs");
    if ($result && $row = $result->fetch_assoc()) {
        $statsData['jobs']['total'] = (int)$row['total'];
    }

    // Get past papers count
    $result = $db->query("SELECT COUNT(*) as total, SUM(downloads) as downloads FROM past_papers");
    if ($result && $row = $result->fetch_assoc()) {
        $statsData['past_papers']['total'] = (int)$row['total'];
        $statsData['past_papers']['downloads'] = (int)$row['downloads'];
    }

    // Get users count
    $result = $db->query("SELECT COUNT(*) as total FROM users");
    if ($result && $row = $result->fetch_assoc()) {
        $statsData['users']['total'] = (int)$row['total'];
    }
}

// Return specific stat or all stats
if ($resource) {
    if (isset($statsData[$resource])) {
        jsonResponse([
            'success' => true,
            $resource => $statsData[$resource]
        ]);
    } else {
        jsonResponse(['error' => 'Stat not found'], 404);
    }
}

jsonResponse([
    'success' => true,
    'stats' => $statsData
]);
