<?php

namespace Tests\Feature\Auth;

use App\Models\Airport;
use App\Models\User;
use App\Notifications\WelcomeEmail;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class CreateUserTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Notification::fake();

        Airport::factory()->hub()->create(['identifier' => 'AYMR']);
    }

    public function test_successfully_registers_user(): void
    {
        $userData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123'
        ];

        $response = $this->post(route('register'), $userData);

        $response->assertRedirect(route('login'));
        $response->assertSessionHas('success', 'Registered successfully!');

        $this->assertDatabaseHas('users', [
            'name' => 'John Doe',
            'email' => 'john@example.com'
        ]);
    }

    public function test_sends_welcome_email(): void
    {
        $userData = [
            'name' => 'Email Test User',
            'email' => 'emailtest@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123'
        ];

        $this->post(route('register'), $userData);

        $user = User::query()->where('email', 'emailtest@example.com')->first();

        Notification::assertSentTo($user, WelcomeEmail::class);
    }

    public function test_validates_registration_data(): void
    {
        // Test missing required fields
        $response = $this->post(route('register'), []);
        $response->assertSessionHasErrors(['name', 'email', 'password']);

        // Test duplicate email
        User::factory()->create(['email' => 'existing@example.com']);
        $response = $this->post(route('register'), [
            'name' => 'Test User',
            'email' => 'existing@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123'
        ]);
        $response->assertSessionHasErrors(['email']);
    }
}