<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;

class UserController extends Controller
{
    public function index(){
        $users=User::all();
        return Inertia::render('User/User',[
            'users'=>$users,
            'pageLabel'=>'Users',
        ]);
    }

    public function store(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'user_name' => 'required|string|max:255',
            'user_role' => 'required|string|max:255',
        ]);

        // Create a new user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password), // Hash the password
            'user_name' => $request->user_name,
            'user_role' => $request->user_role,
        ]);

        return Redirect::route('users.index');
    }

    public function update(Request $request, $id)
    {
        // Find the user by ID
        $user = User::findOrFail($id);

        // Validate the incoming request
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8', // Password is optional for update
            'user_name' => 'required|string|max:255',
            'user_role' => 'required|string|max:255',
        ]);

        // Update user details
        $user->name = $request->name;
        $user->email = $request->email;
        $user->user_name = $request->user_name;
        $user->user_role = $request->user_role;

        // Only update the password if it is provided
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return Redirect::route('users.index');
    }
}
