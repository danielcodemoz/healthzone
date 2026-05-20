export function exportToTxt(title: string, headers: string[], rows: string[][]) {
  let content = `${title}\n`;
  content += `Exported: ${new Date().toLocaleString()}\n`;
  content += '='.repeat(60) + '\n\n';
  content += headers.join('\t') + '\n';
  content += '-'.repeat(60) + '\n';
  rows.forEach((row) => {
    content += row.join('\t') + '\n';
  });
  content += '\n' + '-'.repeat(60) + '\n';
  content += `Total records: ${rows.length}\n`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToPdf(title: string, headers: string[], rows: string[][]) {
  const w = window.open('', '_blank');
  if (!w) return alert('Please allow popups to export PDF');

  const tableRows = rows
    .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`)
    .join('');

  w.document.write(`<!DOCTYPE html><html><head><title>${title}</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Segoe UI', Inter, system-ui, sans-serif; padding: 48px; color: #1e293b; }
      .header { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
      .logo { width: 36px; height: 36px; background: linear-gradient(135deg, #6366f1, #06b6d4); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px; }
      h1 { font-size: 22px; color: #4f46e5; }
      .meta { color: #64748b; font-size: 12px; margin-bottom: 24px; }
      table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px; }
      th { background: #f1f5f9; color: #334155; font-weight: 600; text-align: left; padding: 10px 14px; border: 1px solid #e2e8f0; }
      td { padding: 8px 14px; border: 1px solid #e2e8f0; }
      tr:nth-child(even) { background: #f8fafc; }
      .footer { margin-top: 24px; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 12px; }
      @media print { body { padding: 24px; } }
    </style>
  </head><body>
    <div class="header"><div class="logo">HZ</div><h1>${title}</h1></div>
    <p class="meta">Exported from HealthZone on ${new Date().toLocaleString()} · ${rows.length} records</p>
    <table>
      <thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
      <tbody>${tableRows}</tbody>
    </table>
    <div class="footer">HealthZone — Personal Health Assistant · Generated Report</div>
  </body></html>`);
  w.document.close();
  setTimeout(() => w.print(), 400);
}
