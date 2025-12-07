-- USERS (passagers + staff)
create table if not exists public.users (
  id bigserial primary key,
  full_name text not null,
  email text not null unique,
  password_hash text not null,
  role text not null default 'PASSENGER', -- 'PASSENGER' ou 'STAFF'
  created_at timestamp with time zone default now()
);

-- FLIGHTS
create table if not exists public.flights (
  id bigserial primary key,
  flight_number text not null,
  airline text not null,
  origin text not null,
  origin_code text not null,
  destination text not null,
  destination_code text not null,
  departure_time timestamp with time zone not null,
  arrival_time timestamp with time zone not null,
  duration text not null,
  stops integer not null default 0,
  base_price numeric(10,2) not null,
  aircraft text,
  baggage text,
  refundable boolean default false,
  seat_selection text,
  status text not null default 'SCHEDULED', -- 'SCHEDULED', 'CANCELLED', 'COMPLETED'
  created_at timestamp with time zone default now()
);

-- BOOKINGS
create table if not exists public.bookings (
  id bigserial primary key,
  user_id bigint not null references public.users(id) on delete cascade,
  flight_id bigint not null references public.flights(id) on delete cascade,
  seat_number text not null,
  status text not null default 'PENDING_PAYMENT', -- 'PENDING_PAYMENT', 'CONFIRMED', 'CANCELLED'
  total_price numeric(10,2) not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- PAYMENTS
create table if not exists public.payments (
  id bigserial primary key,
  booking_id bigint not null references public.bookings(id) on delete cascade,
  amount numeric(10,2) not null,
  currency text not null default 'CNY',
  status text not null default 'PENDING', -- 'PENDING','COMPLETED','FAILED','REFUNDED'
  payment_method text not null,          -- ex: 'CARD'
  transaction_reference text,
  created_at timestamp with time zone default now()
);
