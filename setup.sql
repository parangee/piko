create table guilds (
    id text not null,
    antispam_role text
);
alter table guilds add column config text not null default '{}';
alter table guilds add column warns text not null default '{}';