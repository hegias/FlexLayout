import * as React from "react";
import TabSetNode from "../model/TabSetNode";
import TabNode from "../model/TabNode";
import Actions from "../model/Actions";
import Layout from "./Layout";
import { JSMap } from "../Types";

/** @hidden @internal */
export interface ITabProps {
    layout: Layout,
    selected: boolean,
    node: TabNode,
    factory: (node:TabNode) => React.ReactNode
}

/** @hidden @internal */
export class Tab extends React.Component<ITabProps, any> {

    constructor(props:ITabProps) {
        super(props);
        this.state = {renderComponent: !props.node.isEnableRenderOnDemand() || props.selected};
    }

    componentDidMount() {
        //console.log("mount " + this.props.node.getName());
    }

    componentWillUnmount() {
        //console.log("unmount " + this.props.node.getName());
    }

    componentWillReceiveProps(newProps: ITabProps) {
        if (!this.state.renderComponent && newProps.selected) {
            // load on demand
            //console.log("load on demand: " + this.props.node.getName());
            this.setState({renderComponent: true});
        }
    }

    onMouseDown(event:React.MouseEvent<HTMLDivElement>) {
        const parent = this.props.node.getParent() as TabSetNode;
        if (parent.getType() === TabSetNode.TYPE) {
            if (!parent.isActive()) {
                this.props.layout.doAction(Actions.setActiveTabset(parent.getId()));
            }
        }
    }

    render() {
        let cm = this.props.layout.getClassName;

        const node = this.props.node;
        const parentNode = node.getParent() as TabSetNode;
        const style:JSMap<any> = node._styleWithPosition({
            display: this.props.selected ? "block" : "none"
        });

        if (parentNode.isMaximized()) {
            style.zIndex = 100;
        }

        let child = undefined;
        if (this.state.renderComponent) {
            child = this.props.factory(node);
        }

        let flexlayoutWidthSize = 'flexlayout__tab_width_default';
        let flexlayoutHeightSize = 'flexlayout__tab_height_default';
        let getStyleWidth= parseInt(style.width, 10);
        let getStyleHeight= parseInt(style.height, 10);

        //SET WIDTH CLASS
        if(getStyleWidth < 100){
            flexlayoutWidthSize = 'flexlayout__tab_width_small';
        }else if(getStyleWidth >= 100 && getStyleWidth < 260){
            flexlayoutWidthSize = 'flexlayout__tab_width_xs';
        }else if(getStyleWidth >= 260 && getStyleWidth < 355){
            flexlayoutWidthSize = 'flexlayout__tab_width_x';
        }else if(getStyleWidth >= 355 && getStyleWidth < 500){
            flexlayoutWidthSize = 'flexlayout__tab_width_ms';
        }else if(getStyleWidth >= 500 && getStyleWidth < 768){
            flexlayoutWidthSize = 'flexlayout__tab_width_m';
        }else if(getStyleWidth >= 768 && getStyleWidth < 992){
            flexlayoutWidthSize = 'flexlayout__tab_width_ms';
        }else if(getStyleWidth >= 992 && getStyleWidth < 1200){
            flexlayoutWidthSize = 'flexlayout__tab_width_lgs';
        }else if(getStyleWidth >= 1200 && getStyleWidth < 1500){
            flexlayoutWidthSize = 'flexlayout__tab_width_lg';
        }

        //SET HEIGHT CLASS
        if(getStyleHeight < 100){
            flexlayoutHeightSize = 'flexlayout__tab_height_small';
        }else if(getStyleWidth >= 100 && getStyleWidth < 260){
            flexlayoutHeightSize = 'flexlayout__tab_height_xs';
        }else if(getStyleHeight >= 260 && getStyleHeight < 355){
            flexlayoutHeightSize = 'flexlayout__tab_height_x';
        }else if(getStyleHeight >= 355 && getStyleHeight < 500){
            flexlayoutHeightSize = 'flexlayout__tab_height_ms';
        }else if(getStyleHeight >= 500 && getStyleHeight < 768){
            flexlayoutHeightSize = 'flexlayout__tab_height_m';
        }else if(getStyleHeight >= 768 && getStyleHeight < 992){
            flexlayoutHeightSize = 'flexlayout__tab_height_ms';
        }else if(getStyleHeight >= 992 && getStyleHeight < 1200){
            flexlayoutHeightSize = 'flexlayout__tab_height_lgs';
        }else if(getStyleHeight >= 1200 && getStyleHeight < 1500){
            flexlayoutHeightSize = 'flexlayout__tab_height_lg';
        }

        
        return <div className={cm(flexlayoutHeightSize+" flexlayout__tab "+flexlayoutWidthSize)}
                    onMouseDown={this.onMouseDown.bind(this)}
                    onTouchStart={this.onMouseDown.bind(this)}
                    style={style}>{child}
        </div>;
    }
}

// export default Tab;
