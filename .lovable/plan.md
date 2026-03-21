

# Plan: Products Logic, Content DB, Chats, Forum, Smart Search

## Overview

This is a large feature set spanning 6 areas. The database is currently empty (no tables). We need to create the DB schema first, then update the frontend. The `country-state-city` library is already installed but may not be properly integrated.

---

## 1. Bug Fix: Country/City Cascading Lists

**Problem:** Profile page imports `country-state-city` but the library may not be used correctly.

**Fix:** Verify and ensure `Country.getAllCountries()` and `City.getCitiesOfCountry(isoCode)` are used properly in `MamaProfilePage.tsx`. The library is already in `package.json`.

---

## 2. Products with Expiry Logic (MamaCoursesPage + MamaHomePage)

**Changes to `PRODUCTS` and `ACTIVE_PRODUCTS` mock data:**
- Add `expiresAt: string` (ISO datetime) to all products (subscriptions AND courses)
- Add `materialsTotal` / `materialsCompleted` to subscriptions

**New logic:**
- Compare `new Date(expiresAt)` with `Date.now()` to determine active/inactive status
- Inactive cards: apply `opacity-50 grayscale` CSS classes
- Show exact expiry datetime (e.g., "24.04.2026, 23:59")
- Add progress bar `materialsCompleted/materialsTotal` to subscription cards (same style as courses)

**Files:** `MamaCoursesPage.tsx`, `MamaHomePage.tsx`

---

## 3. Database Schema (Migration)

Create tables for content, tags, chats, forum, and content gap alerts:

```text
┌─────────────────┐     ┌──────────────────┐
│  content_tags   │     │ content_items    │
│  id, type,      │     │ id, title, desc, │
│  label, parent  │◄────│ type, difficulty │
│                 │     │ duration, etc.   │
└─────────────────┘     └──────────────────┘
        │                       │
        └───── content_item_tags ─────┘

┌──────────────────┐    ┌──────────────────┐
│  expert_chats    │    │  forum_threads   │
│  id, club_id,    │    │  id, club_id,    │
│  name, category  │    │  title, author,  │
│                  │    │  tag, replies     │
└──────────────────┘    └──────────────────┘

┌──────────────────────┐
│  content_gap_alerts  │
│  id, topics, avail,  │
│  requested, created  │
└──────────────────────┘
```

**Tables to create:**
1. `content_tags` — id, type (enum: age/topic/subtopic), label, parent_id (self-ref)
2. `content_items` — id, title, description, type (enum), difficulty (enum), duration, file_size, thumbnail_url, club_only, product_id, created_at
3. `content_item_tags` — content_item_id FK, tag_id FK (junction)
4. `expert_chat_rooms` — id, club_product_id, name, category, created_at (admin-manageable)
5. `chat_messages` — id, room_id FK, user_id, text, created_at
6. `forum_threads` — id, club_product_id, title, author_user_id, tag, created_at
7. `forum_replies` — id, thread_id FK, user_id, text, created_at
8. `content_gap_alerts` — id, user_id, requested_topics (jsonb), available_count, requested_count, created_at

After creating tables, seed them with existing mock data from `contentData.ts` and `MamaCourseDetailPage.tsx`.

**RLS:** Read access for authenticated users on content/chat/forum tables. Insert for chat_messages, forum_threads, forum_replies. Content_gap_alerts: insert for authenticated, select for admins only.

Enable realtime on `chat_messages` and `forum_replies`.

---

## 4. Club Page Overhaul (MamaCourseDetailPage.tsx)

**News cards:** Make clickable with a Dialog popup showing full text + image placeholder.

**Team block:** Remove individual expert cards from "About" tab. Add a generic "Our Team" section with role-based avatars (no real names).

**Expert Chats → "Chats with Experts":**
- Rename tab from "Чат с экспертом" to "Чаты с экспертами"
- Replace individual expert selection with 3 category-based chat rooms: "Педиатрия", "Психология 0-18 лет", "Психология 18+"
- Data-driven from `expert_chat_rooms` table (initially mock, ready for DB)

**Forum enhancements:**
- "Create new thread" button opens a Dialog form (title + tag selection)
- Sorting toggle: "Популярные" (by replies) / "Последняя активность" (by lastActivity)
- Search bar at top of forum (filters threads by keyword in title)

---

## 5. Smart Questionnaire Refinement (MamaHomePage)

Already implemented. Minor improvements:
- Content gap alert: actually insert into `content_gap_alerts` table (or log to console until DB is seeded)
- Ensure questionnaire only appears for products with `isClub: true`

---

## 6. Global Search in Forum + Chats

Add a search input component that appears:
- At top of Forum thread list (filters by title/tag)
- Inside chat rooms (filters messages by text)
- Reusable `<SearchBar>` component with debounce

---

## File Changes Summary

| File | Action |
|---|---|
| DB Migration | Create 8 tables + enums + RLS + realtime |
| `MamaCoursesPage.tsx` | Add expiry logic, progress for subscriptions, inactive styling |
| `MamaHomePage.tsx` | Same product updates, minor questionnaire fixes |
| `MamaCourseDetailPage.tsx` | Major: news popups, team block, chat rooms, forum search/sort/create |
| `MamaProfilePage.tsx` | Verify country-state-city integration |
| `src/lib/contentData.ts` | Keep as fallback data source |

## Technical Notes

- `country-state-city` v3.2.1 is already installed. Will use `Country.getAllCountries()`, `City.getCitiesOfCountry(countryCode)`.
- All new DB tables use UUIDs with `gen_random_uuid()`.
- Chat rooms are admin-managed (no code changes needed to add new rooms — just insert into table).
- Forum sorting is client-side on mock data, will be query-level with real DB.

