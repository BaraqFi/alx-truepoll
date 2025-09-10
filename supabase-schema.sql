-- =====================================================
-- TruePoll Database Schema for Supabase
-- =====================================================
-- This schema provides a comprehensive database structure
-- for a polling application with user authentication,
-- poll creation, voting, and results tracking.

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. POLLS TABLE
-- =====================================================
-- Main table for storing poll information
CREATE TABLE IF NOT EXISTS public.polls (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL CHECK (length(title) >= 3 AND length(title) <= 200),
    description TEXT CHECK (length(description) <= 1000),
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_public BOOLEAN DEFAULT true NOT NULL,
    is_multiple_choice BOOLEAN DEFAULT false NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    total_votes INTEGER DEFAULT 0 NOT NULL CHECK (total_votes >= 0),
    -- Additional metadata
    tags TEXT[] DEFAULT '{}',
    category TEXT CHECK (length(category) <= 50),
    allow_anonymous BOOLEAN DEFAULT false NOT NULL,
    max_votes_per_user INTEGER DEFAULT 1 CHECK (max_votes_per_user > 0),
    -- Constraints
    CONSTRAINT valid_expiry CHECK (expires_at IS NULL OR expires_at > created_at)
);

-- =====================================================
-- 2. POLL_OPTIONS TABLE
-- =====================================================
-- Table for storing poll options/choices
CREATE TABLE IF NOT EXISTS public.poll_options (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
    text TEXT NOT NULL CHECK (length(text) >= 1 AND length(text) <= 200),
    position INTEGER NOT NULL CHECK (position >= 0),
    vote_count INTEGER DEFAULT 0 NOT NULL CHECK (vote_count >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    -- Ensure unique position per poll
    UNIQUE(poll_id, position)
);

-- =====================================================
-- 3. VOTES TABLE
-- =====================================================
-- Table for storing user votes
CREATE TABLE IF NOT EXISTS public.votes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
    option_id UUID NOT NULL REFERENCES public.poll_options(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    -- For anonymous voting
    anonymous_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    -- Ensure one vote per user per poll (unless multiple choice is enabled)
    UNIQUE(poll_id, user_id),
    -- Ensure anonymous_id is provided when user_id is null
    CONSTRAINT valid_voter CHECK (
        (user_id IS NOT NULL AND anonymous_id IS NULL) OR 
        (user_id IS NULL AND anonymous_id IS NOT NULL)
    )
);

-- =====================================================
-- 4. USER_PROFILES TABLE (Optional Enhancement)
-- =====================================================
-- Extended user profile information
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE CHECK (length(username) >= 3 AND length(username) <= 30),
    display_name TEXT CHECK (length(display_name) <= 100),
    bio TEXT CHECK (length(bio) <= 500),
    avatar_url TEXT,
    website TEXT,
    location TEXT CHECK (length(location) <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    -- Statistics
    polls_created INTEGER DEFAULT 0 NOT NULL CHECK (polls_created >= 0),
    votes_cast INTEGER DEFAULT 0 NOT NULL CHECK (votes_cast >= 0),
    -- Preferences
    email_notifications BOOLEAN DEFAULT true NOT NULL,
    public_profile BOOLEAN DEFAULT true NOT NULL
);

-- =====================================================
-- 5. POLL_CATEGORIES TABLE (Optional Enhancement)
-- =====================================================
-- Predefined categories for polls
CREATE TABLE IF NOT EXISTS public.poll_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE CHECK (length(name) >= 2 AND length(name) <= 50),
    description TEXT CHECK (length(description) <= 200),
    color TEXT CHECK (length(color) = 7 AND color ~ '^#[0-9A-Fa-f]{6}$'),
    icon TEXT CHECK (length(icon) <= 50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL
);

-- =====================================================
-- 6. POLL_TAGS TABLE (Optional Enhancement)
-- =====================================================
-- Tags for better poll organization
CREATE TABLE IF NOT EXISTS public.poll_tags (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE CHECK (length(name) >= 2 AND length(name) <= 30),
    usage_count INTEGER DEFAULT 0 NOT NULL CHECK (usage_count >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- =====================================================
-- 7. POLL_ANALYTICS TABLE (Optional Enhancement)
-- =====================================================
-- Analytics and statistics for polls
CREATE TABLE IF NOT EXISTS public.poll_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    views INTEGER DEFAULT 0 NOT NULL CHECK (views >= 0),
    votes INTEGER DEFAULT 0 NOT NULL CHECK (votes >= 0),
    unique_voters INTEGER DEFAULT 0 NOT NULL CHECK (unique_voters >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(poll_id, date)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Polls table indexes
CREATE INDEX IF NOT EXISTS idx_polls_created_by ON public.polls(created_by);
CREATE INDEX IF NOT EXISTS idx_polls_created_at ON public.polls(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_polls_is_public ON public.polls(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_polls_is_active ON public.polls(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_polls_expires_at ON public.polls(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_polls_category ON public.polls(category) WHERE category IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_polls_tags ON public.polls USING GIN(tags);

-- Poll options indexes
CREATE INDEX IF NOT EXISTS idx_poll_options_poll_id ON public.poll_options(poll_id);
CREATE INDEX IF NOT EXISTS idx_poll_options_position ON public.poll_options(poll_id, position);

-- Votes table indexes
CREATE INDEX IF NOT EXISTS idx_votes_poll_id ON public.votes(poll_id);
CREATE INDEX IF NOT EXISTS idx_votes_option_id ON public.votes(option_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON public.votes(user_id);
CREATE INDEX IF NOT EXISTS idx_votes_created_at ON public.votes(created_at DESC);

-- User profiles indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON public.user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_public ON public.user_profiles(public_profile) WHERE public_profile = true;

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_poll_analytics_poll_id ON public.poll_analytics(poll_id);
CREATE INDEX IF NOT EXISTS idx_poll_analytics_date ON public.poll_analytics(date DESC);

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- Poll results view
CREATE OR REPLACE VIEW public.poll_results AS
SELECT 
    po.poll_id,
    po.id as option_id,
    po.text as option_text,
    po.position,
    COUNT(v.id) as votes_count,
    ROUND(
        CASE 
            WHEN p.total_votes > 0 THEN (COUNT(v.id)::DECIMAL / p.total_votes * 100)
            ELSE 0 
        END, 2
    ) as percentage
FROM public.poll_options po
LEFT JOIN public.votes v ON po.id = v.option_id
LEFT JOIN public.polls p ON po.poll_id = p.id
GROUP BY po.poll_id, po.id, po.text, po.position, p.total_votes
ORDER BY po.poll_id, po.position;

-- Active polls view
CREATE OR REPLACE VIEW public.active_polls AS
SELECT 
    p.*,
    up.display_name as creator_name,
    up.username as creator_username,
    COUNT(po.id) as options_count
FROM public.polls p
LEFT JOIN public.user_profiles up ON p.created_by = up.id
LEFT JOIN public.poll_options po ON p.id = po.poll_id
WHERE p.is_active = true 
    AND (p.expires_at IS NULL OR p.expires_at > NOW())
GROUP BY p.id, up.display_name, up.username
ORDER BY p.created_at DESC;

-- User poll statistics view
CREATE OR REPLACE VIEW public.user_poll_stats AS
SELECT 
    up.id as user_id,
    up.username,
    up.display_name,
    COUNT(DISTINCT p.id) as polls_created,
    COUNT(DISTINCT v.id) as votes_cast,
    SUM(p.total_votes) as total_votes_received,
    AVG(p.total_votes) as avg_votes_per_poll
FROM public.user_profiles up
LEFT JOIN public.polls p ON up.id = p.created_by
LEFT JOIN public.votes v ON up.id = v.user_id
GROUP BY up.id, up.username, up.display_name;

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update poll vote counts
CREATE OR REPLACE FUNCTION update_poll_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
    -- Update total votes for the poll
    UPDATE public.polls 
    SET total_votes = (
        SELECT COUNT(*) 
        FROM public.votes 
        WHERE poll_id = COALESCE(NEW.poll_id, OLD.poll_id)
    )
    WHERE id = COALESCE(NEW.poll_id, OLD.poll_id);
    
    -- Update vote count for the option
    UPDATE public.poll_options 
    SET vote_count = (
        SELECT COUNT(*) 
        FROM public.votes 
        WHERE option_id = COALESCE(NEW.option_id, OLD.option_id)
    )
    WHERE id = COALESCE(NEW.option_id, OLD.option_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update vote counts when votes are inserted/updated/deleted
CREATE TRIGGER trigger_update_vote_counts
    AFTER INSERT OR UPDATE OR DELETE ON public.votes
    FOR EACH ROW EXECUTE FUNCTION update_poll_vote_counts();

-- Function to update user profile statistics
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update polls created count
    UPDATE public.user_profiles 
    SET polls_created = (
        SELECT COUNT(*) 
        FROM public.polls 
        WHERE created_by = COALESCE(NEW.created_by, OLD.created_by)
    )
    WHERE id = COALESCE(NEW.created_by, OLD.created_by);
    
    -- Update votes cast count
    UPDATE public.user_profiles 
    SET votes_cast = (
        SELECT COUNT(*) 
        FROM public.votes 
        WHERE user_id = COALESCE(NEW.user_id, OLD.user_id)
    )
    WHERE id = COALESCE(NEW.user_id, OLD.user_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update user stats when polls are created/deleted
CREATE TRIGGER trigger_update_user_poll_stats
    AFTER INSERT OR DELETE ON public.polls
    FOR EACH ROW EXECUTE FUNCTION update_user_stats();

-- Trigger to update user stats when votes are cast
CREATE TRIGGER trigger_update_user_vote_stats
    AFTER INSERT OR DELETE ON public.votes
    FOR EACH ROW EXECUTE FUNCTION update_user_stats();

-- Function to automatically create user profile
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, display_name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile when user signs up
CREATE TRIGGER trigger_create_user_profile
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION create_user_profile();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to update updated_at timestamps
CREATE TRIGGER trigger_polls_updated_at
    BEFORE UPDATE ON public.polls
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_votes_updated_at
    BEFORE UPDATE ON public.votes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_analytics ENABLE ROW LEVEL SECURITY;

-- Polls policies
CREATE POLICY "Public polls are viewable by everyone" ON public.polls
    FOR SELECT USING (is_public = true AND is_active = true);

CREATE POLICY "Users can view their own polls" ON public.polls
    FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Authenticated users can create polls" ON public.polls
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own polls" ON public.polls
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own polls" ON public.polls
    FOR DELETE USING (auth.uid() = created_by);

-- Poll options policies
CREATE POLICY "Poll options are viewable with their polls" ON public.poll_options
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.polls 
            WHERE id = poll_id 
            AND (is_public = true OR auth.uid() = created_by)
        )
    );

CREATE POLICY "Poll creators can manage options" ON public.poll_options
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.polls 
            WHERE id = poll_id 
            AND auth.uid() = created_by
        )
    );

-- Votes policies
CREATE POLICY "Users can view their own votes" ON public.votes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can vote" ON public.votes
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM public.polls 
            WHERE id = poll_id 
            AND is_active = true 
            AND (expires_at IS NULL OR expires_at > NOW())
        )
    );

CREATE POLICY "Users can update their own votes" ON public.votes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes" ON public.votes
    FOR DELETE USING (auth.uid() = user_id);

-- User profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.user_profiles
    FOR SELECT USING (public_profile = true);

CREATE POLICY "Users can view their own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Poll categories policies (read-only for all, admin-only for modifications)
CREATE POLICY "Categories are viewable by everyone" ON public.poll_categories
    FOR SELECT USING (is_active = true);

-- Poll tags policies (read-only for all, admin-only for modifications)
CREATE POLICY "Tags are viewable by everyone" ON public.poll_tags
    FOR SELECT USING (true);

-- Poll analytics policies (poll creators can view their analytics)
CREATE POLICY "Poll creators can view their analytics" ON public.poll_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.polls 
            WHERE id = poll_id 
            AND auth.uid() = created_by
        )
    );

-- =====================================================
-- SAMPLE DATA (Optional)
-- =====================================================

-- Insert sample categories
INSERT INTO public.poll_categories (name, description, color, icon) VALUES
('Technology', 'Polls about technology, programming, and software', '#3B82F6', 'laptop'),
('Entertainment', 'Movies, music, games, and entertainment', '#EF4444', 'tv'),
('Sports', 'Sports, fitness, and athletic activities', '#10B981', 'trophy'),
('Food & Drink', 'Culinary preferences and dining', '#F59E0B', 'utensils'),
('Travel', 'Travel destinations and experiences', '#8B5CF6', 'map-pin'),
('Lifestyle', 'Daily life, habits, and preferences', '#EC4899', 'heart'),
('Business', 'Work, career, and business topics', '#6B7280', 'briefcase'),
('Education', 'Learning, schools, and academic topics', '#059669', 'book-open')
ON CONFLICT (name) DO NOTHING;

-- Insert sample tags
INSERT INTO public.poll_tags (name) VALUES
('programming'), ('javascript'), ('python'), ('react'), ('nodejs'),
('movies'), ('music'), ('games'), ('sports'), ('fitness'),
('food'), ('travel'), ('lifestyle'), ('business'), ('education')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- HELPFUL QUERIES AND FUNCTIONS
-- =====================================================

-- Function to get poll with results
CREATE OR REPLACE FUNCTION get_poll_with_results(poll_uuid UUID)
RETURNS TABLE (
    poll_id UUID,
    title TEXT,
    description TEXT,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_public BOOLEAN,
    is_multiple_choice BOOLEAN,
    total_votes INTEGER,
    options JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.title,
        p.description,
        p.created_by,
        p.created_at,
        p.expires_at,
        p.is_public,
        p.is_multiple_choice,
        p.total_votes,
        COALESCE(
            jsonb_agg(
                jsonb_build_object(
                    'id', po.id,
                    'text', po.text,
                    'position', po.position,
                    'votes_count', po.vote_count,
                    'percentage', ROUND(
                        CASE 
                            WHEN p.total_votes > 0 THEN (po.vote_count::DECIMAL / p.total_votes * 100)
                            ELSE 0 
                        END, 2
                    )
                ) ORDER BY po.position
            ) FILTER (WHERE po.id IS NOT NULL),
            '[]'::jsonb
        ) as options
    FROM public.polls p
    LEFT JOIN public.poll_options po ON p.id = po.poll_id
    WHERE p.id = poll_uuid
    GROUP BY p.id, p.title, p.description, p.created_by, p.created_at, 
             p.expires_at, p.is_public, p.is_multiple_choice, p.total_votes;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can vote on poll
CREATE OR REPLACE FUNCTION can_user_vote(poll_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    poll_record RECORD;
    existing_vote_count INTEGER;
BEGIN
    -- Get poll details
    SELECT * INTO poll_record FROM public.polls WHERE id = poll_uuid;
    
    -- Check if poll exists and is active
    IF NOT FOUND OR NOT poll_record.is_active THEN
        RETURN FALSE;
    END IF;
    
    -- Check if poll has expired
    IF poll_record.expires_at IS NOT NULL AND poll_record.expires_at <= NOW() THEN
        RETURN FALSE;
    END IF;
    
    -- Check if user has already voted (for single choice polls)
    IF NOT poll_record.is_multiple_choice THEN
        SELECT COUNT(*) INTO existing_vote_count
        FROM public.votes
        WHERE poll_id = poll_uuid AND user_id = user_uuid;
        
        IF existing_vote_count > 0 THEN
            RETURN FALSE;
        END IF;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- CLEANUP AND MAINTENANCE FUNCTIONS
-- =====================================================

-- Function to clean up expired polls
CREATE OR REPLACE FUNCTION cleanup_expired_polls()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    UPDATE public.polls 
    SET is_active = false 
    WHERE expires_at IS NOT NULL 
    AND expires_at <= NOW() 
    AND is_active = true;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update tag usage counts
CREATE OR REPLACE FUNCTION update_tag_usage_counts()
RETURNS VOID AS $$
BEGIN
    UPDATE public.poll_tags 
    SET usage_count = (
        SELECT COUNT(*)
        FROM public.polls
        WHERE tags @> ARRAY[poll_tags.name]
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- GRANTS AND PERMISSIONS
-- =====================================================

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Grant read permissions to anon users for public data
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON public.polls TO anon;
GRANT SELECT ON public.poll_options TO anon;
GRANT SELECT ON public.poll_results TO anon;
GRANT SELECT ON public.active_polls TO anon;
GRANT SELECT ON public.poll_categories TO anon;
GRANT SELECT ON public.poll_tags TO anon;
GRANT SELECT ON public.user_profiles TO anon;

-- =====================================================
-- COMMENTS AND DOCUMENTATION
-- =====================================================

COMMENT ON TABLE public.polls IS 'Main table storing poll information and metadata';
COMMENT ON TABLE public.poll_options IS 'Poll choices/options with vote counts';
COMMENT ON TABLE public.votes IS 'User votes on poll options';
COMMENT ON TABLE public.user_profiles IS 'Extended user profile information';
COMMENT ON TABLE public.poll_categories IS 'Predefined categories for poll organization';
COMMENT ON TABLE public.poll_tags IS 'Tags for better poll discovery and organization';
COMMENT ON TABLE public.poll_analytics IS 'Daily analytics and statistics for polls';

COMMENT ON VIEW public.poll_results IS 'Aggregated poll results with vote counts and percentages';
COMMENT ON VIEW public.active_polls IS 'Currently active and non-expired polls';
COMMENT ON VIEW public.user_poll_stats IS 'User statistics for polls created and votes cast';

-- =====================================================
-- END OF SCHEMA
-- =====================================================
