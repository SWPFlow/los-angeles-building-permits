require('babel-register');

import needle from 'needle';
import { format } from 'date-fns';

export const buildUrlQuery = (url, queries) => {
  const qs = Object.keys(queries)
    .map(q => queries[q] ? `$${q}=${queries[q]}` : ``)
    .filter(v => v !== ``)
    .join('&');

    if (!qs) return url;

    return `${url}?${qs}`;
}

export const getPermits = (url, {...queries, limit=10000, offset=0}, page=null) => modifier => {
  const urlQuery= buildUrlQuery(url, {...queries, limit, offset});

  return needle('get', urlQuery)
    .then(res => {
      if (res.statusCode !== 200) throw `
        Request Failuer: Status Code: ${res.statusCode} - ${JSON.stringify(res.body, null, 2)}
      `;
      return res.body
    })
    .then(data => {
      const mapped = data.map(modifier);

      return Promise.all(mapped);
    })
    .then(data => {
      if (data.length === 0 || page) {
        return 'done'
      }

      return getPermits(url, {...queries, limit, offset: offset+data.length})(modifier);
    });
}

const filtered = (data, keys) => {
  return Object.keys(data)
    .filter(key => keys.includes(key))
    .reduce((obj, key) => {
      obj[key] = data[key];
      return obj;
    }, {});
}

export const formatPermit = json => {
  const columns = [
    'status_date','issue_date','license_expiration_date',
    'census_tract','tract','zip_code','zone','lot','assessor_parcel',
    'street_suffix','street_name','address_start','address_end',
    'latest_status','pcis_permit','initiating_office','permit_category',
    'permit_type','permit_sub_type','license','license_type',
    'principal_first_name','principal_last_name','applicant_first_name',
    'applicant_last_name','applicant_address_1','contractors_business_name',
    'contractor_address','contractor_city','contractor_state'
  ];

  const {location_1, ...attrs} = json;
  const attributes = filtered(attrs, columns);

  if (!location_1) return attributes;

  const { latitude, longitude } = location_1;

  return {
    ...attributes,
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude)
  }
}

export const getLastPermitIssued = (knex) => {
  return knex('permit_loads')
    .select('issue_date')
    .orderBy('issue_date', 'desc')
    .limit(1)
    .then(res => {
      if (res.length === 0) {
        return null;
      }

      return format(new Date(res[0].issue_date), `YYYY-MM-DD`);
    });
}

export const insertPermit = (knex) => (data) => {
  const permit = formatPermit(data);
  return knex('permits')
    .insert(permit);
}