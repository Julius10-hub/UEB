"""Create the MySQL database specified in the project's .env

This script reads DB connection details from the environment and
creates the database if it does not exist.
"""
import os
from urllib.parse import unquote
import pymysql
from dotenv import load_dotenv

ROOT = os.path.dirname(os.path.dirname(__file__))
load_dotenv(os.path.join(ROOT, '.env'))
load_dotenv(os.path.join(ROOT, 'backend', '.env'))

def parse_db_url(url):
    # expected format: mysql+pymysql://user:pass@host[:port]/dbname
    if not url.startswith('mysql'):
        raise SystemExit('DATABASE_URL does not appear to be a MySQL URL')
    # strip scheme
    rest = url.split('://', 1)[1]
    creds, host_db = rest.split('@', 1)
    user, password = creds.split(':', 1)
    host_part, dbname = host_db.split('/', 1)
    if ':' in host_part:
        host, port = host_part.split(':', 1)
    else:
        host, port = host_part, None
    return unquote(user), unquote(password), host, port, unquote(dbname)

def main():
    db_url = os.getenv('DATABASE_URL')
    if not db_url:
        print('DATABASE_URL not found in environment')
        return
    user, password, host, port, dbname = parse_db_url(db_url)

    conn_kwargs = {'host': host, 'user': user, 'password': password}
    if port:
        conn_kwargs['port'] = int(port)

    print(f"Connecting to MySQL at {host} as {user} to create database '{dbname}'")
    conn = pymysql.connect(**conn_kwargs)
    try:
        with conn.cursor() as cur:
            cur.execute(f"CREATE DATABASE IF NOT EXISTS `{dbname}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
            print(f"Database '{dbname}' ensured.")
        conn.commit()
    finally:
        conn.close()

if __name__ == '__main__':
    main()
