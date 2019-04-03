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
var ReactDOM = require("react-dom");
var Splitter_1 = require("./Splitter");
var Tab_1 = require("./Tab");
var TabSet_1 = require("./TabSet");
var BorderTabSet_1 = require("./BorderTabSet");
var DragDrop_1 = require("../DragDrop");
var Rect_1 = require("../Rect");
var DockLocation_1 = require("../DockLocation");
var TabNode_1 = require("../model/TabNode");
var TabSetNode_1 = require("../model/TabSetNode");
var SplitterNode_1 = require("../model/SplitterNode");
var Actions_1 = require("../model/Actions");
/**
 * A React component that hosts a multi-tabbed layout
 */
var Layout = /** @class */ (function (_super) {
    __extends(Layout, _super);
    function Layout(props) {
        var _this = _super.call(this, props) || this;
        /** @hidden @internal */
        _this.firstMove = false;
        /** @hidden @internal */
        _this.dragDivText = "";
        _this.model = _this.props.model;
        _this.rect = new Rect_1.default(0, 0, 0, 0);
        _this.model._setChangeListener(_this.onModelChange.bind(_this));
        _this.updateRect = _this.updateRect.bind(_this);
        _this.getClassName = _this.getClassName.bind(_this);
        _this.tabIds = [];
        return _this;
    }
    /** @hidden @internal */
    Layout.prototype.onModelChange = function () {
        this.forceUpdate();
        if (this.props.onModelChange) {
            this.props.onModelChange(this.model);
        }
    };
    /** @hidden @internal */
    Layout.prototype.doAction = function (action) {
        if (this.props.onAction !== undefined) {
            this.props.onAction(action);
        }
        else {
            this.model.doAction(action);
        }
    };
    Layout.prototype.tabMenu = function () {
        if (this.props.tabMenu) {
            return (this.props.tabMenu());
        }
        else {
            return false;
        }
    };
    /** @hidden @internal */
    Layout.prototype.componentWillReceiveProps = function (newProps) {
        if (this.model !== newProps.model) {
            if (this.model !== undefined) {
                this.model._setChangeListener(undefined); // stop listening to old model
            }
            this.model = newProps.model;
            this.model._setChangeListener(this.onModelChange.bind(this));
            this.forceUpdate();
        }
    };
    /** @hidden @internal */
    Layout.prototype.componentDidMount = function () {
        this.updateRect();
        // need to re-render if size changes
        window.addEventListener("resize", this.updateRect);
    };
    /** @hidden @internal */
    Layout.prototype.componentDidUpdate = function () {
        this.updateRect();
        //console.log("Layout time: " + this.layoutTime + "ms Render time: " + (Date.now() - this.start) + "ms");
    };
    /** @hidden @internal */
    Layout.prototype.updateRect = function () {
        var domRect = this.selfRef.getBoundingClientRect();
        var rect = new Rect_1.default(0, 0, domRect.width, domRect.height);
        if (!rect.equals(this.rect)) {
            this.rect = rect;
            this.forceUpdate();
        }
    };
    /** @hidden @internal */
    Layout.prototype.getClassName = function (defaultClassName) {
        if (this.props.classNameMapper === undefined) {
            return defaultClassName;
        }
        else {
            return this.props.classNameMapper(defaultClassName);
        }
    };
    /** @hidden @internal */
    Layout.prototype.componentWillUnmount = function () {
        window.removeEventListener("resize", this.updateRect);
    };
    /** @hidden @internal */
    Layout.prototype.render = function () {
        var _this = this;
        // this.start = Date.now();
        var borderComponents = [];
        var tabSetComponents = [];
        var tabComponents = {};
        var splitterComponents = [];
        this.centerRect = this.model._layout(this.rect);
        this.renderBorder(this.model.getBorderSet(), borderComponents, tabComponents, splitterComponents);
        this.renderChildren(this.model.getRoot(), tabSetComponents, tabComponents, splitterComponents);
        var nextTopIds = [];
        var nextTopIdsMap = {};
        // Keep any previous tabs in the same DOM order as before, removing any that have been deleted
        this.tabIds.forEach(function (t) {
            if (tabComponents[t]) {
                nextTopIds.push(t);
                nextTopIdsMap[t] = t;
            }
        });
        this.tabIds = nextTopIds;
        // Add tabs that have been added to the DOM
        Object.keys(tabComponents).forEach(function (t) {
            if (!nextTopIdsMap[t]) {
                _this.tabIds.push(t);
            }
        });
        // this.layoutTime = (Date.now() - this.start);
        return (React.createElement("div", { ref: function (self) { return _this.selfRef = (self === null) ? undefined : self; }, className: this.getClassName("flexlayout__layout") },
            tabSetComponents,
            this.tabIds.map(function (t) {
                return tabComponents[t];
            }),
            borderComponents,
            splitterComponents));
    };
    /** @hidden @internal */
    Layout.prototype.renderBorder = function (borderSet, borderComponents, tabComponents, splitterComponents) {
        for (var i = 0; i < borderSet.getBorders().length; i++) {
            var border = borderSet.getBorders()[i];
            if (border.isShowing()) {
                borderComponents.push(React.createElement(BorderTabSet_1.BorderTabSet, { key: "border_" + border.getLocation().getName(), border: border, layout: this }));
                var drawChildren = border._getDrawChildren();
                for (var i_1 = 0; i_1 < drawChildren.length; i_1++) {
                    var child = drawChildren[i_1];
                    if (child instanceof SplitterNode_1.default) {
                        splitterComponents.push(React.createElement(Splitter_1.Splitter, { key: child.getId(), layout: this, node: child }));
                    }
                    else if (child instanceof TabNode_1.default) {
                        tabComponents[child.getId()] = React.createElement(Tab_1.Tab, { key: child.getId(), layout: this, node: child, selected: i_1 === border.getSelected(), factory: this.props.factory });
                    }
                }
            }
        }
    };
    /** @hidden @internal */
    Layout.prototype.renderChildren = function (node, tabSetComponents, tabComponents, splitterComponents) {
        var drawChildren = node._getDrawChildren();
        for (var i = 0; i < drawChildren.length; i++) {
            var child = drawChildren[i];
            if (child instanceof SplitterNode_1.default) {
                splitterComponents.push(React.createElement(Splitter_1.Splitter, { key: child.getId(), layout: this, node: child }));
            }
            else if (child instanceof TabSetNode_1.default) {
                tabSetComponents.push(React.createElement(TabSet_1.TabSet, { key: child.getId(), layout: this, node: child }));
                this.renderChildren(child, tabSetComponents, tabComponents, splitterComponents);
            }
            else if (child instanceof TabNode_1.default) {
                var selectedTab = child.getParent().getChildren()[child.getParent().getSelected()];
                if (selectedTab === undefined) {
                    debugger; // this should not happen!
                }
                tabComponents[child.getId()] = React.createElement(Tab_1.Tab, { key: child.getId(), layout: this, node: child, selected: child === selectedTab, factory: this.props.factory });
            }
            else { // is row
                this.renderChildren(child, tabSetComponents, tabComponents, splitterComponents);
            }
        }
    };
    /**
     * Adds a new tab to the given tabset
     * @param tabsetId the id of the tabset where the new tab will be added
     * @param json the json for the new tab node
    */
    Layout.prototype.addTabToTabSet = function (tabsetId, json) {
        var tabsetNode = this.model.getNodeById(tabsetId);
        if (tabsetNode !== undefined) {
            this.doAction(Actions_1.default.addNode(json, tabsetId, DockLocation_1.default.CENTER, -1));
        }
    };
    /**
     * Adds a new tab to the active tabset (if there is one)
     * @param json the json for the new tab node
     */
    Layout.prototype.addTabToActiveTabSet = function (json) {
        var tabsetNode = this.model.getActiveTabset();
        if (tabsetNode !== undefined) {
            this.doAction(Actions_1.default.addNode(json, tabsetNode.getId(), DockLocation_1.default.CENTER, -1));
        }
    };
    /**
     * Adds a new tab by dragging a labeled panel to the drop location, dragging starts immediatelly
     * @param dragText the text to show on the drag panel
     * @param json the json for the new tab node
     * @param onDrop a callback to call when the drag is complete
     */
    Layout.prototype.addTabWithDragAndDrop = function (dragText, json, onDrop) {
        this.fnNewNodeDropped = onDrop;
        this.newTabJson = json;
        this.dragStart(undefined, dragText, TabNode_1.default._fromJson(json, this.model), true, undefined, undefined);
    };
    /**
     * Adds a new tab by dragging a labeled panel to the drop location, dragging starts when you
     * mouse down on the panel
     *
     * @param dragText the text to show on the drag panel
     * @param json the json for the new tab node
     * @param onDrop a callback to call when the drag is complete
     */
    Layout.prototype.addTabWithDragAndDropIndirect = function (dragText, json, onDrop) {
        this.fnNewNodeDropped = onDrop;
        this.newTabJson = json;
        DragDrop_1.default.instance.addGlass(this.onCancelAdd.bind(this));
        this.dragDivText = dragText;
        this.dragDiv = document.createElement("div");
        this.dragDiv.className = this.getClassName("flexlayout__drag_rect");
        this.dragDiv.innerHTML = this.dragDivText;
        this.dragDiv.addEventListener("mousedown", this.onDragDivMouseDown.bind(this));
        this.dragDiv.addEventListener("touchstart", this.onDragDivMouseDown.bind(this));
        var r = new Rect_1.default(10, 10, 150, 50);
        r.centerInRect(this.rect);
        this.dragDiv.style.left = r.x + "px";
        this.dragDiv.style.top = r.y + "px";
        var rootdiv = ReactDOM.findDOMNode(this);
        rootdiv.appendChild(this.dragDiv);
    };
    /** @hidden @internal */
    Layout.prototype.onCancelAdd = function () {
        var rootdiv = ReactDOM.findDOMNode(this);
        rootdiv.removeChild(this.dragDiv);
        this.dragDiv = undefined;
        if (this.fnNewNodeDropped != undefined) {
            this.fnNewNodeDropped();
            this.fnNewNodeDropped = undefined;
        }
        DragDrop_1.default.instance.hideGlass();
        this.newTabJson = undefined;
    };
    /** @hidden @internal */
    Layout.prototype.onCancelDrag = function (wasDragging) {
        if (wasDragging) {
            var rootdiv = ReactDOM.findDOMNode(this);
            try {
                rootdiv.removeChild(this.outlineDiv);
            }
            catch (e) {
            }
            try {
                rootdiv.removeChild(this.dragDiv);
            }
            catch (e) {
            }
            this.dragDiv = undefined;
            this.hideEdges(rootdiv);
            if (this.fnNewNodeDropped != undefined) {
                this.fnNewNodeDropped();
                this.fnNewNodeDropped = undefined;
            }
            DragDrop_1.default.instance.hideGlass();
            this.newTabJson = undefined;
        }
    };
    /** @hidden @internal */
    Layout.prototype.onDragDivMouseDown = function (event) {
        event.preventDefault();
        this.dragStart(event, this.dragDivText, TabNode_1.default._fromJson(this.newTabJson, this.model), true, undefined, undefined);
    };
    /** @hidden @internal */
    Layout.prototype.dragStart = function (event, dragDivText, node, allowDrag, onClick, onDoubleClick) {
        if (this.model.getMaximizedTabset() !== undefined || !allowDrag) {
            DragDrop_1.default.instance.startDrag(event, undefined, undefined, undefined, undefined, onClick, onDoubleClick);
        }
        else {
            this.dragNode = node;
            this.dragDivText = dragDivText;
            DragDrop_1.default.instance.startDrag(event, this.onDragStart.bind(this), this.onDragMove.bind(this), this.onDragEnd.bind(this), this.onCancelDrag.bind(this), onClick, onDoubleClick);
        }
    };
    /** @hidden @internal */
    Layout.prototype.onDragStart = function (event) {
        this.dropInfo = undefined;
        var rootdiv = ReactDOM.findDOMNode(this);
        this.outlineDiv = document.createElement("div");
        this.outlineDiv.className = this.getClassName("flexlayout__outline_rect");
        rootdiv.appendChild(this.outlineDiv);
        if (this.dragDiv == undefined) {
            this.dragDiv = document.createElement("div");
            this.dragDiv.className = this.getClassName("flexlayout__drag_rect");
            this.dragDiv.innerHTML = this.dragDivText;
            rootdiv.appendChild(this.dragDiv);
        }
        // add edge indicators
        this.showEdges(rootdiv);
        if (this.dragNode !== undefined && this.dragNode instanceof TabNode_1.default && this.dragNode.getTabRect() !== undefined) {
            this.dragNode.getTabRect().positionElement(this.outlineDiv);
        }
        this.firstMove = true;
        return true;
    };
    /** @hidden @internal */
    Layout.prototype.onDragMove = function (event) {
        if (this.firstMove === false) {
            var speed = this.model._getAttribute("tabDragSpeed");
            this.outlineDiv.style.transition = "top " + speed + "s, left " + speed + "s, width " + speed + "s, height " + speed + "s";
        }
        this.firstMove = false;
        var clientRect = this.selfRef.getBoundingClientRect();
        var pos = {
            x: event.clientX - clientRect.left,
            y: event.clientY - clientRect.top
        };
        this.dragDiv.style.left = (pos.x - this.dragDiv.getBoundingClientRect().width / 2) + "px";
        this.dragDiv.style.top = pos.y + 5 + "px";
        var dropInfo = this.model._findDropTargetNode(this.dragNode, pos.x, pos.y);
        if (dropInfo) {
            this.dropInfo = dropInfo;
            this.outlineDiv.className = this.getClassName(dropInfo.className);
            dropInfo.rect.positionElement(this.outlineDiv);
        }
    };
    /** @hidden @internal */
    Layout.prototype.onDragEnd = function (event) {
        var rootdiv = ReactDOM.findDOMNode(this);
        rootdiv.removeChild(this.outlineDiv);
        rootdiv.removeChild(this.dragDiv);
        this.dragDiv = undefined;
        this.hideEdges(rootdiv);
        DragDrop_1.default.instance.hideGlass();
        if (this.dropInfo) {
            if (this.newTabJson !== undefined) {
                this.doAction(Actions_1.default.addNode(this.newTabJson, this.dropInfo.node.getId(), this.dropInfo.location, this.dropInfo.index));
                if (this.fnNewNodeDropped != undefined) {
                    this.fnNewNodeDropped();
                    this.fnNewNodeDropped = undefined;
                }
                this.newTabJson = undefined;
            }
            else if (this.dragNode !== undefined) {
                this.doAction(Actions_1.default.moveNode(this.dragNode.getId(), this.dropInfo.node.getId(), this.dropInfo.location, this.dropInfo.index));
            }
        }
    };
    /** @hidden @internal */
    Layout.prototype.showEdges = function (rootdiv) {
        if (this.model.isEnableEdgeDock()) {
            var domRect = rootdiv.getBoundingClientRect();
            var r = this.centerRect;
            var size = 100;
            var length_1 = size + "px";
            var radius = "50px";
            var width = "10px";
            this.edgeTopDiv = document.createElement("div");
            this.edgeTopDiv.className = this.getClassName("flexlayout__edge_rect");
            this.edgeTopDiv.style.top = r.y + "px";
            this.edgeTopDiv.style.left = r.x + (r.width - size) / 2 + "px";
            this.edgeTopDiv.style.width = length_1;
            this.edgeTopDiv.style.height = width;
            this.edgeTopDiv.style.borderBottomLeftRadius = radius;
            this.edgeTopDiv.style.borderBottomRightRadius = radius;
            this.edgeLeftDiv = document.createElement("div");
            this.edgeLeftDiv.className = this.getClassName("flexlayout__edge_rect");
            this.edgeLeftDiv.style.top = r.y + (r.height - size) / 2 + "px";
            this.edgeLeftDiv.style.left = r.x + "px";
            this.edgeLeftDiv.style.width = width;
            this.edgeLeftDiv.style.height = length_1;
            this.edgeLeftDiv.style.borderTopRightRadius = radius;
            this.edgeLeftDiv.style.borderBottomRightRadius = radius;
            this.edgeBottomDiv = document.createElement("div");
            this.edgeBottomDiv.className = this.getClassName("flexlayout__edge_rect");
            this.edgeBottomDiv.style.bottom = (domRect.height - r.getBottom()) + "px";
            this.edgeBottomDiv.style.left = r.x + (r.width - size) / 2 + "px";
            this.edgeBottomDiv.style.width = length_1;
            this.edgeBottomDiv.style.height = width;
            this.edgeBottomDiv.style.borderTopLeftRadius = radius;
            this.edgeBottomDiv.style.borderTopRightRadius = radius;
            this.edgeRightDiv = document.createElement("div");
            this.edgeRightDiv.className = this.getClassName("flexlayout__edge_rect");
            this.edgeRightDiv.style.top = r.y + (r.height - size) / 2 + "px";
            this.edgeRightDiv.style.right = (domRect.width - r.getRight()) + "px";
            this.edgeRightDiv.style.width = width;
            this.edgeRightDiv.style.height = length_1;
            this.edgeRightDiv.style.borderTopLeftRadius = radius;
            this.edgeRightDiv.style.borderBottomLeftRadius = radius;
            rootdiv.appendChild(this.edgeTopDiv);
            rootdiv.appendChild(this.edgeLeftDiv);
            rootdiv.appendChild(this.edgeBottomDiv);
            rootdiv.appendChild(this.edgeRightDiv);
        }
    };
    /** @hidden @internal */
    Layout.prototype.hideEdges = function (rootdiv) {
        if (this.model.isEnableEdgeDock()) {
            try {
                rootdiv.removeChild(this.edgeTopDiv);
                rootdiv.removeChild(this.edgeLeftDiv);
                rootdiv.removeChild(this.edgeBottomDiv);
                rootdiv.removeChild(this.edgeRightDiv);
            }
            catch (e) {
            }
        }
    };
    /** @hidden @internal */
    Layout.prototype.maximize = function (tabsetNode) {
        this.doAction(Actions_1.default.maximizeToggle(tabsetNode.getId()));
    };
    /** @hidden @internal */
    Layout.prototype.customizeTab = function (tabNode, renderValues) {
        if (this.props.onRenderTab) {
            this.props.onRenderTab(tabNode, renderValues);
        }
    };
    /** @hidden @internal */
    Layout.prototype.customizeTabSet = function (tabSetNode, renderValues) {
        if (this.props.onRenderTabSet) {
            this.props.onRenderTabSet(tabSetNode, renderValues);
        }
    };
    return Layout;
}(React.Component));
exports.Layout = Layout;
exports.default = Layout;
//# sourceMappingURL=Layout.js.map