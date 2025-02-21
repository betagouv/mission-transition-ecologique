-- Create schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS __SCHEMA_NAME__;

-- Table opportunities
CREATE TABLE IF NOT EXISTS __SCHEMA_NAME__.opportunities (
    brevo_id TEXT PRIMARY KEY,
    opportunity_date TIMESTAMP NOT NULL,
    company_siret TEXT,
    status TEXT,
    opportunity_type TEXT,
    opportunity_title TEXT,
    status_detail_transmise TEXT,
    status_detail_aide_proposee TEXT,
    status_detail_gagnee TEXT,
    status_detail_perdue TEXT,
    campaign TEXT,
    partner_id_ce INTEGER,
    partner_id_opale INTEGER,
    partner_match_quality_opale TEXT,
    opportunity_operator TEXT
);

-- Table companies
CREATE TABLE IF NOT EXISTS __SCHEMA_NAME__.companies (
    siret TEXT PRIMARY KEY,
    naf_section TEXT,
    naf_division TEXT,
    naf_group TEXT,
    naf_class TEXT,
    naf_code TEXT,
    city_code TEXT,
    department TEXT,
    region TEXT,
    workforce_category TEXT,
    workforce_min INTEGER,
    workforce_max INTEGER
);

-- Table daily_web_stats
CREATE TABLE IF NOT EXISTS __SCHEMA_NAME__.daily_web_stats (
    stat_date DATE PRIMARY KEY,
    unique_visitors INTEGER
);

-- Table web_registered_siret
CREATE TABLE IF NOT EXISTS __SCHEMA_NAME__.web_registered_siret (
    date TIMESTAMPTZ PRIMARY KEY,
    siret TEXT
);

-- Ensuring there are no duplicates entry in web_registered_siret--
ALTER TABLE __SCHEMA_NAME__.web_registered_siret
ADD CONSTRAINT unique_date_siret UNIQUE (date, siret);
