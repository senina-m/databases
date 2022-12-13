create table s312986.Permissions (
  id SMALLINT PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE
);

create table s312986.Location (
  id SMALLINT PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE
);

create table s312986.Customer (
  id BIGINT PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE,
  password VARCHAR NOT NULL,
  permissions_id SMALLINT NOT NULL REFERENCES Permissions(id)
);

create table s312986.Position (
  id SMALLINT PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE
);

create table s312986.Detective (
  id BIGINT PRIMARY KEY,
  creature_id INTEGER NOT NULL UNIQUE,
  position_id SMALLINT NOT NULL REFERENCES Position(id)
);

create table s312986.Crime (
  id BIGINT PRIMARY KEY,
  title VARCHAR NOT NULL UNIQUE,
  description VARCHAR NOT NULL,
  date_begin DATE NOT NULL,
  date_end DATE NOT NULL,
  main_detective_id BIGINT NOT NULL REFERENCES Detective(id),
  is_solved BOOLEAN NOT NULL,
  damage_description VARCHAR ,
  location_id SMALLINT NOT NULL REFERENCES Location(id)
);

create table s312986.Creature (
  id BIGINT PRIMARY KEY,
  name VARCHAR NOT NULL,
  birthday DATE NOT NULL,
  race VARCHAR NOT NULL,
  death_date DATE,
  sex VARCHAR NOT NULL
);

create table s312986.Criminals (
  id BIGINT PRIMARY KEY,
  creature_id BIGINT NOT NULL REFERENCES Creature(id),
  crime_id BIGINT NOT NULL REFERENCES Crime(id),
  punishment_id BIGINT,
  is_proved BOOLEAN NOT NULL,
  UNIQUE(creature_id, crime_id, punishment_id)
);

create table s312986.Victims(
  creature_id BIGINT NOT NULL REFERENCES Creature(id),
  crime_id BIGINT NOT NULL REFERENCES Crime(id),
  UNIQUE(creature_id, crime_id),
  PRIMARY KEY(creature_id, crime_id)
);


create table s312986.Magic (
  id SMALLINT PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE
);

create table s312986.Used_magic (
  id BIGINT PRIMARY KEY,
  date DATE NOT NULL,
  criminals_id BIGINT NOT NULL REFERENCES Criminals(id),
  magic_id SMALLINT NOT NULL REFERENCES Magic(id),
  UNIQUE(date, criminals_id, magic_id)
);

create table s312986.True_magic (
  id SMALLINT PRIMARY KEY,
  magic_id SMALLINT NOT NULL UNIQUE REFERENCES Magic(id)
);

-- create table s312986.Color (
--   id SMALLINT PRIMARY KEY,
--   value VARCHAR NOT NULL UNIQUE
-- );

create type s312986.Color as enum ('black', 'white');

create table s312986.Obvious_magic (
  id SMALLINT PRIMARY KEY,
  magic_id INTEGER NOT NULL UNIQUE REFERENCES Magic(id),
  color_id s312986.Color NOT NULL,
  level INTEGER NOT NULL,
  damage INTEGER NOT NULL,
  is_allowed BOOLEAN NOT NULL
);

create table s312986.Orden (
  id SMALLINT PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE,
  description VARCHAR
);

-- create table s312986.Orden_rank (
--   id SMALLINT PRIMARY KEY,
--   name VARCHAR NOT NULL UNIQUE
-- );

create type s312986.Orden_rank as enum ('orden_woman', 'novice', 'junior_master', 'chief_master');

create table s312986.Orden_member (
  id BIGINT PRIMARY KEY,
  creature_id BIGINT NOT NULL,
  orden_id SMALLINT NOT NULL REFERENCES Orden(id),
  orden_rank s312986.Orden_rank NOT NULL,
  UNIQUE(creature_id, orden_id, orden_rank)
);

create table s312986.Punishment (
  id BIGINT PRIMARY KEY,
  type VARCHAR NOT NULL,
  date_begin DATE NOT NULL,
  date_end DATE NOT NULL,
  fine_amonut INTEGER NOT NULL,
  UNIQUE(type, date_begin, date_end, fine_amonut)
);


create table s312986.Take_part (
  id UUID PRIMARY KEY,
  detective_id INTEGER NOT NULL REFERENCES Detective(id),
  crime_id INTEGER NOT NULL REFERENCES Crime(id),
  UNIQUE(detective_id, crime_id)
);

create table s312986.Salary (
  id SMALLINT PRIMARY KEY,
  value INTEGER NOT NULL,
  position_id SMALLINT NOT NULL UNIQUE
);

create table s312986.Allowance (
  id SMALLINT PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE,
  value INTEGER NOT NULL,
  min_crimes INTEGER NOT NULL UNIQUE
);

create table s312986.Dosseir (
  id BIGINT PRIMARY KEY,
  author_id BIGINT NOT NULL REFERENCES Customer(id),
  create_date DATE NOT NULL,
  crime_id BIGINT NOT NULL REFERENCES Crime(id),
  UNIQUE(author_id, crime_id, create_date)
);


-- - расчет урона сердцу мира за указанный месяц
create or replace function count_world_heart_damage_per_dates(date, date) returns integer as $psql$
  begin
    return 
      (select sum(om.damage) from Used_magic um
      inner join Obvious_magic om
      on om.magic_id = um.magic_id
      where $1 < um.date and um.date < $2);
  end;
$psql$ language plpgsql;

-- - в очевидной магии нельзя чтобы is_allowed было true у черной магии больше 22 ступени и у белой больше 10
create or replace function true_magic_level_check() returns trigger as $psql$
  begin
    if new.level > 22 and new.is_allowed = true and new.color_id = 'black' then
      RAISE EXCEPTION 'level = % > 22, is allowed for black magic', new.level;
      return null;
    end if;

    if new.level > 10 and new.is_allowed = true and new.color_id = 'white' then
      RAISE EXCEPTION 'level = % > 10, is allowed for white magic', new.level;
      return null;
    end if;
    return new;
  end;
$psql$ language plpgsql;

create or replace trigger insert_magic_level_check_trigger before insert on Obvious_magic
for each row execute procedure true_magic_level_check();

create or replace trigger update_magic_level_check_trigger before update on Obvious_magic
for each row execute procedure true_magic_level_check();


-- заклинание должно встречаться только в одном виде магии в истинной или в очевидной

create or replace function obvious_magic_check() returns trigger as $psql$
  begin
        if exists(
      select magic_id
      from Obvious_magic m
      where m.magic_id=new.magic_id)
    then
      RAISE EXCEPTION 'magic_id = % is already in obvious_magic table', new.magic_id;
      return null;
    end if;
    return new;
  end;
$psql$ language plpgsql;

create or replace function true_magic_check() returns trigger as $psql$
  begin
    if exists(
      select magic_id
      from True_magic m
      where m.magic_id=new.magic_id)
    then
      RAISE EXCEPTION 'magic_id = % is already in true_magic table', new.magic_id;
      return null;
    end if;

    return new;
  end;
$psql$ language plpgsql;

create or replace trigger insert_magic_true_or_obvious_check_trigger before insert on Obvious_magic
for each row execute procedure true_magic_check();

create or replace trigger update_magic_true_or_obvious_check_trigger before update on Obvious_magic
for each row execute procedure true_magic_check();

create or replace trigger insert_magic_true_or_obvious_check_trigger before insert on True_magic
for each row execute procedure obvious_magic_check();

create or replace trigger update_magic_true_or_obvious_check_trigger before update on True_magic
for each row execute procedure obvious_magic_check();

-- если существо женского пола, то в орден_мембер может быть орден_ранг только женщина ордена. 
-- А если пол мужской, то такого ранга быть не может

create or replace function sex_orden_rank_check() returns trigger as $psql$
  begin
    if (select sex from Creature c where c.id=new.creature_id) = 'female'
    then
      if (new.orden_rank != 'orden_woman')
      then
        RAISE EXCEPTION 'Woman can be only orden_woman';
        return null;
      end if;
    elsif (new.orden_rank = 'orden_woman')
    then
      RAISE EXCEPTION 'Man cant be an orden_woman';
      return null;
    end if;

    return new;
  end;
$psql$ language plpgsql;

create or replace trigger insert_sex_orden_rank_check_trigger before insert on Orden_member
for each row execute procedure sex_orden_rank_check();

create or replace trigger update_sex_orden_rank_check_trigger before update on Orden_member
for each row execute procedure sex_orden_rank_check();

-- на обновление столбца date_begin в Crime
-- условия:
-- date_begin < Dosseir.create_dt         |
-- date_begin < min(Used_magic.date)      |
-- date_begin <= now()                    |
-- date_begin < date_end                  |
-- date_begin < max(crime.death_date)     |
-- date_begin < max(victims.death_date)   |

create or replace function crime_date_begin_check() returns trigger as $psql$
  declare 
    dt_to_compare date;
  begin
    if new.date_begin > now() then
      raise exception 'date_begin of crime cannot be in future';
    end if;
    if new.date_begin > new.date_end then
      raise exception 'date_begin cannot be after date_end';
    end if;
    select create_dt into dt_to_compare from Dosseir where Dosseir.crime_id = new.id;
    if dt_to_compare is not null and new.date_begin > dt_to_compare then
      raise exception 'date_begin cannot be after create_dt of Dosseir';
    end if;
    select min(Used_magic.date) into dt_to_compare from Used_magic join Criminals on Used_magic.criminals_id = Criminals.id
    where Criminals.crime_id = new.id;
    if dt_to_compare is not null and new.date_begin > dt_to_compare then
      raise exception 'date_begin of crime cannot be after date of first use magic what was used in this crime';
    end if;
    select max(Creature.death_date) into dt_to_compare from Creature join Criminals on Criminals.creature_id = Creature.id
    where Criminals.crime_id = new.id;
    if dt_to_compare is not null and new.date_begin > dt_to_compare then
      raise exception 'date_begin of crime cannot be after the greatest death_date of criminals';
    end if;
    select max(Creature.death_date) into dt_to_compare from Creature join Victims on Victims.creature_id = Creature.id
    where Victims.crime_id = new.id;
    if dt_to_compare is not null and new.date_begin > dt_to_compare then
      raise exception 'date_begin of crime cannot be after the greatest death_date of victims';
    end if;
    return new;
  end;
$psql$ language plpgsql;

create or replace trigger crime_date_begin_insert_trigger before insert on Crime
for each row
execute procedure crime_date_begin_check();

create or replace trigger crime_date_begin_update_trigger before update of date_begin on Crime
for each row when (old.date_begin < new.date_begin)
execute procedure crime_date_begin_check();

-- date_end > max(crime.birthday)                 |
-- date_end > max(victims.birthday)               |
-- date_end > max(Used_magic.date)                |
-- date_end > main_detective.birthday             |
-- date_end > max(take_part.birthday)             |
-- not null is is_solved (and null is not_solved) |
-- date_end > date_begin                          |
-- date_end <= now()                              |  
-- date_end < max(take_part.death_date)           | (c date_begin про транзитивности date_begin < date_end)

create or replace function crime_date_end_check() returns trigger as $psql$
  declare 
    dt_to_compare date;
  begin
    if new.is_solved = false then
      raise exception 'crime cannot have date_end if it is not solved';
    end if;
    if new.date_end > now() then
      raise exception 'date_end of crime cannot be in future';
    end if;
    if new.date_end < new.date_begin then
      raise exception 'date_end cannot be before date_begin';
    end if;
    select max(Used_magic.date) into dt_to_compare from Used_magic join Criminals on Used_magic.criminals_id = Criminals.id
    where Criminals.crime_id = new.id;
    if dt_to_compare is not null and new.date_end < dt_to_compare then
      raise exception 'date_end of crime cannot be before date of last use magic what was used in this crime';
    end if;
    select max(Creature.birthday) into dt_to_compare from Creature join Criminals on Criminals.creature_id = Creature.id
    where Criminals.crime_id = new.id;
    if dt_to_compare is not null and new.date_end < dt_to_compare then
      raise exception 'date_end of crime cannot be before the greatest birthday of criminals';
    end if;
    select max(Creature.birthday) into dt_to_compare from Creature join Victims on Victims.creature_id = Creature.id
    where Victims.crime_id = new.id;
    if dt_to_compare is not null and new.date_end < dt_to_compare then
      raise exception 'date_end of crime cannot be before the greatest birthday of victims';
    end if;
    select Creature.birthday into dt_to_compare from Creature join Detective on Detective.creature_id = Creature.id
    where Detective.id = new.main_detective_id;
    if dt_to_compare is not null and new.date_end < dt_to_compare then
      raise exception 'date_end of crime cannot be before birthday of main detective';
    end if;
    select max(Creature.birthday) into dt_to_compare from Creature join Detective on Detective.creature_id = Creature.id
    join Take_part on take_part.detective_id = Detective.id
    where Take_part.crime_id = new.id;
    if dt_to_compare is not null and new.date_end < dt_to_compare then
      raise exception 'date_end of crime cannot be before greatest birthday of participating detectives';
    end if;
    select max(Creature.death_date) into dt_to_compare from Creature join Detective on Detective.creature_id = Creature.id
    join Take_part on take_part.detective_id = Detective.id
    where Take_part.crime_id = new.id;
    if dt_to_compare is not null and new.date_end > dt_to_compare then
      raise exception 'date_end of crime cannot be after greatest date_death of participating detectives';
    end if;
  end;
$psql$ language plpgsql;

create or replace trigger crime_date_end_insert_trigger before insert on Crime
for each row when (new.date_end is not null)
execute procedure crime_date_end_check();

create or replace trigger crime_date_end_update_trigger before update of date_end on Crime
for each row when (new.date_end is not null and old.date_end > new.date_end)
execute procedure crime_date_end_check();

create or replace function crime_is_solved_check() returns trigger as $psql$
  begin
    if (new.is_solved = true and new.date_end is null) then
      raise exception 'crime cannot be solved if it have not date_end';
    end if;
    if (new.is_solved = false and new.date_end is not null) then
      raise exception 'crime cannot have date_end if it is not solved';
    end if;
    return new;
  end;
$psql$ language plpgsql;

create or replace trigger crime_is_solved_insert_trigger before insert on Crime
for each row 
execute procedure crime_is_solved_check();

create or replace trigger crime_is_solved_update_trigger before update of is_solved on Crime
for each row 
execute procedure crime_is_solved_check();
