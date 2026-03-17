// Run after linking the Google Form to a Sheet via the Responses tab.
//
// Column layout (set by Google Forms):
//   A: Timestamp  B: First Name  C: Last Name  D: Email
//   E: Q1 (Diabetes)  F: Q2 (Travelling)  G: Q3 (Postpone)  H: Status

function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const responses = ss.getSheetByName('Form Responses 1');

  if (!responses) {
    throw new Error("Sheet 'Form Responses 1' not found. Link the form first.");
  }

  addStatusColumn_(responses);
  applyConditionalFormatting_(responses);
  createPrescreeningReport_(ss);

  Logger.log('Setup complete.');
}

function addStatusColumn_(sheet) {
  sheet.getRange('H1').setValue('Status').setFontWeight('bold');

  // Pass: Q1 is Yes/Unsure AND (Q2 is No OR (Q2 is Yes/Unsure AND Q3 is Yes/Unsure))
  const formula =
    '=IF(A2="","",IF(OR(E2="Yes",E2="Unsure"),IF(F2="No","Passed",' +
    'IF(OR(G2="Yes",G2="Unsure"),"Passed","Failed")),"Failed"))';

  sheet.getRange('H2').setFormula(formula);
}

function applyConditionalFormatting_(sheet) {
  const rules = sheet.getConditionalFormatRules();

  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$H2="Failed"')
      .setBackground('#f4cccc')
      .setRanges([sheet.getRange('A2:H')])
      .build()
  );

  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('No')
      .setBackground('#ea9999')
      .setRanges([sheet.getRange('E2:E')])
      .build()
  );

  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('No')
      .setBackground('#ea9999')
      .setRanges([sheet.getRange('G2:G')])
      .build()
  );

  sheet.setConditionalFormatRules(rules);
}

function createPrescreeningReport_(ss) {
  let report = ss.getSheetByName('Prescreening Report');
  if (report) ss.deleteSheet(report);
  report = ss.insertSheet('Prescreening Report');

  report.getRange('A1').setValue('Online Prescreening Report').setFontSize(16).setFontWeight('bold');

  report.getRange('A3:C3').setValues([['Prescreening Breakdown', 'Number', 'Percentage']]).setFontWeight('bold');
  report.getRange('A4').setValue('Total Prescreened');
  report.getRange('B4').setFormula("=COUNTA('Form Responses 1'!A2:A)");
  report.getRange('C4').setFormula('=IF(B4>0,1,0)');
  report.getRange('A5').setValue('Failed Prescreening');
  report.getRange('B5').setFormula('=COUNTIF(\'Form Responses 1\'!H2:H,"Failed")');
  report.getRange('C5').setFormula('=IF(B4>0,B5/B4,0)');
  report.getRange('A6').setValue('Passed Prescreening');
  report.getRange('B6').setFormula('=COUNTIF(\'Form Responses 1\'!H2:H,"Passed")');
  report.getRange('C6').setFormula('=IF(B4>0,B6/B4,0)');
  report.getRange('C4:C6').setNumberFormat('0%');

  report.getRange('A8:C8').setValues([['Failed Online Prescreening Reasons', 'Number', 'Percentage']]).setFontWeight('bold');
  report.getRange('A9').setValue('Not diagnosed with type 2 diabetes');
  report.getRange('B9').setFormula('=COUNTIF(\'Form Responses 1\'!E2:E,"No")');
  report.getRange('C9').setFormula('=IF(B4>0,B9/B4,0)');
  report.getRange('A10').setValue('Cannot postpone out-of-state trips');
  report.getRange('B10').setFormula('=COUNTIF(\'Form Responses 1\'!G2:G,"No")');
  report.getRange('C10').setFormula('=IF(B4>0,B10/B4,0)');
  report.getRange('C9:C10').setNumberFormat('0%');

  report.autoResizeColumns(1, 3);

  report.insertChart(
    report.newChart()
      .setChartType(Charts.ChartType.BAR)
      .addRange(report.getRange('A4:B6'))
      .setPosition(1, 5, 0, 0)
      .setOption('title', 'Online Prescreening')
      .setOption('width', 450)
      .setOption('height', 220)
      .setOption('legend', { position: 'none' })
      .build()
  );

  report.insertChart(
    report.newChart()
      .setChartType(Charts.ChartType.COLUMN)
      .addRange(report.getRange('A9:B10'))
      .setPosition(14, 5, 0, 0)
      .setOption('title', 'Reasons for Failing Online Prescreening')
      .setOption('width', 450)
      .setOption('height', 300)
      .setOption('legend', { position: 'none' })
      .setOption('vAxis', { title: 'Number' })
      .build()
  );
}
