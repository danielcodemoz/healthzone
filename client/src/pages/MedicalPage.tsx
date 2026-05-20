import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Pill, Plus, AlertTriangle, Phone, Trash2, ShieldCheck, Pencil, Stethoscope } from 'lucide-react';
import api from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import ExportButtons from '../components/ui/ExportButtons';
import { useUIStore } from '../store/uiStore';
import { staggerContainer, staggerItem } from '../animations/variants';
import type { Medication, Allergy, MedicalCondition, EmergencyContact } from '../types';

type Tab = 'meds' | 'allergies' | 'conditions' | 'contacts';

export default function MedicalPage() {
  const [tab, setTab] = useState<Tab>('meds');
  const [meds, setMeds] = useState<Medication[]>([]);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [conditions, setConditions] = useState<MedicalCondition[]>([]);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [modal, setModal] = useState<{ mode: 'add' | 'edit'; tab: Tab; data?: any } | null>(null);
  const [form, setForm] = useState<any>({});
  const addToast = useUIStore((s) => s.addToast);

  const load = useCallback(() => {
    api.get('/medications').then((r) => setMeds(r.data));
    api.get('/medical/allergies').then((r) => setAllergies(r.data));
    api.get('/medical/conditions').then((r) => setConditions(r.data));
    api.get('/medical/emergency-contacts').then((r) => setContacts(r.data));
  }, []);
  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setModal({ mode: 'add', tab }); setForm({}); };
  const openEdit = (t: Tab, data: any) => { setModal({ mode: 'edit', tab: t, data }); setForm({ ...data }); };

  const save = async () => {
    if (!modal) return;
    const endpoints: Record<Tab, string> = { meds: '/medications', allergies: '/medical/allergies', conditions: '/medical/conditions', contacts: '/medical/emergency-contacts' };
    if (modal.mode === 'add') {
      await api.post(endpoints[modal.tab], form);
      addToast('Added successfully!', 'success');
    } else {
      await api.put(`${endpoints[modal.tab]}/${form.id}`, form);
      addToast('Updated successfully!', 'success');
    }
    setModal(null); setForm({}); load();
  };

  const del = async (t: Tab, id: number) => {
    const endpoints: Record<Tab, string> = { meds: '/medications', allergies: '/medical/allergies', conditions: '/medical/conditions', contacts: '/medical/emergency-contacts' };
    await api.delete(`${endpoints[t]}/${id}`);
    addToast('Removed', 'info'); load();
  };

  const getExportData = () => {
    if (tab === 'meds') return { headers: ['Name', 'Dosage', 'Frequency', 'Time', 'Notes'], rows: meds.map((m) => [m.name, m.dosage || '-', m.frequency || '-', m.time || '-', m.notes || '-']) };
    if (tab === 'allergies') return { headers: ['Name', 'Severity', 'Notes'], rows: allergies.map((a) => [a.name, a.severity, a.notes || '-']) };
    if (tab === 'conditions') return { headers: ['Name', 'Diagnosed', 'Notes'], rows: conditions.map((c) => [c.name, c.diagnosed_date || '-', c.notes || '-']) };
    return { headers: ['Name', 'Phone', 'Relationship', 'Primary'], rows: contacts.map((c) => [c.name, c.phone, c.relationship || '-', c.is_primary ? 'Yes' : 'No']) };
  };

  const tabs: { key: Tab; label: string; icon: any; count: number }[] = [
    { key: 'meds', label: 'Medications', icon: Pill, count: meds.length },
    { key: 'allergies', label: 'Allergies', icon: AlertTriangle, count: allergies.length },
    { key: 'conditions', label: 'Conditions', icon: ShieldCheck, count: conditions.length },
    { key: 'contacts', label: 'Emergency', icon: Phone, count: contacts.length },
  ];

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={staggerItem} className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-violet-500/10"><Stethoscope size={24} className="text-violet-500" /></div>
          <div><h1 className="text-2xl font-bold">Medical Info</h1><p className="text-surface-500 mt-0.5">Manage your medical records</p></div>
        </div>
        <div className="flex items-center gap-3">
          <ExportButtons title={`Medical - ${tabs.find((t) => t.key === tab)?.label}`} getData={getExportData} />
          <Button onClick={openAdd}><Plus size={16} className="mr-1" /> Add</Button>
        </div>
      </motion.div>

      <motion.div variants={staggerItem} className="flex gap-1 bg-surface-100 dark:bg-surface-800 p-1 rounded-xl overflow-x-auto">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} aria-label={t.label}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${tab === t.key ? 'bg-white dark:bg-surface-700 shadow-sm text-primary-600' : 'text-surface-500 hover:text-surface-700'}`}>
            <t.icon size={16} />{t.label} <span className="text-xs bg-surface-200 dark:bg-surface-600 px-1.5 rounded-full">{t.count}</span>
          </button>
        ))}
      </motion.div>

      <motion.div variants={staggerItem}>
        {tab === 'meds' && (
          <div className="grid gap-3">{meds.map((m) => (
            <Card key={m.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3"><Pill size={18} className="text-violet-500 flex-shrink-0" /><div><h3 className="font-semibold">{m.name}</h3><p className="text-sm text-surface-500">{m.dosage} · {m.frequency} {m.time && `· ${m.time}`}</p>{m.notes && <p className="text-xs text-surface-400 mt-1">{m.notes}</p>}</div></div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit('meds', m)} className="text-primary-400 hover:text-primary-500 p-2" aria-label="Edit"><Pencil size={15} /></button>
                <button onClick={() => del('meds', m.id)} className="text-red-400 hover:text-red-500 p-2" aria-label="Delete"><Trash2 size={15} /></button>
              </div>
            </Card>
          ))}{meds.length === 0 && <p className="text-surface-400 text-center py-8">No medications added</p>}</div>
        )}
        {tab === 'allergies' && (
          <div className="grid gap-3">{allergies.map((a) => (
            <Card key={a.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3"><AlertTriangle size={18} className={`flex-shrink-0 ${a.severity === 'severe' ? 'text-red-500' : 'text-amber-500'}`} /><div><h3 className="font-semibold">{a.name}</h3><span className={`text-xs px-2 py-0.5 rounded-full ${a.severity === 'severe' ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400' : 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400'}`}>{a.severity}</span>{a.notes && <p className="text-xs text-surface-400 mt-1">{a.notes}</p>}</div></div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit('allergies', a)} className="text-primary-400 hover:text-primary-500 p-2" aria-label="Edit"><Pencil size={15} /></button>
                <button onClick={() => del('allergies', a.id)} className="text-red-400 hover:text-red-500 p-2" aria-label="Delete"><Trash2 size={15} /></button>
              </div>
            </Card>
          ))}{allergies.length === 0 && <p className="text-surface-400 text-center py-8">No allergies added</p>}</div>
        )}
        {tab === 'conditions' && (
          <div className="grid gap-3">{conditions.map((c) => (
            <Card key={c.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3"><ShieldCheck size={18} className="text-emerald-500 flex-shrink-0" /><div><h3 className="font-semibold">{c.name}</h3>{c.diagnosed_date && <p className="text-xs text-surface-400">Diagnosed: {c.diagnosed_date}</p>}{c.notes && <p className="text-xs text-surface-400">{c.notes}</p>}</div></div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit('conditions', c)} className="text-primary-400 hover:text-primary-500 p-2" aria-label="Edit"><Pencil size={15} /></button>
                <button onClick={() => del('conditions', c.id)} className="text-red-400 hover:text-red-500 p-2" aria-label="Delete"><Trash2 size={15} /></button>
              </div>
            </Card>
          ))}{conditions.length === 0 && <p className="text-surface-400 text-center py-8">No conditions added</p>}</div>
        )}
        {tab === 'contacts' && (
          <div className="grid gap-3">{contacts.map((c) => (
            <Card key={c.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3"><Phone size={18} className="text-blue-500 flex-shrink-0" /><div><h3 className="font-semibold">{c.name} {c.is_primary ? '⭐' : ''}</h3><p className="text-sm text-surface-500">{c.phone} · {c.relationship}</p></div></div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit('contacts', c)} className="text-primary-400 hover:text-primary-500 p-2" aria-label="Edit"><Pencil size={15} /></button>
                <button onClick={() => del('contacts', c.id)} className="text-red-400 hover:text-red-500 p-2" aria-label="Delete"><Trash2 size={15} /></button>
              </div>
            </Card>
          ))}{contacts.length === 0 && <p className="text-surface-400 text-center py-8">No emergency contacts</p>}</div>
        )}
      </motion.div>

      <Modal open={!!modal} onClose={() => setModal(null)} title={`${modal?.mode === 'edit' ? 'Edit' : 'Add'} ${modal?.tab === 'meds' ? 'Medication' : modal?.tab === 'allergies' ? 'Allergy' : modal?.tab === 'conditions' ? 'Condition' : 'Contact'}`}>
        <div className="space-y-4">
          <Input label="Name" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} required autoFocus />
          {modal?.tab === 'meds' && (<><Input label="Dosage" value={form.dosage || ''} onChange={(e) => setForm({ ...form, dosage: e.target.value })} /><Input label="Frequency" value={form.frequency || ''} onChange={(e) => setForm({ ...form, frequency: e.target.value })} placeholder="e.g. Daily" /><Input label="Time" type="time" value={form.time || ''} onChange={(e) => setForm({ ...form, time: e.target.value })} /></>)}
          {modal?.tab === 'allergies' && (<div><label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Severity</label><select className="input-field" value={form.severity || 'moderate'} onChange={(e) => setForm({ ...form, severity: e.target.value })} aria-label="Severity"><option value="mild">Mild</option><option value="moderate">Moderate</option><option value="severe">Severe</option></select></div>)}
          {modal?.tab === 'contacts' && (<><Input label="Phone" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} /><Input label="Relationship" value={form.relationship || ''} onChange={(e) => setForm({ ...form, relationship: e.target.value })} /></>)}
          {modal?.tab === 'conditions' && <Input label="Diagnosed Date" type="date" value={form.diagnosed_date || ''} onChange={(e) => setForm({ ...form, diagnosed_date: e.target.value })} />}
          <Input label="Notes" value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <div className="flex gap-3 justify-end"><Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button><Button onClick={save}>{modal?.mode === 'edit' ? 'Update' : 'Save'}</Button></div>
        </div>
      </Modal>
    </motion.div>
  );
}
