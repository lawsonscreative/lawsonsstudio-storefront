'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/useAuth';
import { AddressAutocomplete } from '@/components/checkout/AddressAutocomplete';

interface Address {
  id: string;
  label: string;
  is_default_shipping: boolean;
  is_default_billing: boolean;
  recipient_name: string;
  line1: string;
  line2: string;
  city: string;
  county: string;
  postcode: string;
  country: string;
  phone: string;
}

export default function AddressesPage() {
  const { user, supabase } = useAuth();
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [label, setLabel] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [county, setCounty] = useState('');
  const [postcode, setPostcode] = useState('');
  const [phone, setPhone] = useState('');
  const [isDefaultShipping, setIsDefaultShipping] = useState(false);
  const [isDefaultBilling, setIsDefaultBilling] = useState(false);

  useEffect(() => {
    if (user) {
      loadAddresses();
    }
  }, [user]);

  const loadAddresses = async () => {
    try {
      setLoading(true);

      // Get customer
      const { data: customer } = await supabase
        .from('customers')
        .select('id')
        .eq('auth_user_id', user?.id)
        .single();

      if (!customer) return;

      // Get addresses
      const { data } = await supabase
        .from('addresses')
        .select('*')
        .eq('customer_id', customer.id)
        .order('created_at', { ascending: false });

      setAddresses(data || []);
    } catch (err) {
      console.error('Error loading addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setLabel('');
    setRecipientName('');
    setLine1('');
    setLine2('');
    setCity('');
    setCounty('');
    setPostcode('');
    setPhone('');
    setIsDefaultShipping(false);
    setIsDefaultBilling(false);
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  const handleEdit = (address: Address) => {
    setLabel(address.label);
    setRecipientName(address.recipient_name);
    setLine1(address.line1);
    setLine2(address.line2);
    setCity(address.city);
    setCounty(address.county);
    setPostcode(address.postcode);
    setPhone(address.phone);
    setIsDefaultShipping(address.is_default_shipping);
    setIsDefaultBilling(address.is_default_billing);
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      // Get customer
      const { data: customer } = await supabase
        .from('customers')
        .select('id')
        .eq('auth_user_id', user?.id)
        .single();

      if (!customer) throw new Error('Customer not found');

      const addressData = {
        customer_id: customer.id,
        label,
        recipient_name: recipientName,
        line1,
        line2,
        city,
        county,
        postcode,
        country: 'GB',
        phone,
        is_default_shipping: isDefaultShipping,
        is_default_billing: isDefaultBilling,
      };

      if (editingId) {
        // Update existing
        const { error: updateError } = await supabase
          .from('addresses')
          .update(addressData)
          .eq('id', editingId);

        if (updateError) throw updateError;
      } else {
        // Create new
        const { error: insertError } = await supabase
          .from('addresses')
          .insert(addressData);

        if (insertError) throw insertError;
      }

      await loadAddresses();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadAddresses();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete address');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-gray-900">Addresses</h1>
          <p className="mt-2 text-gray-600">Manage your saved addresses</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-brand-primary px-6 py-2 font-medium text-brand-dark hover:bg-brand-primary/90 transition-colors"
          >
            Add Address
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {showForm && (
        <div className="mb-6 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="font-heading text-xl font-semibold text-gray-900 mb-4">
            {editingId ? 'Edit Address' : 'New Address'}
          </h2>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Label (e.g., Home, Work)
              </label>
              <input
                type="text"
                required
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                placeholder="Home"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient Name
              </label>
              <input
                type="text"
                required
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 1 *
              </label>
              <AddressAutocomplete
                value={line1}
                onChange={setLine1}
                onAddressSelect={(addressDetails) => {
                  setLine1(addressDetails.line_1 || '');
                  setLine2(addressDetails.line_2 || '');
                  setCity(addressDetails.town_or_city || '');
                  setCounty(addressDetails.county || '');
                  setPostcode(addressDetails.postcode || '');
                }}
                placeholder="Start typing address or postcode to search..."
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 2
              </label>
              <input
                type="text"
                value={line2}
                onChange={(e) => setLine2(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City/Town *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  County
                </label>
                <input
                  type="text"
                  value={county}
                  onChange={(e) => setCounty(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postcode *
              </label>
              <input
                type="text"
                required
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                placeholder="TN23 3SD"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                placeholder="+44"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isDefaultShipping}
                  onChange={(e) => setIsDefaultShipping(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Set as default shipping address</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isDefaultBilling}
                  onChange={(e) => setIsDefaultBilling(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Set as default billing address</span>
              </label>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-gray-300 px-6 py-2 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-brand-primary px-6 py-2 font-medium text-brand-dark hover:bg-brand-primary/90 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Saving...' : editingId ? 'Update Address' : 'Add Address'}
              </button>
            </div>
          </form>
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h2 className="font-heading text-xl font-semibold text-gray-900 mb-2">
            No saved addresses
          </h2>
          <p className="text-gray-600 mb-6">Add an address to save time at checkout</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-heading text-lg font-semibold text-gray-900">
                    {address.label}
                  </h3>
                  {(address.is_default_shipping || address.is_default_billing) && (
                    <div className="flex gap-2 mt-1">
                      {address.is_default_shipping && (
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          Default Shipping
                        </span>
                      )}
                      {address.is_default_billing && (
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                          Default Billing
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium text-gray-900">{address.recipient_name}</p>
                <p>{address.line1}</p>
                {address.line2 && <p>{address.line2}</p>}
                <p>
                  {address.city}
                  {address.county && `, ${address.county}`}
                </p>
                <p>{address.postcode}</p>
                {address.phone && <p>{address.phone}</p>}
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(address)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(address.id)}
                  className="flex-1 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
