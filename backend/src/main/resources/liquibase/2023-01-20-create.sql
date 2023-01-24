set lc_messages to 'ru_RU.UTF-8';

create table Creature (
                          id BIGSERIAL PRIMARY KEY,
                          name VARCHAR NOT NULL,
                          birthday DATE NOT NULL,
                          race VARCHAR NOT NULL,
                          death_date DATE,
                          sex VARCHAR NOT NULL
);

create table Permissions (
                             id SMALLSERIAL PRIMARY KEY,
                             name VARCHAR NOT NULL UNIQUE
);

create table Location (
                          id SMALLSERIAL PRIMARY KEY,
                          name VARCHAR NOT NULL UNIQUE
);

create table Customer (
                          id BIGSERIAL PRIMARY KEY,
                          name VARCHAR NOT NULL UNIQUE,
                          password VARCHAR NOT NULL,
                          permissions_id SMALLINT NOT NULL REFERENCES Permissions(id)
);

create table Position (
                          id SMALLSERIAL PRIMARY KEY,
                          name VARCHAR NOT NULL UNIQUE
);

create table Detective (
                           id BIGSERIAL PRIMARY KEY,
                           creature_id BIGINT NOT NULL UNIQUE REFERENCES Creature(id) ON DELETE CASCADE,
                           position_id SMALLINT NOT NULL REFERENCES Position(id)
);

create table Crime (
                       id BIGSERIAL PRIMARY KEY,
                       title VARCHAR NOT NULL UNIQUE,
                       description VARCHAR NOT NULL,
                       date_begin DATE NOT NULL,
                       date_end DATE NOT NULL,
                       main_detective_id BIGINT NOT NULL REFERENCES Detective(id),
                       is_solved BOOLEAN NOT NULL,
                       damage_description VARCHAR ,
                       location_id SMALLINT NOT NULL REFERENCES Location(id)
);

create index main_det_date_end_crime_index on Crime(main_detective_id, date_end);

create table Punishment (
                            id BIGSERIAL PRIMARY KEY,
                            type VARCHAR NOT NULL,
                            date_begin DATE NOT NULL,
                            date_end DATE NOT NULL,
                            fine_amonut INTEGER NOT NULL,
                            UNIQUE(type, date_begin, date_end, fine_amonut)
);

create table Criminals (
                           id BIGSERIAL PRIMARY KEY,
                           creature_id BIGINT NOT NULL REFERENCES Creature(id) ON DELETE CASCADE,
                           crime_id BIGINT NOT NULL REFERENCES Crime(id) ON DELETE CASCADE,
                           punishment_id BIGINT REFERENCES Punishment(id),
                           is_proved BOOLEAN NOT NULL,
                           UNIQUE(crime_id, creature_id)
);

create index creature_criminals_index on Criminals(creature_id);

create table Victims(
                        creature_id BIGINT NOT NULL REFERENCES Creature(id) ON DELETE CASCADE,
                        crime_id BIGINT NOT NULL REFERENCES Crime(id) ON DELETE CASCADE,
                        UNIQUE(creature_id, crime_id),
                        PRIMARY KEY(crime_id, creature_id)
);

create table Magic (
                       id SMALLSERIAL PRIMARY KEY,
                       name VARCHAR NOT NULL UNIQUE
);

create table Used_magic (
                            id BIGSERIAL PRIMARY KEY,
                            date DATE NOT NULL,
                            criminals_id BIGINT NOT NULL REFERENCES Criminals(id) ON DELETE CASCADE,
                            magic_id SMALLINT NOT NULL REFERENCES Magic(id),
                            UNIQUE(criminals_id, date, magic_id)
);

create index magic_used_magic_index on Used_magic(magic_id);

create table True_magic (
                            id SMALLSERIAL PRIMARY KEY,
                            magic_id SMALLINT NOT NULL UNIQUE REFERENCES Magic(id)
);

create type Color as enum ('black', 'white');

create table Obvious_magic (
                               id SMALLSERIAL PRIMARY KEY,
                               magic_id INTEGER NOT NULL UNIQUE REFERENCES Magic(id),
                               color Color NOT NULL,
                               level INTEGER NOT NULL,
                               damage INTEGER NOT NULL,
                               is_allowed BOOLEAN NOT NULL
);

create table Orden (
                       id SMALLSERIAL PRIMARY KEY,
                       name VARCHAR NOT NULL UNIQUE,
                       description VARCHAR
);

create type Orden_rank as enum ('orden_woman', 'novice', 'junior_master', 'chief_master');

create table Orden_member (
                              id BIGSERIAL PRIMARY KEY,
                              creature_id BIGINT NOT NULL REFERENCES Creature(id) ON DELETE CASCADE,
                              orden_id SMALLINT NOT NULL REFERENCES Orden(id) ON DELETE CASCADE,
                              orden_rank Orden_rank NOT NULL,
                              UNIQUE(creature_id, orden_id, orden_rank)
);

create index orden_member_index on Orden_member(orden_id);

create table Take_part (
                           id BIGSERIAL PRIMARY KEY,
                           detective_id INTEGER NOT NULL REFERENCES Detective(id) ON DELETE CASCADE,
                           crime_id INTEGER NOT NULL REFERENCES Crime(id) ON DELETE CASCADE,
                           UNIQUE(detective_id, crime_id)
);

create table Salary (
                        id SMALLSERIAL PRIMARY KEY,
                        value INTEGER NOT NULL,
                        position_id SMALLINT NOT NULL UNIQUE REFERENCES Position(id) ON DELETE CASCADE
);

create index position_salary_index on Salary(position_id);

create table Allowance (
                           id SMALLSERIAL PRIMARY KEY,
                           name VARCHAR NOT NULL UNIQUE,
                           value INTEGER NOT NULL,
                           min_crimes INTEGER NOT NULL UNIQUE
);

create table Dosseir (
                         id BIGSERIAL PRIMARY KEY,
                         author_id BIGINT NOT NULL REFERENCES Customer(id),
                         create_date DATE NOT NULL,
                         crime_id BIGINT NOT NULL UNIQUE REFERENCES Crime(id) ON DELETE CASCADE
);

create table Customer_creature (
                                   id BIGSERIAL PRIMARY KEY,
                                   customer_id BIGINT NOT NULL UNIQUE REFERENCES Customer(id) ON DELETE CASCADE,
                                   creature_id BIGINT NOT NULL UNIQUE REFERENCES Creature(id) ON DELETE CASCADE
);

create or replace function count_prize(date, date, bigint) returns integer as $psql$
begin
return
        2*(select count(*) from Crime c
           where c.main_detective_id = $3
             and $1 <= c.date_end
             and c.date_end < $2);
end;
$psql$ language plpgsql;

-- - расчет зарплаты для детектива (дата начала, дата конца, детектив_ид)
create or replace function count_salary(date, date, bigint) returns integer as $psql$
    declare
        salary_value int;
    begin
        select value into salary_value from Salary s where s.position_id =
            (select position_id from Detective where id = $3);
        if (salary_value is null)
		    then salary_value = 0;
        end if;
        return salary_value
            * abs(extract(day from $1::timestamp - $2::timestamp))
            + count_prize($1, $2, $3);
    end;
$psql$ language plpgsql;

-- - расчет урона сердцу мира за указанный месяц
create or replace function count_world_heart_damage_per_dates(date, date) returns integer as $psql$
begin
return
    (select sum(om.damage) from Used_magic um
                                    inner join Obvious_magic om
                                               on om.magic_id = um.magic_id
     where $1 <= um.date and um.date < $2);
end;
$psql$ language plpgsql;

-- - в очевидной магии нельзя чтобы is_allowed было true у черной магии больше 22 ступени и у белой больше 10
create or replace function true_magic_level_check() returns trigger as $psql$
begin
    if new.level > 22 and new.is_allowed = true and new.color_id = 'black' then
      RAISE EXCEPTION 'уровень = % > 22, и не может быть разрешен для черной очевидной магии', new.level;
return null;
end if;

    if new.level > 10 and new.is_allowed = true and new.color_id = 'white' then
      RAISE EXCEPTION 'уровень = % > 10, и не может быть разрешен для белой очевидной магии', new.level;
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
    if (select sex from Creature c where c.id=new.creature_id) = 'woman'
    then
      if (new.orden_rank != 'orden_woman')
      then
        RAISE EXCEPTION 'женщина может занимать в ордене только позицию "Женщина ордена"';
return null;
end if;
    elsif (new.orden_rank = 'orden_woman')
    then
      RAISE EXCEPTION 'Мужчина не может занимать в ордене позицию "Женщина ордена"';
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
-- date_begin < Dosseir.create_date         |
-- date_begin < min(Used_magic.date)      |
-- date_begin <= now()                    |
-- date_begin < date_end                  |
-- date_begin <= min(crime.death_date)     |
-- date_begin <= min(victims.death_date)   |

create or replace function crime_date_begin_check() returns trigger as $psql$
  declare
dt_to_compare date;
begin
    if new.date_begin > now() then
      raise exception 'Дата начала преступления не может быть в будущем';
end if;
    if new.date_begin > new.date_end then
      raise exception 'Дата начала преступления не может быть после даты окончания';
end if;
select create_date into dt_to_compare from Dosseir where Dosseir.crime_id = new.id;
if dt_to_compare is not null and new.date_begin > dt_to_compare then
      raise exception 'Дата начала преступления не может быть после даты создания досье';
end if;
select min(Used_magic.date) into dt_to_compare from Used_magic join Criminals on Used_magic.criminals_id = Criminals.id
where Criminals.crime_id = new.id;
if dt_to_compare is not null and new.date_begin > dt_to_compare then
      raise exception 'Дата начала преступления не может быть после первого из использованных при совершении этого преступления заклинания';
end if;
select min(Creature.death_date) into dt_to_compare from Creature join Criminals on Criminals.creature_id = Creature.id
where Criminals.crime_id = new.id;
if dt_to_compare is not null and new.date_begin > dt_to_compare then
      raise exception 'Дата начала преступления не может быть после первой смерти среди преступников';
end if;
select min(Creature.death_date) into dt_to_compare from Creature join Victims on Victims.creature_id = Creature.id
where Victims.crime_id = new.id;
if dt_to_compare is not null and new.date_begin > dt_to_compare then
      raise exception 'Дата начала преступления не может быть после первой смерти среди жертв';
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
      raise exception 'У преступления не может быть дата конца если оно не раскрыто';
end if;
    if new.date_end > now() then
      raise exception 'Дата конца преступления не может быть в будущем';
end if;
    if new.date_end < new.date_begin then
      raise exception 'Дата конца преступления не может быть раньше даты начала';
end if;
select max(Used_magic.date) into dt_to_compare from Used_magic join Criminals on Used_magic.criminals_id = Criminals.id
where Criminals.crime_id = new.id;
if dt_to_compare is not null and new.date_end < dt_to_compare then
      raise exception 'Дата конца преступления не может быть до последнего использованного при его совершении заклинания';
end if;
select max(Creature.birthday) into dt_to_compare from Creature join Criminals on Criminals.creature_id = Creature.id
where Criminals.crime_id = new.id;
if dt_to_compare is not null and new.date_end < dt_to_compare then
      raise exception 'Дата конца преступления не может быть раньше дня рождения самого юнного преступника';
end if;
select max(Creature.birthday) into dt_to_compare from Creature join Victims on Victims.creature_id = Creature.id
where Victims.crime_id = new.id;
if dt_to_compare is not null and new.date_end < dt_to_compare then
      raise exception 'Дата конца преступления не может быть раньше дня рождения самой юной жертвы';
end if;
select Creature.birthday into dt_to_compare from Creature join Detective on Detective.creature_id = Creature.id
where Detective.id = new.main_detective_id;
if dt_to_compare is not null and new.date_end < dt_to_compare then
      raise exception 'Дата конца перступления не может быть до дня рождения ответственного за него детектива';
end if;
select max(Creature.birthday) into dt_to_compare from Creature join Detective on Detective.creature_id = Creature.id
                                                               join Take_part on take_part.detective_id = Detective.id
where Take_part.crime_id = new.id;
if dt_to_compare is not null and new.date_end < dt_to_compare then
      raise exception 'Дата конца преступлеиня не может быть до дня рождения самого юнного из принимающих участие в раскрытии детектива';
end if;
select max(Creature.death_date) into dt_to_compare from Creature join Detective on Detective.creature_id = Creature.id
                                                                 join Take_part on take_part.detective_id = Detective.id
where Take_part.crime_id = new.id;
if dt_to_compare is not null and new.date_end > dt_to_compare then
      raise exception 'Дата конца преступления не может быть после смерти последнего из прнимающих участие детективов (иначе кто его окончательно раскроет)';
end if;
return new;
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
      raise exception 'Преступление не может быть раскрыто если у него не назначена дата конца';
end if;
    if (new.is_solved = false and new.date_end is not null) then
      raise exception 'У преступления не может быть дата конца если оно ещё не раскрыто';
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

-- Creature
-- birthday < dead_date (on create too)
create or replace function creature_birthday_less_death_check() returns trigger as $psql$
begin
    if (new.death_date is not null) and (new.birthday > new.death_date) then
      raise exception 'Дата смерти не может быть до даты рождения';
end if;
return new;
end;
$psql$ language plpgsql;

create or replace trigger creature_birthday_death_insert_trigger before insert on Creature
for each row
execute procedure creature_birthday_less_death_check();

create or replace trigger creature_birthday_death_update_trigger before update on Creature
                                                                                          for each row
                                                                                          execute procedure creature_birthday_less_death_check();

-- birthday
-- birthday < min(used_magic)                         |
-- bithday < min(criminal.crime.date_end)             |
-- birthday < min(victims.crime.date_end)             |
-- birthday < min(detective.takePart.crime.date_end)  |
-- birthday < min(mainDetective.crime.date_end)       |

create or replace function creature_birthday_check() returns trigger as $psql$
  declare
dt_to_compare date;
begin
select min(Used_magic.date) into dt_to_compare from Used_magic join Criminals on Criminals.id = Used_magic.criminals_id
where Criminals.creature_id = new.id;
if dt_to_compare is not null and new.birthday > dt_to_compare then
      raise exception 'Дата рождения преступника не может быть позже чем первое использование магии им';
end if;
select min(Crime.date_end) into dt_to_compare from Crime join Criminals on Criminals.crime_id = Crime.id
where Criminals.creature_id = new.id;
if dt_to_compare is not null and new.birthday > dt_to_compare then
      raise exception 'Дата рождения преступника не может быть после даты конца первого по окончанию из его преступлений';
end if;
select min(Crime.date_end) into dt_to_compare from Crime join Victims on Victims.crime_id = Crime.id
where Victims.creature_id = new.id;
if dt_to_compare is not null and new.birthday > dt_to_compare then
      raise exception 'Дата рождения жертвы не может быть после даты конца первого по окончанию преступления, в котором она пострадала';
end if;
select min(Crime.date_end) into dt_to_compare from Crime join Take_part on Take_part.crime_id = Crime.id
                                                         join Detective on Detective.id = Take_part.detective_id where Detective.creature_id = new.id;
if dt_to_compare is not null and new.birthday > dt_to_compare then
      raise exception 'День рождения детектива не может быть после даты конца первого по окончанию из его дел';
end if;
select min(Crime.date_end) into dt_to_compare from Crime join Detective on Detective.id = Crime.main_detective_id
where Detective.creature_id = new.id;
if dt_to_compare is not null and new.birthday > dt_to_compare then
      raise exception 'День рождения детектива не может быть после даты конца первого по окончанию из его дел, за которые он ответственен';
end if;
return new;
end;
$psql$ language plpgsql;

create or replace trigger creature_birthday_update_trigger before update of birthday on Creature
    for each row
    execute procedure creature_birthday_check();

-- death_day
-- death_date > max(used_magic)                           |
-- death_date > max(criminal.crime.date_begin)            |
-- death_date > max(victims.crime.date_begin)             |
-- death_date > max(detective.takePart.crime.date_begin)  |
-- death_date > max(mainDetective.crime.date_begin)       |

create or replace function creature_death_date_check() returns trigger as $psql$
  declare
dt_to_compare date;
begin
select max(Used_magic.date) into dt_to_compare from Used_magic join Criminals on Criminals.id = Used_magic.criminals_id
where Criminals.creature_id = new.id;
if dt_to_compare is not null and new.death_date < dt_to_compare then
      raise exception 'Дата смерти преступника не может быть до даты его последнего заклинания';
end if;
select max(Crime.date_begin) into dt_to_compare from Crime join Criminals on Criminals.crime_id = Crime.id
where Criminals.creature_id = new.id;
if dt_to_compare is not null and new.death_date < dt_to_compare then
      raise exception 'Дата смерти преступника не может быть до даты начала последнего из его преступлений';
end if;
select max(Crime.date_begin) into dt_to_compare from Crime join Victims on Victims.crime_id = Crime.id
where Victims.creature_id = new.id;
if dt_to_compare is not null and new.death_date < dt_to_compare then
      raise exception 'Дата смерти жертвы не может быть до даты начала последнего из преступлений, в которых она страдала';
end if;
select max(Crime.date_begin) into dt_to_compare from Crime join Take_part on Take_part.crime_id = Crime.id
                                                         join Detective on Detective.id = Take_part.detective_id where Detective.creature_id = new.id;
if dt_to_compare is not null and new.death_date < dt_to_compare then
      raise exception 'Дата смерти детектива не может быть до даты начала последнего из его дел';
end if;
select max(Crime.date_end) into dt_to_compare from Crime join Detective on Detective.id = Crime.main_detective_id
where Detective.creature_id = new.id;
if dt_to_compare is not null and new.death_date < dt_to_compare then
      raise exception 'Дата смерти детектива не может быть до даты конца последнего из дел, за который он ответственен';
end if;
return new;
end;
$psql$ language plpgsql;

create or replace trigger creature_death_date_update_trigger before update of death_date on Creature
    for each row when (new.death_date is not null)
    execute procedure creature_death_date_check();

-- Used_magic (insert and update)
-- criminals.birthday < date < criminals.death_date
-- crime.date_begin < date < crime.date_end

create or replace function used_magic_date_check() returns trigger as $psql$
declare
result record;
begin
select * into result from Creature join Criminals on Criminals.creature_id = Creature.id
                                   join Used_magic on Used_magic.criminals_id = Criminals.id where Used_magic.id = new.id;
if result is not null then
      if result.death_date is not null and new.date > result.death_date then
        raise exception 'Дата использования заклинания не может быть после даты смерти использовавшего его преступника';
end if;
      if new.date < result.birthday then
        raise exception 'Дата использования заклинания не может быть до даты рождения использовавшего его преступника';
end if;
end if;
select * into result from Crime join Criminals on Criminals.crime_id = Crime.id
                                join Used_magic on Used_magic.criminals_id = Criminals.id where Used_magic.id = new.id;
if result is not null then
      if result.date_end is not null and new.date > result.date_end then
        raise exception 'Дата использования заклинания не может быть после даты окончания преступления, в котором оно использовалось';
end if;
      if new.date < result.date_begin then
        raise exception 'Дата использования заклинания не может быть до даты начала преступления, в котором оно использовалось';
end if;
end if;
return new;
end;
$psql$ language plpgsql;

create or replace trigger used_magic_date_insert_trigger before insert on Used_magic
for each row
execute procedure used_magic_date_check();

create or replace trigger used_magic_date_update_trigger before update of date on Used_magic
    for each row
    execute procedure used_magic_date_check();

-- Criminals (insert and update)
-- creature.birthday < crime.date_end
-- creature.death_date > crime.date_begin

create or replace function criminals_dates_check() returns trigger as $psql$
  declare
creature_result record;
    crime_result record;
begin
select * into creature_result from Creature where Creature.id = new.creature_id;
select * into crime_result from Crime where Crime.id = new.crime_id;
if crime_result.date_end is not null and crime_result.date_end < creature_result.birthday then
      raise exception 'Преступник не может родится после окончания преступления';
end if;
    if creature_result.death_date is not null and crime_result.date_begin > creature_result.death_date then
      raise exception 'Преступник не может умереть до начала преступления';
end if;
return new;
end;
$psql$ language plpgsql;

create or replace trigger criminals_dates_insert_trigger before insert on Criminals
for each row
execute procedure criminals_dates_check();

create or replace trigger criminals_dates_update_trigger before update on Criminals
                                                                                  for each row
                                                                                  execute procedure criminals_dates_check();

-- Victims (insert and update)
-- creature.birthday < crime.date_end
-- creature.death_date > crime.date_begin

create or replace function victims_dates_check() returns trigger as $psql$
  declare
creature_result record;
    crime_result record;
begin
select * into creature_result from Creature where Creature.id = new.creature_id;
select * into crime_result from Crime where Crime.id = new.crime_id;
if crime_result.date_end is not null and crime_result.date_end < creature_result.birthday then
      raise exception 'Жертва не может родиться после конца преступленияd';
end if;
    if creature_result.death_date is not null and crime_result.date_begin > creature_result.death_date then
      raise exception 'Жертва не может умереть до начала преступления';
end if;
return new;
end;
$psql$ language plpgsql;

create or replace trigger victims_dates_insert_trigger before insert on Victims
for each row
execute procedure victims_dates_check();

create or replace trigger victims_dates_update_trigger before update on Victims
                                                                                for each row
                                                                                execute procedure victims_dates_check();

-- Take part
-- detective.birthday < crime.date_end
-- detective.death_date > crime.date_begin

create or replace function take_part_dates_check() returns trigger as $psql$
  declare
creature_result record;
    crime_result record;
begin
select * into creature_result from Creature join Detective on Detective.creature_id = Creature.id
where Detective.id = new.detective_id;
select * into crime_result from Crime where Crime.id = new.crime_id;
if crime_result.date_end is not null and crime_result.date_end < creature_result.birthday then
      raise exception 'Принимающий участие в раскрытии преступления детектив не может родиться после конца преступления';
end if;
    if creature_result.death_date is not null and crime_result.date_begin > creature_result.death_date then
      raise exception 'Принимающий участие в раскрытии преступления детектив не может умереть до начала преступления';
end if;
return new;
end;
$psql$ language plpgsql;

create or replace trigger take_part_dates_insert_trigger before insert on Take_part
for each row
execute procedure take_part_dates_check();

create or replace trigger take_part_dates_update_trigger before update on Take_part
                                                                                  for each row
                                                                                  execute procedure take_part_dates_check();
