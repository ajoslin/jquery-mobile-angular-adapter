/*
 * Tests for the slider widget integration.
 */
describe("selectmenu", function() {
    it('should save the ui value into the model when using non native menus and popups', function() {
        var scope, dialog, dialogOpen;
        loadHtml('/jqmng/test/ui/test-fixture.html', function(frame) {
            var page = frame.$('#start');
            // Note: Be sure to use ng:repeat, as this is the most problematic case!
            page.append(
                    '<div data-role="content">' +
                            '<select ng:repeat="item in [1]" name="mysel" id="mysel" data-native-menu="false"><option value="v1" default="true">v1</option><option value="v2">v2</option></select>' +
                            '</div>');
        });
        runs(function() {
            var $ = testframe().$;
            var page = $("#start");
            var select = page.find("#mysel");
            expect(select[0].value).toEqual("v1");
            scope = select.scope();
            expect(scope.$get('mysel')).toEqual("v1");

            expect($(".ui-dialog").length).toEqual(0);

            // find the menu and click on the second entry
            testframe().innerHeight = 10;
            select.selectmenu('open');
            dialog = $(".ui-dialog");
            dialogOpen = false;
            expect(dialog.length).toEqual(1);
            dialog.bind('pageshow', function() {
                dialogOpen = true;
            });
            dialog.bind('pagehide', function() {
                dialogOpen = false;
            });
        });
        waitsFor(function() {
            return dialogOpen;
        });
        runs(function() {
            var $ = testframe().$;
            $(dialog.find('li')[1]).trigger('vclick')
            expect(scope.$get('mysel')).toEqual("v2");
        });
        waitsFor(function() {
            return !dialogOpen;
        });
        runs(function() {
            var $ = testframe().$;
            dialog = $(".ui-dialog");
            expect(dialog.length).toEqual(0);
        });
    });

    it('should save the ui value into the model when using non native menus', function() {
        loadHtml('/jqmng/test/ui/test-fixture.html', function(frame) {
            var page = frame.$('#start');
            // Note: Be sure to use ng:repeat, as this is the most problematic case!
            page.append(
                    '<div data-role="content">' +
                            '<select ng:repeat="item in [1]" name="mysel" id="mysel" data-native-menu="false"><option value="v1" default="true">v1</option><option value="v2">v2</option></select>' +
                            '</div>');
        });
        runs(function() {
            var page = testframe().$("#start");
            var select = page.find("#mysel");
            expect(select[0].value).toEqual("v1");
            var scope = select.scope();
            expect(scope.$get('mysel')).toEqual("v1");
            // the menu should only be in the dom when it is open
            expect(page.find(".ui-selectmenu").length).toEqual(0);

            // find the menu and click on the second entry
            select.selectmenu('open');
            var popup = page.find(".ui-selectmenu");
            var options = popup.find("li");
            var option = testframe().$(options[1]);
            option.trigger('vclick');
            select.selectmenu('close');
            expect(scope.$get('mysel')).toEqual("v2");
        });
    });

    it('should save the model value into the ui', function() {
        loadHtml('/jqmng/test/ui/test-fixture.html', function(frame) {
            var page = frame.$('#start');
            // Note: Be sure to use ng:repeat, as this is the most problematic case!
            page.append(
                    '<div data-role="content">' +
                            '<select ng:repeat="item in [1]" name="mysel" id="mysel" data-native-menu="false"><option value="v1" default="true">v1</option><option value="v2">v2</option></select>' +
                            '</div>');
        });
        runs(function() {
            var page = testframe().$("#start");
            var select = page.find("#mysel");
            var scope = select.scope();
            expect(select[0].value).toEqual("v1");
            // jquery mobile creates a new span
            // that displays the actual value of the select box.
            var valueSpan = select.parent().find(".ui-btn-text");
            expect(valueSpan.text()).toEqual("v1");
            scope.$set("mysel", "v2");
            scope.$eval();
            expect(select[0].value).toEqual("v2");
            expect(valueSpan.text()).toEqual("v2");
        });
    });



    it('should use the disabled attribute', function() {
        loadHtml('/jqmng/test/ui/test-fixture.html', function(frame) {
            var page = frame.$('#start');
            // Note: Be sure to use ng:repeat, as this is the most problematic case!
            page.append(
                    '<div data-role="content">' +
                            '<select ng:repeat="item in [1]" name="mysel" id="mysel" data-native-menu="false" ng:bind-attr="{disabled: \'{{disabled}}\'}"><option value="v1" default="true">v1</option><option value="v2">v2</option></select>' +
                            '</div>');
        });
        runs(function() {
            var page = testframe().$("#start");
            var select = page.find("#mysel");
            var scope = select.scope();
            scope.$set('disabled', false);
            scope.$eval();
            var disabled = select.selectmenu('option', 'disabled');
            expect(disabled).toEqual(false);
            scope.$set('disabled', true);
            scope.$eval();
            var disabled = select.selectmenu('option', 'disabled');
            expect(disabled).toEqual(true);
        });
    });


    it('should be removable when ng:repeat shrinks', function() {
        loadHtml('/jqmng/test/ui/test-fixture.html', function(frame) {
            var page = frame.$('#start');
            // Note: Be sure to use ng:repeat, as this is the most problematic case!
            page.append(
                    '<div data-role="content" ng:init="mylist = [1,2]">' +
                            '<select ng:repeat="item in mylist" name="mysel" id="mysel" data-native-menu="false" ng:bind-attr="{disabled: \'{{disabled}}\'}"><option value="v1" default="true">v1</option><option value="v2">v2</option></select>' +
                            '</div>');
        });
        runs(function() {
            var page = testframe().$("#start");
            var scope = page.scope();
            // ui select creates a new parent for itself
            var content = page.find(":jqmData(role='content')");
            expect(content.children('div').length).toEqual(2);
            scope.mylist = [1];
            scope.$eval();
            expect(content.children('div').length).toEqual(1);
        });
    });

    it('should refresh when the options change via ng:if', function() {
        loadHtml('/jqmng/test/ui/test-fixture.html', function(frame) {
            var page = frame.$('#start');
            // Note: Be sure to use ng:repeat, as this is the most problematic case!
            page.append(
                    '<div data-role="content">' +
                            '<select ng:repeat="item in [1]" name="mysel" id="mysel" data-native-menu="false"><option value="v1" ng:if="option1" default="true">v1</option><option value="v2" ng:if="option2">v2</option></select>' +
                            '</div>');
        });
        runs(function() {
            var page = testframe().$("#start");
            var select = page.find("#mysel");
            var refreshSpy = spyOn(select.data().selectmenu, 'refresh').andCallThrough();
            expect(select.children('option').length).toEqual(0);
            var scope = select.scope();
            scope.option1 = true;
            scope.option2 = true;
            expect(refreshSpy.callCount).toEqual(0);
            scope.$eval();
            expect(refreshSpy.callCount).toEqual(1);
            expect(select.children('option').length).toEqual(2);
            scope.$eval();
            expect(refreshSpy.callCount).toEqual(1);
            scope.option1 = false;
            scope.$eval();
            expect(refreshSpy.callCount).toEqual(2);
            expect(select.children('option').length).toEqual(1);
        });
    });

    it('should refresh when the options change via ng:repeat', function() {
        loadHtml('/jqmng/test/ui/test-fixture.html', function(frame) {
            var page = frame.$('#start');
            // Note: Be sure to use ng:repeat, as this is the most problematic case!
            page.append(
                    '<div data-role="content">' +
                            '<select ng:repeat="item in [1]" name="mysel" id="mysel" data-native-menu="false"><option ng:repeat="o in opts" value="o">{{o}}</option></select>' +
                            '</div>');
        });
        runs(function() {
            var page = testframe().$("#start");
            var select = page.find("#mysel");
            var refreshSpy = spyOn(select.data().selectmenu, 'refresh').andCallThrough();
            expect(select.children('option').length).toEqual(0);
            var scope = select.scope();
            scope.opts = ['v1', 'v2'];
            expect(refreshSpy.callCount).toEqual(0);
            scope.$eval();
            expect(refreshSpy.callCount).toEqual(1);
            expect(select.children('option').length).toEqual(2);
            scope.$eval();
            expect(refreshSpy.callCount).toEqual(1);
            scope.opts = ['v2'];
            scope.$eval();
            expect(refreshSpy.callCount).toEqual(2);
            expect(select.children('option').length).toEqual(1);
        });
    });

});
