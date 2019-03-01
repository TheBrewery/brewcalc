import React from 'react'
import { FormGroup, FormControl, Panel, Row, Col } from 'react-bootstrap'
import { importFromBeerXml, importFromBSMX } from 'brewcalc'
import { connect } from 'react-redux'

const ImportArea = ({ editorState, onReloadEditorState }) => {
  const onXmlLoaded = e => {
    const reader = new FileReader()
    const file = e.target.files[0]
    const ext = file.name.match(/\.\w+$/g)[0]
    reader.readAsText(file)
    reader.onloadend = function () {
      try {
        console.log(reader.result)
        var result = ""

        switch (ext) {
          case ".xml": result = importFromBeerXml(reader.result)
            break
          case ".bsmx": result = importFromBSMX(reader.result)
            break
          default: 
            throw new Error("unsupported file")
        }
        
        onReloadEditorState(
          JSON.stringify(
            { recipe: result.recipe, equipment: result.equipment },
            null,
            4
          )
        )
      } catch (err) {
        alert('Can\'t import from file, see console for the details')
      }
    }
  }

  return (
    <Row className="show-grid">
      <Col md={6}>
        <Panel header="Upload BeerXML file">
          <FormGroup>
            <FormControl
              id="formControlsFile"
              type="file"
              label="File"
              accept="application/xml, .bsmx"
              onChange={onXmlLoaded}
            />
          </FormGroup>
        </Panel>
      </Col>
      <Col md={6}>
        <Panel header="brewcalc">
          <div>A modern (ES6) functional JavaScript library for brewing calculations.</div>
          <a href="https://github.com/brewcomputer/brewcalc">brewcalc lib on the GitHub (MIT license)</a>
        </Panel>
      </Col>
    </Row>
  )
}

const mapStateToProps = ({ editorState }) => ({ editorState })

const mapDispatchToProps = dispatch => ({
  onReloadEditorState: editorState => {
    dispatch({
      type: 'UPDATE_EDITOR_STATE',
      payload: editorState
    })
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(ImportArea)
