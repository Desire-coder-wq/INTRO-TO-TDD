// ShoppingListManager.test.js
const PersistenceService = require('./PersistenceService');
const ShoppingListManager = require('./ShoppingListManager');

// Mock data for testing
const mockListId = 'W101-AUG';
const mockItems = [
    { name: 'Milk', quantity: 1 },
    { name: 'Eggs', quantity: 12 }
];

// =========================================================================
// 1. STUB EXAMPLE: Controlling the outcome to test the success path
// =========================================================================
test('STUB: should set status to finalized when saving succeeds', () => {
    // ARRANGE: Create a STUB for the PersistenceService's saveList method.
    // The stub's only job is to return a CANNED, predefined success value.
    const persistenceStub = {
        saveList: jest.fn().mockReturnValue({
            success: true,
            recordId: 'STUB-REC-001'
        }),
        logAction: jest.fn() // The stub must implement all expected methods
    };
    
    // Pass the stubbed dependency to the SUT
    const manager = new ShoppingListManager(persistenceStub);
    manager.addItem('Bread'); // Add an item so the list isn't empty

    // ACT
    manager.finalizeList(mockListId);

    // ASSERT: We test the SUT's internal state change (listStatus)
    expect(manager.listStatus).toBe('finalized');
    expect(manager.recordId).toBe('STUB-REC-001');
    
    // Ensure the stub was called
    expect(persistenceStub.saveList).toHaveBeenCalledTimes(1);
});

// =========================================================================
// 2. MOCK EXAMPLE: Setting expectations on arguments and failure paths
// =========================================================================
test('MOCK: should correctly call saveList with the current items and listId', () => {
    // ARRANGE: Create a MOCK for the PersistenceService. 
    // Mocks are used to set explicit expectations and check arguments.
    const persistenceMock = {
        saveList: jest.fn(() => ({ 
            success: true, 
            recordId: 'MOCK-REC-999' 
        })), // We mock the implementation
        logAction: jest.fn()
    };
    
    const manager = new ShoppingListManager(persistenceMock);
    manager.addItem(mockItems[0].name, mockItems[0].quantity); // Milk
    manager.addItem(mockItems[1].name, mockItems[1].quantity); // Eggs

    // ACT
    manager.finalizeList(mockListId);

    // ASSERT: We check that the mock was called correctly with the expected arguments. 
    // If the SUT fails to pass the correct list of items, this test fails.
    expect(persistenceMock.saveList).toHaveBeenCalledTimes(1);
    expect(persistenceMock.saveList).toHaveBeenCalledWith(mockListId, manager.items);
    
    // Test a failure path with a mock:
    persistenceMock.saveList.mockReturnValueOnce({ success: false });
    const result = manager.finalizeList('FAIL-ID');
    expect(result.success).toBe(false);
    expect(manager.listStatus).toBe('failed');
});


// =========================================================================
// 3. SPY EXAMPLE: Tracking usage while still running the real function
// =========================================================================
test('SPY: should ensure logAction is called with the correct item count', () => {
    // ARRANGE: Get an instance of the REAL dependency.
    const realService = new PersistenceService();
    
    // Create a SPY on the real method 'logAction'.
    // The spy lets the real function run (logging to console), but tracks calls.
    const logSpy = jest.spyOn(realService, 'logAction');
    
    const manager = new ShoppingListManager(realService);
    manager.addItem('Apples');
    manager.addItem('Oranges');
    
    // Use a stub for the heavy operation (saveList) to ensure the test is fast,
    // but the SPY is specifically on the logAction utility method.
    const saveStub = jest.spyOn(realService, 'saveList');
    saveStub.mockReturnValue({ success: true, recordId: 'SPY-REC-002' });

    // ACT
    manager.finalizeList(mockListId);
    
    // ASSERT: Check that the logging function (logAction) was called with the right message.
    expect(logSpy).toHaveBeenCalledTimes(1);
    
    // The item count is 2
    expect(logSpy).toHaveBeenCalledWith(`Attempting to finalize list ID: ${mockListId} with 2 items`);
    
    // We can also assert the order of operations by checking call counts
    expect(saveStub).toHaveBeenCalledTimes(1);

    // CLEANUP: Spies must be restored after the test is done.
    logSpy.mockRestore();
    saveStub.mockRestore();
});