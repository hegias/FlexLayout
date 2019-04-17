"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ReactDOM = require("react-dom");
var Rect_1 = require("../Rect");
var Actions_1 = require("../model/Actions");
/** @hidden @internal */
var TabButton = /** @class */ (function (_super) {
    __extends(TabButton, _super);
    function TabButton(props) {
        var _this = _super.call(this, props) || this;
        _this.contentWidth = 0;
        _this.state = { editing: false };
        _this.onEndEdit = _this.onEndEdit.bind(_this);
        return _this;
    }
    TabButton.prototype.onMouseDown = function (event) {
        this.props.layout.dragStart(event, "Move: " + this.props.node.getName(), this.props.node, this.props.node.isEnableDrag(), this.onClick.bind(this), this.onDoubleClick.bind(this));
    };
    TabButton.prototype.onClick = function (event) {
        var node = this.props.node;
        this.props.layout.doAction(Actions_1.default.selectTab(node.getId()));
    };
    TabButton.prototype.onDoubleClick = function (event) {
        if (this.props.node.isEnableRename()) {
            this.setState({ editing: true });
            document.body.addEventListener("mousedown", this.onEndEdit);
            document.body.addEventListener("touchstart", this.onEndEdit);
        }
        else {
            var parentNode = this.props.node.getParent();
            if (parentNode.isEnableMaximize()) {
                this.props.layout.maximize(parentNode);
            }
        }
    };
    TabButton.prototype.onEndEdit = function (event) {
        if (event.target !== this.contentRef) {
            this.setState({ editing: false });
            document.body.removeEventListener("mousedown", this.onEndEdit);
            document.body.removeEventListener("touchstart", this.onEndEdit);
        }
    };
    TabButton.prototype.onClose = function (event) {
        var node = this.props.node;
        this.props.layout.doAction(Actions_1.default.deleteTab(node.getId()));
    };
    TabButton.prototype.onCloseMouseDown = function (event) {
        event.stopPropagation();
    };
    TabButton.prototype.componentDidMount = function () {
        this.updateRect();
    };
    TabButton.prototype.componentDidUpdate = function () {
        this.updateRect();
        if (this.state.editing) {
            this.contentRef.select();
        }
    };
    TabButton.prototype.updateRect = function () {
        // record position of tab in node
        var clientRect = ReactDOM.findDOMNode(this.props.layout).getBoundingClientRect();
        var r = this.selfRef.getBoundingClientRect();
        this.props.node._setTabRect(new Rect_1.default(r.left - clientRect.left, r.top - clientRect.top, r.width, r.height));
        this.contentWidth = this.contentRef.getBoundingClientRect().width;
    };
    TabButton.prototype.onTextBoxMouseDown = function (event) {
        //console.log("onTextBoxMouseDown");
        event.stopPropagation();
    };
    TabButton.prototype.onTextBoxKeyPress = function (event) {
        //console.log(event, event.keyCode);
        if (event.keyCode === 27) { // esc
            this.setState({ editing: false });
        }
        else if (event.keyCode === 13) { // enter
            this.setState({ editing: false });
            var node = this.props.node;
            this.props.layout.doAction(Actions_1.default.renameTab(node.getId(), event.target.value));
        }
    };
    TabButton.prototype.doRename = function (node, newName) {
        this.props.layout.doAction(Actions_1.default.renameTab(node.getId(), newName));
    };
    TabButton.prototype.render = function () {
        var _this = this;
        var cm = this.props.layout.getClassName;
        var classNames = cm("flexlayout__tab_button");
        var node = this.props.node;
        if (this.props.selected) {
            classNames += " " + cm("flexlayout__tab_button--selected");
        }
        else {
            classNames += " " + cm("flexlayout__tab_button--unselected");
        }
        if (this.props.node.getClassName() !== undefined) {
            classNames += " " + this.props.node.getClassName();
        }
        var leadingContent = undefined;
        if (node.getIcon() !== undefined) {
            leadingContent = React.createElement("img", { src: node.getIcon() });
        }
        // allow customization of leading contents (icon) and contents
        var renderState = { leading: leadingContent, content: node.getName() };
        this.props.layout.customizeTab(node, renderState);
        var content = React.createElement("div", { ref: function (ref) { return _this.contentRef = (ref === null) ? undefined : ref; }, className: cm("flexlayout__tab_button_content") }, renderState.content);
        var leading = React.createElement("div", { className: cm("flexlayout__tab_button_leading") }, renderState.leading);
        if (this.state.editing) {
            var contentStyle = { width: this.contentWidth + "px" };
            content = React.createElement("input", { style: contentStyle, ref: function (ref) { return _this.contentRef = (ref === null) ? undefined : ref; }, className: cm("flexlayout__tab_button_textbox"), type: "text", autoFocus: true, defaultValue: node.getName(), onKeyDown: this.onTextBoxKeyPress.bind(this), onMouseDown: this.onTextBoxMouseDown.bind(this), onTouchStart: this.onTextBoxMouseDown.bind(this) });
        }
        var closeButton = undefined;
        if (this.props.node.isEnableClose()) {
            closeButton = React.createElement("div", { className: cm("flexlayout__tab_button_trailing"), onMouseDown: this.onCloseMouseDown.bind(this), onClick: this.onClose.bind(this), onTouchStart: this.onCloseMouseDown.bind(this) });
        }
        return React.createElement("div", { ref: function (ref) { return _this.selfRef = (ref === null) ? undefined : ref; }, style: {
                visibility: this.props.show ? "visible" : "hidden",
                height: this.props.height
            }, className: classNames, onMouseDown: this.onMouseDown.bind(this), onTouchStart: this.onMouseDown.bind(this) },
            leading,
            content,
            closeButton);
    };
    return TabButton;
}(React.Component));
exports.TabButton = TabButton;
// export default TabButton;
//# sourceMappingURL=TabButton.js.map