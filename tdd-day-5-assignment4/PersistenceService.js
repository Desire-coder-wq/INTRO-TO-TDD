// PersistenceService.js
// This class simulates an external dependency responsible for saving data (e.g., a database call).
// In unit tests, we stub or mock this to avoid real I/O operations.

class PersistenceService {
    /**
     * Simulates saving a finalized shopping list to a persistent store.
     * @param {string} listId - The unique ID of the list.
     * @param {Array<object>} items - The list items.
     * @returns {{success: boolean, recordId: string}}
     */
    saveList(listId, items) {
        console.error("--- REAL DATABASE SAVE OPERATION INITIATED ---");
        // In a real app, this would be an actual asynchronous database insert.
        if (items.length === 0) {
            return { success: false, recordId: null };
        }
        
        // Simulating a successful save record ID
        const recordId = `rec_${listId}_${Math.random().toString(36).substring(2, 6)}`;
        return { success: true, recordId: recordId };
    }
    
    // A utility function we might want to track (spy on)
    logAction(message) {
        console.log(`[ACTION LOG] ${message}`);
        // In a real app, this might write audit logs.
    }
}

module.exports = PersistenceService;