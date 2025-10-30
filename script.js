document.getElementById("fillBtn").addEventListener("click", async () => {
  const status = document.getElementById("status");
  status.textContent = "";

  // 所有输入字段的校验规则
  const fields = [
    { id: "family", rule: v => v !== "", msg: "请输入姓氏" },
    { id: "given", rule: v => v !== "", msg: "请输入名字" },
    { id: "dob", rule: v => /^\d{2}-\d{2}-\d{4}$/.test(v), msg: "日期格式应为 MM-DD-YYYY" },
    { id: "birthCountry", rule: v => v !== "", msg: "请输入出生国家" },
    { id: "citizenship", rule: v => v !== "", msg: "请输入国籍" },
    { id: "street", rule: v => v !== "", msg: "请输入街道地址" },
    { id: "city", rule: v => v !== "", msg: "请输入城市名称" },
    { id: "state", rule: v => /^[A-Za-z]{2}$/.test(v), msg: "请输入州缩写 (如 CA)" },
    { id: "zip", rule: v => /^\d{5}$/.test(v), msg: "请输入5位邮编" },
    { id: "country", rule: v => v !== "", msg: "请输入国家" },
    { id: "phone", rule: v => /^\d{10}$/.test(v.replace(/\D/g, "")), msg: "请输入正确的10位数字" },
    { id: "email", rule: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: "请输入正确邮箱" },
  ];

  let hasError = false;

  // 重置状态
  fields.forEach(f => {
    const input = document.getElementById(f.id);
    input.classList.remove("error");
    document.getElementById(`err-${f.id}`).style.display = "none";
  });

  // 验证输入
  fields.forEach(f => {
    const val = document.getElementById(f.id).value.trim();
    if (!f.rule(val)) {
      const input = document.getElementById(f.id);
      input.classList.add("error");
      document.getElementById(`err-${f.id}`).style.display = "block";
      hasError = true;
    }
  });

  if (hasError) {
    status.textContent = "⚠️ 请修正以上错误后再提交。";
    return;
  }

  try {
    status.textContent = "⏳ 正在生成 PDF，请稍候...";

    const pdfBytes = await fetch("./I-131_unlocked.pdf").then(r => r.arrayBuffer());
    const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();

    const g = id => document.getElementById(id).value.trim();

    form.getTextField("form1[0].P4[0].Part2_Line1_FamilyName[0]").setText(g("family"));
    form.getTextField("form1[0].P4[0].Part2_Line1_GivenName[0]").setText(g("given"));
    form.getTextField("form1[0].P5[0].Part2_Line9_DateOfBirth[0]").setText(g("dob"));
    form.getTextField("form1[0].P5[0].Part2_Line6_CountryOfBirth[0]").setText(g("birthCountry"));
    form.getTextField("form1[0].P5[0].Part2_Line7_CountryOfCitizenshiporNationality[0]").setText(g("citizenship"));

    // 地址部分
    form.getTextField("form1[0].P5[0].Part2_Line3_StreetNumberName[0]").setText(g("street"));
    form.getTextField("form1[0].P5[0].Part2_Line3_CityTown[0]").setText(g("city"));
    try {
      form.getDropdown("form1[0].P5[0].Part2_Line3_State[0]").select(g("state"));
    } catch {
      form.getTextField("form1[0].P5[0].Part2_Line3_State[0]").setText(g("state"));
    }
    form.getTextField("form1[0].P5[0].Part2_Line3_ZipCode[0]").setText(g("zip"));
    form.getTextField("form1[0].P5[0].Part2_Line3_Country[0]").setText(g("country"));

    // 电话、邮箱
    const cleanedPhone = g("phone").replace(/\D/g, "").slice(-10);
    form.getTextField("form1[0].#subform[10].Part10_Line1_DayPhone[0]").setText(cleanedPhone);
    form.getTextField("form1[0].#subform[10].Part10_Line3_Email[0]").setText(g("email"));

    form.flatten();

    const filledBytes = await pdfDoc.save();
    const blob = new Blob([filledBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "I-131_filled.pdf";
    a.click();

    status.textContent = "✅ 已成功生成填写后的 PDF 文件！";
  } catch (err) {
    console.error(err);
    status.textContent = "❌ 错误：" + err.message;
  }
});
