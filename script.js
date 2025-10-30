document.getElementById("fillBtn").addEventListener("click", async () => {
  const status = document.getElementById("status");
  status.textContent = "Processing...";

  try {
    const family = document.getElementById("family").value;
    const given = document.getElementById("given").value;
    const dob = document.getElementById("dob").value;
    const country = document.getElementById("country").value;

    // 1. Fetch your blank I-131 PDF
    const formUrl = "./i-131.pdf";
    const existingPdfBytes = await fetch(formUrl).then(res => res.arrayBuffer());

    // 2. Load into pdf-lib
    const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();

    // 3. Fill known fields (based on extracted names)
    try {
      form.getTextField("Pt1Line1a_FamilyName").setText(family);
      form.getTextField("Pt1Line1b_GivenName").setText(given);
      form.getTextField("Pt1Line2_DateOfBirth").setText(dob);
      form.getTextField("Pt1Line3_CountryOfBirth").setText(country);
    } catch (err) {
      status.textContent = "⚠️ Could not find those fields, using overlay instead.";
      const page = pdfDoc.getPages()[0];
      const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
      page.drawText(`${family}, ${given}`, { x: 120, y: 620, size: 10, font });
      page.drawText(dob, { x: 120, y: 595, size: 10, font });
      page.drawText(country, { x: 250, y: 595, size: 10, font });
    }

    form.flatten();

    // 4. Save and trigger download
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "I-131_filled.pdf";
    a.click();

    status.textContent = "✅ PDF generated and downloaded!";
  } catch (e) {
    console.error(e);
    status.textContent = "❌ Error filling PDF.";
  }
});
