describe("ngm-if", function () {
    var element, scope;

    function compile(html) {
        var d = testutils.compileInPage(html);
        element = d.element;
        scope = element.scope();
    }

    beforeEach(function () {
        scope = null;
        element = null;
    });

    it('should add the element if the expression is true', function () {
        compile('<div><span ngm-if="true">A</span></div>');
        expect(element.children('span').length).toEqual(1);
    });

    it('should remove the element if the expression is false', function () {
        compile('<div><span ngm-if="false">A</span></div>');
        expect(element.children('span').length).toEqual(0);
    });

    it('should use an own scope', function () {
        compile('<div><span ngm-if="true"><span ng-init="test = true"></span></span></div>');
        expect(scope.test).toBeFalsy();
        expect(element.children('span').scope().test).toBeTruthy();
    });

    describe("fire $childrenChanged", function() {
        var eventSpy;
        beforeEach(function() {
            compile('<div><span ngm-if="show"></span></div>');
            eventSpy = jasmine.createSpy("$childrenChanged");
            scope.$on("$childrenChanged", eventSpy);
        });

        it("should fire the event when the content is added", function() {
            scope.show = true;
            scope.$root.$digest();
            expect(eventSpy.callCount).toBe(1);
        });

        it("should fire the event when the content is hidden", function() {
            scope.show = true;
            scope.$root.$digest();
            eventSpy.reset();

            scope.show = false;
            scope.$root.$digest();
            expect(eventSpy.callCount).toBe(1);
        });

        it("should not fire if nothing changes", function() {
            scope.$root.$digest();
            expect(eventSpy.callCount).toBe(0);
        });
    });
});