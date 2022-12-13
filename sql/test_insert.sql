insert into Color (id, value) values
    (1, 'black'),
    (2, 'white');

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
    (1, 1, 2, 10, 3, true), 
    -- black magic make a dragon a mause level=22, damage=3 allowed ==> ok
    (2, 2, 1, 22, 3, true);

insert into Obvious_magic(id, magic_id, color_id, level, damage, is_allowed) values
    -- white magic be invisible level=11, damage=3 allowed ==> not ok (unallowed level)
    (3, 3, 2, 11, 3, true);

insert into Obvious_magic(id, magic_id, color_id, level, damage, is_allowed) values
    -- black magic call for coffe level=23, damage=3 allowed ==> not ok (unallowed level)
    (4, 6, 1, 23, 3, true);

insert into Obvious_magic(id, magic_id, color_id, level, damage, is_allowed) values
    -- white magic be invisible level=11, damage=3 NOTallowed ==> ok
    (5, 7, 2, 11, 3, false),
    -- black magic call for coffe level=23, damage=3 NOTallowed ==> ok
    (6, 4, 1, 23, 3, false);
    

insert into True_magic(id, magic_id) values
    (1, 1); -- not ok (such spell exist in obvious magic)
insert into True_magic(id, magic_id) values
    (2, 5); -- ok

insert into Obvious_magic(id, magic_id, color_id, level, damage, is_allowed) values
    -- black magic make kamra level=23, damage=3 NOTallowed ==> not ok (such spell exist in true magic)
    (7, 5, 1, 23, 3, false);