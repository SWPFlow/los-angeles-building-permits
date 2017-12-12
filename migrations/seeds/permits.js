import { getLastPermitIssued, getPermits, insertPermit } from '../src';
import format from 'date-fns/format'
import addDays from 'date-fns/add_days';

const url = 'https://data.lacity.org/resource/nbyu-2ha9.json';

exports.seed = function(knex, Promise) {
  return getLastPermitIssued(knex)
    .then(lastLoad => {
      if (!lastLoad) return lastLoad;

      const newDate = format(addDays(lastLoad, 1), 'YYYY-MM-DD');
      return `issue_date > '${newDate}'`
    })
    .then(where => {
      const request = getPermits(url, {where});
      return request(insertPermit(knex));
    });
};
