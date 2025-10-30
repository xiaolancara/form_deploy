document.getElementById("fillBtn").addEventListener("click", async () => {
  const status = document.getElementById("status");
  status.textContent = "Filling form fields...";

  try {
    const family = document.getElementById("family").value;
    const given = document.getElementById("given").value;
    const dob = document.getElementById("dob").value;
    const country = document.getElementById("country").value;

    const formUrl = "./i-131.pdf"; // use decrypted file
    const existingPdfBytes = await fetch(formUrl).then(r => r.arrayBuffer());

    const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();

    // Fill real USCIS field names (case sensitive)
    form.getTextField("Pt1Line1a_FamilyName").setText(family);
    form.getTextField("Pt1Line1b_GivenName").setText(given);
    form.getTextField("Pt1Line2_DateOfBirth").setText(dob);
    form.getTextField("Pt1Line3_CountryOfBirth").setText(country);

    form.flatten(); // lock entries so they render on all viewers

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "I-131_filled.pdf";
    a.click();

    status.textContent = "✅ PDF filled successfully!";
  } catch (err) {
    console.error(err);
    status.textContent = "❌ Error: " + err.message;
  }
});
