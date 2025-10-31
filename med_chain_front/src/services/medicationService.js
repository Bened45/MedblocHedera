
import { resolveDid } from './api.ts'; // Import resolveDid

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

/**
 * Verifies a medication's authenticity by its QR code content.
 * @param {string} qrCodeContent The content scanned from the medication's QR code.
 * @returns {Promise<object>} A promise that resolves with the medication data if found.
 */
export const verifyMedication = async (qrCodeContent) => {
  try {
    console.log(`Resolving DID for medication with QR content: ${qrCodeContent}`);
    const didDocument = await resolveDid(qrCodeContent); // Assuming qrCodeContent is the DID

    // The DID document should contain the actual medication data
    // You might need to parse the DID document to extract the relevant medication information
    // For now, let's assume the DID document directly contains the medication data
    const medication = didDocument; // Adjust this based on the actual DID document structure

    if (medication) {
      return medication;
    } else {
      throw new Error('Médicament non trouvé ou non authentique.');
    }
  } catch (error) {
    console.error("Error verifying medication and resolving DID:", error);
    throw error; // Re-throw the error for the calling component to handle
  }
};
