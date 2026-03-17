function createForm() {
  const form = FormApp.create(
    'Help Improve Diabetes Care: Explore a Potential New Treatment!'
  );

  form.setDescription(
    'Please be aware that you will need to answer the questionnaire ' +
    'in its entirety to understand your eligibility for this study. ' +
    'Thank you for your patience.'
  );

  form.setPublishingSummary(false);
  form.setShowLinkToRespondAgain(false);

  form.addTextItem().setTitle('First Name').setRequired(true);
  form.addTextItem().setTitle('Last Name').setRequired(true);
  form.addTextItem().setTitle('Email Address').setRequired(true);

  form.addPageBreakItem().setTitle('Study Questions');

  const q1 = form.addMultipleChoiceItem();
  q1.setTitle('Have you been diagnosed with type 2 diabetes mellitus?')
    .setChoices([
      q1.createChoice('Yes'),
      q1.createChoice('No'),
      q1.createChoice('Unsure')
    ])
    .setRequired(true);

  const q2 = form.addMultipleChoiceItem();
  q2.setTitle('Are you travelling out of state within the next 3 months?')
    .setRequired(true);

  const followUpPage = form.addPageBreakItem().setTitle('Follow-up');

  const q3 = form.addMultipleChoiceItem();
  q3.setTitle('Can you postpone any out-of-state trips after enrollment?')
    .setChoices([
      q3.createChoice('Yes'),
      q3.createChoice('No'),
      q3.createChoice('Unsure')
    ])
    .setRequired(true);

  q2.setChoices([
    q2.createChoice('Yes', followUpPage),
    q2.createChoice('Unsure', followUpPage),
    q2.createChoice('No', FormApp.PageNavigationType.SUBMIT)
  ]);

  Logger.log('Edit URL:      ' + form.getEditUrl());
  Logger.log('Published URL: ' + form.getPublishedUrl());
}
