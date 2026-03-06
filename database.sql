-- ============================================
-- PHYSIQUE APP — Paste this in Supabase
-- SQL Editor → New Query → Paste → Run
-- ============================================

create table if not exists profiles (
  id uuid references auth.users primary key,
  name text,
  height numeric,
  age int,
  gender text,
  current_weight numeric,
  goal_weight numeric,
  goal_look text,
  duration_months int,
  activity_level text,
  created_at timestamptz default now()
);

create table if not exists weight_log (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  weight numeric not null,
  logged_at timestamptz default now()
);

create table if not exists food_log (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  name text,
  qty numeric,
  unit text,
  cal int,
  protein numeric,
  carbs numeric,
  fats numeric,
  logged_at timestamptz default now()
);

create table if not exists prs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  lift text,
  weight numeric,
  reps int,
  logged_at timestamptz default now()
);

create table if not exists measurements (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  data jsonb,
  logged_at timestamptz default now()
);

-- Row Level Security
alter table profiles enable row level security;
alter table weight_log enable row level security;
alter table food_log enable row level security;
alter table prs enable row level security;
alter table measurements enable row level security;

create policy "own profile" on profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "own weight" on weight_log for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own food" on food_log for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own prs" on prs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own measurements" on measurements for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
