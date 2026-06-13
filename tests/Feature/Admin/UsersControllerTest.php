<?php

namespace Tests\Feature\Admin;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UsersControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $regularUser;
    protected Role $role;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['is_admin' => true]);
        $this->regularUser = User::factory()->create(['is_admin' => false]);
        $this->role = Role::factory()->create(['role' => 'fleet_manager']);
    }

    // --- ShowUsersController ---

    public function test_admin_users_page_only_shows_privileged_users(): void
    {
        $userWithRole = User::factory()->create(['is_admin' => false]);
        $userWithRole->roles()->attach($this->role);

        $plainUser = User::factory()->create(['is_admin' => false]);

        $response = $this->actingAs($this->admin)->get('/admin/users');

        $response->assertStatus(200);

        $ids = collect($response->original->getData()['page']['props']['users'])
            ->pluck('id')
            ->toArray();

        $this->assertContains($this->admin->id, $ids);
        $this->assertContains($userWithRole->id, $ids);
        $this->assertNotContains($plainUser->id, $ids);
    }

    public function test_admin_users_page_passes_available_roles(): void
    {
        $response = $this->actingAs($this->admin)->get('/admin/users');

        $response->assertStatus(200);

        $roles = collect($response->original->getData()['page']['props']['roles']);
        $this->assertGreaterThan(0, $roles->count());
    }

    public function test_non_admin_cannot_access_users_page(): void
    {
        $response = $this->actingAs($this->regularUser)->get('/admin/users');

        $response->assertStatus(302);
    }

    // --- LookupUserController ---

    public function test_lookup_returns_user_by_numeric_id(): void
    {
        $user = User::factory()->create([
            'is_admin'         => false,
            'msfs_username'    => 'FlyGuy42',
            'discord_username' => 'FlyGuy#1234',
        ]);

        $response = $this->actingAs($this->admin)->getJson("/admin/users/lookup/{$user->id}");

        $response->assertStatus(200)
            ->assertJsonFragment([
                'id'               => $user->id,
                'msfs_username'    => 'FlyGuy42',
                'discord_username' => 'FlyGuy#1234',
                'is_admin'         => false,
            ]);
    }

    public function test_lookup_accepts_pilot_id_format(): void
    {
        $user = User::factory()->create(['is_admin' => false]);
        $pilotId = sprintf('BDV%04d', $user->id);

        $response = $this->actingAs($this->admin)->getJson("/admin/users/lookup/{$pilotId}");

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $user->id]);
    }

    public function test_lookup_returns_404_for_missing_user(): void
    {
        $response = $this->actingAs($this->admin)->getJson('/admin/users/lookup/99999');

        $response->assertStatus(404);
    }

    public function test_non_admin_cannot_lookup_users(): void
    {
        $response = $this->actingAs($this->regularUser)->getJson("/admin/users/lookup/{$this->admin->id}");

        $response->assertStatus(302);
    }

    // --- UpdateUserPrivilegesController ---

    public function test_admin_can_grant_admin_flag(): void
    {
        $response = $this->actingAs($this->admin)->post(
            "/admin/users/{$this->regularUser->id}/privileges",
            ['is_admin' => true, 'roles' => []]
        );

        $response->assertRedirect()->assertSessionHas('success');
        $this->assertDatabaseHas('users', ['id' => $this->regularUser->id, 'is_admin' => true]);
    }

    public function test_admin_can_revoke_admin_flag(): void
    {
        // Need three admins so demoting one still leaves two
        $privilegedUser = User::factory()->create(['is_admin' => true]);
        User::factory()->create(['is_admin' => true]);

        $response = $this->actingAs($this->admin)->post(
            "/admin/users/{$privilegedUser->id}/privileges",
            ['is_admin' => false, 'roles' => []]
        );

        $response->assertRedirect()->assertSessionHas('success');
        $this->assertDatabaseHas('users', ['id' => $privilegedUser->id, 'is_admin' => false]);
    }

    public function test_admin_can_assign_roles_to_user(): void
    {
        $response = $this->actingAs($this->admin)->post(
            "/admin/users/{$this->regularUser->id}/privileges",
            ['is_admin' => false, 'roles' => [$this->role->id]]
        );

        $response->assertRedirect()->assertSessionHas('success');
        $this->assertDatabaseHas('role_user', [
            'user_id' => $this->regularUser->id,
            'role_id' => $this->role->id,
        ]);
    }

    public function test_admin_can_sync_roles_removing_old_ones(): void
    {
        $extraRole = Role::factory()->create(['role' => 'airport_manager']);
        $this->regularUser->roles()->attach([$this->role->id, $extraRole->id]);

        $response = $this->actingAs($this->admin)->post(
            "/admin/users/{$this->regularUser->id}/privileges",
            ['is_admin' => false, 'roles' => [$this->role->id]]
        );

        $response->assertRedirect()->assertSessionHas('success');

        $this->assertDatabaseHas('role_user', ['user_id' => $this->regularUser->id, 'role_id' => $this->role->id]);
        $this->assertDatabaseMissing('role_user', ['user_id' => $this->regularUser->id, 'role_id' => $extraRole->id]);
    }

    public function test_admin_can_clear_all_roles(): void
    {
        $this->regularUser->roles()->attach($this->role->id);

        $response = $this->actingAs($this->admin)->post(
            "/admin/users/{$this->regularUser->id}/privileges",
            ['is_admin' => false, 'roles' => []]
        );

        $response->assertRedirect()->assertSessionHas('success');
        $this->assertDatabaseMissing('role_user', ['user_id' => $this->regularUser->id]);
    }

    public function test_non_admin_cannot_update_privileges(): void
    {
        $response = $this->actingAs($this->regularUser)->post(
            "/admin/users/{$this->admin->id}/privileges",
            ['is_admin' => false, 'roles' => []]
        );

        $response->assertRedirect();
        $this->assertDatabaseHas('users', ['id' => $this->admin->id, 'is_admin' => true]);
    }

    public function test_admin_cannot_remove_their_own_admin_access(): void
    {
        $response = $this->actingAs($this->admin)->post(
            "/admin/users/{$this->admin->id}/privileges",
            ['is_admin' => false, 'roles' => []]
        );

        $response->assertRedirect()->assertSessionHas('error');
        $this->assertDatabaseHas('users', ['id' => $this->admin->id, 'is_admin' => true]);
    }

    public function test_cannot_remove_admin_when_only_two_admins_remain(): void
    {
        // $this->admin is the only admin; create a second so we can act as it
        $secondAdmin = User::factory()->create(['is_admin' => true]);

        // secondAdmin tries to demote $this->admin — would leave only 1 admin (secondAdmin)
        $response = $this->actingAs($secondAdmin)->post(
            "/admin/users/{$this->admin->id}/privileges",
            ['is_admin' => false, 'roles' => []]
        );

        $response->assertRedirect()->assertSessionHas('error');
        $this->assertDatabaseHas('users', ['id' => $this->admin->id, 'is_admin' => true]);
    }

    public function test_can_remove_admin_when_another_admin_exists(): void
    {
        // Three admins total — demoting one still leaves two
        $secondAdmin = User::factory()->create(['is_admin' => true]);
        $thirdAdmin = User::factory()->create(['is_admin' => true]);

        $response = $this->actingAs($this->admin)->post(
            "/admin/users/{$thirdAdmin->id}/privileges",
            ['is_admin' => false, 'roles' => []]
        );

        $response->assertRedirect()->assertSessionHas('success');
        $this->assertDatabaseHas('users', ['id' => $thirdAdmin->id, 'is_admin' => false]);
    }

    public function test_update_privileges_validates_role_exists(): void
    {
        $response = $this->actingAs($this->admin)->post(
            "/admin/users/{$this->regularUser->id}/privileges",
            ['is_admin' => false, 'roles' => [99999]]
        );

        $response->assertSessionHasErrors(['roles.0']);
    }
}
