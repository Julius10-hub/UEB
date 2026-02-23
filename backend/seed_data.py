#!/usr/bin/env python
"""
Database seed script - Populates the database with sample data
Run this after creating tables: python seed_data.py
"""

from app import create_app
from models import db, User, School, Event, Job, Bursary, Agent, PastPaper, Suggestion
from datetime import datetime, timedelta


def seed_database():
    """Populate database with sample data"""
    
    app = create_app()
    
    with app.app_context():
        # Clear existing data
        db.session.query(User).delete()
        db.session.query(School).delete()
        db.session.query(Event).delete()
        db.session.query(Job).delete()
        db.session.query(Bursary).delete()
        db.session.query(Agent).delete()
        db.session.query(PastPaper).delete()
        db.session.query(Suggestion).delete()
        
        # Create admin user
        admin = User(
            email='admin@thrive.com',
            name='Admin User',
            phone='+1234567890',
            is_admin=True,
            is_active=True
        )
        admin.set_password('admin123')
        
        # Create regular user
        user = User(
            email='user@thrive.com',
            name='Test User',
            phone='+0987654321',
            is_admin=False,
            is_active=True
        )
        user.set_password('user123')
        
        db.session.add(admin)
        db.session.add(user)
        
        # Create sample schools
        schools = [
            School(
                name='Cpace Aeronautics Academy',
                location='Dubai, UAE',
                city='Dubai',
                country='UAE',
                description='Premier training facility for next-generation aerospace engineers.',
                long_description='State-of-the-art simulation labs and world-class faculty.',
                students=1200,
                faculty=150,
                image='https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
                established=2018,
                category='University',
                programs=['Aerospace Engineering', 'Atmospheric Design', 'Propulsion Systems'],
                contact_email='info@cpace.com',
                contact_phone='+971234567890',
                website='https://cpace.com',
                is_verified=True,
                rating=4.8
            ),
            School(
                name='Skyward Institute of Technology',
                location='Singapore',
                city='Singapore',
                country='Singapore',
                description='Focused on airborne city infrastructure and sustainable living systems.',
                long_description='Pioneers in vertical farming and sustainable technologies.',
                students=850,
                faculty=100,
                image='https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&q=80',
                established=2020,
                category='Technical',
                programs=['Sustainable Infrastructure', 'Vertical Agriculture', 'Energy Systems'],
                contact_email='info@skyward.sg',
                contact_phone='+6567891234',
                website='https://skyward.sg',
                is_verified=True,
                rating=4.7
            ),
            School(
                name='Elevation Research Center',
                location='Tokyo, Japan',
                city='Tokyo',
                country='Japan',
                description='Advanced research institution specializing in anti-gravity technologies.',
                long_description='Home to the first floating prototype lab in Asia.',
                students=650,
                faculty=80,
                image='https://images.unsplash.com/photo-1427504494785-cdaf7c4d4b31?w=800&q=80',
                established=2019,
                category='University',
                programs=['Anti-Gravity Research', 'Atmospheric Physics', 'Materials Science'],
                contact_email='info@elevation.jp',
                contact_phone='+8134567890',
                website='https://elevation.jp',
                is_verified=True,
                rating=4.9
            ),
            School(
                name='Global Secondary Academy',
                location='London, UK',
                city='London',
                country='United Kingdom',
                description='Comprehensive secondary education with focus on STEM and international curriculum.',
                long_description='Award-winning school with excellent exam results and university placements.',
                students=1500,
                faculty=200,
                image='https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
                established=2015,
                category='Secondary',
                programs=['STEM', 'Languages', 'Arts', 'Sports'],
                contact_email='info@globalacademy.uk',
                contact_phone='+442012345678',
                website='https://globalacademy.uk',
                is_verified=True,
                rating=4.6
            ),
            School(
                name='Bright Futures Primary School',
                location='Sydney, Australia',
                city='Sydney',
                country='Australia',
                description='Innovative primary education with emphasis on creativity and critical thinking.',
                long_description='Small class sizes and personalized learning approaches.',
                students=800,
                faculty=60,
                image='https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80',
                established=2010,
                category='Primary',
                programs=['Core Subjects', 'Arts', 'Sports', 'Music'],
                contact_email='info@brightfutures.au',
                contact_phone='+61212345678',
                website='https://brightfutures.au',
                is_verified=True,
                rating=4.5
            ),
        ]
        
        for school in schools:
            db.session.add(school)
        
        # Create sample events
        events = [
            Event(
                title='International Education Summit 2024',
                description='Annual gathering of educational leaders and innovators from around the world.',
                event_type='Conference',
                date=datetime.now() + timedelta(days=30),
                venue='Dubai Convention Center',
                location='Dubai, UAE',
                capacity=1000,
                organizer='Global Education Network',
                contact_email='summit@edunet.com',
                contact_phone='+971234567890',
                status='Upcoming',
                is_featured=True
            ),
            Event(
                title='STEM Showcase & Awards',
                description='Celebrate student achievements in science, technology, engineering, and mathematics.',
                event_type='Workshop',
                date=datetime.now() + timedelta(days=45),
                venue='Singapore Tech Hub',
                location='Singapore',
                capacity=500,
                organizer='STEM Education Foundation',
                contact_email='stem@foundation.sg',
                contact_phone='+6567891234',
                status='Upcoming',
                is_featured=True
            ),
            Event(
                title='Educational Technology Workshop',
                description='Learn about the latest tools and platforms transforming education.',
                event_type='Seminar',
                date=datetime.now() + timedelta(days=60),
                venue='Tokyo Convention Center',
                location='Tokyo, Japan',
                capacity=300,
                organizer='EdTech Innovations',
                contact_email='workshop@edtech.jp',
                contact_phone='+8134567890',
                status='Upcoming',
                is_featured=False
            ),
        ]
        
        for event in events:
            db.session.add(event)
        
        # Create sample jobs
        jobs = [
            Job(
                title='Education Technology Specialist',
                description='Implement and manage educational technology solutions.',
                requirements='Bachelor\'s in Education or IT, 3+ years experience',
                location='Dubai',
                job_type='Full-time',
                company='Global Education Network',
                experience_level='Mid',
                deadline=datetime.now() + timedelta(days=30),
                status='Active',
                company_logo='https://example.com/logo1.png',
                is_featured=True
            ),
            Job(
                title='School Principal',
                description='Lead and manage a world-class secondary school.',
                requirements='Master\'s in Educational Leadership, 10+ years experience',
                location='Singapore',
                job_type='Full-time',
                company='Skyward Institute',
                experience_level='Senior',
                salary_min=150000,
                salary_max=200000,
                deadline=datetime.now() + timedelta(days=45),
                status='Active',
                company_logo='https://example.com/logo2.png',
                is_featured=True
            ),
            Job(
                title='STEM Teacher',
                description='Teach science and mathematics at secondary level.',
                requirements='Bachelor\'s in Science/Math, Teaching certification',
                location='Tokyo',
                job_type='Full-time',
                company='Elevation Research Center',
                experience_level='Mid',
                salary_min=50000,
                salary_max=80000,
                deadline=datetime.now() + timedelta(days=60),
                status='Active',
                company_logo='https://example.com/logo3.png',
                is_featured=False
            ),
        ]
        
        for job in jobs:
            db.session.add(job)
        
        # Create sample bursaries
        bursaries = [
            Bursary(
                title='Excellence Merit Scholarship',
                bursary_type='Scholarship',
                amount=50000,
                currency='USD',
                coverage_type='Full',
                description='Full scholarship for outstanding students demonstrating academic excellence.',
                eligibility_criteria='GPA >= 3.8, 2 reference letters',
                provider='Global Education Fund',
                education_level='Secondary',
                award_frequency='Annual',
                number_of_awards=20,
                status='Active',
                is_featured=True
            ),
            Bursary(
                title='Need-Based Grant Program',
                bursary_type='Grant',
                amount=25000,
                currency='USD',
                coverage_type='Partial',
                description='Financial assistance for deserving students with demonstrated financial need.',
                eligibility_criteria='Financial need assessment required',
                provider='UNICEF Education',
                education_level='Tertiary',
                award_frequency='Annual',
                number_of_awards=50,
                status='Active',
                is_featured=False
            ),
            Bursary(
                title='STEM Excellence Award',
                bursary_type='Scholarship',
                amount=35000,
                currency='USD',
                coverage_type='Partial',
                description='Special funding for students pursuing science, technology, engineering, or mathematics.',
                eligibility_criteria='Enrolled in STEM program, 3.5+ GPA',
                provider='STEM Education Foundation',
                education_level='Tertiary',
                field_of_study='STEM',
                award_frequency='Annual',
                number_of_awards=30,
                status='Active',
                is_featured=True
            ),
            Bursary(
                title='Athletic Scholarship',
                bursary_type='Scholarship',
                amount=30000,
                currency='USD',
                coverage_type='Partial',
                description='Recognition and support for student athletes of exceptional caliber.',
                eligibility_criteria='Athletic merit and academic standing',
                provider='International Sports Education',
                education_level='Secondary',
                award_frequency='Annual',
                number_of_awards=15,
                status='Active',
                is_featured=False
            ),
        ]
        
        for bursary in bursaries:
            db.session.add(bursary)
        
        # Create sample agents
        agents = [
            Agent(
                name='John Smith',
                email='john@eduagents.com',
                phone_number='+254123456789',
                organization='Smith Education Consultants',
                region='East Africa',
                country='Kenya',
                promo_code='JOHN2024',
                students_referred=125,
                commissions_percentage=15.0,
                status='Active',
                verification_status='Verified',
                is_featured=True,
                rating=4.8,
                total_enrollments=125
            ),
            Agent(
                name='Sarah Johnson',
                email='sarah@eduagents.com',
                phone_number='+234123456789',
                organization='Johnson Global Recruitment',
                region='West Africa',
                country='Nigeria',
                promo_code='SARAH2024',
                students_referred=98,
                commission_percentage=12.0,
                status='Active',
                verification_status='Verified',
                is_featured=False,
                rating=4.6,
                total_enrollments=98
            ),
            Agent(
                name='Ahmed Hassan',
                email='ahmed@eduagents.com',
                phone_number='+966123456789',
                organization='Hassan Educational Services',
                region='Middle East',
                country='Saudi Arabia',
                promo_code='AHMED2024',
                students_referred=156,
                commission_percentage=18.0,
                status='Active',
                verification_status='Verified',
                is_featured=True,
                rating=4.9,
                total_enrollments=156
            ),
        ]
        
        for agent in agents:
            db.session.add(agent)
        
        # Create sample past papers
        papers = [
            PastPaper(
                title='Mathematics O-Level 2023',
                subject='Mathematics',
                subject_code='MATH101',
                year=2023,
                exam_board='Cambridge',
                category='Secondary',
                level='O-Level',
                paper_number=1,
                duration='2 hours',
                download_url='https://example.com/papers/math_2023_p1.pdf',
                file_size='2.5MB',
                file_type='PDF',
                difficulty_level='Medium',
                provider='Cambridge International',
                is_featured=True,
                rating=4.7
            ),
            PastPaper(
                title='English Literature A-Level 2023',
                subject='English Literature',
                subject_code='ENG201',
                year=2023,
                exam_board='Cambridge',
                category='Secondary',
                level='A-Level',
                paper_number=1,
                duration='3 hours',
                download_url='https://example.com/papers/english_2023_p1.pdf',
                file_size='1.8MB',
                file_type='PDF',
                difficulty_level='Hard',
                provider='Cambridge International',
                is_featured=True,
                rating=4.5
            ),
            PastPaper(
                title='Physics O-Level 2023',
                subject='Physics',
                subject_code='PHYS101',
                year=2023,
                exam_board='Cambridge',
                category='Secondary',
                level='O-Level',
                paper_number=1,
                duration='1.5 hours',
                download_url='https://example.com/papers/physics_2023_p1.pdf',
                file_size='3.1MB',
                file_type='PDF',
                difficulty_level='Medium',
                provider='Cambridge International',
                is_featured=False,
                rating=4.6
            ),
            PastPaper(
                title='Biology O-Level 2023',
                subject='Biology',
                subject_code='BIO101',
                year=2023,
                exam_board='Cambridge',
                category='Secondary',
                level='O-Level',
                paper_number=1,
                duration='2 hours',
                download_url='https://example.com/papers/biology_2023_p1.pdf',
                file_size='2.3MB',
                file_type='PDF',
                difficulty_level='Easy',
                provider='Cambridge International',
                is_featured=False,
                rating=4.4
            ),
            PastPaper(
                title='Chemistry O-Level 2023',
                subject='Chemistry',
                subject_code='CHEM101',
                year=2023,
                exam_board='Cambridge',
                category='Secondary',
                level='O-Level',
                paper_number=1,
                duration='2 hours',
                download_url='https://example.com/papers/chemistry_2023_p1.pdf',
                file_size='2.7MB',
                file_type='PDF',
                difficulty_level='Medium',
                provider='Cambridge International',
                is_featured=False,
                rating=4.5
            ),
        ]
        
        for paper in papers:
            db.session.add(paper)
        
        # Commit all changes
        db.session.commit()
        
        print('✅ Database seeded successfully!')
        print('📊 Created:')
        print(f'   - {len(schools)} schools')
        print(f'   - {len(events)} events')
        print(f'   - {len(jobs)} job listings')
        print(f'   - {len(bursaries)} bursaries')
        print(f'   - {len(agents)} agents')
        print(f'   - {len(papers)} past papers')
        print(f'   - 2 users (admin + regular)')
        print('\n📝 Login credentials:')
        print('   Admin: admin@thrive.com / admin123')
        print('   User: user@thrive.com / user123')


if __name__ == '__main__':
    seed_database()
