const Profile = require('../model/Profile');

module.exports = {
  index(req, res) {
    return res.render('profile', { profile: Profile.get() });
  },

  update(req, res) {
    // dados vindo do front-end;
    const data = req.body;

    // definir quantas semanas tem um ano: 52;
    const weeksPerYear = 52;

    //remover as semanas de férias do ano, para pegar quantas semanas tem em 1 mês;
    const weeeksPerMonth = (weeksPerYear - data['vacation-per-year']) / 12;

    // total de horas trabalhadas na semana;
    const weekTotalHours = data['hours-per-day'] * data['days-per-week'];

    //horas trabalhadas no mês
    const monthlyTotalHours = weekTotalHours * weeeksPerMonth;

    // qual será o valor da minha hora?
    const valueHour = data['monthly-budget'] / monthlyTotalHours;

    Profile.update({
      ...Profile.get(),
      ...req.body,
      'value-hour': valueHour,
    });

    return res.redirect('/profile');
  },
};
