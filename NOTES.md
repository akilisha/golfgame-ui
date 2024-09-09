## Automate profile creation upon sign up

```sql
create table if not exists public.mg_profile (
  id uuid not null references auth.users on delete cascade,
  first_name text,
  last_name text,
  email_address text unique not null,
  phone_number text,
  primary key (id)
);


ALTER TABLE public.mg_profile ENABLE ROW LEVEL SECURITY;



CREATE POLICY "Can only view own profile data."
  ON public.mg_profile
  FOR SELECT
  USING ( auth.uid() = id );



CREATE POLICY "Can only update own profile data."
  ON public.mg_profile
  FOR UPDATE
  USING ( auth.uid() = id );



CREATE 
OR REPLACE FUNCTION public.create_profile() RETURNS TRIGGER AS $$ BEGIN INSERT INTO public.mg_profile (id, first_name, last_name, email_address) 
VALUES 
  (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name', 
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.raw_user_meta_data ->> 'email'
  );
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;



CREATE OR REPLACE TRIGGER create_profile_trigger 
AFTER 
  INSERT ON auth.users FOR EACH ROW WHEN (
    NEW.raw_user_meta_data IS NOT NULL
  ) EXECUTE FUNCTION public.create_profile();



CREATE OR REPLACE TRIGGER create_profile_trigger 
AFTER 
  INSERT ON auth.users FOR EACH ROW WHEN (
    NEW.raw_user_meta_data IS NOT NULL
  ) EXECUTE FUNCTION public.create_profile();


-- SELECT gen_random_uuid();

create table if not exists public.mg_location(
  id uuid not null default gen_random_uuid(),
  name text not null,
  street text not null,
  city text not null,
  state_zip text not null,
  country text not null,
  latitude float not null,
  longitude float not null,
  date_created timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint uniq_place unique(name, city, state_zip),
  constraint location_pk primary key(id)
);


ALTER TABLE public.mg_location ENABLE ROW LEVEL SECURITY;


-- Create Policy around mg_location
create policy "Anyone can view entries in mg_location table."
on mg_location for select
to anon;


create policy "Anyone can insert records in mg_location table."
on mg_location for insert
to anon;


create policy "Anyone can update records in mg_location table."
on mg_location for update
to anon;


create table if not exists public.mg_player (
  organizer uuid references auth.users (id) not null,
  player text not null,
  hole int not null default 1,
  score int not null default 0,
  location uuid references public.mg_location (id),
  last_updated timestamp with time zone default timezone('utc'::text, now()) not null
);


ALTER TABLE public.mg_player ADD primary key (organizer, player, hole);


ALTER TABLE public.mg_player ENABLE ROW LEVEL SECURITY;


-- Create Policy around mp_players
create policy "Organizer can view their own entries in mg_player table."
on mg_player for select
to authenticated
using ( (select auth.uid()) = organizer );


create policy "Organizer can insert records in mg_player table."
on mg_player for insert
to authenticated
with check ( auth.uid() = organizer );


create policy "Organizer can update records in mg_player table."
on mg_player for update
to authenticated
using ( auth.uid() = organizer );       -- checks if the existing row complies with the policy expression
-- with check ( auth.uid() = organizer ); -- checks if the new row complies with the policy expression


create policy "Organizer can delete records in mg_player table."
on mg_player for delete
to authenticated
using ( auth.uid() = organizer );       -- checks if the existing row complies with the policy expression

-- insert into mg_player (organizer, player, hole, score) 
-- values (?, ?, ?, ?)
-- on conflict (organizer, player, hole) do update set score = EXCLUDED.score;


-- select users from auth table

CREATE or replace function select_account(organizer text) returns setof auth.users AS $$
begin
  return query select * from auth.users where id = organizer::uuid;
end;
$$ language plpgsql; 

select * from select_account('some_valid_user_id') limit 1;


-- delete a user from auth table

DROP FUNCTION delete_account(text);

CREATE or replace function delete_account(organizer_input text) returns void AS $$
begin
delete from mg_player where organizer = organizer_input::uuid;
delete from auth.users where id = organizer_input::uuid;
end;
$$ language plpgsql SECURITY DEFINER; 

CREATE POLICY "Only authenticated account owner can delete their account."
  ON auth.users
  FOR DELETE
  TO authenticated
  USING ( auth.uid() = id );

select delete_account('some_valid_user_id');
```

## Create supabase function

```bash
npx supabase functions new fetch-stripe-payment-intent

npx supabase functions new fetch-stripe-setup-intent

npx supabase functions new create-stripe-new-customer

npx supabase functions new fetch-stripe-payment-method

npx supabase functions new fetch-stripe-payment-offline
```

## Deploy supabase function

```bash
npx supabase functions deploy fetch-stripe-payment-intent --project-ref kyjzzmdnpfvxgjfogfqu

npx supabase functions deploy fetch-stripe-setup-intent --project-ref kyjzzmdnpfvxgjfogfqu

npx supabase functions deploy create-stripe-new-customer --project-ref kyjzzmdnpfvxgjfogfqu

npx supabase functions deploy fetch-stripe-payment-method --project-ref kyjzzmdnpfvxgjfogfqu

npx supabase functions deploy fetch-stripe-payment-offline --project-ref kyjzzmdnpfvxgjfogfqu
```

## Execute Stripe function in supabase

```bash
curl -L -X POST "https://kyjzzmdnpfvxgjfogfqu.supabase.co/functions/v1/fetch-stripe-payment-intent" \
-H "Authorization: Bearer ANON_KEY" \
-H "Content-Type: application/json" \
--data '{"amount": 500}'

curl -L -X POST 'https://kyjzzmdnpfvxgjfogfqu.supabase.co/functions/v1/fetch-stripe-setup-intent' \
-H 'Authorization: Bearer ANON_KEY' \
-H "Content-Type: application/json" \
--data '{"customerId": "<id>"}'

curl -L -X POST 'https://kyjzzmdnpfvxgjfogfqu.supabase.co/functions/v1/create-stripe-new-customer' \
-H 'Authorization: Bearer ANON_KEY' \
-H "Content-Type: application/json" \
--data '{"name": "<name>", "email": "<email>"}'
```

## Handling secrets

```bash
# load secrets

npx supabase secrets set --env-file ./supabase/functions/.env

# view secrets

npx supabase secrets list
```

