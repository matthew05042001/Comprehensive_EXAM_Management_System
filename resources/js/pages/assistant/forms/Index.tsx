import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Check, Edit, Save, X } from 'lucide-react';
import { useState } from 'react';

type EvaluationForm = {
    id: number;
    form_timestamp: string;
    family_name: string;
    first_name: string;
    program: string;
    contact_number: string;
    email_address: string;
    id_number: string;
    evaluated: boolean;
};

type PageProps = {
    forms: EvaluationForm[];
    programs: string[];
};

const labelClass = 'mb-1 block bg-white text-sm font-bold text-black dark:bg-white dark:text-black';
const inputClass = 'text-black placeholder:text-gray-500 dark:text-white';

export default function AssistantFormsIndex() {
    const { props } = usePage<PageProps>();
    const form = useForm<{
        family_name: string;
        first_name: string;
        program: string;
        contact_number: string;
        email_address: string;
        id_number: string;
        evaluated: boolean;
    }>({
        family_name: '',
        first_name: '',
        program: '',
        contact_number: '',
        email_address: '',
        id_number: '',
        evaluated: false,
    });
    const [editingId, setEditingId] = useState<number | null>(null);

    function submit(event: React.FormEvent) {
        event.preventDefault();
        form.post(route('assistant.forms.store'), {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    }

    function updateEvaluation(id: number, evaluated: boolean) {
        router.patch(route('assistant.forms.evaluation', id), { evaluated }, {
            preserveScroll: true,
        });
    }

    function editForm(item: EvaluationForm) {
        setEditingId(item.id);
        form.setData({
            family_name: item.family_name,
            first_name: item.first_name,
            program: item.program,
            contact_number: item.contact_number,
            email_address: item.email_address,
            id_number: item.id_number,
            evaluated: item.evaluated,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function saveEdit(event: React.FormEvent) {
        event.preventDefault();
        if (!editingId) return;
        form.put(route('assistant.forms.update', editingId), {
            preserveScroll: true,
            onSuccess: () => {
                setEditingId(null);
                form.reset();
            },
        });
    }

    return (
        <AppLayout>
            <Head title="Forms" />
            <div className="space-y-5 px-7 pt-5 pb-6">
                <div>
                    <h1 className="text-lg font-semibold">{editingId ? 'Edit Evaluation Form' : 'Evaluation Form'}</h1>
                    <p className="text-muted-foreground text-sm">Record student evaluation information.</p>
                </div>

                <form onSubmit={editingId ? saveEdit : submit} className="grid gap-4 rounded-lg border bg-white p-5 shadow-sm md:grid-cols-2">
                    <div>
                        <label className={labelClass}>Family Name</label>
                        <Input className={inputClass} value={form.data.family_name} onChange={(e) => form.setData('family_name', e.target.value)} />
                        {form.errors.family_name && <p className="text-sm text-red-600">{form.errors.family_name}</p>}
                    </div>
                    <div>
                        <label className={labelClass}>First Name</label>
                        <Input className={inputClass} value={form.data.first_name} onChange={(e) => form.setData('first_name', e.target.value)} />
                        {form.errors.first_name && <p className="text-sm text-red-600">{form.errors.first_name}</p>}
                    </div>
                    <div>
                        <label className={labelClass}>Program</label>
                        <select className="h-10 w-full rounded-md border bg-background px-3 text-sm text-black dark:text-white" value={form.data.program} onChange={(e) => form.setData('program', e.target.value)}>
                            <option value="">Select program</option>
                            {props.programs.map((program) => <option key={program} value={program}>{program}</option>)}
                        </select>
                        {form.errors.program && <p className="text-sm text-red-600">{form.errors.program}</p>}
                    </div>
                    <div>
                        <label className={labelClass}>Contact Number</label>
                        <Input className={inputClass} value={form.data.contact_number} onChange={(e) => form.setData('contact_number', e.target.value)} />
                        {form.errors.contact_number && <p className="text-sm text-red-600">{form.errors.contact_number}</p>}
                    </div>
                    <div>
                        <label className={labelClass}>Email Address</label>
                        <Input type="email" className={inputClass} value={form.data.email_address} onChange={(e) => form.setData('email_address', e.target.value)} />
                        {form.errors.email_address && <p className="text-sm text-red-600">{form.errors.email_address}</p>}
                    </div>
                    <div>
                        <label className={labelClass}>ID Number</label>
                        <Input className={inputClass} value={form.data.id_number} onChange={(e) => form.setData('id_number', e.target.value)} />
                        {form.errors.id_number && <p className="text-sm text-red-600">{form.errors.id_number}</p>}
                    </div>
                    <label className="flex items-center gap-2 text-sm font-bold text-black dark:text-white">
                        <input type="checkbox" checked={form.data.evaluated} onChange={(e) => form.setData('evaluated', e.target.checked)} />
                        Evaluated
                    </label>
                    <div className="md:col-span-2">
                        <Button type="submit" disabled={form.processing}><Save className="mr-2 h-4 w-4" />{editingId ? 'Update form' : 'Save form'}</Button>
                        {editingId && <Button type="button" variant="outline" onClick={() => { setEditingId(null); form.reset(); }}>Cancel</Button>}
                    </div>
                </form>

                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/40">
                            <tr><th className="p-3">Timestamp</th><th className="p-3">Name</th><th className="p-3">Program</th><th className="p-3">Contact</th><th className="p-3">Email</th><th className="p-3">ID Number</th><th className="p-3">Evaluated</th><th className="p-3">Action</th></tr>
                        </thead>
                        <tbody>
                            {props.forms.map((item) => (
                                <tr key={item.id} className="border-t">
                                    <td className="p-3">{new Date(item.form_timestamp).toLocaleString()}</td>
                                    <td className="p-3">{item.family_name}, {item.first_name}</td>
                                    <td className="p-3">{item.program}</td>
                                    <td className="p-3">{item.contact_number}</td>
                                    <td className="p-3">{item.email_address}</td>
                                    <td className="p-3">{item.id_number}</td>
                                    <td className="p-3">
                                        <div className="flex gap-2">
                                            <Button type="button" size="sm" variant={item.evaluated ? 'default' : 'outline'} onClick={() => updateEvaluation(item.id, true)} disabled={form.processing}>
                                                <Check className="mr-1 h-4 w-4" />Accept
                                            </Button>
                                            <Button type="button" size="sm" variant={!item.evaluated ? 'destructive' : 'outline'} onClick={() => updateEvaluation(item.id, false)} disabled={form.processing}>
                                                <X className="mr-1 h-4 w-4" />Not accepted
                                            </Button>
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <Button type="button" size="sm" variant="outline" onClick={() => editForm(item)} disabled={form.processing}>
                                            <Edit className="mr-1 h-4 w-4" />Edit
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {props.forms.length === 0 && <tr><td colSpan={8} className="text-muted-foreground p-8 text-center">No forms submitted yet.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
