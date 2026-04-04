"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getProfile, updateProfile } from "@/services/userService";
import { User, Mail, Phone, Building2, FileText, MapPin, Edit2, Save, X } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    organizationName: "",
    gstNumber: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
    },
    notificationPreferences: {
      radiusKm: 15,
      pushEnabled: true,
      emailEnabled: true,
    },
  });

  // Fetch profile on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      if (data.success) {
        setProfile(data.data);
        setFormData({
          firstName: data.data.firstName || "",
          lastName: data.data.lastName || "",
          organizationName: data.data.organizationName || "",
          gstNumber: data.data.gstNumber || "",
          address: data.data.address || {
            street: "",
            city: "",
            state: "",
            pincode: "",
          },
          notificationPreferences: data.data.notificationPreferences || {
            radiusKm: 15,
            pushEnabled: true,
            emailEnabled: true,
          },
        });
      }
    } catch (err) {
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const handleNotificationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [name]: type === "checkbox" ? checked : Number(value),
      },
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      setMessage("");

      const data = await updateProfile(formData);
      if (data.success) {
        setProfile(data.data);
        setMessage("Profile updated successfully!");
        setIsEditing(false);
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      organizationName: profile?.organizationName || "",
      gstNumber: profile?.gstNumber || "",
      address: profile?.address || {
        street: "",
        city: "",
        state: "",
        pincode: "",
      },
      notificationPreferences: profile?.notificationPreferences || {
        radiusKm: 15,
        pushEnabled: true,
        emailEnabled: true,
      },
    });
    setIsEditing(false);
    setError("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-gray-600">Failed to load profile. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {formData.firstName} {formData.lastName}
                </h1>
                <p className="text-sm text-gray-500 capitalize font-medium">{profile.role}</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                isEditing
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              {isEditing ? (
                <>
                  <X className="w-4 h-4" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </>
              )}
            </button>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
              {message}
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-6">
          {/* Personal Information */}
          <section className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-green-600" />
              Personal Information
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <label>
                <span className="block text-sm font-semibold text-gray-700 mb-2">First Name *</span>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                />
              </label>
              <label>
                <span className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</span>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label>
                <span className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Mail className="w-4 h-4" />
                  Email
                </span>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
              </label>
              <label>
                <span className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </span>
                <input
                  type="tel"
                  value={profile.phoneNumber}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 mt-1">Phone cannot be changed</p>
              </label>
            </div>
          </section>

          {/* Business Information (Sellers) */}
          {profile.role === "seller" && (
            <section className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-green-600" />
                Business Information
              </h2>

              <label className="block mb-4">
                <span className="block text-sm font-semibold text-gray-700 mb-2">Organization Name *</span>
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                />
              </label>

              <label className="block">
                <span className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <FileText className="w-4 h-4" />
                  GST Number (Optional)
                </span>
                <input
                  type="text"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                />
              </label>
            </section>
          )}

          {/* Address */}
          <section className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              Address
            </h2>

            <div className="space-y-4">
              <label>
                <span className="block text-sm font-semibold text-gray-700 mb-2">Street</span>
                <input
                  type="text"
                  name="street"
                  value={formData.address.street}
                  onChange={handleAddressChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                />
              </label>

              <div className="grid grid-cols-3 gap-4">
                <label>
                  <span className="block text-sm font-semibold text-gray-700 mb-2">City</span>
                  <input
                    type="text"
                    name="city"
                    value={formData.address.city}
                    onChange={handleAddressChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                  />
                </label>
                <label>
                  <span className="block text-sm font-semibold text-gray-700 mb-2">State</span>
                  <input
                    type="text"
                    name="state"
                    value={formData.address.state}
                    onChange={handleAddressChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                  />
                </label>
                <label>
                  <span className="block text-sm font-semibold text-gray-700 mb-2">Pincode</span>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.address.pincode}
                    onChange={handleAddressChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                  />
                </label>
              </div>
            </div>
          </section>

          {/* Notification Preferences */}
          <section className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Notification Preferences</h2>

            <div className="space-y-4">
              <label>
                <span className="block text-sm font-semibold text-gray-700 mb-2">
                  Notification Radius (km) - {formData.notificationPreferences.radiusKm}
                </span>
                <input
                  type="range"
                  name="radiusKm"
                  min="1"
                  max="100"
                  value={formData.notificationPreferences.radiusKm}
                  onChange={handleNotificationChange}
                  disabled={!isEditing}
                  className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="pushEnabled"
                  checked={formData.notificationPreferences.pushEnabled}
                  onChange={handleNotificationChange}
                  disabled={!isEditing}
                  className="w-5 h-5 rounded border-gray-300 text-green-600 disabled:cursor-not-allowed"
                />
                <span className="text-sm font-medium text-gray-700">Enable Push Notifications</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="emailEnabled"
                  checked={formData.notificationPreferences.emailEnabled}
                  onChange={handleNotificationChange}
                  disabled={!isEditing}
                  className="w-5 h-5 rounded border-gray-300 text-green-600 disabled:cursor-not-allowed"
                />
                <span className="text-sm font-medium text-gray-700">Enable Email Notifications</span>
              </label>
            </div>
          </section>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-semibold py-3 rounded-xl transition disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 rounded-xl transition disabled:cursor-not-allowed"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}