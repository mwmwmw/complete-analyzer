import ReactDOM, { createPortal} from "react-dom";
import React, {Component , useState } from "react";

const modalRoot = document.getElementById('menu');


export class Portal extends Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  render() {
    return createPortal(
      this.props.children,
      this.el
    );
  }
}


export default function Menu ({children, title, toggle = false}) {
    const [open, setOpen] = useState(!toggle);
    return <Portal>
        {!toggle && <h2>{title}</h2>}
        {toggle && <h2 className="toggle-title">{title} <div onClick={()=>setOpen(!open)}>{open? "X" : "Open"}</div></h2>}
            <div class="panel">
                
                {open && children}
            </div>
        </Portal>
}
