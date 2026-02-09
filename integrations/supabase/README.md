# Supabase Integration

This directory contains the Supabase integration for tracking skill usage and community contributions.

## Overview

The Supabase integration provides:

- **Usage Analytics**: Track which testing patterns are used
- **Community Examples**: Share and discover testing examples
- **Feedback System**: Collect user feedback on patterns
- **Statistics**: Analyze trends and popular patterns

## Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### 2. Run Schema Migration

```bash
# Copy the schema.sql content
cat schema.sql

# In Supabase Dashboard:
# 1. Go to SQL Editor
# 2. Create new query
# 3. Paste schema.sql content
# 4. Run the query
```

### 3. Configure Environment

```bash
# Create .env file
cat > .env << EOF
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
EOF
```

### 4. Test Connection

```bash
# Test with curl
curl "${SUPABASE_URL}/rest/v1/skill_usage?select=*&limit=5" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}"
```

## Database Schema

### Tables

#### `skill_usage`
Tracks when and how patterns are used.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| pattern_name | TEXT | Name of the pattern used |
| language | TEXT | Programming language |
| framework | TEXT | Testing framework |
| timestamp | TIMESTAMPTZ | When pattern was used |
| context | JSONB | Additional context |
| session_id | TEXT | User session identifier |

#### `community_examples`
Stores community-contributed examples.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | TEXT | Example title |
| description | TEXT | Example description |
| code | TEXT | Example code |
| language | TEXT | Programming language |
| framework | TEXT | Testing framework |
| pattern_type | TEXT | Type of pattern |
| tags | TEXT[] | Searchable tags |
| upvotes | INT | Number of upvotes |
| downvotes | INT | Number of downvotes |
| views | INT | View count |

#### `feedback`
User feedback on patterns and skill.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| rating | INT | Rating 1-5 |
| comment | TEXT | Feedback comment |
| pattern_name | TEXT | Pattern being reviewed |
| category | TEXT | Feedback category |

#### `pattern_stats`
Aggregated statistics for patterns.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| pattern_name | TEXT | Pattern name |
| total_uses | INT | Total usage count |
| unique_users | INT | Unique user count |
| avg_rating | DECIMAL | Average rating |
| last_used | TIMESTAMPTZ | Last usage timestamp |

## Usage Examples

### Track Pattern Usage

```sql
-- Insert usage tracking
INSERT INTO skill_usage (pattern_name, language, framework, context)
VALUES ('AAA Pattern', 'Python', 'pytest', '{"topic": "structure"}');
```

### Submit Community Example

```sql
-- Add new example
INSERT INTO community_examples (
  title,
  description,
  code,
  language,
  framework,
  pattern_type,
  tags
) VALUES (
  'Advanced pytest fixture',
  'Fixture with setup and teardown',
  '@pytest.fixture\ndef db():\n    conn = connect()\n    yield conn\n    conn.close()',
  'Python',
  'pytest',
  'fixtures',
  ARRAY['pytest', 'fixtures', 'advanced', 'database']
);
```

### Query Popular Patterns

```sql
-- Get most used patterns this month
SELECT pattern_name, language, COUNT(*) as uses
FROM skill_usage
WHERE timestamp > NOW() - INTERVAL '30 days'
GROUP BY pattern_name, language
ORDER BY uses DESC
LIMIT 10;
```

### Get Top Examples

```sql
-- Get highest rated examples
SELECT title, language, upvotes - downvotes as score
FROM community_examples
WHERE upvotes - downvotes > 5
ORDER BY score DESC
LIMIT 10;
```

### View Analytics

```sql
-- Pattern usage by language
SELECT
  language,
  COUNT(*) as total_uses,
  COUNT(DISTINCT pattern_name) as unique_patterns
FROM skill_usage
GROUP BY language
ORDER BY total_uses DESC;

-- Trending patterns (last 7 days)
SELECT
  pattern_name,
  COUNT(*) as recent_uses,
  COUNT(DISTINCT session_id) as unique_users
FROM skill_usage
WHERE timestamp > NOW() - INTERVAL '7 days'
GROUP BY pattern_name
ORDER BY recent_uses DESC;

-- Average ratings by pattern
SELECT
  pattern_name,
  AVG(rating) as avg_rating,
  COUNT(*) as total_ratings
FROM feedback
GROUP BY pattern_name
HAVING COUNT(*) >= 3
ORDER BY avg_rating DESC;
```

## API Integration

### Using Supabase Client

```python
# Python example
from supabase import create_client

client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

# Track usage
client.table('skill_usage').insert({
    'pattern_name': 'Mocking',
    'language': 'Python',
    'framework': 'pytest'
}).execute()

# Get popular patterns
response = client.table('skill_usage') \
    .select('pattern_name, count') \
    .gte('timestamp', '2026-01-01') \
    .order('count', desc=True) \
    .limit(10) \
    .execute()
```

```javascript
// JavaScript example
import { createClient } from '@supabase/supabase-js'

const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Track usage
await client.from('skill_usage').insert({
  pattern_name: 'Mocking',
  language: 'JavaScript',
  framework: 'Vitest'
})

// Get popular patterns
const { data } = await client
  .from('skill_usage')
  .select('pattern_name, count')
  .gte('timestamp', '2026-01-01')
  .order('count', { ascending: false })
  .limit(10)
```

## Dashboard Queries

### Usage Dashboard

```sql
-- Daily usage
SELECT
  DATE(timestamp) as date,
  COUNT(*) as uses
FROM skill_usage
WHERE timestamp > NOW() - INTERVAL '30 days'
GROUP BY DATE(timestamp)
ORDER BY date;

-- Language distribution
SELECT
  language,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM skill_usage
GROUP BY language
ORDER BY count DESC;

-- Framework usage
SELECT
  framework,
  language,
  COUNT(*) as uses
FROM skill_usage
WHERE framework IS NOT NULL
GROUP BY framework, language
ORDER BY uses DESC;
```

### Community Dashboard

```sql
-- Most upvoted examples
SELECT
  title,
  language,
  upvotes,
  views,
  created_at
FROM community_examples
ORDER BY upvotes DESC, views DESC
LIMIT 20;

-- Recent contributions
SELECT
  title,
  language,
  framework,
  created_at
FROM community_examples
ORDER BY created_at DESC
LIMIT 10;

-- Top contributors (if you track authors)
SELECT
  author_id,
  COUNT(*) as contributions,
  SUM(upvotes) as total_upvotes
FROM community_examples
WHERE author_id IS NOT NULL
GROUP BY author_id
ORDER BY contributions DESC;
```

## Security

### Row Level Security (RLS)

RLS is enabled on all tables:

- **Public read**: Anyone can view statistics
- **Authenticated write**: Only authenticated users can submit data
- **Vote protection**: Users can only vote once per example

### Privacy

What we track:
- ✅ Pattern usage (anonymous)
- ✅ Language/framework preferences
- ✅ General statistics

What we DON'T track:
- ❌ Personal code
- ❌ User identifiers (unless explicitly provided)
- ❌ Sensitive data

## Maintenance

### Cleanup Old Data

```sql
-- Delete old usage data (keep 90 days)
DELETE FROM skill_usage
WHERE timestamp < NOW() - INTERVAL '90 days';

-- Archive old examples (keep active ones)
DELETE FROM community_examples
WHERE created_at < NOW() - INTERVAL '1 year'
  AND views < 10
  AND upvotes - downvotes < 1;
```

### Update Statistics

```sql
-- Refresh pattern statistics
REFRESH MATERIALIZED VIEW IF EXISTS pattern_stats_mv;

-- Recalculate trending scores
UPDATE pattern_stats
SET trending_score = (
  SELECT COUNT(*)
  FROM skill_usage
  WHERE skill_usage.pattern_name = pattern_stats.pattern_name
    AND timestamp > NOW() - INTERVAL '7 days'
) * 10 + total_uses / 100;
```

## Troubleshooting

### Connection Issues

```bash
# Test connection
curl "${SUPABASE_URL}/rest/v1/" \
  -H "apikey: ${SUPABASE_ANON_KEY}"

# Should return: {"message":"Welcome to PostgREST"}
```

### Permission Errors

```sql
-- Check RLS policies
SELECT * FROM pg_policies
WHERE schemaname = 'public';

-- Grant permissions if needed
GRANT USAGE ON SCHEMA public TO anon, authenticated;
```

### Query Performance

```sql
-- Check missing indexes
SELECT schemaname, tablename, indexname
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Add index if needed
CREATE INDEX IF NOT EXISTS idx_name ON table_name(column_name);
```

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgREST API](https://postgrest.org/en/stable/)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [SQL Queries](https://supabase.com/docs/guides/database/overview)
