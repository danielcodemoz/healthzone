import{d,j as r}from"./index-DvWX3Y4B.js";/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=d("Download",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c=d("FileDown",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M12 18v-6",key:"17g6i2"}],["path",{d:"m9 15 3 3 3-3",key:"1npd3o"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=d("FileText",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);function h(o,i,a){let e=`${o}
`;e+=`Exported: ${new Date().toLocaleString()}
`,e+="=".repeat(60)+`

`,e+=i.join("	")+`
`,e+="-".repeat(60)+`
`,a.forEach(l=>{e+=l.join("	")+`
`}),e+=`
`+"-".repeat(60)+`
`,e+=`Total records: ${a.length}
`;const n=new Blob([e],{type:"text/plain;charset=utf-8"}),t=URL.createObjectURL(n),s=document.createElement("a");s.href=t,s.download=`${o.replace(/\s+/g,"_")}_${new Date().toISOString().split("T")[0]}.txt`,s.click(),URL.revokeObjectURL(t)}function f(o,i,a){const e=window.open("","_blank");if(!e)return alert("Please allow popups to export PDF");const n=a.map(t=>`<tr>${t.map(s=>`<td>${s}</td>`).join("")}</tr>`).join("");e.document.write(`<!DOCTYPE html><html><head><title>${o}</title>
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
    <div class="header"><div class="logo">HZ</div><h1>${o}</h1></div>
    <p class="meta">Exported from HealthZone on ${new Date().toLocaleString()} · ${a.length} records</p>
    <table>
      <thead><tr>${i.map(t=>`<th>${t}</th>`).join("")}</tr></thead>
      <tbody>${n}</tbody>
    </table>
    <div class="footer">HealthZone — Personal Health Assistant · Generated Report</div>
  </body></html>`),e.document.close(),setTimeout(()=>e.print(),400)}function b({title:o,getData:i}){const a=()=>{const{headers:n,rows:t}=i();h(o,n,t)},e=()=>{const{headers:n,rows:t}=i();f(o,n,t)};return r.jsxs("div",{className:"flex items-center gap-1.5",children:[r.jsxs("span",{className:"text-xs text-surface-400 mr-1 hidden sm:inline",children:[r.jsx(p,{size:12,className:"inline mr-1"}),"Export:"]}),r.jsxs("button",{onClick:a,className:`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium
          bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300
          hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors`,"aria-label":"Export as TXT",children:[r.jsx(x,{size:13})," TXT"]}),r.jsxs("button",{onClick:e,className:`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium
          bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400
          hover:bg-primary-100 dark:hover:bg-primary-500/20 transition-colors`,"aria-label":"Export as PDF",children:[r.jsx(c,{size:13})," PDF"]})]})}export{b as E};
