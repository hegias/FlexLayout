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
var TabSetNode_1 = require("../model/TabSetNode");
var Actions_1 = require("../model/Actions");
/** @hidden @internal */
var Tab = /** @class */ (function (_super) {
    __extends(Tab, _super);
    function Tab(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { renderComponent: !props.node.isEnableRenderOnDemand() || props.selected };
        return _this;
    }
    Tab.prototype.componentDidMount = function () {
        //console.log("mount " + this.props.node.getName());
    };
    Tab.prototype.componentWillUnmount = function () {
        //console.log("unmount " + this.props.node.getName());
    };
    Tab.prototype.componentWillReceiveProps = function (newProps) {
        if (!this.state.renderComponent && newProps.selected) {
            // load on demand
            //console.log("load on demand: " + this.props.node.getName());
            this.setState({ renderComponent: true });
        }
    };
    Tab.prototype.onMouseDown = function (event) {
        var parent = this.props.node.getParent();
        if (parent.getType() === TabSetNode_1.default.TYPE) {
            if (!parent.isActive()) {
                this.props.layout.doAction(Actions_1.default.setActiveTabset(parent.getId()));
            }
        }
    };
    Tab.prototype.render = function () {
        var cm = this.props.layout.getClassName;
        var node = this.props.node;
        var parentNode = node.getParent();
        var style = node._styleWithPosition({
            display: this.props.selected ? "block" : "none"
        });
        if (parentNode.isMaximized()) {
            style.zIndex = 100;
        }
        var child = undefined;
        if (this.state.renderComponent) {
            child = this.props.factory(node);
        }
        var flexlayoutWidthSize = 'flexlayout__tab_width_default';
        if (style.width < 100) {
            flexlayoutWidthSize = 'flexlayout__tab_width_xs';
        }
        else if (style.width > 100 && style.width < 355) {
            flexlayoutWidthSize = 'flexlayout__tab_width_x';
        }
        else if (style.width > 355 && style.width < 500) {
            flexlayoutWidthSize = 'flexlayout__tab_width_ms';
        }
        else if (style.width > 500 && style.width < 768) {
            flexlayoutWidthSize = 'flexlayout__tab_width_m';
        }
        else if (style.width > 768 && style.width < 992) {
            flexlayoutWidthSize = 'flexlayout__tab_width_ms';
        }
        else if (style.width > 992 && style.width < 1200) {
            flexlayoutWidthSize = 'flexlayout__tab_width_xlg';
        }
        else if (style.width > 1200 && style.width < 1500) {
            flexlayoutWidthSize = 'flexlayout__tab_width_lg';
        }
        else {
            flexlayoutWidthSize = 'flexlayout__tab_width_large';
        }
        return React.createElement("div", { className: cm("flexlayout__tab " + flexlayoutWidthSize), onMouseDown: this.onMouseDown.bind(this), onTouchStart: this.onMouseDown.bind(this), style: style }, child);
    };
    return Tab;
}(React.Component));
exports.Tab = Tab;
// export default Tab;
//# sourceMappingURL=Tab.js.map