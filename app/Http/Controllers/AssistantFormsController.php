<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AssistantFormsController extends Controller
{
    private function authorizeAssistant(Request $request): void
    {
        abort_unless($request->user()?->role === 'Administrative Assistant', 403);
    }

    public function index(Request $request)
    {
        $this->authorizeAssistant($request);

        return Inertia::render('assistant/forms/Index', [
            'forms' => DB::table('evaluation_forms')->latest('form_timestamp')->get(),
            'programs' => [
                'Master of Arts in Education',
                'Master of Arts in Education major in English',
                'Master of Business Administration',
            ],
        ]);
    }

    public function store(Request $request)
    {
        $this->authorizeAssistant($request);

        $validated = $request->validate([
            'family_name' => ['required', 'string', 'max:100'],
            'first_name' => ['required', 'string', 'max:100'],
            'program' => ['required', 'string', 'max:255'],
            'contact_number' => ['required', 'string', 'max:50'],
            'email_address' => ['required', 'email', 'max:255'],
            'id_number' => ['required', 'string', 'max:100'],
            'evaluated' => ['required', 'boolean'],
        ]);

        DB::table('evaluation_forms')->insert($validated + [
            'form_timestamp' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return to_route('assistant.forms.index')->with('success', 'Form saved.');
    }

    public function updateEvaluation(Request $request, int $form)
    {
        $this->authorizeAssistant($request);

        $validated = $request->validate([
            'evaluated' => ['required', 'boolean'],
        ]);

        $updated = DB::table('evaluation_forms')
            ->where('id', $form)
            ->update([
                'evaluated' => $validated['evaluated'],
                'updated_at' => now(),
            ]);

        abort_unless($updated, 404);

        return to_route('assistant.forms.index')->with('success', 'Evaluation status updated.');
    }

    public function update(Request $request, int $form)
    {
        $this->authorizeAssistant($request);

        $validated = $request->validate([
            'family_name' => ['required', 'string', 'max:100'],
            'first_name' => ['required', 'string', 'max:100'],
            'program' => ['required', 'string', 'max:255'],
            'contact_number' => ['required', 'string', 'max:50'],
            'email_address' => ['required', 'email', 'max:255'],
            'id_number' => ['required', 'string', 'max:100'],
        ]);

        $updated = DB::table('evaluation_forms')->where('id', $form)->update($validated + ['updated_at' => now()]);
        abort_unless($updated, 404);

        return to_route('assistant.forms.index')->with('success', 'Form updated.');
    }
}
