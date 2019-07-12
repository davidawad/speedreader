import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

import PropTypes from 'prop-types';

// TODO remove this
import Swipeable from 'react-swipeable';

import EpubParser from '../EpubParser/EpubParser';
import PDFParser from '../PDFParser/PDFParser';

// TODO remove these styles?
import defaultStyles from './style';

import './FileParser.css';

const PDFTYPE = 'application/pdf';
const EPUBTYPE = 'application/epub+zip';

// const allowedFiletypes = [PDFTYPE, EPUBTYPE];
const allowedFiletypes = [PDFTYPE];

let ctx = {};

// global.ePub = Epub; // Fix for v3 branch of epub.js -> needs ePub to by a global var

// TODO ADD PROCESSING INFO FOR SLOW / LARGER BOOKS ?
class FileParser extends Component {
  constructor(props) {
    super(props);

    ctx = this;

    this.state = {
      fileLoaded: false,
      currentFile: undefined,
      updateCallback: this.props.updateCallback,
      verbose: this.props.verbose
    };

    this.onDrop = files => {
      this.setState({
        fileLoaded: false,
        currentFile: undefined
      });

      const file = files[0];

      if (ctx.state.verbose) {
        console.log('FILEPARSER FILE:', file);
      }

      const fUrl = URL.createObjectURL(file);

      if (ctx.state.verbose) {
        console.log('FILEPARSER FILE URL:', fUrl);
      }

      // TODO update callback with text from page

      this.setState({
        fileLoaded: true,
        currentFile: file,
        currentFileUrl: fUrl
      });
    };

    this.state = {
      files: []
    };
  }

  componentWillReceiveProps({ someProp }) {
    this.setState({ ...this.state, someProp });
  }

  render() {
    // TODO trim these out?
    const {
      url,
      title,
      showToc,
      loadingView,
      epubOptions,
      styles,
      getRendition,
      locationChanged,
      location,
      swipeable
    } = this.props;

    const files = this.state.files.map(file => (
      <li key={file.name}>
        {file.name} - {file.size} bytes
      </li>
    ));

    return (
      <div className="FileParser-canvas">
        <Dropzone onDrop={this.onDrop} accept={allowedFiletypes}>
          {({ getRootProps, getInputProps }) => (
            <section className="container">
              <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
              </div>

              <aside>
                <h4>File</h4>
                <ul>{files}</ul>
              </aside>
            </section>
          )}
        </Dropzone>

        {this.state.fileLoaded && this.state.currentFile.type === EPUBTYPE ? (
          // render epub view!

          <EpubParser
            className="false"
            file={this.state.currentFile}
            // epub parser
            ref={this.readerRef}
            url={this.state.currentFileUrl}
            location={location}
            loadingView={loadingView}
            tocChanged={this.onTocChange}
            locationChanged={locationChanged}
            epubOptions={{}}
            getRendition={getRendition}
            verbose={true} // TODO set back to normal.
          />
        ) : (
          // else
          <span></span>
        )}

        {this.state.fileLoaded && this.state.currentFile.type === PDFTYPE ? (
          // render PDF text!

          <PDFParser
            className="false"
            file={this.state.currentFile}
            ref={this.readerRef}
            url={this.state.currentFileUrl}
            updateCallback={this.props.updateCallback}
            // verbose={this.props.verbose}
            verbose={true}
          />
        ) : (
          // else
          <span></span>
        )}

        <div id="reader-fodder" />
      </div>
    );
  }
}

/* TODO remove these prop types as they're not necessary. 
FileParser.defaultProps = {
  loadingView: <div>Loading . . . </div>,
  locationChanged: null,
  tocChanged: () => {
    if (ctx.state.verbose) {
      console.log('TOC CHANGED FUNC CALLED?');
    }
  },
  showToc: true,
  styles: defaultStyles
};

FileParser.propTypes = {
  title: PropTypes.string,
  loadingView: PropTypes.element,
  url: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(ArrayBuffer)
  ]),
  showToc: PropTypes.bool,
  location: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  locationChanged: PropTypes.func,
  tocChanged: PropTypes.func,
  styles: PropTypes.object,
  epubOptions: PropTypes.object,
  getRendition: PropTypes.func,
  swipeable: PropTypes.bool
};
*/

export default FileParser;
