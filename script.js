document.getElementById("fillBtn").addEventListener("click", async () => {
  const status = document.getElementById("status");
  status.textContent = "Extracting field names... (check console)";

  try {
    const pdfUrl = "./i-131.pdf"; // make sure file name matches
    const bytes = await fetch(pdfUrl).then(r => r.arrayBuffer());
    const pdfDoc = await PDFLib.PDFDocument.load(bytes);
    const form = pdfDoc.getForm();
    const fields = form.getFields();

    console.log("🧾 Found " + fields.length + " form fields:");
    fields.forEach(f => console.log(f.getName()));

    // optional: display on screen too
    const pre = document.createElement("pre");
    pre.textContent = fields.map(f => f.getName()).join("\n");
    document.body.appendChild(pre);

    status.textContent = "✅ Field names printed below (and in console)";
  } catch (err) {
    console.error(err);
    status.textContent = "❌ Error: " + err.message;
  }
});
