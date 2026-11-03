import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head } from '@inertiajs/react';

type RegisterDashboardProps = {
    auth?: {
        user?: {
            name?: string;
        };
    };
    evaluationForms?: EvaluationForm[];
};

type EvaluationForm = {
    id: number;
    form_timestamp: string;
    family_name: string;
    first_name: string;
    program: string;
    contact_number: string;
    email_address: string;
    id_number: string;
    evaluated: boolean | number;
};

export default function RegisterDashboard({ auth, evaluationForms = [] }: RegisterDashboardProps) {
    const name = auth?.user?.name || 'Register';

    return (
        <>
            <Head title="Register Dashboard" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-semibold">Register Dashboard</h1>
                    <p className="text-muted-foreground">Welcome, {name}.</p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Evaluation Forms</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="p-2">Name</th>
                                        <th className="p-2">Program</th>
                                        <th className="p-2">Contact</th>
                                        <th className="p-2">Email</th>
                                        <th className="p-2">ID Number</th>
                                        <th className="p-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {evaluationForms.map((item) => (
                                        <tr key={item.id} className="border-b">
                                            <td className="p-2">{item.family_name}, {item.first_name}</td>
                                            <td className="p-2">{item.program}</td>
                                            <td className="p-2">{item.contact_number}</td>
                                            <td className="p-2">{item.email_address}</td>
                                            <td className="p-2">{item.id_number}</td>
                                            <td className="p-2 font-medium">{Boolean(item.evaluated) ? 'Accepted' : 'Not accepted'}</td>
                                        </tr>
                                    ))}
                                    {evaluationForms.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="p-6 text-center text-muted-foreground">No evaluation forms available.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
