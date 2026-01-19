/* eslint-disable array-callback-return */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/order */
/* eslint-disable camelcase */
/* eslint-disable no-else-return */
/* eslint-disable no-nested-ternary */
/* eslint-disable eqeqeq */
/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable no-continue */
/* eslint-disable no-plusplus */

let XLSXPopulate;
try {
  XLSXPopulate = require('xlsx-populate');
} catch (error) {
  console.warn('xlsx-populate module not found, download service will be disabled.');
  XLSXPopulate = null;
}
const moment = require('moment/moment');
const { sequelize } = require('../models');
const fs = require("fs");
const ExcelJS = require("exceljs");
const path = require('path');


const filledColor = [];
const generateCellDuration = (sheet, duration, startColumn = 'AM', startRow = 17, color = '0000FF') => {
  const totalCell = Math.min(Math.max(Math.floor(duration / 10), duration > 0 ? 1 : 0), 50); // At least 1 cell if duration > 0, cap at 50 cells (500 minutes)

  const columnToIndex = (column) => {
    let sum = 0;
    for (let i = 0; i < column.length; i++) {
      sum *= 26;
      sum += column.charCodeAt(i) - 'A'.charCodeAt(0) + 1;
    }
    return sum;
  };

  const indexToColumn = (index) => {
    let column = '';
    while (index > 0) {
      const mod = (index - 1) % 26;
      column = String.fromCharCode(65 + mod) + column;
      index = Math.floor((index - 1) / 26);
    }
    return column;
  };

  const startColumnIndex = columnToIndex(startColumn);

  for (let i = 0; i < totalCell; i++) {
    const currentColumnIndex = startColumnIndex + i;
    const currentColumn = indexToColumn(currentColumnIndex);

    if (filledColor.includes(`${currentColumn}${startRow}`)) {
      continue;
    }

    sheet
      .cell(`${currentColumn}${startRow}`)
      .style({
        fill: {
          type: 'pattern',
          pattern: 'darkDown',
          foreground: {
            rgb: color,
          },
          background: {
            theme: 3,
            tint: 0.4,
          },
        },
      });

    filledColor.push(`${currentColumn}${startRow}`);
  }
};

const generateGapDuration = (sheet, idealDuration, actualDuration, startColumn = 'AM', startRow = 17) => {
  const idealCells = Math.min(Math.max(Math.floor(idealDuration / 10), idealDuration > 0 ? 1 : 0), 50);
  const actualCells = Math.min(Math.max(Math.floor(actualDuration / 10), actualDuration > 0 ? 1 : 0), 50);

  const columnToIndex = (column) => {
    let sum = 0;
    for (let i = 0; i < column.length; i++) {
      sum *= 26;
      sum += column.charCodeAt(i) - 'A'.charCodeAt(0) + 1;
    }
    return sum;
  };

  const indexToColumn = (index) => {
    let column = '';
    while (index > 0) {
      const mod = (index - 1) % 26;
      column = String.fromCharCode(65 + mod) + column;
      index = Math.floor((index - 1) / 26);
    }
    return column;
  };

  const startColumnIndex = columnToIndex(startColumn);

  // Color the gap between ideal and actual (if actual > ideal)
  if (actualCells > idealCells) {
    for (let i = idealCells; i < actualCells; i++) {
      const currentColumnIndex = startColumnIndex + i;
      const currentColumn = indexToColumn(currentColumnIndex);

      if (filledColor.includes(`${currentColumn}${startRow}`)) {
        continue;
      }

      sheet
        .cell(`${currentColumn}${startRow}`)
        .style({
          fill: {
            type: 'pattern',
            pattern: 'darkDown',
            foreground: {
              rgb: 'FF0000', // Red for gap
            },
            background: {
              theme: 3,
              tint: 0.4,
            },
          },
        });

      filledColor.push(`${currentColumn}${startRow}`);
    }
  }
};

const flattenArray = (arr) => {
    const result = [];

    const recursiveFlatten = (obj) => {
        result.push({
            id: obj.id,
            isLeaf: obj.isLeaf,
            name: obj.name,
            pid: obj.pid,
        });
        if (obj.children && obj.children.length > 0) {
            obj.children.forEach((child) => recursiveFlatten(child));
        }
    }

    arr.forEach((item) => recursiveFlatten(item));
    return result;
}

const isNotEmpty = (input) => {
    console.log('isNotEmpty input:', input, 'type:', typeof input);
    if (input == null || input == undefined || input == "" || input == "null" || input == "undefined" || input == -1) {
        return false;
    } else {
        return true;
    }
}

// Helper function untuk debugging countermeasure data
const debugCountermeasureData = (problemData) => {
    console.log('=== DEBUG COUNTERMEASURE DATA ===');
    console.log('fpermanet_cm:', problemData.fpermanet_cm);
    console.log('fpermanet_cm_lama:', problemData.fpermanet_cm_lama);
    
    try {
        const cm_terjadi = isNotEmpty(problemData.fpermanet_cm) ? JSON.parse(problemData.fpermanet_cm) : [];
        const cm_lama = isNotEmpty(problemData.fpermanet_cm_lama) ? JSON.parse(problemData.fpermanet_cm_lama) : [];
        
        console.log('Parsed cm_terjadi:', cm_terjadi);
        console.log('Parsed cm_lama:', cm_lama);
        
        if (cm_terjadi.length > 0) {
            console.log('Sample cm_terjadi item:', cm_terjadi[0]);
            console.log('cm_terjadi item keys:', Object.keys(cm_terjadi[0] || {}));
        }
        
        if (cm_lama.length > 0) {
            console.log('Sample cm_lama item:', cm_lama[0]);
            console.log('cm_lama item keys:', Object.keys(cm_lama[0] || {}));
        }
        
        const countermeasure = cm_terjadi && cm_lama ? cm_terjadi.concat(cm_lama).splice(0, 5) : [];
        console.log('Final countermeasure array:', countermeasure);
        
        return countermeasure;
    } catch (error) {
        console.error('Error parsing countermeasure data:', error);
        return [];
    }
}

// Helper function untuk memastikan data cmCategory bisa masuk ke Excel
const sanitizeCountermeasureData = (item) => {
    console.log('=== SANITIZE COUNTERMEASURE ITEM ===');
    console.log('Original item:', item);
    
    // Cek semua kemungkinan nama field untuk cmCategory
    const possibleCategoryFields = [
        'cmCategory', 'cmcategory', 'category', 'Category', 
        'cm_category', 'cm_cat', 'cat', 'Cat'
    ];
    
    let cmCategoryValue = '';
    for (const field of possibleCategoryFields) {
        if (item[field] !== undefined && item[field] !== null && item[field] !== '') {
            cmCategoryValue = String(item[field]);
            console.log(`Found cmCategory in field '${field}':`, cmCategoryValue);
            break;
        }
    }
    
    // Jika tidak ditemukan, coba cek semua keys
    if (!cmCategoryValue) {
        console.log('All item keys:', Object.keys(item));
        // Cari field yang mengandung 'category' atau 'cat'
        for (const key of Object.keys(item)) {
            if (key.toLowerCase().includes('category') || key.toLowerCase().includes('cat')) {
                cmCategoryValue = String(item[key] || '');
                console.log(`Found potential category field '${key}':`, cmCategoryValue);
                break;
            }
        }
    }
    
    // Sanitasi nilai lainnya
    const cmDescValue = item.cmDesc || item.cmdesc || item.desc || item.Desc || item.description || '';
    const picValue = item.pic || item.PIC || item.pic_name || item.picName || '';
    const datePlanValue = item.datePlan || item.date_plan || item.plan_date || item.date || '';
    const judgValue = item.judg !== undefined ? (item.judg ? 'OK' : 'Not Yet') : 'Not Yet';
    
    const sanitizedItem = {
        cmCategory: cmCategoryValue,
        cmDesc: cmDescValue,
        pic: picValue,
        datePlan: datePlanValue,
        judg: judgValue
    };
    
    console.log('Sanitized item:', sanitizedItem);
    return sanitizedItem;
}

const q6 = [{
        category: "Q1",
        description: "Diagnose / Cause Analysis",
    },
    {
        category: "Q2",
        description: "Spareparts",
    },
    {
        category: "Q3",
        description: "Tools",
    },
    {
        category: "Q4",
        description: "Maintenance Ability",
    },
    {
        category: "Q5",
        description: "Machine Setting",
    },
    {
        category: "Q6",
        description: "Machine Backup",
    },
];

const generatedStepRepairCellDuration = async (res, problemData, uraianData, fullPath) => {
  // Clear the filledColor array to ensure clean state for each Excel generation
  filledColor.length = 0;

  const workbook = await XLSXPopulate.fromFileAsync(fullPath);
  const sheet = workbook.sheet(0);
  const startTime = moment(problemData.fstart_time);
  const endTime = moment(problemData.fend_time);

  sheet.cell('F12').value(startTime.format('DD'));
  sheet.cell('H12').value(startTime.format('MM'));
  sheet.cell('J12').value(startTime.format('YYYY'));
  sheet.cell('L12').value(problemData.fshift == 'r' ? 'RED' : 'WHITE');
  sheet.cell('M12').value(startTime.format('HH:mm:ss'));
  sheet.cell('O12').value(endTime.format('HH:mm:ss'));
  sheet.cell('Q12').value(`${problemData.fdur}`);
  sheet.cell('S11').value(problemData.ferror_name);
  sheet.cell('BO10').value(problemData.fline);
  sheet.cell('BO11').value(problemData.fmc_name);
  sheet.cell('CH11').value(problemData.foperator);
  sheet.cell('CY11').value(problemData.fid);

  sheet.cell('C31').value((uraianData[0] && uraianData[0].desc_nm) || '');
  sheet.cell('L17').value((uraianData[1] && uraianData[1].desc_nm) || '<no-description>');
  sheet.cell('L27').value((uraianData[2] && uraianData[2].desc_nm) || '<no-description>');

  let jsonStepRepair = [];
  try {
    jsonStepRepair = problemData.fstep_new ? JSON.parse(problemData.fstep_new) : [];
  } catch (e) {
    console.warn('Invalid fstep_new JSON, continuing with empty steps');
    jsonStepRepair = [];
  }
  if (jsonStepRepair.length > 0) {
    let no = 1;
    let idxAct = 0;
    const idxOffsetStd = 10;
    let initialDurationIdx = 17;
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 17; i < 17 + 6; i++) {
      const element = jsonStepRepair[idxAct];
      if (element) {
        sheet.cell(`W${i}`).value(no);
        sheet.cell(`X${i}`).value(element.stepDesc);
        sheet.cell(`AI${i}`).value(element.actualTime);
        sheet.cell(`CK${i}`).value(element.quick6);

        sheet.cell(`W${i + idxOffsetStd}`).value(no);
        sheet.cell(`X${i + idxOffsetStd}`).value(element.stepDesc);
        sheet.cell(`AI${i + idxOffsetStd}`).value(element.idealTime);
        sheet.cell(`CK${i + idxOffsetStd}`).value(element.quick6);

        generateCellDuration(sheet, element.actualTime, 'AM', i, '0000FF'); // Blue for actual
        generateCellDuration(sheet, element.idealTime, 'AM', i + idxOffsetStd, '00FF00'); // Green for ideal
        generateGapDuration(sheet, element.idealTime, element.actualTime, 'AM', i);

        idxAct++;
        no++;
        initialDurationIdx++;
      }
    }

    const groupedSteps = jsonStepRepair.reduce((acc, step) => {
      if (!acc[step.quick6]) {
        acc[step.quick6] = [];
      }
      acc[step.quick6].push(step);
      return acc;
    }, {});

    const groupsWithHighestGap = Object.keys(groupedSteps).map((key) => {
      const group = groupedSteps[key];
      const highestGap = Math.max(...group.map((step) => step.actualTime - step.idealTime));
      return { quick6: key, steps: group, highestGap };
    });

    const sortedStep = groupsWithHighestGap.sort((a, b) => b.highestGap - a.highestGap);

    if (sortedStep.length > 0) {
      const findHigh = q6.find((item) => item.category === sortedStep[0].quick6);

      if (findHigh) {
        sheet.cell('CN24').value(`${findHigh.category} = ${findHigh.description}`);
      }
    }
  }

  // Mark O6 and Q6 categories on row 35 based on problemData.oCategory and problemData.qCategory
  try {
    const oCategoryColumnById = {
      '1': 'L',
      '2': 'M',
      '3': 'O',
      '4': 'Q',
      '5': 'S',
      '6': 'U',
    };
    const qCategoryColumnById = {
      '1': 'AM',
      '2': 'AZ',
      '3': 'BM',
      '4': 'BZ',
      '5': 'CM',
      '6': 'CZ',
    };

    const o6Key = problemData && problemData.oCategory != null ? String(problemData.oCategory) : null;
    const qKey = problemData && problemData.qCategory != null ? String(problemData.qCategory) : null;

    const o6 = o6Key && oCategoryColumnById[o6Key] ? oCategoryColumnById[o6Key] : null;
    const q = qKey && qCategoryColumnById[qKey] ? qCategoryColumnById[qKey] : null;

    if (q) {
      sheet.cell(`${q}35`).value('O');
    }
    if (o6) {
      sheet.cell(`${o6}35`).value('O');
    }
  } catch (markErr) {
    console.warn('Failed to mark O6/Q6 category cells:', markErr);
  }

  const dataAnalysisQuery = `SELECT * FROM o_analisys WHERE id_problem = :fid`;
    const dataAnalysis = await sequelize.query(dataAnalysisQuery, {
        replacements: { fid: problemData.fid },
        type: sequelize.QueryTypes.SELECT,
    });
  console.log(dataAnalysis);

  const whyTerjadi =
    dataAnalysis.length && dataAnalysis[0].json_string != '' ? await JSON.parse(dataAnalysis[0].json_string) : [];

  const whyLama =
    dataAnalysis.length > 1 ? (dataAnalysis[1].json_string != '' ? await JSON.parse(dataAnalysis[1].json_string) : []) : [];

  const containerWhyCols = ['E36', 'E39', 'E42', 'E45', 'E48'];
  const flattenTerjadi = flattenArray(whyTerjadi);
  flattenTerjadi.map((item, i) => {
    if (containerWhyCols[i]) {
      sheet.cell(containerWhyCols[i]).value(item.name);
    }
  });

  const containerLamaCols = ['W36', 'W38', 'E40', 'E42', 'E44'];
  const flattenLama = flattenArray(whyLama);
  flattenLama.map((item, i) => {
    if (containerLamaCols[i]) {
      sheet.cell(containerLamaCols[i]).value(item.name);
    }
  });

  const cm_lama = isNotEmpty(problemData.fpermanet_cm_lama) ? JSON.parse(problemData.fpermanet_cm_lama) : [];
  const cm_terjadi = isNotEmpty(problemData.fpermanet_cm) ? JSON.parse(problemData.fpermanet_cm) : [];

  // Gunakan fungsi debug untuk mendapatkan data countermeasure yang lebih detail
  const countermeasure = debugCountermeasureData(problemData);
  console.log('countermeasure');
  console.log(countermeasure);

  {
    const containerCmColNo = ['W47', 'W48', 'W49', 'W50'];
    const containerCmColDesc = ['X47', 'X48', 'X49', 'X50'];
    const containerCmColCat = ['AL47', 'AL48', 'AL49', 'AL50'];
    const containerCmColPic = ['AY47', 'AY48', 'AY49', 'AY50'];
    const containerCmColDate = ['BO47', 'BO48', 'BO49', 'BO50'];
    const containerCmColJudg = ['BX47', 'BX48', 'BX49', 'BX50'];
    if (countermeasure && countermeasure.length > 0) {
      countermeasure.map((item, i) => {
        console.log(`Processing countermeasure item ${i}:`, item);
        console.log(`cmCategory value:`, item.cmCategory);
        console.log(`cmCategory type:`, typeof item.cmCategory);
        
        // Gunakan fungsi sanitasi untuk memastikan data benar
        const sanitizedItem = sanitizeCountermeasureData(item);
        
        try {
          // Validasi cell sebelum menulis
          const cellNo = sheet.cell(containerCmColNo[i]);
          const cellDesc = sheet.cell(containerCmColDesc[i]);
          const cellCat = sheet.cell(containerCmColCat[i]);
          const cellPic = sheet.cell(containerCmColPic[i]);
          const cellDate = sheet.cell(containerCmColDate[i]);
          const cellJudg = sheet.cell(containerCmColJudg[i]);
          
          // Pastikan cell ada sebelum menulis
          if (!cellNo || !cellDesc || !cellCat || !cellPic || !cellDate || !cellJudg) {
            console.error(`One or more cells not found for row ${i}`);
            return;
          }
          
          cellNo.value(i + 1);
          cellDesc.value(sanitizedItem.cmDesc);
          cellCat.value(sanitizedItem.cmCategory);
          cellPic.value(sanitizedItem.pic);
          cellDate.value(sanitizedItem.datePlan);
          cellJudg.value(sanitizedItem.judg);
          
          // Verifikasi data yang ditulis ke Excel
          const writtenNo = cellNo.value();
          const writtenDesc = cellDesc.value();
          const writtenCat = cellCat.value();
          const writtenPic = cellPic.value();
          const writtenDate = cellDate.value();
          const writtenJudg = cellJudg.value();
          
          console.log(`Successfully wrote to Excel - Row ${i + 1}:`);
          console.log(`  No: ${writtenNo}`);
          console.log(`  Desc: ${writtenDesc}`);
          console.log(`  Category: ${writtenCat}`);
          console.log(`  PIC: ${writtenPic}`);
          console.log(`  Date: ${writtenDate}`);
          console.log(`  Judg: ${writtenJudg}`);
          
          // Verifikasi bahwa data benar-benar masuk
          if (writtenCat !== sanitizedItem.cmCategory) {
            console.warn(`WARNING: Category mismatch! Expected: ${sanitizedItem.cmCategory}, Written: ${writtenCat}`);
          }
        } catch (error) {
          console.error(`Error writing to Excel for item ${i}:`, error);
          console.error(`Item data:`, item);
          console.error(`Sanitized item:`, sanitizedItem);
          console.error(`Cell addresses:`, {
            no: containerCmColNo[i],
            desc: containerCmColDesc[i],
            cat: containerCmColCat[i],
            pic: containerCmColPic[i],
            date: containerCmColDate[i],
            judg: containerCmColJudg[i]
          });
        }
      });
    } else {
      console.log('No countermeasure data found or empty array');
    }
  }
  const containerYokoColMc = ['CD47', 'CD49'];
  const containerYokoColPic = ['CO47', 'CO49'];
  const containerYokoColDate = ['DD47', 'DD49'];
  const containerYokoColJudg = ['DJ47', 'CJ49'];
  const yokoten = isNotEmpty(problemData.fyokoten) ? JSON.parse(problemData.fyokoten) : [];

  console.log(yokoten);

  if (yokoten.length > 0) {
    yokoten.map((item, i) => {
      sheet.cell(containerYokoColMc[i]).value(item.machine);
      sheet.cell(containerYokoColPic[i]).value(item.pic);
      sheet.cell(containerYokoColDate[i]).value(item.datePlan);
      sheet.cell(containerYokoColJudg[i]).value(item.judg ? 'OK' : 'Not Yet');
    });
  }

  let dirFile = `./reports/ltb/${problemData.fid}_${problemData.ferror_name}`;
  if (dirFile.includes(':')) {
    dirFile = dirFile.replace(new RegExp(':', 'g'), '_');
  }

  if (!fs.existsSync(dirFile)) {
    fs.mkdirSync(dirFile);
  }

  let r = `${dirFile}/${problemData.ferror_name}.xlsx`;
  if (r.includes(':')) {
    r = r.replace(new RegExp(':', 'g'), '_');
  }

  await workbook.toFileAsync(r);
  return r;
};

const mappedImageFile = async (res, problemData, uraianData, generatedExcelPath) => {
    console.log('=== MAPPED IMAGE FILE START ===');
    console.log('problemData:', problemData);
    console.log('uraianData length:', uraianData.length);
    console.log('generatedExcelPath:', generatedExcelPath);

    const workbook = new ExcelJS.Workbook();
    const wb = await workbook.xlsx.readFile(generatedExcelPath);
    const worksheet = wb.worksheets[0];

    if (
        uraianData.length >= 1 &&
        uraianData[0].ilustration &&
        uraianData[0].ilustration != "" &&
        uraianData[0].ilustration != "null" &&
        fs.existsSync(uraianData[0].ilustration)
    ) {
        const chartImageIdGeneral = workbook.addImage({
            filename: uraianData[0].ilustration,
            extension: "jpeg",
        });
        const column = "C";
        const row = 21;
        const colIndex = worksheet.getColumn(column).number;
        worksheet.addImage(chartImageIdGeneral, {
            tl: {col: colIndex, row: row},
            ext: {width: 280, height: 180},
        });
    }

    if (
        uraianData.length >= 2 &&
        uraianData[1].ilustration &&
        uraianData[1].ilustration != "" &&
        uraianData[1].ilustration != "null" &&
        fs.existsSync(uraianData[1].ilustration)
    ) {
        const chartImageIdStd = workbook.addImage({
            filename: uraianData[1].ilustration,
            extension: "jpeg",
        });
        const P17 = worksheet.getCell("P17");
        const col2 = "P";
        const row2 = 17;
        const colIndex2 = worksheet.getColumn(col2).number;
        worksheet.addImage(chartImageIdStd, {
            tl: {col: colIndex2, row: row2},
            ext: {width: 200, height: 150},
        });
    }
    if (
        uraianData.length >= 3 &&
        uraianData[2].ilustration &&
        uraianData[2].ilustration != "" &&
        uraianData[2].ilustration != "null" &&
        fs.existsSync(uraianData[2].ilustration)
    ) {
        const chartImageIdAct = workbook.addImage({
            filename: uraianData[2].ilustration ?? 'tidak ada gambar',
            extension: "jpeg",
        });

        const P27 = worksheet.getCell("P27");
        const col3 = "P";
        const row3 = 27;
        const colIndex3 = worksheet.getColumn(col3).number;

        worksheet.addImage(chartImageIdAct, {
            tl: {col: colIndex3, row: row3},
            ext: {width: 200, height: 150},
        });

    }

    // Insert Why Analysis Images - MOVED OUTSIDE CONDITIONS
    const why1_img = problemData.why1_img;
    const why2_img = problemData.why2_img;
    const why12_img = problemData.why12_img;
    const why22_img = problemData.why22_img;

    // Debug logging untuk why images
    console.log('=== DEBUG WHY IMAGES ===');
    console.log('why1_img from DB:', why1_img);
    console.log('why2_img from DB:', why2_img);
    console.log('why12_img from DB:', why12_img);
    console.log('why22_img from DB:', why22_img);
    console.log('Current working directory:', process.cwd());
    console.log('why1_img absolute path:', path.resolve(why1_img || ''));
    console.log('why2_img absolute path:', path.resolve(why2_img || ''));
    console.log('why1_img exists:', fs.existsSync(why1_img));
    console.log('why2_img exists:', fs.existsSync(why2_img));
    console.log('why1_img isNotEmpty:', isNotEmpty(why1_img));
    console.log('why2_img isNotEmpty:', isNotEmpty(why2_img));

    // Why1 Image (Why Terjadi - First Level) - Cell M36
    if (isNotEmpty(why1_img) && fs.existsSync(why1_img)) {
        console.log('Processing why1_img:', why1_img);
        // Detect file extension
        const ext = path.extname(why1_img).toLowerCase();
        const extension = ext === '.jpg' || ext === '.jpeg' ? 'jpeg' : 
                         ext === '.png' ? 'png' : 
                         ext === '.gif' ? 'gif' : 'jpeg';
        console.log('why1_img extension:', extension);

        const why1ImageId = workbook.addImage({
            filename: why1_img,
            extension: extension,
        });
        const col1 = "M";
        const row1 = 36;
        const colIndex1 = worksheet.getColumn(col1).number;
        worksheet.addImage(why1ImageId, {
            tl: {col: colIndex1, row: row1},
            ext: {width: 250, height: 200},
        });
        console.log('why1_img added to Excel at M36');
    } else {
        console.log('why1_img skipped - not found or empty');
    }

    // Why2 Image (Why Lama - First Level) - Cell AM36
    if (isNotEmpty(why2_img) && fs.existsSync(why2_img)) {
        console.log('Processing why2_img:', why2_img);
        // Detect file extension
        const ext2 = path.extname(why2_img).toLowerCase();
        const extension2 = ext2 === '.jpg' || ext2 === '.jpeg' ? 'jpeg' : 
                          ext2 === '.png' ? 'png' : 
                          ext2 === '.gif' ? 'gif' : 'jpeg';
        console.log('why2_img extension:', extension2);

        const why2ImageId = workbook.addImage({
            filename: why2_img,
            extension: extension2,
        });
        const col2 = "AM";
        const row2 = 36;
        const colIndex2 = worksheet.getColumn(col2).number;
        worksheet.addImage(why2ImageId, {
            tl: {col: colIndex2, row: row2},
            ext: {width: 250, height: 200},
        });
        console.log('why2_img added to Excel at AM36');
    } else {
        console.log('why2_img skipped - not found or empty');
    }

    // Why12 Image (Why Terjadi - Second Level) - Cell BR36
    if (isNotEmpty(why12_img) && fs.existsSync(why12_img)) {
        console.log('Processing why12_img:', why12_img);
        const ext3 = path.extname(why12_img).toLowerCase();
        const extension3 = ext3 === '.jpg' || ext3 === '.jpeg' ? 'jpeg' : 
                          ext3 === '.png' ? 'png' : 
                          ext3 === '.gif' ? 'gif' : 'jpeg';
        console.log('why12_img extension:', extension3);

        const why12ImageId = workbook.addImage({
            filename: why12_img,
            extension: extension3,
        });
        const col3 = "BR";
        const row3 = 36;
        const colIndex3 = worksheet.getColumn(col3).number;
        worksheet.addImage(why12ImageId, {
            tl: {col: colIndex3, row: row3},
            ext: {width: 250, height: 200},
        });
        console.log('why12_img added to Excel at BR36');
    } else {
        console.log('why12_img skipped - not found or empty');
    }

    // Why22 Image (Why Lama - Second Level) - Cell CG36
    if (isNotEmpty(why22_img) && fs.existsSync(why22_img)) {
        console.log('Processing why22_img:', why22_img);
        const ext4 = path.extname(why22_img).toLowerCase();
        const extension4 = ext4 === '.jpg' || ext4 === '.jpeg' ? 'jpeg' : 
                          ext4 === '.png' ? 'png' : 
                          ext4 === '.gif' ? 'gif' : 'jpeg';
        console.log('why22_img extension:', extension4);

        const why22ImageId = workbook.addImage({
            filename: why22_img,
            extension: extension4,
        });
        const col4 = "CG";
        const row4 = 36;
        const colIndex4 = worksheet.getColumn(col4).number;
        worksheet.addImage(why22ImageId, {
            tl: {col: colIndex4, row: row4},
            ext: {width: 250, height: 200},
        });
        console.log('why22_img added to Excel at CG36');
    } else {
        console.log('why22_img skipped - not found or empty');
    }

    await workbook.xlsx.writeFile(generatedExcelPath);
    res.download(generatedExcelPath);
}

module.exports = {
    generatedStepRepairCellDuration,
    mappedImageFile,
    sanitizeCountermeasureData,
    debugCountermeasureData,
    generateCellDuration,
    generateGapDuration
};
