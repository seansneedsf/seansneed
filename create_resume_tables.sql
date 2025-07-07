-- Resume Database Schema for Supabase
-- This creates the tables needed for dynamic resume management

-- 1. Resume Header Information
CREATE TABLE IF NOT EXISTS resume_header (
    id SERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    professional_title TEXT NOT NULL,
    contact_info TEXT NOT NULL,
    professional_summary TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Professional Experience
CREATE TABLE IF NOT EXISTS resume_experience (
    id SERIAL PRIMARY KEY,
    job_title TEXT NOT NULL,
    company TEXT NOT NULL,
    duration TEXT NOT NULL,
    location TEXT,
    description TEXT,
    achievements TEXT[], -- Array of achievements
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Skills/Competencies
CREATE TABLE IF NOT EXISTS resume_skills (
    id SERIAL PRIMARY KEY,
    category_name TEXT NOT NULL,
    skill_list TEXT NOT NULL, -- Comma-separated skills
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Education
CREATE TABLE IF NOT EXISTS resume_education (
    id SERIAL PRIMARY KEY,
    degree TEXT NOT NULL,
    institution TEXT NOT NULL,
    graduation_year TEXT,
    location TEXT,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Key Achievements
CREATE TABLE IF NOT EXISTS resume_achievements (
    id SERIAL PRIMARY KEY,
    achievement TEXT NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_resume_experience_display_order ON resume_experience (display_order);
CREATE INDEX IF NOT EXISTS idx_resume_skills_display_order ON resume_skills (display_order);
CREATE INDEX IF NOT EXISTS idx_resume_education_display_order ON resume_education (display_order);
CREATE INDEX IF NOT EXISTS idx_resume_achievements_display_order ON resume_achievements (display_order);

-- Enable Row Level Security (RLS) for security
ALTER TABLE resume_header ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_achievements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all operations for now - can be restricted later)
-- Note: You might want to add more specific policies based on your needs

-- Resume Header Policies
DROP POLICY IF EXISTS "Allow all operations on resume_header" ON resume_header;
CREATE POLICY "Allow all operations on resume_header" ON resume_header
    FOR ALL USING (true) WITH CHECK (true);

-- Resume Experience Policies
DROP POLICY IF EXISTS "Allow all operations on resume_experience" ON resume_experience;
CREATE POLICY "Allow all operations on resume_experience" ON resume_experience
    FOR ALL USING (true) WITH CHECK (true);

-- Resume Skills Policies
DROP POLICY IF EXISTS "Allow all operations on resume_skills" ON resume_skills;
CREATE POLICY "Allow all operations on resume_skills" ON resume_skills
    FOR ALL USING (true) WITH CHECK (true);

-- Resume Education Policies
DROP POLICY IF EXISTS "Allow all operations on resume_education" ON resume_education;
CREATE POLICY "Allow all operations on resume_education" ON resume_education
    FOR ALL USING (true) WITH CHECK (true);

-- Resume Achievements Policies
DROP POLICY IF EXISTS "Allow all operations on resume_achievements" ON resume_achievements;
CREATE POLICY "Allow all operations on resume_achievements" ON resume_achievements
    FOR ALL USING (true) WITH CHECK (true);

-- Insert default resume header data (based on current resume.html)
INSERT INTO resume_header (full_name, professional_title, contact_info, professional_summary)
VALUES (
    'SEAN SNEED',
    'Creative Director & Product Designer | Design Strategist | Digital Innovation',
    'San Francisco, CA | email@seansneed.com | linkedin.com/in/seansneed',
    'Creative Director and Product Designer with over 8 years of experience transforming complex ideas into beautiful, functional digital experiences. Proven track record in co-founding successful companies, leading cross-functional teams, and driving business transformation through strategic design thinking. Experienced in scaling design agencies, developing innovative technology solutions, and collaborating with major brands like Nike and Apple to deliver exceptional results.'
) ON CONFLICT DO NOTHING;

-- Insert default experience data (based on current resume.html)
INSERT INTO resume_experience (job_title, company, duration, location, description, achievements, display_order)
VALUES 
    (
        'Co-Founder & Design Strategist',
        'Colour International, LLC',
        'March 2024 - Present',
        'San Francisco, CA',
        'Co-founded a creative collective focused on innovative business solutions and digital strategy.',
        ARRAY[
            'Leading cross-functional teams to analyze business requirements and develop actionable solutions',
            'Maintaining client relationships and ensuring project deliverables meet business objectives',
            'Developing strategic frameworks for digital transformation and business improvement initiatives',
            'Collaborating with technical teams to implement solutions that drive measurable business results'
        ],
        1
    ),
    (
        'Founder & Design Strategist',
        'TheTheory, LLC',
        'May 2020 - July 2024',
        'San Francisco, CA',
        'Established a transcontinental, cross-disciplinary design agency focusing on brand strategy and business improvement.',
        ARRAY[
            'Led client discovery sessions to identify business requirements and translate them into actionable solutions',
            'Ensured alignment with business goals and collaborated with technical teams to implement digital solutions',
            'Improved client business processes through strategic design thinking and technology implementation',
            'Built and managed a global team of designers and strategists across multiple time zones'
        ],
        2
    ),
    (
        'Senior Digital Strategist',
        'PriceSlash, LLC',
        '2016 - 2018',
        'San Francisco, CA',
        'Developed and implemented content strategies that led to successful company acquisition by a Mark Cuban portfolio company.',
        ARRAY[
            'Partnered with operation leaders to review business processes and create project plans for operational improvements',
            'Led cross-functional project teams responsible for identifying operational improvements',
            'Analyzed user data to optimize digital experiences and increase product metrics',
            'Contributed to strategic initiatives that resulted in successful company acquisition'
        ],
        3
    ),
    (
        'Co-Founder',
        'Plus0ne, LLC',
        '2014 - 2016',
        'San Francisco, CA',
        'Co-founded an innovative platform that revolutionized event planning by enabling users to create and send event invitations via text messaging.',
        ARRAY[
            'Built the product from concept to launch, focusing on user experience design and strategic product development',
            'Simplified event coordination and communication through innovative technology solutions',
            'Developed go-to-market strategy and managed product development lifecycle',
            'Created user-centered design processes that improved customer engagement and retention'
        ],
        4
    ),
    (
        'Business Consultant',
        'Nike, Inc.',
        '2010 - 2015',
        'Portland, OR / Canada',
        'Created, implemented, and maintained the North America Technology Portfolio for North America Retail.',
        ARRAY[
            'Managed delivery of Technology Services and led teams to drive infrastructure consolidation and cost management initiatives',
            'Served as primary point of contact for new store technology implementations in Canada',
            'Collaborated with technical and business stakeholders to ensure alignment between technology solutions and business needs',
            'Developed and executed strategic technology roadmaps for retail operations across North America'
        ],
        5
    ),
    (
        'Specialist and Trainer',
        'Apple, Inc.',
        'Prior Experience',
        'Various Locations',
        'Trained staff on product features, customer service protocols, and technical troubleshooting.',
        ARRAY[
            'Provided exceptional customer service while demonstrating technical products',
            'Collaborated with team members to ensure store operations ran efficiently',
            'Developed deep expertise in Apple''s design philosophy and customer experience standards',
            'Mentored new team members on product knowledge and customer engagement best practices'
        ],
        6
    )
ON CONFLICT DO NOTHING;

-- Insert default skills data (based on current resume.html)
INSERT INTO resume_skills (category_name, skill_list, display_order)
VALUES 
    ('Design Leadership', 'Creative Direction, Design Strategy, Brand Identity, Cross-functional Team Leadership, Design Systems, Digital Transformation', 1),
    ('Product & UX', 'Product Strategy, UX/UI Design, User Experience Research, Prototyping, Customer Journey Mapping, Digital Product Development', 2),
    ('Business Strategy', 'Business Development, Strategic Planning, Client Relationship Management, Project Management, Operational Improvement', 3),
    ('Technology & Innovation', 'Digital Strategy, Technology Implementation, Content Strategy, Data Analysis, Process Optimization, Innovation Management', 4)
ON CONFLICT DO NOTHING;

-- Insert default education data (based on current resume.html)
INSERT INTO resume_education (degree, institution, graduation_year, display_order)
VALUES 
    ('Continuous Learning in Design Strategy & Business Innovation', 'Various Institutions & Professional Development Programs', 'Ongoing', 1)
ON CONFLICT DO NOTHING;

-- Insert default achievements data (based on current resume.html)
INSERT INTO resume_achievements (achievement, display_order)
VALUES 
    ('Co-founded multiple successful technology companies with successful exit (PriceSlash acquired by Mark Cuban portfolio company)', 1),
    ('Built and scaled transcontinental design agency serving clients across multiple industries', 2),
    ('8+ years of experience working with major brands including Nike and Apple', 3),
    ('Completed 150+ projects with 50+ happy clients across diverse industries', 4),
    ('Expertise in leading cross-functional teams and driving digital transformation initiatives', 5)
ON CONFLICT DO NOTHING;

-- Create triggers to update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_resume_header_updated_at ON resume_header;
CREATE TRIGGER update_resume_header_updated_at BEFORE UPDATE ON resume_header
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_resume_experience_updated_at ON resume_experience;
CREATE TRIGGER update_resume_experience_updated_at BEFORE UPDATE ON resume_experience
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_resume_skills_updated_at ON resume_skills;
CREATE TRIGGER update_resume_skills_updated_at BEFORE UPDATE ON resume_skills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_resume_education_updated_at ON resume_education;
CREATE TRIGGER update_resume_education_updated_at BEFORE UPDATE ON resume_education
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_resume_achievements_updated_at ON resume_achievements;
CREATE TRIGGER update_resume_achievements_updated_at BEFORE UPDATE ON resume_achievements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE resume_header IS 'Stores basic header information for the resume';
COMMENT ON TABLE resume_experience IS 'Stores professional experience entries';

-- 6. Index Page Content (Homepage-specific content)
CREATE TABLE IF NOT EXISTS index_content (
    id INTEGER PRIMARY KEY DEFAULT 1,
    badge_text TEXT,
    main_heading TEXT,
    subheading TEXT,
    location TEXT,
    timezone TEXT,
    availability_status TEXT,
    profile_summary TEXT,
    projects_completed TEXT,
    happy_clients TEXT,
    years_experience TEXT,
    core_skills TEXT[],
    featured_experience_ids INTEGER[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS for index_content
ALTER TABLE index_content ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for index_content
DROP POLICY IF EXISTS "Allow all operations on index_content" ON index_content;
CREATE POLICY "Allow all operations on index_content" ON index_content
    FOR ALL USING (true) WITH CHECK (true);

-- Insert default index content
INSERT INTO index_content (
    id, badge_text, main_heading, subheading, location, timezone, availability_status,
    profile_summary, projects_completed, happy_clients, years_experience, core_skills,
    featured_experience_ids
) VALUES (
    1,
    'Award-Winning Design Strategist',
    'Sean Sneed, Design Strategist',
    'Crafting exceptional digital experiences through innovative design thinking and strategic brand storytelling. Based in San Francisco, working globally.',
    'San Francisco, CA',
    'PST (GMT-8)',
    'Available for Projects',
    'I''m Sean Sneed, a passionate Creative Director and Product Designer with over 8 years of experience transforming complex ideas into beautiful, functional digital experiences. Based in San Francisco, I work with startups and Fortune 500 companies to create meaningful connections between brands and their audiences through thoughtful design and strategic innovation.',
    '150+',
    '50+',
    '8+',
    ARRAY['Product Strategy', 'UX/UI Design', 'Design Systems', 'Brand Identity', 'Creative Direction', 'Prototyping'],
    ARRAY[1, 2, 3, 4, 5, 6]
) ON CONFLICT (id) DO NOTHING;

-- Create trigger for index_content updated_at
DROP TRIGGER IF EXISTS update_index_content_updated_at ON index_content;
CREATE TRIGGER update_index_content_updated_at BEFORE UPDATE ON index_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comment
COMMENT ON TABLE index_content IS 'Stores homepage-specific content separate from full resume';
COMMENT ON TABLE resume_skills IS 'Stores skill categories and their associated skills';
COMMENT ON TABLE resume_education IS 'Stores education and certification information';
COMMENT ON TABLE resume_achievements IS 'Stores key achievements and accomplishments';

COMMENT ON COLUMN resume_experience.achievements IS 'Array of achievement bullet points';
COMMENT ON COLUMN resume_experience.display_order IS 'Order in which to display experience entries (lower numbers first)';
COMMENT ON COLUMN resume_skills.skill_list IS 'Comma-separated list of skills in this category';
COMMENT ON COLUMN resume_skills.display_order IS 'Order in which to display skill categories (lower numbers first)'; 