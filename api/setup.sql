-- PHP MySQL Database Setup
-- Run this file to create the database and tables

-- Create database
CREATE DATABASE IF NOT EXISTS school_system;
USE school_system;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    is_admin BOOLEAN DEFAULT FALSE,
    is_systems BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Schools table
CREATE TABLE IF NOT EXISTS schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Uganda',
    category VARCHAR(50),
    description TEXT,
    students INT DEFAULT 0,
    faculty INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3,1) DEFAULT 0,
    logo VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Bursaries table
CREATE TABLE IF NOT EXISTS bursaries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    provider VARCHAR(255),
    description TEXT,
    amount VARCHAR(100),
    deadline DATE,
    eligibility TEXT,
    category VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Bursary applications table
CREATE TABLE IF NOT EXISTS bursary_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bursary_id INT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    school VARCHAR(255),
    message TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Agents table
CREATE TABLE IF NOT EXISTS agents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    region VARCHAR(100),
    specialization VARCHAR(255),
    rating DECIMAL(3,1) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time VARCHAR(50),
    location VARCHAR(255),
    category VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    location VARCHAR(100),
    type VARCHAR(50),
    description TEXT,
    requirements TEXT,
    salary VARCHAR(100),
    deadline DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Job applications table
CREATE TABLE IF NOT EXISTS job_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    resume TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Past papers table
CREATE TABLE IF NOT EXISTS past_papers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    subject VARCHAR(100),
    level VARCHAR(50),
    year INT,
    downloads INT DEFAULT 0,
    file_url VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Suggestions table
CREATE TABLE IF NOT EXISTS suggestions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    category VARCHAR(50),
    subject VARCHAR(255),
    message TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data for testing
INSERT INTO users (email, password, name, role, is_admin) VALUES 
('admin@thrive.com', 'admin123', 'Admin User', 'admin', TRUE),
('systems@thrive.com', 'systems123', 'Systems Manager', 'systems', FALSE);

INSERT INTO schools (name, location, city, category, description, students, faculty, is_verified, rating) VALUES
('Springfield International School', 'Kampala', 'Kampala', 'secondary', 'A leading international school in Kampala', 450, 35, TRUE, 4.8),
('Kampala Technical Institute', 'Industrial Area, Kampala', 'Kampala', 'technical', 'Premier technical institution in Uganda', 680, 42, TRUE, 4.9),
('Al-Noor Islamic Academy', 'Jinja', 'Jinja', 'tahfidh', 'Quality Islamic education with Quran memorization', 320, 28, TRUE, 5.0),
('Mbarara Girls High School', 'Mbarara', 'Mbarara', 'secondary', 'Excellent girls secondary school in western Uganda', 520, 38, TRUE, 4.9),
('Sunshine Kindergarten', 'Kampala', 'Kampala', 'kindergarten', 'A nurturing environment for early learners', 150, 15, TRUE, 4.7);

INSERT INTO bursaries (name, provider, description, amount, deadline, eligibility, category) VALUES
('Uganda Government Bursary Scheme', 'Ministry of Education', 'Government-funded bursary for students from disadvantaged backgrounds', 'Up to UGX 2,000,000', '2026-03-31', 'Secondary school students with good academic performance', 'government'),
('MTN Foundation Scholarship', 'MTN Uganda', 'Full scholarship for bright students pursuing STEM courses', 'Full tuition + stipend', '2026-04-15', 'University students in STEM fields', 'private'),
('Islamic Development Bank Scholarship', 'IsDB', 'Scholarship for Muslim students pursuing higher education', 'Full tuition + living allowance', '2026-05-01', 'Muslim students with academic excellence', 'international');

INSERT INTO agents (name, email, phone, region, specialization, rating) VALUES
('John Mukama', 'john@edubridge.com', '+256 700 123456', 'Kampala', 'Primary & Secondary Schools', 4.8),
('Sarah Nakato', 'sarah@edubridge.com', '+256 700 234567', 'Jinja & Eastern Uganda', 'Islamic Schools', 4.9),
('David Okello', 'david@edubridge.com', '+256 700 345678', 'Western Uganda', 'Technical Institutes', 4.7);

INSERT INTO events (title, description, date, time, location, category) VALUES
('Open Day - Sunshine Academy', 'Visit our campus and meet our teachers', '2026-04-15', '10:00 AM - 2:00 PM', 'Main Campus, Kampala', 'open-day'),
('STEM Workshop for Kids', 'Hands-on science experiments for children aged 8-14', '2026-04-20', '9:00 AM - 12:00 PM', 'Science Lab, Kampala', 'workshop'),
('University Fair 2026', 'Meet representatives from 20+ universities', '2026-04-25', '11:00 AM - 4:00 PM', 'Kampala Convention Center', 'fair');

INSERT INTO jobs (title, company, location, type, description, requirements, salary, deadline) VALUES
('Mathematics Teacher', 'Greenfield High', 'Jinja', 'Full-time', 'Teach Mathematics to secondary school students', 'Bachelor''s in Mathematics, teaching experience', 'UGX 1,500,000 - 2,000,000', '2026-05-30'),
('School Counselor', 'Sunshine Academy', 'Kampala', 'Full-time', 'Provide academic and career counseling', 'Degree in Psychology or Counseling', 'UGX 1,200,000 - 1,500,000', '2026-06-15'),
('IT Support Specialist', 'Kampala Tech Institute', 'Kampala', 'Contract', 'Maintain school IT infrastructure', 'Diploma in IT, network management skills', 'UGX 800,000 - 1,000,000', '2026-05-20');

INSERT INTO past_papers (title, description, subject, level, year, downloads) VALUES
('PLE Mathematics Past Papers 2025', 'Primary Leaving Examination Mathematics papers', 'Mathematics', 'Primary', 2025, 1250),
('UCE Physics Past Papers 2024', 'Uganda Certificate of Education Physics papers', 'Physics', 'Secondary', 2024, 890),
('UACE Biology Past Papers 2024', 'Uganda Advanced Certificate of Education Biology', 'Biology', 'Advanced', 2024, 567),
('Mathematics KCSE Past Papers', 'Kenya Certificate of Secondary Education Math', 'Mathematics', 'Secondary', 2025, 2100);

INSERT INTO suggestions (name, email, category, subject, message, status) VALUES
('Mary Wanjiku', 'mary@email.com', 'school', 'Add more schools in Northern Uganda', 'Please consider adding more schools from Gulu, Lira, and other northern regions.', 'pending'),
('James Odhiambo', 'james@email.com', 'bursary', 'More scholarship information', 'It would be helpful to have more details about scholarship requirements.', 'reviewed');

