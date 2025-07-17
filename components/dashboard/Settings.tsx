import { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';

const UNIVERSITY_OPTIONS = [
  { value: 'MIT', label: 'MIT' },
  { value: 'Stanford', label: 'Stanford' },
  { value: 'Illinois Institute of Technology', label: 'Illinois Institute of Technology' },
];

export default function Settings() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    university: user?.university || '',
    interests: user?.interests?.join(', ') || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      await updateProfile({
        name: formData.name,
        email: formData.email,
        university: formData.university,
        interests: formData.interests.split(',').map(i => i.trim()).filter(Boolean),
      });
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 space-y-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      {success && <div className="text-green-600">{success}</div>}
      {error && <div className="text-red-600">{error}</div>}
      <div>
        <label htmlFor="name" className="block font-medium mb-1">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className="input-field w-full"
        />
      </div>
      <div>
        <label htmlFor="email" className="block font-medium mb-1">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="input-field w-full"
        />
      </div>
      <div>
        <label htmlFor="university" className="block font-medium mb-1">University</label>
        <select
          id="university"
          name="university"
          value={formData.university}
          onChange={handleChange}
          className="input-field w-full"
        >
          <option value="">Select your university</option>
          {UNIVERSITY_OPTIONS.map(u => (
            <option key={u.value} value={u.value}>{u.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="interests" className="block font-medium mb-1">Interests (comma separated)</label>
        <input
          id="interests"
          name="interests"
          type="text"
          value={formData.interests}
          onChange={handleChange}
          className="input-field w-full"
        />
      </div>
      <button
        type="submit"
        className="btn-primary w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
} 