import React, { useState, useEffect } from 'react';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';

interface AdminAppProps {
  onNavigateHome: () => void;
}

export const AdminApp: React.FC<AdminAppProps> = ({ onNavigateHome }) => {
  const [token, setToken] = useState<string | null>(null);
  const [adminUser, setAdminUser] = useState<{ email: string; name: string } | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);

  // Check stored credentials on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('velora_admin_token');
    const savedUser = localStorage.getItem('velora_admin_user');

    if (!savedToken) {
      setIsVerifying(false);
      return;
    }

    // Verify token with backend
    fetch('/api/admin/verify', {
      headers: {
        Authorization: `Bearer ${savedToken}`
      }
    })
      .then((res) => {
        if (res.ok) {
          setToken(savedToken);
          if (savedUser) {
            try {
              setAdminUser(JSON.parse(savedUser));
            } catch {
              setAdminUser({ email: 'admin@velorapk.com', name: 'Velora Warden' });
            }
          } else {
            setAdminUser({ email: 'admin@velorapk.com', name: 'Velora Warden' });
          }
        } else {
          localStorage.removeItem('velora_admin_token');
          localStorage.removeItem('velora_admin_user');
          setToken(null);
          setAdminUser(null);
        }
      })
      .catch(() => {
        // If network error, allow saved token session
        setToken(savedToken);
        setAdminUser({ email: 'admin@velorapk.com', name: 'Velora Warden' });
      })
      .finally(() => {
        setIsVerifying(false);
      });
  }, []);

  const handleLoginSuccess = (newToken: string, user: { email: string; name: string }) => {
    setToken(newToken);
    setAdminUser(user);
  };

  const handleLogout = () => {
    if (token) {
      fetch('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => {});
    }
    localStorage.removeItem('velora_admin_token');
    localStorage.removeItem('velora_admin_user');
    setToken(null);
    setAdminUser(null);
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-[#050505] text-[#F5D76E] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-3" />
        <span className="font-serif-lux text-xs uppercase tracking-widest text-[#D4AF37]">
          Verifying Sovereign Administrative Security...
        </span>
      </div>
    );
  }

  // If not authenticated, show Admin Login Screen first
  if (!token || !adminUser) {
    return (
      <AdminLogin
        onLoginSuccess={handleLoginSuccess}
        onNavigateHome={onNavigateHome}
      />
    );
  }

  // If authenticated, show Admin Dashboard
  return (
    <AdminDashboard
      token={token}
      adminUser={adminUser}
      onLogout={handleLogout}
      onNavigateHome={onNavigateHome}
    />
  );
};
