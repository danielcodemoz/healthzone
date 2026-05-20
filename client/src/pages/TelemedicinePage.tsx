import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Video, Plus, Calendar, Clock, Stethoscope, Trash2, Pencil, UserRound } from 'lucide-react';
import api from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import ExportButtons from '../components/ui/ExportButtons';
import { useUIStore } from '../store/uiStore';
import { staggerContainer, staggerItem } from '../animations/variants';
import type { Appointment } from '../types';

const mockDoctors = [
  { name: 'Dr. Sarah Mitchell', specialty: 'General Medicine', avatar: 'SM' },
  { name: 'Dr. James Wilson', specialty: 'Cardiology', avatar: 'JW' },
  { name: 'Dr. Lisa Park', specialty: 'Dermatology', avatar: 'LP' },
  { name: 'Dr. David Brown', specialty: 'Neurology', avatar: 'DB' },
];

export default function TelemedicinePage() {
  const [appts, setAppts] = useState<Appointment[]>([]);
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [form, setForm] = useState<any>({});
  const addToast = useUIStore((s) => s.addToast);

  const load = () => api.get('/appointments').then((r) => setAppts(r.data));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.doctor_name || !form.date) return addToast('Fill required fields', 'error');
    if (modal === 'add') { await api.post('/appointments', form); addToast('Appointment booked! 📅', 'success'); }
    else { await api.put(`/appointments/${form.id}`, form); addToast('Appointment updated!', 'success'); }
    setModal(null); setForm({}); load();
  };

  const del = async (id: number) => {
    await api.delete(`/appointments/${id}`);
    addToast('Appointment cancelled', 'info');
    load();
  };

  const getExportData = () => ({
    headers: ['Doctor', 'Specialty', 'Date', 'Time', 'Status'],
    rows: appts.map((a) => [a.doctor_name, a.specialty || '-', a.date, a.time || '-', a.status]),
  });

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={staggerItem} className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-500/10"><Stethoscope size={24} className="text-teal-500" /></div>
          <div><h1 className="text-2xl font-bold">Telemedicine</h1><p className="text-surface-500 mt-0.5">Connect with healthcare professionals</p></div>
        </div>
        <div className="flex items-center gap-3">
          <ExportButtons title="Appointments" getData={getExportData} />
          <Button onClick={() => { setModal('add'); setForm({}); }}><Plus size={16} className="mr-1" /> Book</Button>
        </div>
      </motion.div>

      <motion.div variants={staggerItem}>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><UserRound size={18} className="text-teal-500" /> Available Doctors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockDoctors.map((d) => (
            <Card key={d.name} className="text-center space-y-3">
              <div className="w-14 h-14 rounded-full gradient-accent flex items-center justify-center text-white font-bold mx-auto">{d.avatar}</div>
              <h3 className="font-semibold text-sm">{d.name}</h3>
              <span className="text-xs text-surface-500">{d.specialty}</span>
              <Button size="sm" variant="outline" className="w-full" onClick={() => { setForm({ doctor_name: d.name, specialty: d.specialty }); setModal('add'); }}>
                <Video size={14} className="mr-1" /> Consult
              </Button>
            </Card>
          ))}
        </div>
      </motion.div>

      <motion.div variants={staggerItem}>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Calendar size={18} className="text-primary-500" /> Upcoming Appointments</h2>
        {appts.length === 0 ? <p className="text-surface-400 text-center py-8">No appointments</p> : (
          <div className="space-y-3">{appts.map((a) => (
            <Card key={a.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center"><Stethoscope size={18} className="text-primary-500" /></div>
                <div>
                  <h3 className="font-semibold">{a.doctor_name}</h3>
                  <p className="text-sm text-surface-500">{a.specialty}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right text-sm">
                  <div className="flex items-center gap-1 text-surface-500"><Calendar size={14} />{a.date}</div>
                  {a.time && <div className="flex items-center gap-1 text-surface-400"><Clock size={14} />{a.time}</div>}
                </div>
                <button onClick={() => { setModal('edit'); setForm({ ...a }); }} className="text-primary-400 hover:text-primary-500 p-1.5" aria-label="Edit"><Pencil size={15} /></button>
                <button onClick={() => del(a.id)} className="text-red-400 hover:text-red-500 p-1.5" aria-label="Delete"><Trash2 size={15} /></button>
              </div>
            </Card>
          ))}</div>
        )}
      </motion.div>

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === 'edit' ? 'Edit Appointment' : 'Book Appointment'}>
        <div className="space-y-4">
          <Input label="Doctor" value={form.doctor_name || ''} onChange={(e) => setForm({ ...form, doctor_name: e.target.value })} required />
          <Input label="Specialty" value={form.specialty || ''} onChange={(e) => setForm({ ...form, specialty: e.target.value })} />
          <Input label="Date" type="date" value={form.date || ''} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
          <Input label="Time" type="time" value={form.time || ''} onChange={(e) => setForm({ ...form, time: e.target.value })} />
          <Input label="Notes" value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <div className="flex gap-3 justify-end"><Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button><Button onClick={save}>{modal === 'edit' ? 'Update' : 'Book'}</Button></div>
        </div>
      </Modal>
    </motion.div>
  );
}
