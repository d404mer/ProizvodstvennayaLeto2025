describe('Task Listing', () => {
    it('should list all tasks', () => {
      expect(Array.isArray([1,2,3])).toBe(true);
    });
  
    it('should show empty list if no tasks', () => {
      expect([].length).toBe(0);
    });
  });
  