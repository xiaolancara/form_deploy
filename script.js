document.getElementById("fillBtn").addEventListener("click", async () => {
  const status = document.getElementById("status");
  status.textContent = "正在填写表格...";

  try {
    // 📥 获取用户输入
    const family = document.getElementById("family").value || "";
    const given = document.getElementById("given").value || "";
    const dob = document.getElementById("dob").value || "";
    const birthCountry = document.getElementById("birthCountry").value || "";
    const citizenship = document.getElementById("citizenship").value || "";
    const street = document.getElementById("street").value || "";
    const city = document.getElementById("city").value || "";
    const state = document.getElementById("state").value || "";
    const zip = document.getElementById("zip").value || "";
    const country = document.getElementById("country").value || "";
    const phone = document.getElementById("phone").value || "";
    const email = document.getElementById("email").value || "";

    // 📄 载入解锁的 I-131 PDF
    const pdfBytes = await fetch("./i-131.pdf").then(r => r.arrayBuffer());
    const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();

    // 👤 基本信息
    form.getTextField("form1[0].P4[0].Part2_Line1_FamilyName[0]").setText(family);
    form.getTextField("form1[0].P4[0].Part2_Line1_GivenName[0]").setText(given);
    form.getTextField("form1[0].P5[0].Part2_Line9_DateOfBirth[0]").setText(dob);
    form.getTextField("form1[0].P5[0].Part2_Line6_CountryOfBirth[0]").setText(birthCountry);
    form.getTextField("form1[0].P5[0].Part2_Line7_CountryOfCitizenshiporNationality[0]").setText(citizenship);

    // 🏠 地址信息
    form.getTextField("form1[0].P5[0].Part2_Line3_StreetNumberName[0]").setText(street);
    form.getTextField("form1[0].P5[0].Part2_Line3_CityTown[0]").setText(city);
    form.getTextField("form1[0].P5[0].Part2_Line3_State[0]").setText(state);
    form.getTextField("form1[0].P5[0].Part2_Line3_ZipCode[0]").setText(zip);
    form.getTextField("form1[0].P5[0].Part2_Line3_Country[0]").setText(country);

    // ☎️ 联系方式（限制10位数字）
    const cleanedPhone = phone.replace(/\D/g, "").slice(-10);
    form.getTextField("form1[0].#subform[10].Part10_Line1_DayPhone[0]").setText(cleanedPhone);
    form.getTextField("form1[0].#subform[10].Part10_Line3_Email[0]").setText(email);

    form.flatten();

    // 💾 导出
    const filledBytes = await pdfDoc.save();
    const blob = new Blob([filledBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "I-131_filled.pdf";
    a.click();

    status.textContent = "✅ 填写完成！已下载填写好的 PDF。";
  } catch (err) {
    console.error(err);
    status.textContent = "❌ 错误：" + err.message;
  }
});
