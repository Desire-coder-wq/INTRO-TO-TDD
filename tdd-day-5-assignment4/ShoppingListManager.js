// ShoppingListManager.js
class ShoppingListManager {
    /**
     * @param {object} persistenceService - An instance of the PersistenceService dependency.
     */
    constructor(persistenceService) {
        this.persistenceService = persistenceService;
        this.items = [];
        this.listStatus = 'draft';
        this.recordId = null;
    }

    /**
     * Adds an item to the list.
     * @param {string} name - The name of the item.
     * @param {number} quantity - The quantity needed.
     */
    addItem(name, quantity = 1) {
        this.items.push({ name, quantity });
    }

    /**
     * Finalizes the list and attempts to save it persistently.
     * @param {string} listId - A unique identifier for the list.
     */
    finalizeList(listId) {
        // Log the attempt before saving (a good candidate for a Spy)
        this.persistenceService.logAction(`Attempting to finalize list ID: ${listId} with ${this.items.length} items`);

        // The core dependency call (a good candidate for a Stub/Mock)
        const saveResult = this.persistenceService.saveList(listId, this.items);

        if (saveResult.success) {
            this.listStatus = 'finalized';
            this.recordId = saveResult.recordId;
            // Additional logic we are testing: clear local list, notify user, etc.
            return { success: true, message: `List finalized and saved. Record ID: ${this.recordId}` };
        } else {
            this.listStatus = 'failed';
            return { success: false, message: 'Failed to save the shopping list.' };
        }
    }
}

module.exports = ShoppingListManager;