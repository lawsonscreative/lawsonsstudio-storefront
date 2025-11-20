'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { AdminUserWithRoles } from '@/types/admin';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserWithRoles[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    role_key: 'brand_admin',
    brand_id: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [usersRes, rolesRes, brandsRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/roles'),
        fetch('/api/brands'),
      ]);

      const [usersData, rolesData, brandsData] = await Promise.all([
        usersRes.json(),
        rolesRes.json(),
        brandsRes.json(),
      ]);

      setUsers(usersData);
      setRoles(rolesData);
      setBrands(brandsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddUser() {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          brand_id: formData.role_key === 'super_admin' ? null : formData.brand_id || null,
        }),
      });

      if (response.ok) {
        setShowAddModal(false);
        setFormData({
          email: '',
          first_name: '',
          last_name: '',
          role_key: 'brand_admin',
          brand_id: '',
        });
        await fetchData();
        alert('Admin user created successfully');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create admin user');
      }
    } catch (error) {
      console.error('Create user error:', error);
      alert('Failed to create admin user');
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(userId: string, currentStatus: boolean) {
    if (!confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this admin?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      if (response.ok) {
        await fetchData();
      } else {
        alert('Failed to update admin user');
      }
    } catch (error) {
      console.error('Update user error:', error);
      alert('Failed to update admin user');
    }
  }

  async function removeRole(userId: string, roleAssignmentId: string) {
    if (!confirm('Are you sure you want to remove this role?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}/roles?assignment_id=${roleAssignmentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchData();
      } else {
        alert('Failed to remove role');
      }
    } catch (error) {
      console.error('Remove role error:', error);
      alert('Failed to remove role');
    }
  }

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-gray-900">Admin Users</h1>
          <p className="mt-2 text-gray-600">Manage admin users and their permissions</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-full"></div>
            <div className="h-8 bg-gray-200 rounded w-full"></div>
            <div className="h-8 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link
            href="/admin"
            className="text-sm text-brand-primary hover:text-brand-primary/80 mb-4 inline-flex items-center gap-2"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="font-heading text-3xl font-bold text-gray-900 mt-4">Admin Users</h1>
          <p className="mt-2 text-gray-600">Manage admin users and their permissions</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary rounded-lg text-sm font-medium text-brand-dark hover:bg-brand-primary/90"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Admin User
        </button>
      </div>

      {users.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <h2 className="font-heading text-xl font-semibold text-gray-900 mb-2">No admin users yet</h2>
          <p className="text-gray-600">Create your first admin user to get started</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admin User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Roles & Access
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.first_name || user.last_name
                          ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                          : 'Unnamed Admin'}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {user.admin_user_roles.map((ur) => (
                          <div key={ur.id} className="flex items-center gap-1">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-primary/10 text-brand-primary">
                              {ur.admin_roles.name}
                              {ur.brands && (
                                <span className="ml-1 text-brand-primary/60">
                                  ({ur.brands.name})
                                </span>
                              )}
                              {!ur.brand_id && ur.admin_roles.key === 'super_admin' && (
                                <span className="ml-1 text-brand-primary/60">(All Brands)</span>
                              )}
                            </span>
                            <button
                              onClick={() => removeRole(user.id, ur.id)}
                              className="text-red-600 hover:text-red-800"
                              title="Remove role"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => toggleActive(user.id, user.is_active)}
                        className="text-brand-primary hover:text-brand-primary/80"
                      >
                        {user.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60" onClick={() => setShowAddModal(false)} />
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-4">Add Admin User</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                    placeholder="admin@example.com"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    User must already have a Supabase Auth account
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={formData.role_key}
                    onChange={(e) => setFormData({ ...formData, role_key: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                  >
                    {roles.map((role) => (
                      <option key={role.key} value={role.key}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.role_key !== 'super_admin' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand (Optional)
                    </label>
                    <select
                      value={formData.brand_id}
                      onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                    >
                      <option value="">All Brands</option>
                      {brands.map((brand) => (
                        <option key={brand.id} value={brand.id}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-3 justify-end">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUser}
                  disabled={saving || !formData.email}
                  className="px-4 py-2 bg-brand-primary rounded-lg text-sm font-medium text-brand-dark hover:bg-brand-primary/90 disabled:opacity-50"
                >
                  {saving ? 'Creating...' : 'Create Admin User'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
