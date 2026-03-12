<?php

/**
 * Database Connection Helper
 */

require_once __DIR__ . '/config.php';

class Database
{
    private static $connection = null;

    public static function getConnection()
    {
        if (self::$connection === null) {
            self::$connection = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

            if (self::$connection->connect_error) {
                error_log("Database connection failed: " . self::$connection->connect_error);
                return null;
            }

            self::$connection->set_charset('utf8');
        }

        return self::$connection;
    }

    public static function close()
    {
        if (self::$connection !== null) {
            self::$connection->close();
            self::$connection = null;
        }
    }
}

/**
 * Get all records from a table
 */
function getAll($table, $orderBy = 'id DESC')
{
    $db = Database::getConnection();
    if (!$db) return [];

    $result = $db->query("SELECT * FROM $table ORDER BY $orderBy");
    $records = [];

    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $records[] = $row;
        }
    }

    return $records;
}

/**
 * Get a single record by ID
 */
function getById($table, $id)
{
    $db = Database::getConnection();
    if (!$db) return null;

    $id = (int)$id;
    $result = $db->query("SELECT * FROM $table WHERE id = $id");

    if ($result && $result->num_rows > 0) {
        return $result->fetch_assoc();
    }

    return null;
}

/**
 * Insert a record and return the ID
 */
function insert($table, $data)
{
    $db = Database::getConnection();
    if (!$db) return false;

    $columns = implode(', ', array_keys($data));
    $values = "'" . implode("', '", array_map([$db, 'real_escape_string'], array_values($data))) . "'";

    $sql = "INSERT INTO $table ($columns) VALUES ($values)";

    if ($db->query($sql)) {
        return $db->insert_id;
    }

    error_log("Insert error: " . $db->error);
    return false;
}

/**
 * Update a record by ID
 */
function update($table, $id, $data)
{
    $db = Database::getConnection();
    if (!$db) return false;

    $id = (int)$id;
    $sets = [];

    foreach ($data as $key => $value) {
        $key = $db->real_escape_string($key);
        $value = $db->real_escape_string($value);
        $sets[] = "$key = '$value'";
    }

    $sql = "UPDATE $table SET " . implode(', ', $sets) . " WHERE id = $id";

    return $db->query($sql);
}

/**
 * Delete a record by ID
 */
function delete($table, $id)
{
    $db = Database::getConnection();
    if (!$db) return false;

    $id = (int)$id;
    return $db->query("DELETE FROM $table WHERE id = $id");
}

/**
 * Execute a custom query
 */
function query($sql)
{
    $db = Database::getConnection();
    if (!$db) return null;

    $result = $db->query($sql);

    if ($result === true) {
        return ['affected_rows' => $db->affected_rows, 'insert_id' => $db->insert_id];
    }

    $records = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $records[] = $row;
        }
    }

    return $records;
}
