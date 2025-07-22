import { createContext, useState, useContext } from 'react';
import { 
  createOwner, 
  getAllOwners, 
  getOwnerById, 
  updateOwner, 
  deleteOwner,
  getOwnerStats
} from '../api/ownerApi';

const OwnerContext = createContext();

export const OwnerProvider = ({ children }) => {
  const [owners, setOwners] = useState([]);
  const [currentOwner, setCurrentOwner] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all owners
  const fetchOwners = async (search = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllOwners(search);
      setOwners(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add new owner
  const addOwner = async (ownerData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createOwner(ownerData);
      setOwners(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get owner by ID
  const getOwner = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getOwnerById(id);
      setCurrentOwner(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update owner
  const updateOwnerDetails = async (id, ownerData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateOwner(id, ownerData);
      setOwners(prev => prev.map(owner => 
        owner._id === id ? response.data : owner
      ));
      if (currentOwner && currentOwner._id === id) {
        setCurrentOwner(response.data);
      }
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete owner
  const removeOwner = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteOwner(id);
      setOwners(prev => prev.filter(owner => owner._id !== id));
      if (currentOwner && currentOwner._id === id) {
        setCurrentOwner(null);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get statistics
  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getOwnerStats();
      setStats(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <OwnerContext.Provider
      value={{
        owners,
        currentOwner,
        stats,
        loading,
        error,
        fetchOwners,
        addOwner,
        getOwner,
        updateOwnerDetails,
        removeOwner,
        fetchStats
      }}
    >
      {children}
    </OwnerContext.Provider>
  );
};

export const useOwner = () => {
  const context = useContext(OwnerContext);
  if (!context) {
    throw new Error('useOwner must be used within an OwnerProvider');
  }
  return context;
};