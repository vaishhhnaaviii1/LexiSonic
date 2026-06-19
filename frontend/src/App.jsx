import React, { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Auth from './components/Auth';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';

export default function App() {
  const { token } = useContext(AuthContext);

  // If there's no token, render the shiny new Auth page
  if (!token) {
    return <Auth />;
  }

  // If logged in, wrap the Dashboard inside the shiny new Layout
  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
}