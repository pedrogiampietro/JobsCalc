const express = require('express');
const routes = express.Router();

const views = `${__dirname}/views/`;

const profile = {
  name: 'Pedro Giampietro',
  avatar: 'https://github.com/pedrogiampietro.png',
  'monthly-budget': 5400,
  'days-per-week': 5,
  'hours-per-day': 5,
  'vacation-per-year': 4,
  'value-hour': 75,
};

const jobs = [
  {
    id: 1,
    name: 'Pizzaria Guloso',
    'daily-hours': 2,
    'total-hours': 1,
    created_at: Date.now(),
  },
  {
    id: 2,
    name: 'OneTwo Project',
    'daily-hours': 3,
    'total-hours': 47,
    created_at: Date.now(),
  },
];

function remainingDays(job) {
  const remaining = (job['total-hours'] / job['daily-hours']).toFixed();

  const createdDate = new Date(job.created_at);
  const dueDay = createdDate.getDate() + Number(remaining);
  const dueDateInMs = createdDate.setDate(dueDay);

  const timeDiffInMs = dueDateInMs - Date.now();

  // transformar milliseconds em dias
  const dayInMs = 24 * 60 * 60 * 1000;
  const differenceInDays = Math.floor(timeDiffInMs / dayInMs);

  return differenceInDays;
}

routes.get('/', (request, response) => {
  const updatedJobs = jobs.map((job) => {
    const remaining = remainingDays(job);
    const status = remaining <= 0 ? 'done' : 'progress';

    return {
      ...job,
      remaining,
      status,
      budget: profile['value-hour'] * job['total-hours'],
    };
  });

  return response.render(`${views}index`, { jobs: updatedJobs });
});

routes.get('/job', (req, res) => res.render(`${views}job`));

routes.post('/job', (req, res) => {
  const lastId = jobs[jobs.length - 1]?.id || 1;

  jobs.push({
    id: lastId + 1,
    name: req.body.name,
    'daily-hours': req.body['daily-hours'],
    'total-hours': req.body['total-hours'],
    created_at: Date.now(),
  });
  return res.redirect('/');
});

routes.get('/job/edit', (req, res) => res.render(`${views}job-edit`));

routes.get('/profile', (req, res) => res.render(`${views}profile`, { profile }));

module.exports = routes;
