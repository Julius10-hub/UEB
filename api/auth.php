<?php

/**
 * Authentication API Handler
 * Handles login, register, logout, and user info
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

setCorsHeaders();

// Simple token storage (use database or Redis in production)
session_start();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// Route requests
switch ($action) {
    case 'login':
        handleLogin();
        break;
    case 'register':
        handleRegister();
        break;
    case 'logout':
        handleLogout();
        break;
    case 'me':
        handleMe();
        break;
    case 'refresh':
        handleRefresh();
        break;
    default:
        jsonResponse(['error' => 'Auth endpoint not found'], 404);
}

function handleLogin()
{
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }

    $data = getJsonInput();
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';

    if (empty($email) || empty($password)) {
        jsonResponse(['error' => 'Email and password required'], 400);
    }

    // Demo credentials check
    $isAdmin = ($email === 'admin@thrive.com' && $password === 'admin123');
    $isSystems = ($email === 'systems@thrive.com' && $password === 'systems123');

    if ($isAdmin || $isSystems) {
        $token = bin2hex(random_bytes(32));
        $role = $isAdmin ? 'admin' : 'systems';

        $_SESSION['token'] = $token;
        $_SESSION['user'] = [
            'email' => $email,
            'name' => $isAdmin ? 'Admin' : 'Systems Manager',
            'role' => $role
        ];

        jsonResponse([
            'success' => true,
            'message' => 'Login successful',
            'token' => $token,
            'user' => [
                'email' => $email,
                'name' => $isAdmin ? 'Admin' : 'Systems Manager',
                'role' => $role
            ]
        ]);
    }

    // Try database lookup
    $db = Database::getConnection();
    if ($db) {
        $email = $db->real_escape_string($email);
        $passwordHash = md5($password); // Use password_hash in production

        $result = $db->query("SELECT * FROM users WHERE email = '$email' AND password = '$passwordHash'");

        if ($result && $result->num_rows > 0) {
            $user = $result->fetch_assoc();
            $token = bin2hex(random_bytes(32));

            $_SESSION['token'] = $token;
            $_SESSION['user'] = [
                'email' => $user['email'],
                'name' => $user['name'] ?? $user['email'],
                'role' => $user['role'] ?? 'user'
            ];

            jsonResponse([
                'success' => true,
                'message' => 'Login successful',
                'token' => $token,
                'user' => $_SESSION['user']
            ]);
        }
    }

    jsonResponse(['error' => 'Invalid email or password'], 401);
}

function handleRegister()
{
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }

    $data = getJsonInput();
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';
    $name = $data['name'] ?? '';

    if (empty($email) || empty($password)) {
        jsonResponse(['error' => 'Email and password required'], 400);
    }

    $db = Database::getConnection();

    if ($db) {
        $emailEsc = $db->real_escape_string($email);
        $nameEsc = $db->real_escape_string($name);
        $passwordHash = md5($password); // Use password_hash in production

        // Check if email exists
        $check = $db->query("SELECT id FROM users WHERE email = '$emailEsc'");

        if ($check && $check->num_rows > 0) {
            jsonResponse(['error' => 'Email already registered'], 400);
        }

        // Insert new user
        $sql = "INSERT INTO users (email, password, name, role, created_at) VALUES ('$emailEsc', '$passwordHash', '$nameEsc', 'user', NOW())";

        if ($db->query($sql)) {
            jsonResponse([
                'success' => true,
                'message' => 'Registration successful'
            ], 201);
        }

        jsonResponse(['error' => 'Registration failed'], 500);
    }

    // Demo mode - always succeed
    jsonResponse([
        'success' => true,
        'message' => 'Registration successful (demo mode)'
    ], 201);
}

function handleLogout()
{
    // Clear session
    if (isset($_SESSION['token'])) {
        unset($_SESSION['token']);
    }
    if (isset($_SESSION['user'])) {
        unset($_SESSION['user']);
    }

    session_destroy();

    jsonResponse([
        'success' => true,
        'message' => 'Logged out successfully'
    ]);
}

function handleMe()
{
    if (!isset($_SESSION['user']) || !isset($_SESSION['token'])) {
        jsonResponse(['error' => 'Not authenticated'], 401);
    }

    jsonResponse([
        'success' => true,
        'user' => $_SESSION['user']
    ]);
}

function handleRefresh()
{
    if (!isset($_SESSION['user'])) {
        jsonResponse(['error' => 'Not authenticated'], 401);
    }

    // Generate new token
    $token = bin2hex(random_bytes(32));
    $_SESSION['token'] = $token;

    jsonResponse([
        'success' => true,
        'message' => 'Token refreshed',
        'token' => $token
    ]);
}
