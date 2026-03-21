
-- Enums
CREATE TYPE public.tag_type AS ENUM ('age', 'topic', 'subtopic');
CREATE TYPE public.content_type AS ENUM ('video', 'audio', 'pdf', 'guide', 'checklist');
CREATE TYPE public.difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');

-- Content Tags (age, topic, subtopic with parent)
CREATE TABLE public.content_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type tag_type NOT NULL,
  label TEXT NOT NULL,
  parent_id UUID REFERENCES public.content_tags(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Content Items
CREATE TABLE public.content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  type content_type NOT NULL,
  difficulty difficulty_level NOT NULL DEFAULT 'beginner',
  duration TEXT,
  file_size TEXT,
  thumbnail_url TEXT,
  club_only BOOLEAN NOT NULL DEFAULT true,
  product_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Junction: content_items <-> content_tags
CREATE TABLE public.content_item_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_item_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.content_tags(id) ON DELETE CASCADE,
  UNIQUE(content_item_id, tag_id)
);

-- Expert Chat Rooms (admin-managed)
CREATE TABLE public.expert_chat_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_product_id TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Chat Messages
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.expert_chat_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Forum Threads
CREATE TABLE public.forum_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_product_id TEXT NOT NULL,
  title TEXT NOT NULL,
  author_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tag TEXT NOT NULL DEFAULT 'Общее',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Forum Replies
CREATE TABLE public.forum_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES public.forum_threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Content Gap Alerts
CREATE TABLE public.content_gap_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  requested_topics JSONB NOT NULL DEFAULT '{}',
  available_count INT NOT NULL DEFAULT 0,
  requested_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.content_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_item_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expert_chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_gap_alerts ENABLE ROW LEVEL SECURITY;

-- Read-only for authenticated on content tables
CREATE POLICY "Anyone can read content_tags" ON public.content_tags FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can read content_items" ON public.content_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can read content_item_tags" ON public.content_item_tags FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can read expert_chat_rooms" ON public.expert_chat_rooms FOR SELECT TO authenticated USING (true);

-- Chat messages: read all in room, insert own
CREATE POLICY "Read chat messages" ON public.chat_messages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert own chat messages" ON public.chat_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Forum threads: read all, insert own
CREATE POLICY "Read forum threads" ON public.forum_threads FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert own forum threads" ON public.forum_threads FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_user_id);

-- Forum replies: read all, insert own
CREATE POLICY "Read forum replies" ON public.forum_replies FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert own forum replies" ON public.forum_replies FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Content gap alerts: insert for authenticated, read only own
CREATE POLICY "Insert content gap alerts" ON public.content_gap_alerts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Read own content gap alerts" ON public.content_gap_alerts FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Enable realtime for chat and forum
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.forum_replies;
