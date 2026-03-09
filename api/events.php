<?php

/**
 * Events API Handler
 * Handles all event-related API endpoints
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

// Sample events data
$sampleEvents = [
    [
        'id' => 1,
        'title' => 'Open Day - Sunshine Academy',
        'description' => 'Visit our campus and meet our teachers',
        'date' => '2026-04-15',
        'time' => '10:00 AM - 2:00 PM',
        'location' => 'Main Campus, Kampala',
        'category' => 'open-day'
    ],
    [
        'id' => 2,
        'title' => 'STEM Workshop for Kids',
        'description' => 'Hands-on science experiments for children aged 8-14',
        'date' => '2026-04-20',
        'time' => '9:00 AM - 12:00 PM',
        'location' => 'Science Lab, Kampala',
        'category' => 'workshop'
    ],
    [
        'id' => 3,
        'title' => 'University Fair 2026',
        'description' => 'Meet representatives from 20+ universities',
        'date' => '2026-04-25',
        'time' => '11:00 AM - 4:00 PM',
        'location' => 'Kampala Convention Center',
        'category' => 'fair'
    ]
];

// Route requests
if ($method === 'GET' && $id) {
    getEvent($id);
} elseif ($method === 'GET') {
    getEvents();
} elseif ($method === 'POST') {
    createEvent();
} else {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

function getEvents()
{
    global $sampleEvents;

    $db = Database::getConnection();
    if ($db) {
        $events = getAll('events');
        if (count($events) > 0) {
            jsonResponse([
                'success' => true,
                'events' => $events,
                'total' => count($events)
            ]);
        }
    }

    jsonResponse([
        'success' => true,
        'events' => $sampleEvents,
        'total' => count($sampleEvents)
    ]);
}

function getEvent($id)
{
    global $sampleEvents;

    foreach ($sampleEvents as $e) {
        if ($e['id'] == $id) {
            jsonResponse([
                'success' => true,
                'event' => $e
            ]);
        }
    }

    $db = Database::getConnection();
    if ($db) {
        $event = getById('events', $id);
        if ($event) {
            jsonResponse([
                'success' => true,
                'event' => $event
            ]);
        }
    }

    jsonResponse(['error' => 'Event not found'], 404);
}

function createEvent()
{
    $data = getJsonInput();

    if (empty($data['title'])) {
        jsonResponse(['error' => 'Event title is required'], 400);
    }

    $db = Database::getConnection();

    if ($db) {
        $data['created_at'] = date('Y-m-d H:i:s');

        $id = insert('events', $data);

        if ($id) {
            jsonResponse([
                'success' => true,
                'message' => 'Event created successfully',
                'id' => $id
            ], 201);
        }
    }

    jsonResponse([
        'success' => true,
        'message' => 'Event created successfully (demo mode)'
    ], 201);
}
