Automate profile creation upon sign up


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
create policy "Organizer can insert records in mg_player table."
on mg_player for insert
to authenticated
with check ( auth.uid() = organizer );


create policy "Organizer can view their own entries in mg_player table."
on mg_player for select
to authenticated
using ( (select auth.uid()) = organizer );


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