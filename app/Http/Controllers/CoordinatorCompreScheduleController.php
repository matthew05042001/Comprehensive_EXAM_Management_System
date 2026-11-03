<?php

namespace App\Http\Controllers;

use App\Models\Panelist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CoordinatorCompreScheduleController extends Controller
{
    private function authorizeStaff(Request $request): void
    {
        abort_unless($request->user()?->role === 'Coordinator', 403);
    }

    public function index(Request $request)
    {
        $this->authorizeStaff($request);

        if (app()->environment(['local', 'testing'])) {
            foreach ([
                ['name' => 'Dr. Maria Santos', 'email' => 'demo.proctor.maria@uic.edu.ph'],
                ['name' => 'Dr. Juan Dela Cruz', 'email' => 'demo.proctor.juan@uic.edu.ph'],
                ['name' => 'Prof. Ana Reyes', 'email' => 'demo.proctor.ana@uic.edu.ph'],
            ] as $demoProctor) {
                Panelist::firstOrCreate(
                    ['email' => $demoProctor['email']],
                    ['name' => $demoProctor['name'], 'role' => 'Panel Member', 'status' => 'Assigned'],
                );
            }
        }

        $programs = DB::table('users')
            ->whereNotNull('program')
            ->where('program', '!=', '')
            ->distinct()
            ->orderBy('program')
            ->pluck('program')
            ->values()
            ->all();

        $programs = array_values(array_unique(array_merge($programs, [
            'Master of Arts in Education',
            'Master of Arts in Education major in English',
            'Master of Business Administration',
        ])));
        sort($programs);

        return Inertia::render('coordinator/compre-schedule/Index', [
            'programs' => $programs,
            'proctors' => Panelist::query()
                ->where('status', '!=', 'Not Assigned')
                ->orderBy('name')
                ->get(['id', 'name', 'email']),
            'schedules' => DB::table('comprehensive_exam_schedules as s')
                ->leftJoin('panelists as p', 'p.id', '=', 's.proctor_id')
                ->orderBy('s.exam_date')
                ->orderBy('s.exam_time')
                ->get([
                    's.id', 's.exam_id', 's.exam_date', 's.exam_time', 's.venue',
                    's.program', 's.proctor_id', 's.proctor_name',
                    DB::raw('COALESCE(p.name, s.proctor_name) as assigned_proctor'),
                ]),
        ]);
    }

    public function store(Request $request)
    {
        $this->authorizeStaff($request);

        $validated = $request->validate([
            'exam_id' => ['required', 'string', 'max:100'],
            'exam_date' => ['required', 'date'],
            'exam_time' => ['required', 'date_format:H:i'],
            'venue' => ['required', 'string', 'max:255'],
            'program' => ['required', 'string', 'max:255'],
            'proctor_id' => ['nullable', 'integer', 'exists:panelists,id'],
        ]);

        $proctor = $validated['proctor_id']
            ? Panelist::find($validated['proctor_id'])
            : null;

        DB::table('comprehensive_exam_schedules')->insert([
            'exam_id' => $validated['exam_id'],
            'exam_date' => $validated['exam_date'],
            'exam_time' => $validated['exam_time'],
            'venue' => $validated['venue'],
            'program' => $validated['program'],
            'proctor_id' => $proctor?->id,
            'proctor_name' => $proctor?->name,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return to_route('coordinator.compre-schedule.index')->with('success', 'Exam schedule saved.');
    }

    public function destroy(Request $request, int $schedule)
    {
        $this->authorizeStaff($request);

        $deleted = DB::table('comprehensive_exam_schedules')
            ->where('id', $schedule)
            ->delete();

        abort_unless($deleted, 404);

        return to_route('coordinator.compre-schedule.index')->with('success', 'Exam schedule removed.');
    }
}
