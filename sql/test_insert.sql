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

insert into Obvious_magic(id, magic_id, color_id, level, damage, is_allowed) values
    -- white magic be invisible level=11, damage=3 allowed ==> not ok (unallowed level)
    (3, 3, 'white', 11, 3, true);

insert into Obvious_magic(id, magic_id, color_id, level, damage, is_allowed) values
    -- black magic call for coffe level=23, damage=3 allowed ==> not ok (unallowed level)
    (4, 6, 'black', 23, 3, true);

insert into Obvious_magic(id, magic_id, color_id, level, damage, is_allowed) values
    -- white magic be invisible level=11, damage=3 NOTallowed ==> ok
    (5, 7, 'white', 11, 3, false),
    -- black magic call for coffe level=23, damage=3 NOTallowed ==> ok
    (6, 4, 'black', 23, 3, false);
    

insert into True_magic(id, magic_id) values
    (1, 1); -- not ok (such spell exist in obvious magic)
insert into True_magic(id, magic_id) values
    (2, 5); -- ok

insert into Obvious_magic(id, magic_id, color_id, level, damage, is_allowed) values
    -- black magic make kamra level=23, damage=3 NOTallowed ==> not ok (such spell exist in true magic)
    (7, 5, 'black', 23, 3, false);

insert into Creature(id, name, birthday, race, death_date, sex) values
    (1, 'Max', '2017-03-14', 'human', '2022-03-14', 'male'),
    (2, 'Lonli-locli', '2015-02-11', 'human', '2022-03-14', 'male'),
    (3, 'Milifaro', '2003-03-10', 'human', '2022-03-14', 'male'),
    (4, 'Sophi', '2003-03-10', 'human', '2022-03-14', 'female');

insert into Orden(id, name, description) values
    (1, 'Wather crow', 'jds;lfkajsaljdfla'),
    (2, 'Hidden grass', 'lkj;weiurqui');

insert into Orden_member(id, creature_id, orden_id, orden_rank) values
    (1, 1, 1, 'orden_woman');
insert into Orden_member(id, creature_id, orden_id, orden_rank) values
    (2, 1, 1, 'novice');

insert into Orden_member(id, creature_id, orden_id, orden_rank) values
    (3, 4, 2, 'novice');
insert into Orden_member(id, creature_id, orden_id, orden_rank) values
    (4, 4, 2, 'orden_woman');