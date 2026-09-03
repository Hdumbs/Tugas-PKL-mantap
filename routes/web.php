<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ScanController;
use App\Http\Controllers\SurveyController;
use Illuminate\Support\Facades\Route;

// User / Client Flow: Scanner -> Result & Rating -> Survey
Route::get('/', function () {
    return redirect()->route('scanner');
});

Route::get('/scanner', [ScanController::class, 'index'])->name('scanner');
Route::post('/scan/process', [ScanController::class, 'processScan'])->name('scan.process');
Route::get('/scan/{code}', [ScanController::class, 'result'])->name('scan.result');
Route::post('/scan/{code}/review', [ReviewController::class, 'store'])->name('scan.review');

Route::get('/survey', [SurveyController::class, 'index'])->name('survey');
Route::post('/survey', [SurveyController::class, 'store'])->name('survey.store');

Route::get('/history', [ScanController::class, 'history'])->name('history');

// Route alias for unauthenticated middleware
Route::get('/login', fn () => redirect()->route('admin.login'))->name('login');

// Admin Portal routes
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/', function () {
        return redirect()->route('admin.login');
    });
    Route::get('/login', [AdminController::class, 'showLogin'])->name('login');
    Route::post('/login', [AdminController::class, 'login'])->name('login.post');
    Route::post('/logout', [AdminController::class, 'logout'])->name('logout');

    Route::middleware(['auth'])->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
        Route::post('/ask-advisor', [AdminController::class, 'askAiAdvisor'])->name('ask_advisor');
        Route::get('/team', [AdminController::class, 'team'])->name('team');
        Route::post('/team/invite', [AdminController::class, 'inviteTeam'])->name('team.invite');
        Route::delete('/team/{id}', [AdminController::class, 'deleteTeam'])->name('team.delete');

        Route::get('/ai-analytics', [AdminController::class, 'aiAnalytics'])->name('ai');
        Route::get('/dietary-database', [AdminController::class, 'dietaryDatabase'])->name('database');
    });
});
