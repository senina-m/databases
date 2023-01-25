insert into permissions (name) values ('ROLE_WRITER');
insert into permissions (name) values ('ROLE_DETECTIVE');

create or replace function get_permission_id(permission_name varchar) returns smallint as $$
    declare
        result_id smallint;
    begin
        select id into strict result_id from permissions where name = permission_name;
        return result_id;
    end;
$$ LANGUAGE plpgsql;

create or replace function get_creature_id(creature_name varchar) returns bigint as $$
    declare
        result_id bigint;
    begin
        select id into strict result_id from creature where name = creature_name;
        return result_id;
    end;
$$ LANGUAGE plpgsql;

create or replace function get_customer_id(customer_name varchar) returns bigint as $$
    declare
        result_id bigint;
    begin
        select id into strict result_id from customer where name = customer_name;
        return result_id;
    end;
$$ LANGUAGE plpgsql;

insert into Creature (name, birthday, race, sex) values ('Луукфи Пенц', '1994-01-01', 'Человек', 'man');
insert into Customer (name, password, permissions_id) values ('luukfi_pentz', '$2a$10$tiFFr8TNFQUmR5ol6Fup.ey.8uPsDSAtFGpSYprNMTUSc4/DBG2hG', get_permission_id('ROLE_WRITER'));
insert into Customer_creature (customer_id, creature_id) values (get_customer_id('luukfi_pentz'), get_creature_id('Луукфи Пенц'));

-- create detective
insert into Position values (1, 'Дневное лицо Почтеннейшего Начальника');
insert into Position values (2, 'Мастер Слышащий');
insert into Position values (3, 'Мастер Преследования всех затаившихся и бегущих');

insert into salary (value, position_id) values (600, 1);
insert into salary (value, position_id) values (1000, 2);
insert into salary (value, position_id) values (500, 3);

insert into Creature (name, birthday, race, sex) values ('Мелифаро', '2000-01-01', 'Человек', 'man');
insert into Creature (name, birthday, race, sex) values ('Кофа Йох', '1950-04-20', 'Человек', 'man');
insert into Creature (name, birthday, race, sex) values ('Меламори Блимм', '2002-08-03', 'Оборотень', 'woman');

insert into Detective(creature_id, position_id) values (get_creature_id('Мелифаро'), 1);
insert into Detective(creature_id, position_id) values (get_creature_id('Кофа Йох'), 2);
insert into Detective(creature_id, position_id) values (get_creature_id('Меламори Блимм'), 3);

insert into Customer (name, password, permissions_id) values ('kofa_yox', '$2a$10$P49AzZkMqFaFj2AQ0FpElu6YMtkxEdnSY8.HybweH344JDT45AZ92', get_permission_id('ROLE_DETECTIVE'));
insert into Customer_creature (customer_id, creature_id) values (get_customer_id('kofa_yox'), get_creature_id('Кофа Йох'));

-- create creatures
insert into Creature (name, birthday, race, sex) values ('Лойсо Пондохва', '1300-01-12'::date, 'Полу-эхл', 'man');
insert into Creature (name, birthday, race, sex, death_date) values ('Джуба Чебобарго', '1987-04-09', 'Человек', 'man', '2023-01-24');
insert into Creature (name, birthday, race, sex, death_date) values ('Анавуайна', '1004-04-12', 'Амфитимай', 'woman', '2023-01-20');
insert into Creature (name, birthday, race, sex) values ('Теххи Шекк', '1523-04-12', 'Призрак', 'woman');

-- create crime juba chebobargo
insert into location (name) values ('Мир Стержня');
insert into magic values (1, 'Оживление куклы');
insert into obvious_magic values (1, 1, 'white', 23, 100, false);
insert into magic values (2, 'Обработка дерева');
insert into obvious_magic values (2, 2, 'black', 12, 5, false);
insert into crime (title, description, date_begin, date_end, main_detective_id, is_solved, damage_description, location_id)
values (
    'Похищение вещей по всему Ехо',
    'По всему городу похожим образом пропадают вещи. Их похищали куклы Джубы Чебобарго, известного кукольника',
    '2019-04-09',
    '2019-04-29',
    1,
    true,
    'Множество похищенных вещей. Большая часть уже была распродана, так что их не удалось вернуть',
    1
    );
insert into dosseir (author_id, create_date, crime_id) values (1, now(), 1);
insert into take_part (detective_id, crime_id) values (3, 1);
insert into criminals (creature_id, crime_id, is_proved) values (get_creature_id('Джуба Чебобарго'), 1, true);
insert into used_magic (date, criminals_id, magic_id) values ('2019-04-10', 1, 1);
insert into used_magic (date, criminals_id, magic_id) values ('2019-04-11', 1, 1);
insert into used_magic (date, criminals_id, magic_id) values ('2019-04-12', 1, 1);
insert into used_magic (date, criminals_id, magic_id) values ('2019-04-19', 1, 1);
insert into used_magic (date, criminals_id, magic_id) values ('2019-04-20', 1, 1);
insert into used_magic (date, criminals_id, magic_id) values ('2019-04-25', 1, 1);
insert into used_magic (date, criminals_id, magic_id) values ('2019-04-09', 1, 2);
insert into used_magic (date, criminals_id, magic_id) values ('2019-04-10', 1, 2);
insert into used_magic (date, criminals_id, magic_id) values ('2019-04-11', 1, 2);
insert into used_magic (date, criminals_id, magic_id) values ('2019-04-17', 1, 2);
insert into used_magic (date, criminals_id, magic_id) values ('2019-04-22', 1, 2);
