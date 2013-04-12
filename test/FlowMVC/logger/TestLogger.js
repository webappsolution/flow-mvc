describe("FlowMVC.logger.Logger", function()
{
    beforeEach(function()
    {
	});

    afterEach(function()
    {
    });

    it("should instantiate", function()
    {
        console.debug("TestLogger2::ran test")
    	var instance = Ext.create("FlowMVC.logger.Logger");
        instance.debug("test in TestLogger");
    	expect(instance).not.toBeNull();
    });
});