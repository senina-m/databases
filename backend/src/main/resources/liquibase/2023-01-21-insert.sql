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

insert into Creature (name, birthday, race, sex) values ('Луукфи Пенц', '01.01.2000', 'Человек', 'man');
insert into Customer (name, password, permissions_id) values ('luukfi_pentz', '$2a$10$tiFFr8TNFQUmR5ol6Fup.ey.8uPsDSAtFGpSYprNMTUSc4/DBG2hG', get_permission_id('ROLE_WRITER'));
insert into Customer_creature (customer_id, creature_id) values (get_customer_id('luukfi_pentz'), get_creature_id('Луукфи Пенц'));
