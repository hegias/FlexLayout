"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var PopupMenu_1 = require("../PopupMenu");
var Actions_1 = require("../model/Actions");
var TabButton_1 = require("./TabButton");
/** @hidden @internal */
var TabSet = /** @class */ (function (_super) {
    __extends(TabSet, _super);
    function TabSet(props) {
        var _this = _super.call(this, props) || this;
        _this.recalcVisibleTabs = true;
        _this.showOverflow = false;
        _this.showToolbar = true;
        _this.state = { hideTabsAfter: 999 };
        return _this;
    }
    TabSet.prototype.componentDidMount = function () {
        this.updateVisibleTabs();
    };
    TabSet.prototype.componentDidUpdate = function () {
        this.updateVisibleTabs();
    };
    TabSet.prototype.componentWillReceiveProps = function (nextProps) {
        this.showToolbar = true;
        this.showOverflow = false;
        this.recalcVisibleTabs = true;
        this.setState({ hideTabsAfter: 999 });
    };
    TabSet.prototype.updateVisibleTabs = function () {
        var node = this.props.node;
        if (node.isEnableTabStrip() && this.recalcVisibleTabs) {
            var toolbarWidth = this.toolbarRef.getBoundingClientRect().width;
            var hideTabsAfter = 999;
            for (var i = 0; i < node.getChildren().length; i++) {
                var child = node.getChildren()[i];
                if (child.getTabRect().getRight() > node.getRect().getRight() - (20 + toolbarWidth)) {
                    hideTabsAfter = Math.max(0, i - 1);
                    //console.log("tabs truncated to:" + hideTabsAfter);
                    this.showOverflow = node.getChildren().length > 1;
                    if (i === 0) {
                        this.showToolbar = false;
                        if (child.getTabRect().getRight() > node.getRect().getRight() - 20) {
                            this.showOverflow = false;
                        }
                    }
                    break;
                }
            }
            if (this.state.hideTabsAfter !== hideTabsAfter) {
                this.setState({ hideTabsAfter: hideTabsAfter });
            }
            this.recalcVisibleTabs = false;
        }
    };
    TabSet.prototype.render = function () {
        var _this = this;
        var cm = this.props.layout.getClassName;
        var node = this.props.node;
        var style = node._styleWithPosition();
        if (this.props.node.isMaximized()) {
            style.zIndex = 100;
        }
        var tabs = [];
        var hiddenTabs = [];
        if (node.isEnableTabStrip()) {
            for (var i = 0; i < node.getChildren().length; i++) {
                var isSelected = this.props.node.getSelected() === i;
                var showTab = this.state.hideTabsAfter >= i;
                var child = node.getChildren()[i];
                if (this.state.hideTabsAfter === i && this.props.node.getSelected() > this.state.hideTabsAfter) {
                    hiddenTabs.push({ name: child.getName(), node: child, index: i });
                    child = node.getChildren()[this.props.node.getSelected()];
                    isSelected = true;
                }
                else if (!showTab && !isSelected) {
                    hiddenTabs.push({ name: child.getName(), node: child, index: i });
                }
                if (showTab) {
                    tabs.push(React.createElement(TabButton_1.TabButton, { layout: this.props.layout, node: child, key: child.getId(), selected: isSelected, show: showTab, height: node.getTabStripHeight() }));
                }
            }
        }
        //tabs.forEach(c => console.log(c.key));
        var buttons = [];
        // allow customization of header contents and buttons
        var renderState = { headerContent: node.getName(), buttons: buttons };
        this.props.layout.customizeTabSet(this.props.node, renderState);
        var headerContent = renderState.headerContent;
        buttons = renderState.buttons;
        var toolbar = undefined;
        if (this.showToolbar === true) {
            if (this.props.node.isEnableMaximize()) {
                buttons.push(React.createElement("button", { key: "max", className: cm("flexlayout__tab_toolbar_button-" + (node.isMaximized() ? "max" : "min")), onClick: this.onMaximizeToggle.bind(this) }));
            }
            if (this.props.node.isEnableMenu() && this.props.layout.tabMenu()) {
                buttons.push(React.createElement("div", { className: "flexlayout__tab-menu" }, this.props.layout.tabMenu()));
            }
            toolbar = React.createElement("div", { key: "toolbar", ref: function (ref) { return _this.toolbarRef = (ref === null) ? undefined : ref; }, className: cm("flexlayout__tab_toolbar"), onMouseDown: this.onInterceptMouseDown.bind(this) }, buttons);
        }
        if (this.showOverflow === true) {
            tabs.push(React.createElement("button", { key: "overflowbutton", ref: function (ref) { return _this.overflowbuttonRef = (ref === null) ? undefined : ref; }, className: cm("flexlayout__tab_button_overflow"), onClick: this.onOverflowClick.bind(this, hiddenTabs), onMouseDown: this.onInterceptMouseDown.bind(this) }, hiddenTabs.length));
        }
        var showHeader = node.getName() !== undefined;
        var header = undefined;
        var tabStrip = undefined;
        var tabStripClasses = cm("flexlayout__tab_header_outer");
        if (this.props.node.getClassNameTabStrip() !== undefined) {
            tabStripClasses += " " + this.props.node.getClassNameTabStrip();
        }
        if (node.isActive() && !showHeader) {
            tabStripClasses += " " + cm("flexlayout__tabset-selected");
        }
        if (node.isMaximized() && !showHeader) {
            tabStripClasses += " " + cm("flexlayout__tabset-maximized");
        }
        if (showHeader) {
            var tabHeaderClasses = cm("flexlayout__tabset_header");
            if (node.isActive()) {
                tabHeaderClasses += " " + cm("flexlayout__tabset-selected");
            }
            if (node.isMaximized()) {
                tabHeaderClasses += " " + cm("flexlayout__tabset-maximized");
            }
            if (this.props.node.getClassNameHeader() !== undefined) {
                tabHeaderClasses += " " + this.props.node.getClassNameHeader();
            }
            header = React.createElement("div", { className: tabHeaderClasses, style: { height: node.getHeaderHeight() + "px" }, onMouseDown: this.onMouseDown.bind(this), onTouchStart: this.onMouseDown.bind(this) },
                headerContent,
                toolbar);
            tabStrip = React.createElement("div", { className: tabStripClasses, style: { height: node.getTabStripHeight() + "px", top: node.getHeaderHeight() + "px" } },
                React.createElement("div", { ref: function (ref) { return _this.headerRef = (ref === null) ? undefined : ref; }, className: cm("flexlayout__tab_header_inner") }, tabs));
        }
        else {
            tabStrip = React.createElement("div", { className: tabStripClasses, style: { top: "0px", height: node.getTabStripHeight() + "px" }, onMouseDown: this.onMouseDown.bind(this), onTouchStart: this.onMouseDown.bind(this) },
                React.createElement("div", { ref: function (ref) { return _this.headerRef = (ref === null) ? undefined : ref; }, className: cm("flexlayout__tab_header_inner") }, tabs),
                toolbar);
        }
        return React.createElement("div", { style: style, className: cm("flexlayout__tabset") },
            header,
            tabStrip);
    };
    TabSet.prototype.onOverflowClick = function (hiddenTabs, event) {
        //console.log("hidden tabs: " + hiddenTabs);
        var element = this.overflowbuttonRef;
        PopupMenu_1.default.show(element, hiddenTabs, this.onOverflowItemSelect.bind(this), this.props.layout.getClassName);
    };
    TabSet.prototype.onOverflowItemSelect = function (item) {
        this.props.layout.doAction(Actions_1.default.selectTab(item.node.getId()));
    };
    TabSet.prototype.onMouseDown = function (event) {
        var name = this.props.node.getName();
        if (name === undefined) {
            name = "";
        }
        else {
            name = ": " + name;
        }
        this.props.layout.doAction(Actions_1.default.setActiveTabset(this.props.node.getId()));
        this.props.layout.dragStart(event, "Move tabset" + name, this.props.node, this.props.node.isEnableDrag(), function (event) { return undefined; }, this.onDoubleClick.bind(this));
    };
    TabSet.prototype.onInterceptMouseDown = function (event) {
        event.stopPropagation();
    };
    TabSet.prototype.onMaximizeToggle = function () {
        if (this.props.node.isEnableMaximize()) {
            this.props.layout.maximize(this.props.node);
        }
    };
    TabSet.prototype.onDoubleClick = function (event) {
        if (this.props.node.isEnableMaximize()) {
            this.props.layout.maximize(this.props.node);
        }
    };
    return TabSet;
}(React.Component));
exports.TabSet = TabSet;
// export default TabSet;
//# sourceMappingURL=TabSet.js.map