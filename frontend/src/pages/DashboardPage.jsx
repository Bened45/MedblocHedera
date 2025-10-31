import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRecentEnrollments } from '../services/patientService.js';
import DashboardSkeleton from '../components/skeletons/DashboardSkeleton.jsx';

function DashboardPage() {
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const enrollments = await getRecentEnrollments();
        setRecentEnrollments(enrollments);
      } catch (error) {
        console.error("Failed to fetch recent enrollments:", error);
        // Optionally set an error state here
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Tableau de Bord de l'Hôpital</h1>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Link to="/enroll" className="bg-blue-600 hover:bg-blue-700 text-white p-8 rounded-lg shadow-lg flex flex-col items-center justify-center text-center transition duration-300">
          <h2 className="text-xl md:text-2xl font-bold mb-2">Enrôler un Patient</h2>
          <p>Enregistrer un nouveau patient et générer son QR code.</p>
        </Link>
        <Link to="/scan" className="bg-green-600 hover:bg-green-700 text-white p-8 rounded-lg shadow-lg flex flex-col items-center justify-center text-center transition duration-300">
          <h2 className="text-xl md:text-2xl font-bold mb-2">Scanner un QR Code</h2>
          <p>Accéder au dossier d'un patient existant via son QR code.</p>
        </Link>
        <Link to="/verify-medication" className="bg-teal-600 hover:bg-teal-700 text-white p-8 rounded-lg shadow-lg flex flex-col items-center justify-center text-center transition duration-300">
          <h2 className="text-xl md:text-2xl font-bold mb-2">Vérifier un Médicament</h2>
          <p>Scanner un médicament pour vérifier son authenticité.</p>
        </Link>
        <Link to="/hospital-registration" className="bg-purple-600 hover:bg-purple-700 text-white p-8 rounded-lg shadow-lg flex flex-col items-center justify-center text-center transition duration-300">
          <h2 className="text-xl md:text-2xl font-bold mb-2">Enregistrement Hôpital</h2>
          <p>Enregistrer votre hôpital sur la blockchain Hedera.</p>
        </Link>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl md:text-2xl font-semibold mb-4">Activité Récente</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-bold text-gray-800 mb-3">Derniers patients enrôlés</h3>
          {recentEnrollments.length > 0 ? (
            <ul className="space-y-3">
              {recentEnrollments.map(patient => (
                <li key={patient.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100">
                  <Link to={`/patient-data/${patient.id}`} className="w-full">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-blue-700">{patient.name}</p>
                        <p className="text-sm text-gray-500">ID: {patient.id}</p>
                      </div>
                      <span className="text-sm text-gray-600">Enrôlé le: {new Date().toLocaleDateString()}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 py-4">Aucune activité récente.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
