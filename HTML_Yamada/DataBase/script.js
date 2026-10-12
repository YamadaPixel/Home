const API_URL = "http://192.168.11.8:8000"; //家だったらIpconfig(IPアドレスがずれる場合があるのでLiveServerの拡張機能の設定とこの数字を一致させる)、長工でWi-Fi接続、FastAPI使用時だったら172.16.12.79 基本的にIPアドレス使用
async function UpdateTable() {
  const TableData = await fetch(`${API_URL}/GetList`);
  const Data = await TableData.json();
  const table = document.querySelector("table");
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }
  Data.forEach(([DateVal, Location, Item, Amount]) => {
    const dateParts = DateVal.split('-');
    const formattedDate = dateParts.length === 3 
      ? `${dateParts[0]}年${dateParts[1]}月${dateParts[2]}日` 
      : Date;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${formattedDate}</td>
      <td>${Location}</td>
      <td>${Item}</td>
      <td>${Number(Amount).toLocaleString()}円</td>
    `;
    table.appendChild(tr);
  });
}
async function AddContent() {
  const DateInput = document.getElementById("date");
  const LocationInput = document.getElementById("location");
  const ItemInput = document.getElementById("item");
  const AmountInput = document.getElementById("amount");
  const Date = DateInput.value;
  const Location = LocationInput.value.trim();
  const Item = ItemInput.value.trim();
  const Amount = AmountInput.value;
  if (!Date || !Location || !Item || !Amount) {
    alert("すべての項目を入力してください");
    return;
  }
  const url = `${API_URL}/AddContent?Date=${Date}&Location=${encodeURIComponent(Location)}&Item=${encodeURIComponent(Item)}&Amount=${Amount}`;
  await fetch(url, { method: 'POST' });
  LocationInput.value = "";
  ItemInput.value = "";
  AmountInput.value = "";
  UpdateTable();
}
function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.top = "-9999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      alert("入出金明細表をコピーしました！");
    } else {
      alert("コピーに失敗しました");
    }
  } catch (err) {
    console.error("コピーエラー:", err);
  }
  document.body.removeChild(textArea);
}
document.addEventListener("DOMContentLoaded", () => {
  const copyBtn = document.getElementById("fullkopi");
  const tableElement = document.querySelector("table");

  if (copyBtn && tableElement) {
    copyBtn.addEventListener("click", function() {
      const rows = tableElement.querySelectorAll("tr");
      const textLines = [];
      rows.forEach(row => {
        const cols = row.querySelectorAll("th, td");
        const rowData = Array.from(cols).map(col => col.innerText.trim());
        textLines.push(rowData.join("\t"));
      });
      const textToCopy = textLines.join("\r\n");
      fallbackCopyTextToClipboard(textToCopy);
    });
  }
});
window.onload = UpdateTable;