import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { CalendarDays, Clock3, Save, Trash2 } from 'lucide-react';

type Proctor = { id: number; name: string; email: string };
type Schedule = {
    id: number;
    exam_id: string;
    exam_date: string;
    exam_time: string;
    venue: string;
    program: string;
    assigned_proctor: string | null;
};
type PageProps = { programs: string[]; proctors: Proctor[]; schedules: Schedule[] };

const timeOptions = Array.from({ length: 48 }, (_, index) => {
    const hour = Math.floor(index / 2).toString().padStart(2, '0');
    const minute = index % 2 === 0 ? '00' : '30';
    return `${hour}:${minute}`;
});

export default function CoordinatorCompreScheduleIndex() {
    const { props } = usePage<PageProps>();
    const form = useForm({
        exam_id: '',
        exam_date: '',
        exam_time: '',
        venue: '',
        program: '',
        proctor_id: '',
    });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        form.post(route('coordinator.compre-schedule.store'), { preserveScroll: true, onSuccess: () => form.reset() });
    }

    function removeSchedule(id: number) {
        if (window.confirm('Remove this exam schedule?')) {
            form.delete(route('coordinator.compre-schedule.destroy', id), { preserveScroll: true });
        }
    }

    return (
        <AppLayout>
            <Head title="Schedule and Proctors" />
            <div className="space-y-5 px-7 pt-5 pb-6">
                <div>
                    <h1 className="text-lg font-semibold">Schedule and Proctors</h1>
                    <p className="text-muted-foreground text-sm">Create a comprehensive exam schedule and assign a proctor.</p>
                </div>

                <form onSubmit={submit} className="grid gap-4 rounded-lg border bg-white p-5 shadow-sm md:grid-cols-2">
                    <div>
                        <label className="mb-1 block bg-white text-sm font-bold text-black dark:bg-white dark:text-black">Exam ID</label>
                        <Input className="text-black placeholder:text-gray-500 dark:text-white" value={form.data.exam_id} onChange={(e) => form.setData('exam_id', e.target.value)} placeholder="e.g. CE-2026-001" />
                        {form.errors.exam_id && <p className="text-sm text-red-600">{form.errors.exam_id}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block bg-white text-sm font-bold text-black dark:bg-white dark:text-black">Date</label>
                        <div className="relative">
                            <CalendarDays className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                            <Input type="date" className="pl-8 text-black dark:text-white" value={form.data.exam_date} onChange={(e) => form.setData('exam_date', e.target.value)} />
                        </div>
                        {form.errors.exam_date && <p className="text-sm text-red-600">{form.errors.exam_date}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block bg-white text-sm font-bold text-black dark:bg-white dark:text-black">Time</label>
                        <div className="relative">
                            <Clock3 className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                            <select className="border-input h-10 w-full rounded-md border bg-background pl-8 text-sm text-black dark:text-white" value={form.data.exam_time} onChange={(e) => form.setData('exam_time', e.target.value)}>
                                <option value="">Select time</option>
                                {timeOptions.map((time) => <option key={time} value={time}>{time}</option>)}
                            </select>
                        </div>
                        {form.errors.exam_time && <p className="text-sm text-red-600">{form.errors.exam_time}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block bg-white text-sm font-bold text-black dark:bg-white dark:text-black">Venue</label>
                        <Input className="text-black placeholder:text-gray-500 dark:text-white" value={form.data.venue} onChange={(e) => form.setData('venue', e.target.value)} placeholder="e.g. Room 301" />
                        {form.errors.venue && <p className="text-sm text-red-600">{form.errors.venue}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block bg-white text-sm font-bold text-black dark:bg-white dark:text-black">Program</label>
                        <select className="border-input h-10 w-full rounded-md border bg-background px-3 text-sm text-black dark:text-white" value={form.data.program} onChange={(e) => form.setData('program', e.target.value)}>
                            <option value="">Select program</option>
                            {props.programs.map((program) => <option key={program} value={program}>{program}</option>)}
                        </select>
                        {form.errors.program && <p className="text-sm text-red-600">{form.errors.program}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block bg-white text-sm font-bold text-black dark:bg-white dark:text-black">Assigned Proctor</label>
                        <select className="border-input h-10 w-full rounded-md border bg-background px-3 text-sm text-black dark:text-white" value={form.data.proctor_id} onChange={(e) => form.setData('proctor_id', e.target.value)}>
                            <option value="">Select proctor</option>
                            {props.proctors.map((proctor) => <option key={proctor.id} value={proctor.id}>{proctor.name} ({proctor.email})</option>)}
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <Button type="submit" disabled={form.processing}><Save className="mr-2 h-4 w-4" />Save schedule</Button>
                    </div>
                </form>

                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/40"><tr><th className="p-3">Exam ID</th><th className="p-3">Date</th><th className="p-3">Time</th><th className="p-3">Venue</th><th className="p-3">Program</th><th className="p-3">Proctor</th><th className="p-3">Action</th></tr></thead>
                        <tbody>
                            {props.schedules.map((schedule) => <tr key={schedule.id} className="border-t"><td className="p-3">{schedule.exam_id}</td><td className="p-3">{schedule.exam_date}</td><td className="p-3">{schedule.exam_time.slice(0, 5)}</td><td className="p-3">{schedule.venue}</td><td className="p-3">{schedule.program}</td><td className="p-3">{schedule.assigned_proctor || '—'}</td><td className="p-3"><Button type="button" variant="destructive" size="sm" onClick={() => removeSchedule(schedule.id)} disabled={form.processing}><Trash2 className="mr-1 h-4 w-4" />Remove</Button></td></tr>)}
                            {props.schedules.length === 0 && <tr><td colSpan={7} className="text-muted-foreground p-8 text-center">No schedules saved yet.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
