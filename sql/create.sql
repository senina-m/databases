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
  birthday DATE,
  race VARCHAR NOT NULL,
  is_alive BOOLEAN NOT NULL,
  sex VARCHAR NOT NULL
);

create table s312986.Criminals (
  id UUID PRIMARY KEY,
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

-- заклинание должно встречаться только в одном виде магии в истенной или в очевидной

-- - в очевидной магии нельзя чтобы is_allowed было true у черной магии больше 
-- 22 ступени и у белой больше 10
create function magic_level_check() returns trigger as $psql$
  begin
    if new.level > 22 and (
      select value
      from Color
      where new.color_id = Color.id
    ) = "black" then
        return null;
    end if;

    if new.level > 10 and (
      select value
      from Color
      where new.color_id = Color.id
    ) = "white" then
        return null;
    end if;
    return new;
  end;
$psql$ language plpgsql;

create or replace trigger magic_level_check_trigger before insert on Obvious_magic
for each row execute procedure magic_level_check();