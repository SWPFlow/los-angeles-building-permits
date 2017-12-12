import { expect } from 'chai';
import {
  buildUrlQuery,
  formatPermit,
  getLastPermitIssued,
  getPermits,
  insertPermit } from '../src';
import knex from 'knex';
import permits from '../fixtures/permits';
import config from '../knexfile.js';

const url = 'https://data.lacity.org/resource/nbyu-2ha9.json';
const pg = knex(config.development);
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

describe('Building Permits', () => {

  after(() => {
    return pg('permits')
      .select(pg.raw('count(*)'))
      .then(a => {
        return pg('permits')
          .del()
          .whereNotNull('id')
          .then(() => {
            return pg('permit_loads')
              .del()
              .whereNotNull('id');
          })
          .then(() => {
            return pg.destroy();
          })
          .catch((err) => {
            console.log(err);
            return pg.destroy();
          });
      });
  });

  afterEach(() => {
    return pg('permits')
      .del()
      .whereNotNull('id')
      .then(() => {
        return pg('permit_loads')
          .del()
          .whereNotNull('id');
      });
  });

  it('should return a just url with null query', () => {
    const querystring = buildUrlQuery(url, {where: null});
    return expect(querystring).to.equal(url);
  });

  it('should return a just url with only non null query keys', () => {
    const expected = `${url}?$limit=100`;
    const querystring = buildUrlQuery(url, {where: null, limit: 100});
    return expect(querystring).to.equal(expected);
  });


  it('should return a request and automatically page through results', () => {
    const req = getPermits(url, {
      where: `issue_date > '2017-11-01'`,
      limit: 10
    }, true);

    return req(rec => {
      expect(rec).to.be.an('object');
    });
  });

  it('should format permits request records for db insert', () => {
    return permits.map(data => {
      const permit = formatPermit(data);
      expect(permit).to.be.an('object');
      expect(permit).to.include.any.keys(columns);

      if (permit.geom_4326) {
        expect(typeof(permit.geom_4326)).to.equal('object');
        expect(permit.latitude).to.be.an('number');
        expect(permit.longitude).to.be.an('number');
      }
    });
  });

  it('should insert db records', () => {
    const request = getPermits(url, {
      where: `issue_date > '2017-11-01' and issue_date <= '2017-11-05'`
    });

    return request(insertPermit(pg))
      .then(() => {
        return
      })
      .then(() => {
        return pg('permit_loads')
          .select('*')
          .orderBy('issue_date', 'desc')
          .then(a => {
            expect(a.length).to.equal(4);
          });
      })
  });

  it('should insert db records while paging', () => {
    const request = getPermits(url, {
      where: `issue_date > '2017-11-01' and issue_date <= '2017-11-05'`,
      limit: 100,
    });

    return request(insertPermit(pg))
      .then(() => {
        return pg('permits')
          .count('*')
          .then(a => {
            expect(a[0]).to.be.an('object');
            expect(parseInt(a[0].count)).to.be.above(598);
          });
      })
      .then(() => {
        return pg('permit_loads')
          .select('*')
          .orderBy('issue_date', 'desc')
          .then(a => {
            expect(a.length).to.equal(4);
          });
      });
  });

  it('should get the last issue_date for loaded permits', () => {
    const request = getPermits(url, {
      where: `issue_date > '2017-11-01' and issue_date < '2017-11-02'`,
    });

    return request(insertPermit(pg))
      .then(() => {
        return getLastPermitIssued(pg)
      })
      .then(data => {
        expect(data).to.be.a('string');
        return expect(data).to.equal('2017-11-01')
      });
  });

  it('should get a blank issue_date for no loaded permits', () => {
    return getLastPermitIssued(pg)
      .then(data => {
        return expect(data).to.equal(null);
      });
  });
});