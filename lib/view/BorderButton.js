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
var Rect_1 = require("../Rect");
var Actions_1 = require("../model/Actions");
/** @hidden @internal */
var BorderButton = /** @class */ (function (_super) {
    __extends(BorderButton, _super);
    function BorderButton(props) {
        return _super.call(this, props) || this;
    }
    BorderButton.prototype.onMouseDown = function (event) {
        this.props.layout.dragStart(event, "Move: " + this.props.node.getName(), this.props.node, this.props.node.isEnableDrag(), this.onClick.bind(this), function (event) { return undefined; });
    };
    BorderButton.prototype.onClick = function (event) {
        var node = this.props.node;
        this.props.layout.doAction(Actions_1.default.selectTab(node.getId()));
    };
    BorderButton.prototype.onClose = function (event) {
        var node = this.props.node;
        this.props.layout.doAction(Actions_1.default.deleteTab(node.getId()));
    };
    BorderButton.prototype.onCloseMouseDown = function (event) {
        event.stopPropagation();
    };
    BorderButton.prototype.componentDidMount = function () {
        this.updateRect();
    };
    BorderButton.prototype.componentDidUpdate = function () {
        this.updateRect();
    };
    BorderButton.prototype.updateRect = function () {
        // record position of tab in border
        var clientRect = ReactDOM.findDOMNode(this.props.layout).getBoundingClientRect();
        var r = this.selfRef.getBoundingClientRect();
        this.props.node._setTabRect(new Rect_1.default(r.left - clientRect.left, r.top - clientRect.top, r.width, r.height));
    };
    BorderButton.prototype.render = function () {
        var _this = this;
        var cm = this.props.layout.getClassName;
        var classNames = cm("flexlayout__border_button") + " " +
            cm("flexlayout__border_button_" + this.props.border);
        var node = this.props.node;
        if (this.props.selected) {
            classNames += " " + cm("flexlayout__border_button--selected");
        }
        else {
            classNames += " " + cm("flexlayout__border_button--unselected");
        }
        if (this.props.node.getClassName() !== undefined) {
            classNames += " " + this.props.node.getClassName();
        }
        var leadingContent = undefined;
        if (node.getIcon() !== undefined) {
            leadingContent = React.createElement("img", { src: node.getIcon() });
        }
        var content = React.createElement("div", { ref: function (ref) { return _this.contentsRef = (ref === null) ? undefined : ref; }, className: cm("flexlayout__border_button_content") }, node.getName());
        var closeButton = undefined;
        if (this.props.node.isEnableClose()) {
            closeButton = React.createElement("div", { className: cm("flexlayout__border_button_trailing"), onMouseDown: this.onCloseMouseDown.bind(this), onClick: this.onClose.bind(this), onTouchStart: this.onCloseMouseDown.bind(this) });
        }
        return React.createElement("div", { ref: function (ref) { return _this.selfRef = (ref === null) ? undefined : ref; }, style: {}, className: classNames, onMouseDown: this.onMouseDown.bind(this), onTouchStart: this.onMouseDown.bind(this) },
            leadingContent,
            content,
            closeButton);
    };
    return BorderButton;
}(React.Component));
exports.BorderButton = BorderButton;
// export default BorderButton;
//# sourceMappingURL=BorderButton.js.map