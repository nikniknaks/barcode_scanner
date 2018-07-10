import React from 'react'

import EditableLabel from './editable_label.js'
import 'components/barcode_list_item/barcode_list_item.css'


class BarcodeListItem extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <li className="BarcodeListItem">
        <img alt={this.props.code} src={this.props.value}/>
        <div className="barcodeInfo">
          <div className="code">Code: {this.props.code}</div>
          <EditableLabel identifier={this.props.identifier} label={this.props.label} saveNewLabel={this.props.saveNewLabel} setEditLabelModeTrue={this.props.setEditLabelModeTrue}/>
        </div>
      </li>
    )
  }
}

export default BarcodeListItem