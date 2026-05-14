-- ============================================================
-- Whazzonline Database Schema — run in Supabase SQL editor
-- ============================================================

create table if not exists public.products (
  id          uuid default gen_random_uuid() primary key,
  name        text not null,
  description text,
  price       numeric(12, 2) not null check (price >= 0),
  image_url   text,
  category    text not null default 'general',
  stock       integer not null default 0 check (stock >= 0),
  vendor_id   uuid references auth.users(id) on delete set null,
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null
);

create table if not exists public.cart_items (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references auth.users(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  quantity   integer not null default 1 check (quantity > 0),
  created_at timestamptz default now() not null,
  unique (user_id, product_id)
);

create table if not exists public.orders (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references auth.users(id) on delete set null,
  total_amount numeric(12, 2) not null,
  status       text not null default 'pending'
                 check (status in ('pending','confirmed','shipped','delivered','cancelled')),
  created_at   timestamptz default now() not null
);

create table if not exists public.order_items (
  id         uuid default gen_random_uuid() primary key,
  order_id   uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete set null,
  quantity   integer not null,
  unit_price numeric(12, 2) not null
);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger products_updated_at
  before update on public.products
  for each row execute function public.handle_updated_at();

-- RLS
alter table public.products    enable row level security;
alter table public.cart_items  enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;

create policy "Public read on products"   on public.products for select using (true);
create policy "Vendors insert own"        on public.products for insert with check (auth.uid() = vendor_id);
create policy "Vendors update own"        on public.products for update using (auth.uid() = vendor_id);
create policy "Users manage own cart"     on public.cart_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users view own orders"     on public.orders for select using (auth.uid() = user_id);
create policy "Users insert own orders"   on public.orders for insert with check (auth.uid() = user_id);
create policy "Users view own order items" on public.order_items for select
  using (order_id in (select id from public.orders where user_id = auth.uid()));

-- Indexes
create index if not exists products_category_idx   on public.products (category);
create index if not exists products_created_at_idx on public.products (created_at desc);
create index if not exists cart_items_user_id_idx  on public.cart_items (user_id);
create index if not exists orders_user_id_idx      on public.orders (user_id);
