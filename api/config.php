<?php

/**
 * Database Configuration
 * Update these values to match your MySQL database
 */

define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'school_system');

define('JWT_SECRET', 'your-secret-key-change-in-production');
define('JWT_EXPIRY', 86400); // 24 hours in seconds

// API Response Helpers
function jsonResponse($data, $statusCode = 200)
{
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function getJsonInput()
{
    $input = file_get_contents('php://input');
    return json_decode($input, true);
}

// CORS Headers
function setCorsHeaders()
{
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}
