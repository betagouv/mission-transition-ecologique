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
    unique_visitors INTEGER,
    detail_page_unique_visitors INTEGER
);

-- Table web_registered_siret
CREATE TABLE IF NOT EXISTS __SCHEMA_NAME__.web_registered_siret (
    date TIMESTAMPTZ PRIMARY KEY,
    siret TEXT
);

CREATE TABLE IF NOT EXISTS __SCHEMA_NAME__.siret_search_error (
    siret TEXT PRIMARY KEY,
    fail_count INT
);

-- Ensuring there are no duplicates entry in web_registered_siret--
ALTER TABLE __SCHEMA_NAME__.web_registered_siret
ADD CONSTRAINT unique_date_siret UNIQUE (date, siret);

CREATE TABLE IF NOT EXISTS __SCHEMA_NAME__.external_link_clicked_events (
    siret text,
    hybrid_company_id text,
    custom_company_id text,
    date TIMESTAMP,
    type text,
    title text,
    current_url text,
    link text,
    event_id UUID PRIMARY KEY,
    web_user_id UUID
);

CREATE TABLE IF NOT EXISTS __SCHEMA_NAME__.detail_page_view (
    siret text,
    hybrid_company_id text,
    custom_company_id text,
    date TIMESTAMP,
    type text,
    title text,
    current_url text,
    event_id UUID PRIMARY KEY,
    web_user_id UUID
);

CREATE TABLE IF NOT EXISTS __SCHEMA_NAME__.projects (
    id INT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    sector_eligibility TEXT,
    related_programs TEXT,
    themes TEXT
);

CREATE TABLE IF NOT EXISTS __SCHEMA_NAME__.programs (
    id INT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    themes TEXT NOT NULL,
    aid_type TEXT NOT NULL,
    contact_operator TEXT,
    other_operators TEXT,
    linked_projects TEXT,
    sector_eligibility TEXT,
    geography_eligibility TEXT,
    min_employee INT,
    max_employee INT
);
