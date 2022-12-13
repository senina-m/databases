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
  id UUID PRIMARY KEY,
  creature_id BIGINT NOT NULL REFERENCES Creature(id),
  crime_id BIGINT NOT NULL REFERENCES Criminals(id),
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
  crime_id BIGINT NOT NULL REFERENCES Crime(id),
  magic_id SMALLINT NOT NULL REFERENCES Magic(id),
  UNIQUE(date, crime_id, magic_id)
);

create table s312986.True_magic (
  id SMALLINT PRIMARY KEY,
  magic_id SMALLINT NOT NULL UNIQUE REFERENCES Magic(id)
);

create table s312986.Color (
  id SMALLINT PRIMARY KEY,
  value VARCHAR NOT NULL UNIQUE
);

create table s312986.Obvious_magic (
  id SMALLINT PRIMARY KEY,
  magic_id INTEGER NOT NULL UNIQUE REFERENCES Magic(id),
  color_id SMALLINT NOT NULL REFERENCES Color(id),
  level INTEGER NOT NULL,
  damage INTEGER NOT NULL,
  is_allowed BOOLEAN NOT NULL
);

create table s312986.Orden (
  id SMALLINT PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE,
  description VARCHAR
);

create table s312986.Orden_rank (
  id SMALLINT PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE
);

create table s312986.Orden_member (
  id BIGINT PRIMARY KEY,
  creature_id BIGINT NOT NULL,
  orden_id SMALLINT NOT NULL REFERENCES Orden(id),
  orden_rank_id SMALLINT NOT NULL REFERENCES Orden_rank(id),
  UNIQUE(creature_id, orden_id, orden_rank_id)
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

-- если существо женского пола, то в орден_мембер может быть орден_ранг только женщина ордена. 
-- А если пол мужской, то такого ранга быть не может

-- - если permission - это детектив, то детектив с таким именем должен быть в табличке детективов

-- в очевидной магии нельзя чтобы is_allowed было true у черной магии больше 22 ступени и у белой больше 10
create or replace function true_magic_level_check() returns trigger as $psql$
  begin
    if new.level > 22 and new.is_allowed = true and(
      select value
      from Color
      where new.color_id = Color.id
    ) = 'black' then
      RAISE EXCEPTION 'level = % > 22, is allowed for black magic', new.level;
      return null;
    end if;

    if new.level > 10 and new.is_allowed = true and (
      select value
      from Color
      where new.color_id = Color.id
    ) = 'white' then
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


-- заклинание должно встречаться только в одном виде магии в истенной или в очевидной

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