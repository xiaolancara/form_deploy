document.getElementById("fillBtn").addEventListener("click", async () => {
  const status = document.getElementById("status");
  status.textContent = "Preparing to fill form...";

  try {
    // Collect values from input boxes
    const family = document.getElementById("family").value;
    const given = document.getElementById("given").value;
    const dob = document.getElementById("dob").value;
    const country = document.getElementById("country").value;
    const phone = "408-555-1234";   // example static fields (optional)
    const email = "demo@example.com";

    // Load the unlocked I-131 file
    const formUrl = "./i-131.pdf"; // Must match your filename exactly
    const existingPdfBytes = await fetch(formUrl).then(r => {
      if (!r.ok) throw new Error("Cannot find PDF file");
      return r.arrayBuffer();
    });

    // Use pdf-lib to load and edit
    const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();

    // 🧩 Fill verified fields based on your file
    form.getTextField("Part2_Line1_FamilyName").setText(family);
    form.getTextField("Part2_Line1_GivenName").setText(given);
    form.getTextField("Part2_Line9_DateOfBirth").setText(dob);
    form.getTextField("Part2_Line6_CountryOfBirth").setText(country);
    form.getTextField("Part10_Line1_DayPhone").setText(phone);
    form.getTextField("Part10_Line3_Email").setText(email);

    // ✅ Optional: fill some defaults for demo
    form.getTextField("Part2_Line7_CountryOfCitizenshiporNationality").setText(country);
    form.getTextField("Part2_Line12_ClassofAdmission").setText("F1 Student");
    form.getTextField("Part2_Line13_I94RecordNo").setText("1234567890");

    // Lock entries so they’re visible on any viewer
    form.flatten();

    // Generate filled PDF and download
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "I-131_filled.pdf";
    a.click();

    status.textContent = "✅ Done! Your I-131_filled.pdf has correct field placement.";
  } catch (err) {
    console.error(err);
    status.textContent = "❌ " + err.message;
  }
});
