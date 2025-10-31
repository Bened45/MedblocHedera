const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  throw new Error("La variable d'environnement VITE_API_URL n'est pas définie.");
}

export const createDid = async (data: any) => {
  try {
    const response = await fetch(`${BASE_URL}/create-did`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error creating DID:", error);
    throw error;
  }
};

export const resolveDid = async (did: string) => {
  try {
    const response = await fetch(`${BASE_URL}/resolve-did/${did}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error resolving DID:", error);
    throw error;
  }
};

export const issueMedicalVc = async (data: any) => {
  try {
    const response = await fetch(`${BASE_URL}/issue-medical-vc`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error issuing medical VC:", error);
    throw error;
  }
};

export const verifyVc = async (data: any) => {
  try {
    const response = await fetch(`${BASE_URL}/verify-vc`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error verifying VC:", error);
    throw error;
  }
};

export const login = async (credentials: any) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};