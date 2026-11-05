/**
 * Salon Tracker: Quick Add form
 *
 * Builds a Google Form for logging clients and sends every submission
 * into the "Client Log" tab of this spreadsheet.
 *
 * Worker names come from the Staff tab (anyone whose Active column is not "No").
 * After adding or removing staff, use the menu: Salon Tracker > Update worker names in the form.
 */

// Edit these lists if the styles or barbershop services change.
var SALON_SERVICES = ['Hair', 'Nails', 'Makeup', 'Product'];
var SALON_STYLES = [
  'Knotless braids', 'Box braids', 'Cornrows', 'Twists', 'Passion twists',
  'Faux locs', 'Wig install', 'Weave', 'Crochet', 'Wash and blow-dry',
  'Relaxer', 'Treatment'
];
var BARBERSHOP_SERVICES = ['Haircut', 'Trim', 'Beard', 'Haircut and beard', 'Kids cut', 'Other'];

var LOG_SHEET = 'Client Log';
var STAFF_SHEET = 'Staff';
var NO_HELPER = 'No helper';

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Salon Tracker')
    .addItem('Create the Quick Add form (run once)', 'setupForm')
    .addItem('Update worker names in the form', 'updateWorkers')
    .addItem('Show the form links', 'showLinks')
    .addToUi();
}

function getWorkers_(ss) {
  var sheet = ss.getSheetByName(STAFF_SHEET);
  var rows = sheet.getRange(2, 1, 40, 4).getValues();
  var names = [];
  rows.forEach(function (r) {
    var name = String(r[0]).trim();
    var active = String(r[3]).trim();
    if (name && active !== 'No') names.push(name);
  });
  return names;
}

function setupForm() {
  var ss = SpreadsheetApp.getActive();
  var ui = SpreadsheetApp.getUi();
  var props = PropertiesService.getScriptProperties();

  var workers = getWorkers_(ss);
  if (workers.length === 0) {
    ui.alert('Add at least one worker on the Staff tab first, then run this again.');
    return;
  }

  var existing = props.getProperty('FORM_ID');
  if (existing) {
    var answer = ui.alert(
      'A form already exists',
      'A Quick Add form was already created. Making another one will leave the old one running as well. Create a new one anyway?',
      ui.ButtonSet.YES_NO
    );
    if (answer !== ui.Button.YES) return;
  }

  var form = FormApp.create('Salon Tracker: New client');
  form.setDescription('One form for every client. Pick Salon or Barbershop first.');
  form.setConfirmationMessage('Saved. You can add the next client.');
  form.setShowLinkToRespondAgain(true);
  form.setAllowResponseEdits(false);
  form.setCollectEmail(false);

  // Page 1: location
  var location = form.addMultipleChoiceItem().setTitle('Salon or Barbershop?').setRequired(true);

  // Page 2: salon
  var salonPage = form.addPageBreakItem().setTitle('Salon details');
  form.addMultipleChoiceItem().setTitle('Service').setChoiceValues(SALON_SERVICES).setRequired(true);
  form.addCheckboxItem()
    .setTitle('Styles (tick all that apply)')
    .setChoiceValues(SALON_STYLES)
    .showOtherOption(true);
  form.addTextItem().setTitle('Product sold (only if a product was bought)');

  // Page 3: barbershop
  var barberPage = form.addPageBreakItem().setTitle('Barbershop details');
  form.addMultipleChoiceItem()
    .setTitle('Barbershop service')
    .setChoiceValues(BARBERSHOP_SERVICES)
    .setRequired(true);

  // Page 4: everyone
  var commonPage = form.addPageBreakItem().setTitle('Who did the work, and how much');
  form.addMultipleChoiceItem().setTitle('Visit type').setChoiceValues(['Walk-in', 'Appointment']).setRequired(true);
  form.addListItem().setTitle('Worker').setChoiceValues(workers).setRequired(true);
  form.addListItem().setTitle('Helper').setChoiceValues([NO_HELPER].concat(workers)).setRequired(true);

  var priceCheck = FormApp.createTextValidation()
    .setHelpText('Type the amount in rands, numbers only.')
    .requireNumberGreaterThanOrEqualTo(0)
    .build();
  form.addTextItem().setTitle('Price (R)').setValidation(priceCheck).setRequired(true);

  form.addTextItem().setTitle('Client name').setRequired(true);
  form.addTextItem().setTitle('Phone number');
  form.addTextItem().setTitle('Email');
  form.addParagraphTextItem().setTitle('Notes');

  // Route each choice to the right page. Salon skips the barbershop page.
  location.setChoices([
    location.createChoice('Salon', salonPage),
    location.createChoice('Barbershop', barberPage)
  ]);
  salonPage.setGoToPage(commonPage);

  props.setProperty('FORM_ID', form.getId());
  props.setProperty('SS_ID', ss.getId());

  ScriptApp.newTrigger('onFormSubmit_').forForm(form).onFormSubmit().create();

  ui.alert(
    'Form created',
    'Share this link with the receptionist and add it to her phone home screen:\n\n' +
      form.getPublishedUrl() +
      '\n\n(You can find it again under Salon Tracker > Show the form links.)',
    ui.ButtonSet.OK
  );
}

function onFormSubmit_(e) {
  var ss = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SS_ID'));
  var sheet = ss.getSheetByName(LOG_SHEET);

  var answers = {};
  e.response.getItemResponses().forEach(function (item) {
    var value = item.getResponse();
    answers[item.getItem().getTitle()] = Array.isArray(value) ? value.join(', ') : value;
  });

  var location = answers['Salon or Barbershop?'] || '';
  var isBarbershop = location === 'Barbershop';
  var helper = answers['Helper'] === NO_HELPER ? '' : (answers['Helper'] || '');

  var row = [
    e.response.getTimestamp(),
    location,
    isBarbershop ? 'Barbershop service' : (answers['Service'] || ''),
    answers['Styles (tick all that apply)'] || '',
    isBarbershop ? (answers['Barbershop service'] || '') : '',
    answers['Product sold (only if a product was bought)'] || '',
    answers['Visit type'] || '',
    answers['Worker'] || '',
    helper,
    Number(answers['Price (R)']),
    answers['Client name'] || '',
    answers['Phone number'] || '',
    answers['Email'] || '',
    answers['Notes'] || ''
  ];

  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var colA = sheet.getRange(1, 1, sheet.getMaxRows(), 1).getValues();
    var lastRow = 1;
    for (var i = colA.length - 1; i >= 0; i--) {
      if (colA[i][0] !== '') { lastRow = i + 1; break; }
    }
    sheet.getRange(lastRow + 1, 1, 1, row.length).setValues([row]);
  } finally {
    lock.releaseLock();
  }
}

function updateWorkers() {
  var ss = SpreadsheetApp.getActive();
  var ui = SpreadsheetApp.getUi();
  var formId = PropertiesService.getScriptProperties().getProperty('FORM_ID');
  if (!formId) {
    ui.alert('There is no form yet. Run Salon Tracker > Create the Quick Add form first.');
    return;
  }
  var workers = getWorkers_(ss);
  var form = FormApp.openById(formId);
  form.getItems(FormApp.ItemType.LIST).forEach(function (item) {
    var title = item.getTitle();
    if (title === 'Worker') {
      item.asListItem().setChoiceValues(workers);
    } else if (title === 'Helper') {
      item.asListItem().setChoiceValues([NO_HELPER].concat(workers));
    }
  });
  ui.alert('Done. The form now lists ' + workers.length + ' workers.');
}

function showLinks() {
  var formId = PropertiesService.getScriptProperties().getProperty('FORM_ID');
  if (!formId) {
    SpreadsheetApp.getUi().alert('There is no form yet. Run Salon Tracker > Create the Quick Add form first.');
    return;
  }
  var form = FormApp.openById(formId);
  SpreadsheetApp.getUi().alert(
    'Form links',
    'Fill in the form (give this to the receptionist):\n' + form.getPublishedUrl() +
      '\n\nEdit the form (owner only):\n' + form.getEditUrl(),
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}
