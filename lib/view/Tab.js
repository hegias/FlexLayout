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
        var flexlayoutHeightSize = 'flexlayout__tab_height_default';
        var getStyleWidth = parseInt(style.width, 10);
        var getStyleHeight = parseInt(style.height, 10);
        console.log('getStyleHeight: ', getStyleHeight);
        console.log('style.height: ', style.height);
        //SET WIDTH CLASS
        if (getStyleWidth < 100) {
            flexlayoutWidthSize = 'flexlayout__tab_width_xs';
        }
        else if (getStyleWidth > 100 && getStyleWidth < 355) {
            flexlayoutWidthSize = 'flexlayout__tab_width_x';
        }
        else if (getStyleWidth > 355 && getStyleWidth < 500) {
            flexlayoutWidthSize = 'flexlayout__tab_width_ms';
        }
        else if (getStyleWidth > 500 && getStyleWidth < 768) {
            flexlayoutWidthSize = 'flexlayout__tab_width_m';
        }
        else if (getStyleWidth > 768 && getStyleWidth < 992) {
            flexlayoutWidthSize = 'flexlayout__tab_width_ms';
        }
        else if (getStyleWidth > 992 && getStyleWidth < 1200) {
            flexlayoutWidthSize = 'flexlayout__tab_width_lgs';
        }
        else if (getStyleWidth > 1200 && getStyleWidth < 1500) {
            flexlayoutWidthSize = 'flexlayout__tab_width_lg';
        }
        else {
            flexlayoutWidthSize = 'flexlayout__tab_width_large';
        }
        //SET HEIGHT CLASS
        if (getStyleHeight < 100) {
            flexlayoutHeightSize = 'flexlayout__tab_height_xs';
        }
        else if (getStyleHeight > 100 && getStyleHeight < 355) {
            flexlayoutHeightSize = 'flexlayout__tab_height_x';
        }
        else if (getStyleHeight > 355 && getStyleHeight < 500) {
            flexlayoutHeightSize = 'flexlayout__tab_height_ms';
        }
        else if (getStyleHeight > 500 && getStyleHeight < 768) {
            flexlayoutHeightSize = 'flexlayout__tab_height_m';
        }
        else if (getStyleHeight > 768 && getStyleHeight < 992) {
            flexlayoutHeightSize = 'flexlayout__tab_height_ms';
        }
        else if (getStyleHeight > 992 && getStyleHeight < 1200) {
            flexlayoutHeightSize = 'flexlayout__tab_height_lgs';
        }
        else if (getStyleHeight > 1200 && getStyleHeight < 1500) {
            flexlayoutHeightSize = 'flexlayout__tab_height_lg';
        }
        else {
            flexlayoutHeightSize = 'flexlayout__tab_height_large';
        }
        return React.createElement("div", { className: cm(flexlayoutHeightSize + " flexlayout__tab " + flexlayoutWidthSize), onMouseDown: this.onMouseDown.bind(this), onTouchStart: this.onMouseDown.bind(this), style: style }, child);
    };
    return Tab;
}(React.Component));
exports.Tab = Tab;
// export default Tab;
//# sourceMappingURL=Tab.js.map