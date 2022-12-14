insert into Magic(id, name) values
    (1, 'make mouse a dragon'),
    (2, 'make dragon a mouse'),
    (3, 'be invisible'),
    (4, 'call for coffe'),
    (5, 'make kamra'),
    (6, 'abra-kadabra'),
    (7, 'tilibom');

insert into Obvious_magic(id, magic_id, color_id, level, damage, is_allowed) values
    -- white magic make a mouse a dragon level=10, damage=3 allowed ==> ok
    (1, 1, 'white', 10, 3, true), 
    -- black magic make a dragon a mause level=22, damage=3 allowed ==> ok
    (2, 2, 'black', 22, 3, true);

-- insert into Obvious_magic(id, magic_id, color_id, level, damage, is_allowed) values
    -- white magic be invisible level=11, damage=3 allowed ==> not ok (unallowed level)
    -- (3, 3, 'white', 11, 3, true);

-- insert into Obvious_magic(id, magic_id, color_id, level, damage, is_allowed) values
    -- black magic call for coffe level=23, damage=3 allowed ==> not ok (unallowed level)
    -- (4, 6, 'black', 23, 3, true);

insert into Obvious_magic(id, magic_id, color_id, level, damage, is_allowed) values
    -- white magic be invisible level=11, damage=3 NOTallowed ==> ok
    (5, 7, 'white', 11, 3, false),
    -- black magic call for coffe level=23, damage=3 NOTallowed ==> ok
    (6, 4, 'black', 23, 3, false);
    

-- insert into True_magic(id, magic_id) values
    -- (1, 1); -- not ok (such spell exist in obvious magic)
insert into True_magic(id, magic_id) values
    (2, 5); -- ok

-- insert into Obvious_magic(id, magic_id, color_id, level, damage, is_allowed) values
    -- black magic make kamra level=23, damage=3 NOTallowed ==> not ok (such spell exist in true magic)
    -- (7, 5, 'black', 23, 3, false);

insert into Salary values
    (1, 50000, 1);

insert into Position values
    (1, 'detective');

insert into Detective values
    (1, 1, 1);

insert into Location values
    (1, 'earth');

insert into Crime values
    (1, 'the crime', 'description', '2017-04-16', '2022-12-14', 1, true, 'damage was sooo big', 1);

insert into Punishment values
    (1, 'jail', '2020-04-15', '2021-04-15', 0);

insert into Creature(id, name, birthday, race, death_date, sex) values
    (1, 'Max', '2017-03-14', 'human', '2022-03-14', 'male'),
    (2, 'Lonli-locli', '2015-02-11', 'human', '2022-03-14', 'male'),
    (3, 'Milifaro', '2003-03-10', 'human', null, 'male'),
    (4, 'Sophi', '2003-03-10', 'human', '2022-03-14', 'female');

insert into Criminals(id, creature_id, crime_id, punishment_id, is_proved) values
    (1, 1, 1, 1, false);

insert into Used_magic(id, date, criminals_id, magic_id) values
    (1, '2017-03-14', 1, 1),
    (2, '2017-04-15', 1, 2),
    (3, '2017-10-15', 1, 7);

insert into Orden(id, name, description) values
    (1, 'Wather crow', 'jds;lfkajsaljdfla'),
    (2, 'Hidden grass', 'lkj;weiurqui');

-- insert into Orden_member(id, creature_id, orden_id, orden_rank) values
    -- (1, 1, 1, 'orden_woman'); -- not ok
insert into Orden_member(id, creature_id, orden_id, orden_rank) values
    (2, 1, 1, 'novice');

-- insert into Orden_member(id, creature_id, orden_id, orden_rank) values
    -- (3, 4, 2, 'novice');-- not ok

insert into Orden_member(id, creature_id, orden_id, orden_rank) values
    (4, 4, 2, 'orden_woman'); -- ok

insert into Permissions values
    (1, 'Detective');

insert into Customer values
    (1, 'mike', 'kkgahsdfkj234dsas;', 1);

insert into Dosseir values
    (1, 1, '2020-04-16', 1);

insert into Victims values
    (3, 1);

insert into Take_part values
    (1, 1, 1);

insert into Allowance values
    (1, 'murder', 15, 1),
    (2, 'highjaking', 30, 2);