/**
 * ONE-TIME IMPORT: Drivvo → Car Tracker Google Sheets
 *
 * วิธีใช้:
 * 1. clasp push เพื่ออัพโหลดไฟล์นี้ขึ้น Apps Script
 * 2. เปิด Apps Script editor → เลือก function "importDrivvoData" → กด Run
 * 3. ตรวจสอบ Google Sheets ว่าข้อมูลถูก import แล้ว
 * 4. ลบไฟล์นี้ออกหลังจาก import สำเร็จ แล้ว clasp push อีกครั้ง
 *
 * Car: Nissan Almera 2020 (ส้ม) ทะเบียน 9กข 70 → car_id = 1
 * ข้อมูล: Pawat D. | ตุลาคม 2025 – มิถุนายน 2026
 */

function importDrivvoData() {
  const fuelCount = importDrivvoFuel();
  const maintCount = importDrivvoMaintenance();
  Logger.log('✅ Import เสร็จสิ้น! เติมน้ำมัน: ' + fuelCount + ' รายการ | ซ่อมบำรุง: ' + maintCount + ' visits');
}


// ==========================================
// FUEL RECORDS — 33 รายการ
// ==========================================

function importDrivvoFuel() {
  const sheet = getSheetByName('fuel_records');
  const CAR_ID = 1;

  // [date, odometer, fuel_type, liters, price_per_liter, total_cost, station, efficiency_km_per_liter, user_name]
  const records = [
    ['2026-06-17', 90457, 'E20',  23.267, 40.40, 940.00,   'ปั้มน้ำมันบางจาก อ่อนนุช55',                    0.00,  'Pawat D.'],
    ['2026-06-11', 90026, 'E20',  25.426, 38.15, 970.00,   'ปั้มบางจาก สุขาภิบาล 2',                        18.52, 'Pawat D.'],
    ['2026-05-31', 89677, 'E20',  23.188, 37.95, 880.00,   'ปั้มบางจาก สุขาภิบาล 2',                        13.73, 'Pawat D.'],
    ['2026-05-23', 89370, 'E20',  25.296, 37.95, 960.00,   'ปั้มน้ำมันบางจาก อ่อนนุช55',                    13.24, 'Pawat D.'],
    ['2026-05-13', 88967, 'E20',  15.934, 36.40, 580.00,   'PTT สุขาภิบาล 2',                               15.93, 'Pawat D.'],
    ['2026-05-07', 88748, 'E20',  25.309, 36.35, 920.00,   'ปั้มน้ำมันบางจาก อ่อนนุช55',                    13.74, 'Pawat D.'],
    ['2026-05-01', 88288, 'E20',  21.458, 36.35, 780.00,   'ปั้มบางจาก',                                    18.18, 'Pawat D.'],
    ['2026-04-23', 88003, 'E20',  23.944, 35.50, 850.00,   'ปั้มน้ำมันบางจาก อ่อนนุช55',                    13.28, 'Pawat D.'],
    ['2026-04-12', 87646, 'E20',  29.722, 36.00, 1070.00,  'O.s. Rung Rueng Partnership (Ngam Wong Wan)',   14.78, 'Pawat D.'],
    ['2026-03-30', 87210, 'E20',  17.175, 36.10, 620.00,   'PTT สุขาภิบาล 2',                               14.78, 'Pawat D.'],
    ['2026-03-28', 86891, 'E20',  9.418,  36.10, 340.00,   'PTT สุขาภิบาล 2',                               18.57, 'Pawat D.'],
    ['2026-03-23', 86732, 'E20',  8.185,  28.10, 230.00,   'PT (PT Company Limited)',                        16.88, 'Pawat D.'],
    ['2026-03-20', 86596, 'E20',  9.225,  27.10, 250.00,   'ปั้มน้ำมันบางจาก อ่อนนุช55',                    16.62, 'Pawat D.'],
    ['2026-03-15', 86464, '95',   16.077, 31.10, 500.00,   'บางจาก ใหม่',                                   14.31, 'Pawat D.'],
    ['2026-03-09', 86220, '95',   11.765, 30.60, 360.00,   'บางจาก ใหม่',                                   15.18, 'Pawat D.'],
    ['2026-03-03', 86076, '95',   27.778, 30.60, 850.00,   'PTT สุขาภิบาล 2',                               16.89, 'Pawat D.'],
    ['2026-02-20', 85552, '95',   27.778, 30.60, 850.00,   'ปั้มบางจาก สุขาภิบาล 2',                        16.89, 'Pawat D.'],
    ['2026-02-14', 85086, '95',   13.916, 30.90, 430.00,   'ปั้มน้ำมันบางจาก อ่อนนุช55',                    16.78, 'Pawat D.'],
    ['2026-02-08', 84893, '95',   30.070, 30.60, 920.14,   'ปั้มน้ำมันบางจาก อ่อนนุช55',                    13.87, 'Pawat D.'],
    ['2026-01-31', 84387, '95',   30.097, 30.90, 930.00,   'บางจาก ใหม่',                                   16.83, 'Pawat D.'],
    ['2026-01-18', 83900, '95',   30.284, 31.04, 940.00,   'ปั๊มน้ำมันบางจาก - สายเอเซีย 2',               16.18, 'Pawat D.'],
    ['2026-01-10', 83391, '95',   29.773, 30.90, 920.00,   'บางจาก ใหม่',                                   16.81, 'Pawat D.'],
    ['2025-12-27', 82929, '95',   28.662, 31.40, 900.00,   'บางจาก ใหม่',                                   15.52, 'Pawat D.'],
    ['2025-12-15', 82476, '95',   31.348, 31.90, 1000.00,  'ปั้มน้ำมันบางจาก อ่อนนุช55',                    15.80, 'Pawat D.'],
    ['2025-12-07', 81963, '95',   20.376, 31.90, 650.00,   'ปั้มน้ำมันบางจาก อ่อนนุช55',                    16.36, 'Pawat D.'],
    ['2025-11-30', 81606, '95',   29.743, 31.94, 950.00,   'ปั้มบางจาก',                                    17.52, 'Pawat D.'],
    ['2025-11-22', 81104, '95',   28.840, 31.90, 920.00,   'ปั้มน้ำมันบางจาก อ่อนนุช55',                    16.88, 'Pawat D.'],
    ['2025-11-14', 80539, '95',   15.674, 31.90, 500.00,   'ปั้มน้ำมันบางจาก อ่อนนุช55',                    19.59, 'Pawat D.'],
    ['2025-11-08', 80314, '95',   29.467, 31.90, 940.00,   'Bangchak Petrol Station',                        14.35, 'Pawat D.'],
    ['2025-10-26', 79863, '95',   30.408, 31.90, 970.00,   'ปั้มบางจาก บางบ่อ',                             15.31, 'Pawat D.'],
    ['2025-10-15', 79341, '95',   26.087, 32.20, 840.00,   'Bangchak Petrol Station',                        18.18, 'Pawat D.'],
    ['2025-10-12', 78836, '95',   9.317,  32.20, 300.00,   'ปั้มบางจาก สุขาภิบาล 2',                        18.18, 'Pawat D.'],
    ['2025-10-11', 78643, '95',   30.707, 32.24, 990.00,   '',                                               20.72, 'Pawat D.'],
  ];

  records.forEach(function(rec, i) {
    var date      = rec[0];
    var odo       = rec[1];
    var fuel      = rec[2];
    var liters    = rec[3];
    var price     = rec[4];
    var total     = rec[5];
    var station   = rec[6];
    var eff       = rec[7];
    var user      = rec[8];

    var recordId = 'FL-DV-' + Utilities.formatString('%03d', i + 1);
    sheet.appendRow([recordId, new Date(), user, CAR_ID, date, odo, fuel, liters, price, total, station, eff]);
  });

  Logger.log('Fuel imported: ' + records.length + ' rows');
  return records.length;
}


// ==========================================
// MAINTENANCE RECORDS — 7 visits, 13 items
// ==========================================

function importDrivvoMaintenance() {
  const mainSheet = getSheetByName('maintenance_records');
  const itemSheet = getSheetByName('maintenance_items');
  const CAR_ID = 1;

  // visits: [date, time, odometer, shop_name, notes, user, items: [[service_name, cost], ...]]
  const visits = [
    {
      date: '2026-02-08', time: '16:00', odo: 84907,
      shop: 'B-Quik', notes: '', user: 'Pawat D.',
      items: [
        ['เปลี่ยนถ่ายน้ำมันเครื่อง',   1154.30],
        ['กรองน้ำมันเครื่อง',           470.00],
        ['สารทำความสะอาดเครื่องยนต์',  533.50],
        ['แหวนอ่างน้ำมัน',              13.58],
        ['แรงดันลมยาง',                 0.00],
      ]
    },
    {
      date: '2025-12-26', time: '13:00', odo: 82865,
      shop: 'ไม่ระบุ', notes: 'เปลี่ยนโช๊ค', user: 'Pawat D.',
      items: [
        ['ช่วงล่าง (โช๊คอัพ)', 10400.00],
      ]
    },
    {
      date: '2025-11-25', time: '11:30', odo: 81277,
      shop: 'เต้น ออโต้ เซอร์วิส', notes: '', user: 'Pawat D.',
      items: [
        ['น้ำมันเกียร์',         1350.00],
        ['กรองน้ำมันเกียร์',      375.00],
        ['น้ำมันเบรค',            100.00],
        ['น้ำยาหม้อน้ำ',          550.00],
      ]
    },
    {
      date: '2025-10-12', time: '06:42', odo: 78700,
      shop: 'กูรูไทยะ', notes: '', user: 'Pawat D.',
      items: [
        ['สลับยาง', 0.00],
      ]
    },
    {
      date: '2025-09-06', time: '17:40', odo: 77561,
      shop: 'อู่ช่างหมู', notes: '', user: 'Pawat D.',
      items: [
        ['เปลี่ยนถ่ายน้ำมันเครื่อง', 1800.00],
        ['กรองน้ำมันเครื่อง',          0.00],
      ]
    },
    {
      date: '2024-12-19', time: '17:33', odo: 66685,
      shop: 'ไม่ระบุ', notes: 'บูชปีกนกหน้า + ลูกหมากกันโคลงหน้า', user: 'Pawat D.',
      items: [
        ['ช่วงล่าง (บูชปีกนกหน้า + ลูกหมากกันโคลงหน้า)', 4200.00],
      ]
    },
    {
      date: '2024-03-22', time: '17:38', odo: 61000,
      shop: 'ไม่ระบุ', notes: 'GS EFB-Q85L', user: 'Pawat D.',
      items: [
        ['แบตเตอรี่ (GS EFB-Q85L)', 2810.00],
      ]
    },
  ];

  visits.forEach(function(visit, i) {
    var recordId = 'MT-DV-' + Utilities.formatString('%03d', i + 1);
    var totalCost = visit.items.reduce(function(sum, item) { return sum + item[1]; }, 0);

    // Append main record
    mainSheet.appendRow([
      recordId,
      new Date(),
      visit.user,
      CAR_ID,
      visit.date,
      visit.time,
      visit.odo,
      visit.shop,
      totalCost,
      '',           // next_km
      '',           // next_date
      visit.notes
    ]);

    // Append sub-items
    visit.items.forEach(function(item, j) {
      var itemId = 'ITI-DV-' + Utilities.formatString('%03d', i + 1) + '-' + (j + 1);
      itemSheet.appendRow([itemId, recordId, item[0], item[1]]);
    });
  });

  Logger.log('Maintenance imported: ' + visits.length + ' visits');
  return visits.length;
}
