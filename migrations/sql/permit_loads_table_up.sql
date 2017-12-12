create table permit_loads (
    id uuid default uuid_generate_v4(),
    issue_date date primary key,
    created_at timestamp default now(),
    updated_at timestamp default now()
);

create index permit_loads_id_idx on permits (id);
create index permit_loads_issue_date_idx on permits (issue_date);

create or replace function update_permit_loads() returns trigger as $update_permit_loads$
    begin
        insert into
            permit_loads (issue_date)
        values (new.issue_date)
        on conflict (issue_date) do update
            set updated_at = now();
        return null;
    end;
$update_permit_loads$ language plpgsql;

create trigger update_permit_loads
    after insert or update on permits
    for each row execute procedure update_permit_loads();