create or replace view permit_summary as (
  with bounds as (
    select
      st_x(st_centroid(st_collect(geom)))::text ||
      ',' ||
      st_y(st_centroid(st_collect(geom)))::text as centroid,
      st_xmin(st_collect(st_transform(geom, 4326)))::text as xmin,
      st_ymin(st_collect(st_transform(geom, 4326)))::text as ymin,
      st_xmax(st_collect(st_transform(geom, 4326)))::text as xmax,
      st_ymax(st_collect(st_transform(geom, 4326)))::text as ymax
    from
      permits
  )
  select
    centroid,
    xmin || ',' || ymin || ',' || xmax || ',' || ymax  as bounds
  from
    bounds
);