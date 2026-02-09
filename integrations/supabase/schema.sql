-- Supabase Schema for Unit Testing Skill Analytics
-- This schema tracks skill usage, community examples, and feedback

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Skill Usage Tracking
-- Tracks when and how the skill is used
CREATE TABLE IF NOT EXISTS skill_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pattern_name TEXT NOT NULL,
    language TEXT NOT NULL CHECK (language IN ('Python', 'JavaScript', 'TypeScript', 'Other')),
    framework TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    context JSONB,
    session_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for common queries
CREATE INDEX idx_skill_usage_timestamp ON skill_usage(timestamp DESC);
CREATE INDEX idx_skill_usage_pattern ON skill_usage(pattern_name);
CREATE INDEX idx_skill_usage_language ON skill_usage(language);
CREATE INDEX idx_skill_usage_session ON skill_usage(session_id);

-- Community Examples
-- Store and share testing examples from the community
CREATE TABLE IF NOT EXISTS community_examples (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    code TEXT NOT NULL,
    language TEXT NOT NULL CHECK (language IN ('Python', 'JavaScript', 'TypeScript', 'Other')),
    framework TEXT,
    pattern_type TEXT,
    tags TEXT[],
    upvotes INT DEFAULT 0,
    downvotes INT DEFAULT 0,
    views INT DEFAULT 0,
    author_id TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_community_examples_language ON community_examples(language);
CREATE INDEX idx_community_examples_pattern ON community_examples(pattern_type);
CREATE INDEX idx_community_examples_popularity ON community_examples(upvotes DESC, views DESC);
CREATE INDEX idx_community_examples_tags ON community_examples USING GIN(tags);

-- User Feedback
-- Collect feedback on patterns and the skill
CREATE TABLE IF NOT EXISTS feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    pattern_name TEXT,
    helpful_count INT DEFAULT 0,
    category TEXT CHECK (category IN ('pattern', 'documentation', 'example', 'general')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_feedback_pattern ON feedback(pattern_name);
CREATE INDEX idx_feedback_rating ON feedback(rating);
CREATE INDEX idx_feedback_created ON feedback(created_at DESC);

-- Pattern Statistics
-- Aggregated statistics for patterns
CREATE TABLE IF NOT EXISTS pattern_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pattern_name TEXT NOT NULL UNIQUE,
    total_uses INT DEFAULT 0,
    unique_users INT DEFAULT 0,
    avg_rating DECIMAL(3,2),
    last_used TIMESTAMPTZ,
    trending_score DECIMAL(10,2),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_pattern_stats_trending ON pattern_stats(trending_score DESC);
CREATE INDEX idx_pattern_stats_uses ON pattern_stats(total_uses DESC);

-- Example Votes
-- Track votes on community examples
CREATE TABLE IF NOT EXISTS example_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    example_id UUID NOT NULL REFERENCES community_examples(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    vote_type TEXT CHECK (vote_type IN ('up', 'down')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(example_id, user_id)
);

-- Add indexes
CREATE INDEX idx_example_votes_example ON example_votes(example_id);

-- Functions

-- Function to update example vote counts
CREATE OR REPLACE FUNCTION update_example_votes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.vote_type = 'up' THEN
            UPDATE community_examples SET upvotes = upvotes + 1 WHERE id = NEW.example_id;
        ELSE
            UPDATE community_examples SET downvotes = downvotes + 1 WHERE id = NEW.example_id;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.vote_type = 'up' THEN
            UPDATE community_examples SET upvotes = upvotes - 1 WHERE id = OLD.example_id;
        ELSE
            UPDATE community_examples SET downvotes = downvotes - 1 WHERE id = OLD.example_id;
        END IF;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.vote_type = 'up' AND NEW.vote_type = 'down' THEN
            UPDATE community_examples SET upvotes = upvotes - 1, downvotes = downvotes + 1 WHERE id = NEW.example_id;
        ELSIF OLD.vote_type = 'down' AND NEW.vote_type = 'up' THEN
            UPDATE community_examples SET upvotes = upvotes + 1, downvotes = downvotes - 1 WHERE id = NEW.example_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for vote updates
CREATE TRIGGER trigger_update_example_votes
    AFTER INSERT OR UPDATE OR DELETE ON example_votes
    FOR EACH ROW
    EXECUTE FUNCTION update_example_votes();

-- Function to update pattern statistics
CREATE OR REPLACE FUNCTION update_pattern_stats()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO pattern_stats (pattern_name, total_uses, last_used)
    VALUES (NEW.pattern_name, 1, NEW.timestamp)
    ON CONFLICT (pattern_name)
    DO UPDATE SET
        total_uses = pattern_stats.total_uses + 1,
        last_used = NEW.timestamp,
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for pattern stats updates
CREATE TRIGGER trigger_update_pattern_stats
    AFTER INSERT ON skill_usage
    FOR EACH ROW
    EXECUTE FUNCTION update_pattern_stats();

-- Views

-- Popular patterns view
CREATE OR REPLACE VIEW popular_patterns AS
SELECT
    pattern_name,
    language,
    COUNT(*) as usage_count,
    COUNT(DISTINCT session_id) as unique_users,
    MAX(timestamp) as last_used
FROM skill_usage
WHERE timestamp > NOW() - INTERVAL '30 days'
GROUP BY pattern_name, language
ORDER BY usage_count DESC;

-- Top rated examples view
CREATE OR REPLACE VIEW top_examples AS
SELECT
    ce.id,
    ce.title,
    ce.description,
    ce.language,
    ce.framework,
    ce.upvotes - ce.downvotes as score,
    ce.views,
    ce.created_at
FROM community_examples ce
WHERE ce.upvotes - ce.downvotes > 0
ORDER BY score DESC, ce.views DESC;

-- Recent feedback view
CREATE OR REPLACE VIEW recent_feedback AS
SELECT
    pattern_name,
    AVG(rating) as avg_rating,
    COUNT(*) as total_feedback,
    MAX(created_at) as last_feedback
FROM feedback
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY pattern_name;

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE skill_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_examples ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE example_votes ENABLE ROW LEVEL SECURITY;

-- Public read access for statistics
CREATE POLICY "Public read access for usage stats"
    ON skill_usage FOR SELECT
    USING (true);

CREATE POLICY "Public read access for examples"
    ON community_examples FOR SELECT
    USING (true);

CREATE POLICY "Public read access for feedback"
    ON feedback FOR SELECT
    USING (true);

-- Authenticated users can insert
CREATE POLICY "Authenticated users can track usage"
    ON skill_usage FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can submit examples"
    ON community_examples FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can give feedback"
    ON feedback FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can vote"
    ON example_votes FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Sample data for testing
INSERT INTO skill_usage (pattern_name, language, framework, context) VALUES
    ('AAA Pattern', 'Python', 'pytest', '{"topic": "basic_structure"}'),
    ('Mocking API', 'Python', 'pytest', '{"topic": "mocking"}'),
    ('Parametrized Tests', 'JavaScript', 'Vitest', '{"topic": "parametrized"}'),
    ('TDD Workflow', 'Python', 'pytest', '{"topic": "tdd"}');

INSERT INTO community_examples (title, description, code, language, framework, pattern_type, tags) VALUES
    ('Basic pytest fixture', 'Simple fixture example', '@pytest.fixture\ndef user():\n    return {"name": "Test"}', 'Python', 'pytest', 'fixtures', ARRAY['pytest', 'fixtures', 'basic']),
    ('Vitest mock example', 'Mocking with Vitest', 'vi.fn().mockReturnValue("test")', 'JavaScript', 'Vitest', 'mocking', ARRAY['vitest', 'mocking']);

INSERT INTO feedback (rating, comment, pattern_name, category) VALUES
    (5, 'Very helpful pattern!', 'AAA Pattern', 'pattern'),
    (4, 'Good explanation', 'Mocking API', 'documentation');

-- Comments
COMMENT ON TABLE skill_usage IS 'Tracks usage of testing patterns by users';
COMMENT ON TABLE community_examples IS 'Community-contributed testing examples';
COMMENT ON TABLE feedback IS 'User feedback on patterns and skill';
COMMENT ON TABLE pattern_stats IS 'Aggregated statistics for testing patterns';
COMMENT ON TABLE example_votes IS 'User votes on community examples';
