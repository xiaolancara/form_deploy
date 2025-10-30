document.getElementById("fillBtn").addEventListener("click", async () => {
  const status = document.getElementById("status");
  status.textContent = "Preparing to fill form...";

  try {
    // Collect input values
    const family = document.getElementById("family").value;
    const given = document.getElementById("given").value;
    const dob = document.getElementById("dob").value;
    const country = document.getElementById("country").value;
    const phone = document.getElementById("phone").value || "408-555-1234";
    const email = document.getElementById("email").value || "demo@example.com";

    // Load unlocked PDF (must be in same folder)
    const formUrl = "./i-131.pdf";
    const existingPdfBytes = await fetch(formUrl).then(r => {
      if (!r.ok) throw new Error("Cannot find PDF file");
      return r.arrayBuffer();
    });

    // Load PDF and get form
    const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();

    // ✅ Fill verified field names from your unlocked file
    form.getTextField("form1[0].P4[0].Part2_Line1_FamilyName[0]").setText(family);
    form.getTextField("form1[0].P4[0].Part2_Line1_GivenName[0]").setText(given);
    form.getTextField("form1[0].P5[0].Part2_Line9_DateOfBirth[0]").setText(dob);
    form.getTextField("form1[0].P5[0].Part2_Line6_CountryOfBirth[0]").setText(country);
    form.getTextField("form1[0].P5[0].Part2_Line7_CountryOfCitizenshiporNationality[0]").setText(country);
    form.getTextField("form1[0].#subform[10].Part10_Line1_DayPhone[0]").setText(phone);
    form.getTextField("form1[0].#subform[10].Part10_Line3_Email[0]").setText(email);

    // Flatten (lock text so visible everywhere)
    form.flatten();

    // Save & download the filled PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "I-131_filled.pdf";
    a.click();

    status.textContent = "✅ Done! Your I-131_filled.pdf has been filled correctly.";
  } catch (err) {
    console.error(err);
    status.textContent = "❌ Error: " + err.message;
  }
});
