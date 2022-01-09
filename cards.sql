create database najjarmtg;

use najjarmtg;

create table card (
	id varchar(50) not null,
	name varchar(255),
	setId varchar(50),
	setReleaseDate varchar(50),
	setName varchar(250),
	setIcon varchar(255),
	imageUrl varchar(255),
	priceUsd varchar(50),
	priceEur varchar(50),
	urlTcg varchar(255),
	urlCm varchar(255),
	urlCh varchar(255),
	have tinyint(1) default 0,
	primary key (id)
);

drop table card;

select * from card;
select count(*) from card;