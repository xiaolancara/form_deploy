document.getElementById("fillBtn").addEventListener("click", async () => {
  const status = document.getElementById("status");
  status.textContent = "⏳ 正在生成 PDF，请稍候...";

  try {
    // 收集输入数据
    const family = document.getElementById("family").value.trim();
    const given = document.getElementById("given").value.trim();
    const dob = document.getElementById("dob").value.trim();
    const birthCountry = document.getElementById("birthCountry").value.trim();
    const citizenship = document.getElementById("citizenship").value.trim();
    const street = document.getElementById("street").value.trim();
    const city = document.getElementById("city").value.trim();
    const state = document.getElementById("state").value.trim();
    const zip = document.getElementById("zip").value.trim();
    const country = document.getElementById("country").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();

    // 载入 PDF
    const pdfBytes = await fetch("./I-131_unlocked.pdf").then(r => r.arrayBuffer());
    const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();

    // 填写主要字段
    form.getTextField("form1[0].P4[0].Part2_Line1_FamilyName[0]").setText(family);
    form.getTextField("form1[0].P4[0].Part2_Line1_GivenName[0]").setText(given);
    form.getTextField("form1[0].P5[0].Part2_Line9_DateOfBirth[0]").setText(dob);
    form.getTextField("form1[0].P5[0].Part2_Line6_CountryOfBirth[0]").setText(birthCountry);
    form.getTextField("form1[0].P5[0].Part2_Line7_CountryOfCitizenshiporNationality[0]").setText(citizenship);

    // 地址部分
    form.getTextField("form1[0].P5[0].Part2_Line3_StreetNumberName[0]").setText(street);
    form.getTextField("form1[0].P5[0].Part2_Line3_CityTown[0]").setText(city);
    form.getTextField("form1[0].P5[0].Part2_Line3_State[0]").setText(state);
    form.getTextField("form1[0].P5[0].Part2_Line3_ZipCode[0]").setText(zip);
    form.getTextField("form1[0].P5[0].Part2_Line3_Country[0]").setText(country);

    // 电话: 清除非数字, 保留最后10位
    const cleanedPhone = phone.replace(/\D/g, "").slice(-10);
    form.getTextField("form1[0].#subform[10].Part10_Line1_DayPhone[0]").setText(cleanedPhone);
    form.getTextField("form1[0].#subform[10].Part10_Line3_Email[0]").setText(email);

    form.flatten();

    // 导出 PDF
    const filledBytes = await pdfDoc.save();
    const blob = new Blob([filledBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "I-131_filled.pdf";
    a.click();

    status.textContent = "✅ 已生成填写好的 PDF 文件！";
  } catch (err) {
    console.error(err);
    status.textContent = "❌ 错误：" + err.message;
  }
});
