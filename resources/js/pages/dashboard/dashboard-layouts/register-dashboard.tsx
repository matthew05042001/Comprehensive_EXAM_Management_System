import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head } from '@inertiajs/react';

type RegisterDashboardProps = {
    auth?: {
        user?: {
            name?: string;
        };
    };
};

export default function RegisterDashboard({ auth }: RegisterDashboardProps) {
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
                        <CardTitle>Register Workspace</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            This dashboard is reserved for the Register role. Register features can be added here as the workflow is defined.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
