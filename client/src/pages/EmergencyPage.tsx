import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Phone, MapPin, CreditCard, Plus, Trash2, Pencil, Siren, HeartPulse } from 'lucide-react';
import api from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import ExportButtons from '../components/ui/ExportButtons';
import { useUIStore } from '../store/uiStore';
import { useAuthStore } from '../store/authStore';
import { staggerContainer, staggerItem } from '../animations/variants';
import type { EmergencyContact } from '../types';

export default function EmergencyPage() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [form, setForm] = useState<any>({});
  const addToast = useUIStore((s) => s.addToast);
  const user = useAuthStore((s) => s.user);

  const load = useCallback(() => { api.get('/medical/emergency-contacts').then((r) => setContacts(r.data)); }, []);
  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!form.name || !form.phone) return addToast('Name and phone required', 'error');
    if (modal === 'add') { await api.post('/medical/emergency-contacts', form); addToast('Contact added!', 'success'); }
    else { await api.put(`/medical/emergency-contacts/${form.id}`, form); addToast('Contact updated!', 'success'); }
    setModal(null); setForm({}); load();
  };
  const del = async (id: number) => { await api.delete(`/medical/emergency-contacts/${id}`); addToast('Removed', 'info'); load(); };

  const getExportData = () => ({
    headers: ['Name', 'Phone', 'Relationship', 'Primary Contact'],
    rows: contacts.map((c) => [c.name, c.phone, c.relationship || '-', c.is_primary ? 'Yes' : 'No']),
  });

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={staggerItem} className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-500/10"><Siren size={24} className="text-red-500" /></div>
          <div><h1 className="text-2xl font-bold text-red-600 dark:text-red-400">Emergency</h1><p className="text-surface-500 mt-0.5">Quick access to emergency information</p></div>
        </div>
        <ExportButtons title="Emergency Info" getData={getExportData} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={staggerItem}>
          <div className="rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 p-6 text-white shadow-xl shadow-red-500/20">
            <div className="flex items-center gap-2 mb-4"><CreditCard size={20} /><h2 className="font-bold text-lg">Medical ID</h2></div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="opacity-70 text-xs">Name</span><p className="font-semibold">{user?.name || '—'}</p></div>
              <div><span className="opacity-70 text-xs">Blood Type</span><p className="font-semibold">{user?.blood_type || '—'}</p></div>
              <div><span className="opacity-70 text-xs">Height</span><p className="font-semibold">{user?.height ? `${user.height} cm` : '—'}</p></div>
              <div><span className="opacity-70 text-xs">Weight</span><p className="font-semibold">{user?.weight ? `${user.weight} kg` : '—'}</p></div>
              <div><span className="opacity-70 text-xs">DOB</span><p className="font-semibold">{user?.dob || '—'}</p></div>
              <div><span className="opacity-70 text-xs">Primary Contact</span><p className="font-semibold">{contacts.find((c) => c.is_primary)?.name || '—'}</p></div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Card className="h-full flex flex-col items-center justify-center text-center space-y-3 min-h-[200px] border-2 border-dashed border-surface-300 dark:border-surface-600">
            <MapPin size={32} className="text-surface-300" />
            <h3 className="font-semibold">Hospital Locator</h3>
            <p className="text-sm text-surface-400">Map integration coming soon</p>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={staggerItem}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2"><Phone size={18} className="text-red-500" /> Emergency Contacts</h2>
          <Button size="sm" onClick={() => { setModal('add'); setForm({}); }}><Plus size={14} className="mr-1" /> Add</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {contacts.map((c) => (
            <Card key={c.id} className="border-l-4 border-red-500">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{c.name} {c.is_primary ? '⭐' : ''}</h3>
                  <p className="text-sm text-surface-500">{c.relationship}</p>
                  <a href={`tel:${c.phone}`} className="text-sm text-primary-500 font-medium flex items-center gap-1 mt-1"><Phone size={14} />{c.phone}</a>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => { setModal('edit'); setForm({ ...c }); }} className="text-primary-400 hover:text-primary-500 p-1.5" aria-label="Edit"><Pencil size={14} /></button>
                  <button onClick={() => del(c.id)} className="text-red-400 hover:text-red-500 p-1.5" aria-label="Delete"><Trash2 size={14} /></button>
                </div>
              </div>
            </Card>
          ))}
          {contacts.length === 0 && <p className="text-surface-400 col-span-2 text-center py-8">No emergency contacts</p>}
        </div>
      </motion.div>

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === 'edit' ? 'Edit Contact' : 'Add Emergency Contact'}>
        <div className="space-y-4">
          <Input label="Name" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} required autoFocus />
          <Input label="Phone" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          <Input label="Relationship" value={form.relationship || ''} onChange={(e) => setForm({ ...form, relationship: e.target.value })} />
          <div className="flex gap-3 justify-end"><Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button><Button variant="danger" onClick={save}>{modal === 'edit' ? 'Update' : 'Add'} Contact</Button></div>
        </div>
      </Modal>
    </motion.div>
  );
}
