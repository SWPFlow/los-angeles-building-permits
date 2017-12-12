create table permits (
	id uuid primary key default uuid_generate_v4(),
	status_date date,
	issue_date date,
	license_expiration_date date,
	census_tract text,
	tract text,
	zip_code varchar(5),
	zone text,
	lot text,
	assessor_parcel text,
	street_suffix text,
	street_name text,
	address_start text,
	address_end text,
	latest_status text,
	pcis_permit text,
	initiating_office text,
	permit_category text,
	permit_type text,
	permit_sub_type text,
	license text,
	license_type text,
	principal_first_name text,
	principal_last_name text,
	applicant_first_name text,
	applicant_last_name text,
	applicant_address_1 text,
	contractors_business_name text,
	contractor_address text,
	contractor_city text,
	contractor_state text,
	longitude double precision,
	latitude double precision,
	geom geometry(point, 3857)
);

create index permits_id_idx on permits (id);
create index permits_status_date_idx on permits (status_date);
create index permits_issue_date_idx on permits (issue_date);
create index permits_census_tract_idx on permits (census_tract);
create index permits_permit_type_idx on permits (permit_type);
create index permits_geom_idx on permits using gist(geom);

create or replace function transform_permits_geom() returns trigger as $permits_geom$
	begin
		if (NEW.latitude is not null and NEW.longitude is not null) then
			NEW.geom := st_transform(st_setsrid(st_makepoint(NEW.longitude, NEW.latitude), 4326), 3857);
			return NEW;
		end if;
		return null;
	end;
$permits_geom$ language plpgsql;

create trigger permits_geom
	before insert or update on permits
	for each row execute procedure transform_permits_geom();