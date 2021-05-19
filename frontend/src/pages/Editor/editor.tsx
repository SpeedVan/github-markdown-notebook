import React, { PureComponent } from 'react';

import RMD from 'react-markdown'
// import gfm from 'remark-gfm'


const Editor = ({content}:{content:string}) => <RMD remarkPlugins={[]} children={content} />

export default Editor