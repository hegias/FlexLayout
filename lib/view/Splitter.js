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
var DragDrop_1 = require("../DragDrop");
var Orientation_1 = require("../Orientation");
var BorderNode_1 = require("../model/BorderNode");
var Actions_1 = require("../model/Actions");
/** @hidden @internal */
var Splitter = /** @class */ (function (_super) {
    __extends(Splitter, _super);
    function Splitter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Splitter.prototype.onMouseDown = function (event) {
        DragDrop_1.default.instance.startDrag(event, this.onDragStart.bind(this), this.onDragMove.bind(this), this.onDragEnd.bind(this), this.onDragCancel.bind(this));
        var parentNode = this.props.node.getParent();
        this.pBounds = parentNode._getSplitterBounds(this.props.node);
        var rootdiv = ReactDOM.findDOMNode(this.props.layout);
        this.outlineDiv = document.createElement("div");
        this.outlineDiv.style.position = "absolute";
        this.outlineDiv.className = this.props.layout.getClassName("flexlayout__splitter_drag");
        this.outlineDiv.style.cursor = this.props.node.getOrientation() === Orientation_1.default.HORZ ? "ns-resize" : "ew-resize";
        this.props.node.getRect().positionElement(this.outlineDiv);
        rootdiv.appendChild(this.outlineDiv);
    };
    Splitter.prototype.onDragCancel = function (wasDragging) {
        var rootdiv = ReactDOM.findDOMNode(this.props.layout);
        rootdiv.removeChild(this.outlineDiv);
    };
    Splitter.prototype.onDragStart = function (event) {
        return true;
    };
    Splitter.prototype.onDragMove = function (event) {
        var clientRect = ReactDOM.findDOMNode(this.props.layout).getBoundingClientRect();
        var pos = {
            x: event.clientX - clientRect.left,
            y: event.clientY - clientRect.top
        };
        var outlineDiv = this.outlineDiv;
        if (this.props.node.getOrientation() === Orientation_1.default.HORZ) {
            outlineDiv.style.top = this.getBoundPosition(pos.y - 4) + "px";
        }
        else {
            outlineDiv.style.left = this.getBoundPosition(pos.x - 4) + "px";
        }
    };
    Splitter.prototype.onDragEnd = function (event, didDrag) {
        var node = this.props.node;
        var parentNode = node.getParent();
        var value = 0;
        var outlineDiv = this.outlineDiv;
        if (node.getOrientation() === Orientation_1.default.HORZ) {
            value = outlineDiv.offsetTop;
        }
        else {
            value = outlineDiv.offsetLeft;
        }
        if (parentNode instanceof BorderNode_1.default) {
            var pos = parentNode._calculateSplit(node, value);
            this.props.layout.doAction(Actions_1.default.adjustBorderSplit(node.getParent().getId(), pos));
        }
        else {
            var splitSpec = parentNode._calculateSplit(this.props.node, value);
            if (splitSpec !== undefined) {
                this.props.layout.doAction(Actions_1.default.adjustSplit(splitSpec));
            }
        }
        var rootdiv = ReactDOM.findDOMNode(this.props.layout);
        rootdiv.removeChild(this.outlineDiv);
    };
    Splitter.prototype.getBoundPosition = function (p) {
        var bounds = this.pBounds;
        var rtn = p;
        if (p < bounds[0]) {
            rtn = bounds[0];
        }
        if (p > bounds[1]) {
            rtn = bounds[1];
        }
        return rtn;
    };
    Splitter.prototype.render = function () {
        var cm = this.props.layout.getClassName;
        var node = this.props.node;
        var OrientationStyle = this.props.node.getOrientation() === Orientation_1.default.HORZ ? "splitter-horizon" : "splitter-vertical";
        var style = node._styleWithPosition({
            cursor: this.props.node.getOrientation() === Orientation_1.default.HORZ ? "ns-resize" : "ew-resize"
        });
        if (style.width) {
        }
        return React.createElement("div", { style: style, onTouchStart: this.onMouseDown.bind(this), onMouseDown: this.onMouseDown.bind(this), className: cm("flexlayout__splitter " + OrientationStyle + ' width-' + style.width) });
    };
    return Splitter;
}(React.Component));
exports.Splitter = Splitter;
// export default Splitter;
//# sourceMappingURL=Splitter.js.map