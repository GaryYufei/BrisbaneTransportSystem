
-- gtfs reference: https://developers.google.com/transit/gtfs/reference
-- code reference: http://www.mysqltutorial.org/import-csv-file-mysql-table
-- usage: should change .csv or .txt files' address below to yours location when you try to load your data
-- date: 30/11/2014

-- initial database
drop database IF EXISTS SEQ_GTFS_DATA;
create database IF NOT EXISTS SEQ_GTFS_DATA;

-- use SEQ_GTFS_DATA database as current database
USE SEQ_GTFS_DATA;

-- initial tables
drop table IF EXISTS calendar_dates,calendar,routes,stops,trips,shapes,stop_times;

-- create calendar_dates table into SEQ_GTFS_DATA database
create table calendar_dates (
    service_id VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    exception_type INT NOT NULL
);

-- create calendar table into SEQ_GTFS_DATA database
create table calendar (
    service_id VARCHAR(50) NOT NULL,
    monday boolean not null default 0,
    tuesday boolean not null default 0,
    wednesday boolean not null default 0,
    thursday boolean not null default 0,
    friday boolean not null default 0,
    saturday boolean not null default 0,
    sunday boolean not null default 0,
    start_date DATE NOT NULL,
    end_date VARCHAR(10) NOT NULL
);

-- create routes table into SEQ_GTFS_DATA database
create table routes (
    route_id VARCHAR(20) NOT NULL,
    route_short_name VARCHAR(50) NOT NULL,
    route_long_name VARCHAR(50) NOT NULL,
    route_desc VARCHAR(150),
    route_type INT NOT NULL,
    route_url VARCHAR(150)
);

-- create stops table into SEQ_GTFS_DATA database
create table stops (
    stop_id VARCHAR(20) NOT NULL,
    stop_code VARCHAR(10),
    stop_name VARCHAR(50),
    stop_desc VARCHAR(150),
    stop_lat DECIMAL(11 , 6 ) NULL,
    stop_lon DECIMAL(11 , 6 ) NULL,
    zone_id VARCHAR(15) NULL,
    stop_url VARCHAR(150) NULL,
    location_type INT NULL,
    parent_station VARCHAR(15) NULL
);

-- create trips table into SEQ_GTFS_DATA database
create table trips (
    route_id VARCHAR(15) NOT NULL,
    service_id VARCHAR(50) NOT NULL,
    trip_id VARCHAR(50) NOT NULL,
    trip_headsign VARCHAR(50) NOT NULL,
    direction_id VARCHAR(15) NOT NULL,
    block_id VARCHAR(20) NOT NULL,
    shape_id VARCHAR(20) NOT NULL
);

-- create shapes table into SEQ_GTFS_DATA database
create table shapes (
    shape_id VARCHAR(20) NOT NULL,
    shape_pt_lat DECIMAL(11 , 6 ) NULL,
    shape_pt_lon DECIMAL(11 , 6 ) NULL,
    shape_pt_sequence VARCHAR(20) NOT NULL
);

-- create stop_times table into SEQ_GTFS_DATA database
create table stop_times (
    trip_id VARCHAR(50) NOT NULL,
    arrival_time time NULL,
    departure_time time NULL,
    stop_id VARCHAR(20) NOT NULL,
    stop_sequence VARCHAR(20) NOT NULL,
    pickup_type VARCHAR(20) NOT NULL,
    drop_off_type VARCHAR(20) NOT NULL
);

-- load calendar_dates.txt data into calendar_dates table
LOAD DATA INFILE '/Users/Shared/WebAPP/Dropbox/UQ_Summer_Research/SEQ_Dec_2013/calendar_dates.txt'
INTO TABLE calendar_dates
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

-- load calendar.txt data into calendar table
LOAD DATA INFILE '/Users/Shared/WebAPP/Dropbox/UQ_Summer_Research/SEQ_Dec_2013/calendar.txt'
INTO TABLE calendar
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

-- load routes.txt data into routes table
LOAD DATA INFILE '/Users/Shared/WebAPP/Dropbox/UQ_Summer_Research/SEQ_Dec_2013/routes.txt'
INTO TABLE routes
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

-- load stops.txt data into stops table
LOAD DATA INFILE '/Users/Shared/WebAPP/Dropbox/UQ_Summer_Research/SEQ_Dec_2013/stops.txt'
INTO TABLE stops
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

-- load trips.txt data into trips table
LOAD DATA INFILE '/Users/Shared/WebAPP/Dropbox/UQ_Summer_Research/SEQ_Dec_2013/trips.txt'
INTO TABLE trips
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

-- load shapes.txt data into shapes table
LOAD DATA INFILE '/Users/Shared/WebAPP/Dropbox/UQ_Summer_Research/SEQ_Dec_2013/shapes.txt'
INTO TABLE shapes
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

-- load stop_times.txt data into stop_times table
LOAD DATA INFILE '/Users/Shared/WebAPP/Dropbox/UQ_Summer_Research/SEQ_Dec_2013/stop_times.txt'
INTO TABLE stop_times
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;
