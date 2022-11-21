const PDFDocument = require("pdfkit");

exports.calculateTotalRatings = (reviews) => {
  const ttlRatings = reviews.length;
  let sumRatings = 0;
  reviews.forEach((review) => {
    sumRatings += review.rating;
  });
  return sumRatings / ttlRatings;
};

exports.userExistFromRequest = (userId, next) => {
  if (!userId) {
    const error = new Error("User not found");
    error.statusCode = 422;
    return next(error);
  }
};

exports.errorStatment = (message, next) => {
  const error = new Error(message);
  error.statusCode = 422;
  return next(error);
};

exports.generatePrescription = (data) => {
  let pdf = new PDFDocument();

  createHeader(pdf);
  createPrescriptionIntro(pdf,data);
  createTable(pdf,data);
  createFooter(pdf);
  pdf.end();
  return pdf;
};

const createHeader = (pdf) => {
  pdf
    .image("../Logo/hospital.png", 50, 45, { width: 50 })
    .fillColor("#444444")
    .fontSize(20)
    .text("WeCare", 110, 57)
    .fontSize(10)
    .text("456 abc Street", 200, 65, { align: "right" })
    .text("Abu Dhabi, AUH, 10092", 200, 80, { align: "right" })
    .moveDown();
};

const createFooter = (pdf, data) => {
  pdf
    .fontSize(10)
    .text("Written by Dr. " + data.doctor, 80, 700, {
      align: "right",
      width: 300,
    })
    .text(
      "Prescription is valid only for 15 days from date of issue",
      50,
      780,
      { align: "center", width: 500 }
    );
};

const createPrescriptionIntro = (pdf, data) => {
  pdf
    .text(`Prescription Number: ${data.id.toString()}`, 50, 200)
    .text(`Prescription Date: ${data.date}`, 50, 215)

    .text(data.patient, 300, 200)
    .text("123 Random Street", 300, 215)
    .text(`${"Khalifa City"}, ${"AUH"}, ${"UAE"}`, 300, 130)
    .moveDown();
};

const createTable = (pdf, data) => {
  let i;
  const invoiceTableTop = 330;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Medicine Name",
    "Dosage",
    "Duration"
  );
  generateHr(pdf, invoiceTableTop + 20);
  pdf.font("Helvetica");

  for (i = 0; i < data.prescriptionDetails.length; i++) {
    const item = data.prescriptionDetails[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      pdf,
      position,
      item.medicine_name,
      item.medicine_dosage,
      item.medicine_duration
    );

    generateHr(pdf, position + 20);
  }
};

const generateHr = (pdf, y) => {
  pdf.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
};

const generateTableRow = (
  pdf,
  y,
  name,
  dosage,
  duration
) => {

  let displayed_dosage = "";
  if (dosage === "3") displayed_dosage = "1 Morning, 1 Aft, 1 Eve"
  else if (dosage == "2") displayed_dosage = "1 Morning, 1 Eve"
  else displayed_dosage = "1/2 Morning, 1/2 Evening"

  pdf
    .fontSize(10)
    .text(name, 50, y)
    .text(displayed_dosage, 150, y)
    .text(duration, 280, y, { width: 90, align: "right" })
};
