import { createDid, issueMedicalVc } from './api.ts'; // Import issueMedicalVc
// This is a mock service to simulate patient-related API calls.

// --- Simulated Blockchain Ledger for Medications ---
const dummyMedications = {
  'MED-XYZ-123': {
    id: 'MED-XYZ-123',
    name: 'Aspirin 500mg',
    manufacturer: 'Pharma Inc.',
    lotNumber: 'LOT-A456',
    manufacturingDate: '2024-01-15',
    expiryDate: '2026-01-14',
    history: [
      { status: 'Manufactured', location: 'Factory A', timestamp: '2024-01-15T08:00:00Z' },
      { status: 'Shipped', location: 'Distributor B', timestamp: '2024-01-20T14:30:00Z' },
      { status: 'Received', location: 'Pharmacy C', timestamp: '2024-01-25T10:00:00Z' },
    ]
  },
  'MED-ABC-789': {
    id: 'MED-ABC-789',
    name: 'Paracetamol 1000mg',
    manufacturer: 'Health Corp.',
    lotNumber: 'LOT-B789',
    manufacturingDate: '2023-11-10',
    expiryDate: '2025-11-09',
    history: [
      { status: 'Manufactured', location: 'Factory D', timestamp: '2023-11-10T09:00:00Z' },
      { status: 'Shipped', location: 'Distributor E', timestamp: '2023-11-15T16:00:00Z' },
      { status: 'Received', location: 'Hospital F', timestamp: '2023-11-20T11:00:00Z' },
    ]
  }
};
// --- End of Simulated Ledger ---

// --- Simulated Database ---
const dummyPatients = {
  'patient-1665504000000': {
    id: 'patient-1665504000000',
    name: 'John Doe',
    dob: '1985-04-12',
    npi: '123456789',
    allergies: 'Pollen, Arachides',
    bloodGroup: 'A+',
    emergencyContact: 'Jane Doe (555-1234)',
    weight: 75, // kg
    height: 175, // cm
    medicalHistory: [
      { id: 'entry-1', date: '2023-10-10', hospital: 'Hôpital Central', type: 'Consultation', details: 'Consultation générale, patient en bonne santé.' },
      { id: 'entry-2', date: '2024-03-22', hospital: 'Clinique du Parc', type: 'Examen', details: 'Analyse de sang. Résultats normaux.' },
    ]
  },
  'patient-12345': { // A simple, memorable one for testing
    id: 'patient-12345',
    name: 'Jane Smith',
    dob: '1992-09-20',
    npi: '987654321',
    allergies: 'Aucune',
    bloodGroup: 'O-',
    emergencyContact: 'John Smith (555-5678)',
    weight: 60, // kg
    height: 165, // cm
    medicalHistory: [
        { id: 'entry-4', date: '2024-08-10', hospital: 'Clinique du Sud', type: 'Vaccin', details: 'Vaccin contre la grippe.' }
    ]
  }
};
// --- End of Simulated Database ---


/**
 * Enrolls a new patient.
 * @param {object} patientData The patient's data.
 * @returns {Promise<string>} A promise that resolves with the new patient's ID.
 */
export const enrollPatient = async (patientData) => {
  try {
    // Call createDid API to generate a DID for the patient
    const didResponse = await createDid({
      name: patientData.name,
      npi: patientData.npi,
      // Add other relevant patientData fields as needed by the create-did endpoint
    });

    const generatedDid = didResponse.did; // Assuming the API returns { did: "..." }

    // Store patient data using the generated DID as the identifier
    dummyPatients[generatedDid] = {
      id: generatedDid, // Use the DID as the ID
      ...patientData,
      medicalEntries: [
        {
          id: `entry-${Date.now()}`, // Still use a dummy ID for medical entries for now
          date: new Date().toISOString(),
          description: patientData.firstEntry,
        },
      ],
    };
    console.log('Generated patient DID:', generatedDid);
    return generatedDid; // Return the generated DID
  } catch (error) {
    console.error("Error enrolling patient and creating DID:", error);
    throw error; // Re-throw the error for the calling component to handle
  }
};

/**
 * Fetches a patient's data by their ID.
 * @param {string} patientId The ID of the patient to fetch.
 * @returns {Promise<object|null>} A promise that resolves with the patient data or null if not found.
 */
export const getPatientData = (patientId) => {
  return new Promise((resolve, reject) => {
    console.log(`Fetching data for patient: ${patientId}`);
    setTimeout(() => {
      const foundPatient = dummyPatients[patientId];
      if (foundPatient) {
        resolve(foundPatient);
      } else {
        // If the ID looks like one we generated, create a temporary record
        if (patientId && patientId.startsWith('patient-')) {
            const newDummyPatient = {
                id: patientId,
                name: `Patient ${patientId.slice(8, 12)}...`,
                dob: 'Inconnue',
                npi: 'Inconnu',
                allergies: '',
                bloodGroup: '',
                emergencyContact: '',
                weight: '',
                height: '',
                medicalHistory: []
            };
            dummyPatients[patientId] = newDummyPatient; // Add to DB for this session
            resolve(newDummyPatient);
        } else {
            reject('Le QR code est invalide ou le patient n\'existe pas.');
        }
      }
    }, 1000);
  });
};

/**
 * Updates a patient's profile.
 * @param {string} patientId The ID of the patient to update.
 * @param {object} updatedData The new data for the patient.
 * @returns {Promise<object>} A promise that resolves with the updated patient data.
 */
export const updatePatientProfile = (patientId, updatedData) => {
  return new Promise((resolve) => {
    console.log('Updating profile for:', patientId, 'with:', updatedData);
    setTimeout(() => {
      dummyPatients[patientId] = { ...dummyPatients[patientId], ...updatedData };
      resolve(dummyPatients[patientId]);
    }, 1000);
  });
};

/**
 * Adds a new medical entry to a patient's record.
 * @param {string} patientId The ID of the patient.
 * @param {object} entryData The new medical entry.
 * @returns {Promise<object>} A promise that resolves with the new medical entry.
 */
export const addMedicalEntry = async (patientId, entryData) => {
  try {
    console.log('Adding medical entry for:', patientId, 'with:', entryData);

    const newEntry = {
      ...entryData,
      id: `entry-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      hospital: 'Hôpital Actuel (Simulé)',
    };

    // Add the entry to the dummy patient's medical history
    dummyPatients[patientId].medicalHistory.push(newEntry);

    // Issue a Verifiable Credential for the new medical entry
    const vcData = {
      patientDid: patientId, // Assuming patientId is the patient's DID
      medicalEntry: newEntry,
      // Add other relevant data for the VC as needed by the issue-medical-vc endpoint
    };
    const vcResponse = await issueMedicalVc(vcData);
    console.log("Medical VC issued:", vcResponse);

    return newEntry;
  } catch (error) {
    console.error("Error adding medical entry and issuing VC:", error);
    throw error; // Re-throw the error for the calling component to handle
  }
};

/**
 * Fetches a list of recently enrolled patients.
 * @returns {Promise<Array<object>>} A promise that resolves with a list of patients.
 */
export const getRecentEnrollments = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return the last 3 enrolled patients from our dummy DB
      const recent = Object.values(dummyPatients)
        .filter(p => p.id.startsWith('patient-')) // Filter out any non-patient records if any
        .sort((a, b) => b.id.split('-')[1] - a.id.split('-')[1]) // Sort by timestamp desc
        .slice(0, 3);
      resolve(recent);
    }, 1200);
  });
};

/**
 * Simulates a request for emergency access to a patient's data.
 * @param {string} npi The patient's National Provider Identifier.
 * @returns {Promise<string>} A promise that resolves with a success message.
 */
export const requestEmergencyAccess = (npi) => {
  return new Promise((resolve, reject) => {
    console.log(`Requesting emergency access for NPI: ${npi}`);
    setTimeout(() => {
      const patient = Object.values(dummyPatients).find(p => p.npi === npi);
      if (patient) {
        resolve(`Emergency access granted for ${patient.name}.`);
      } else {
        reject('No patient found with that NPI.');
      }
    }, 2000);
  });
};

/**
 * Finds a patient by their NPI.
 * @param {string} npi The patient's National Provider Identifier.
 * @returns {Promise<string>} A promise that resolves with the patient's ID.
 */
export const findPatientByNpi = (npi) => {
  return new Promise((resolve, reject) => {
    console.log(`Searching for patient with NPI: ${npi}`);
    setTimeout(() => {
      const patient = Object.values(dummyPatients).find(p => p.npi === npi);
      if (patient) {
        resolve(patient.id);
      } else {
        reject('No patient found with that NPI.');
      }
    }, 1500);
  });
};

/**
 * Verifies a medication's authenticity by its QR code content.
 * @param {string} qrCodeContent The content scanned from the medication's QR code.
 * @returns {Promise<object>} A promise that resolves with the medication data if found.
 */
export const verifyMedication = (qrCodeContent) => {
  return new Promise((resolve, reject) => {
    console.log(`Verifying medication with QR content: ${qrCodeContent}`);
    setTimeout(() => {
      const medication = dummyMedications[qrCodeContent];
      if (medication) {
        resolve(medication);
      } else {
        reject('Médicament non trouvé ou non authentique.');
      }
    }, 1800); // Simulate network and blockchain lookup delay
  });
};