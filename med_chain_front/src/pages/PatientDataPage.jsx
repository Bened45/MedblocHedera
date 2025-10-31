import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getPatientData, updatePatientProfile, addMedicalEntry } from '../services/patientService.js';
import PatientDataSkeleton from '../components/skeletons/PatientDataSkeleton.jsx';

function PatientDataPage() {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for Add Entry form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState({ type: 'Consultation', details: '' });
  const [addEntryFormErrors, setAddEntryFormErrors] = useState({});
  const [isAddingEntry, setIsAddingEntry] = useState(false);

  // State for Edit Profile form
  const [showEditProfileForm, setShowEditProfileForm] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [editFormErrors, setEditFormErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setIsLoading(true);
        const data = await getPatientData(patientId);
        setPatient(data);
        setEditFormData(data);
      } catch (err) {
        setError(String(err));
        toast.error(String(err));
      } finally {
        setIsLoading(false);
      }
    };
    fetchPatient();
  }, [patientId]);

  // --- Validation Functions ---
  const validateAddEntryForm = () => {
    const errors = {};
    if (!newEntry.details.trim()) errors.details = 'Les détails sont requis.';
    return errors;
  };

  const validateEditForm = () => {
    const errors = {};
    if (!editFormData.name) errors.name = 'Le nom est requis.';
    if (!editFormData.dob) errors.dob = 'La date de naissance est requise.';
    if (!editFormData.npi) errors.npi = 'Le NPI est requis.';
    return errors;
  };

  // --- Form Handlers ---
  const handleAddEntryChange = (e) => {
    const { name, value } = e.target;
    setNewEntry(prev => ({ ...prev, [name]: value }));
    if (addEntryFormErrors[name]) {
      setAddEntryFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleAddEntry = async (e) => {
    e.preventDefault();
    const validationErrors = validateAddEntryForm();
    if (Object.keys(validationErrors).length > 0) {
      setAddEntryFormErrors(validationErrors);
      return;
    }
    setIsAddingEntry(true);
    try {
      const addedEntry = await addMedicalEntry(patientId, newEntry);
      setPatient(prevPatient => ({ ...prevPatient, medicalHistory: [...prevPatient.medicalHistory, addedEntry] }));
      toast.success('Nouvelle entrée ajoutée.');
      setShowAddForm(false);
      setNewEntry({ type: 'Consultation', details: '' });
    } catch (err) {
      toast.error("Erreur lors de l'ajout de l'entrée.");
    } finally {
      setIsAddingEntry(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
    if (editFormErrors[name]) {
      setEditFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateEditForm();
    if (Object.keys(validationErrors).length > 0) {
      setEditFormErrors(validationErrors);
      return;
    }
    setIsEditing(true);
    try {
      const updatedPatient = await updatePatientProfile(patientId, editFormData);
      setPatient(updatedPatient);
      toast.success('Profil patient mis à jour.');
      setShowEditProfileForm(false);
    } catch (err) {
      toast.error("Erreur lors de la mise à jour du profil.");
    } finally {
      setIsEditing(false);
    }
  };

  if (isLoading) {
    return <PatientDataSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-4xl py-10 text-center">
        <h1 className="text-3xl font-bold text-red-600">Erreur</h1>
        <p className="mt-4 text-lg bg-red-100 p-4 rounded-lg">{error}</p>
      </div>
    );
  }

  if (!patient) return null;

  return (
    <div className="container mx-auto max-w-4xl py-10">
      <div className="bg-white p-8 rounded-lg shadow-md">
        {/* Patient Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{patient.name}</h1>
            <p className="text-gray-600">Né(e) le: {patient.dob} | NPI: {patient.npi}</p>
            <p className="text-gray-600">Poids: {patient.weight} kg | Taille: {patient.height} cm</p>
            <p className="text-gray-600">Contact d'Urgence: {patient.emergencyContact || 'Non spécifié'}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">ID Dossier:</p>
            <p className="font-mono text-sm break-all">{patientId}</p>
            <button onClick={() => setShowEditProfileForm(true)} className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded text-sm">Modifier le Profil</button>
          </div>
        </div>

        {/* Edit Profile Form Modal */}
        {showEditProfileForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full">
              <h2 className="text-2xl font-bold mb-4">Modifier le Profil Patient</h2>
              <form onSubmit={handleEditSubmit} noValidate>
                <fieldset disabled={isEditing}>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="editName">Nom Complet</label>
                    <input type="text" name="name" id="editName" value={editFormData.name || ''} onChange={handleEditChange} className={`shadow appearance-none border rounded w-full py-2 px-3 ${editFormErrors.name ? 'border-red-500' : ''}`} />
                    {editFormErrors.name && <p className="text-red-500 text-xs italic mt-1">{editFormErrors.name}</p>}
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="editDob">Date de Naissance</label>
                    <input type="date" name="dob" id="editDob" value={editFormData.dob || ''} onChange={handleEditChange} className={`shadow appearance-none border rounded w-full py-2 px-3 ${editFormErrors.dob ? 'border-red-500' : ''}`} />
                    {editFormErrors.dob && <p className="text-red-500 text-xs italic mt-1">{editFormErrors.dob}</p>}
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="editNpi">NPI</label>
                    <input type="text" name="npi" id="editNpi" value={editFormData.npi || ''} onChange={handleEditChange} className={`shadow appearance-none border rounded w-full py-2 px-3 ${editFormErrors.npi ? 'border-red-500' : ''}`} />
                    {editFormErrors.npi && <p className="text-red-500 text-xs italic mt-1">{editFormErrors.npi}</p>}
                  </div>
                  <div className="flex justify-end space-x-4 mt-6">
                    <button type="button" onClick={() => setShowEditProfileForm(false)} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">Annuler</button>
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-48 flex justify-center items-center" disabled={isEditing}>
                      {isEditing ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
        )}

        {/* Medical History */}
        <h2 className="text-xl md:text-2xl font-semibold mb-4">Carnet de Santé</h2>
        <div className="space-y-6">
          {patient.medicalHistory.length > 0 ? (
            patient.medicalHistory.slice().reverse().map(entry => (
              <div key={entry.id} className="p-4 border rounded-lg bg-gray-50">
                 <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-lg">{entry.type}</p>
                    <p className="text-sm text-gray-500">
                      Par <span className="font-semibold">{entry.hospital}</span> le {entry.date}
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-gray-800">{entry.details}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">Aucune entrée dans le carnet de santé.</p>
          )}
        </div>

        {/* Add new entry form */}
        <div className="mt-8 text-center">
          {!showAddForm && (
            <button onClick={() => setShowAddForm(true)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-lg">
              Ajouter une Nouvelle Entrée
            </button>
          )}
          {showAddForm && (
            <form onSubmit={handleAddEntry} className="mt-6 p-6 bg-gray-100 rounded-lg text-left" noValidate>
              <fieldset disabled={isAddingEntry}>
                <h3 className="text-xl font-semibold mb-4">Nouvelle Entrée au Carnet</h3>
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2" htmlFor="type">Type d'entrée</label>
                  <select name="type" id="type" value={newEntry.type} onChange={handleAddEntryChange} className="shadow border rounded w-full py-2 px-3">
                    <option>Consultation</option>
                    <option>Examen</option>
                    <option>Ordonnance</option>
                    <option>Note</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2" htmlFor="details">Détails</label>
                  <textarea name="details" id="details" rows="4" value={newEntry.details} onChange={handleAddEntryChange} className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 ${addEntryFormErrors.details ? 'border-red-500' : ''}`}></textarea>
                  {addEntryFormErrors.details && <p className="text-red-500 text-xs italic mt-1">{addEntryFormErrors.details}</p>}
                </div>
                <div className="flex justify-end space-x-4 mt-4">
                  <button type="button" onClick={() => setShowAddForm(false)} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">Annuler</button>
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-40 flex justify-center items-center" disabled={isAddingEntry}>
                    {isAddingEntry ? 'Ajout...' : 'Ajouter'}
                  </button>
                </div>
              </fieldset>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default PatientDataPage;