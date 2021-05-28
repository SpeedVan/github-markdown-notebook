import React from 'react';

import RMD from 'react-markdown'
// import gfm from 'remark-gfm'

export const MarkdownReader = ({content}) => <RMD remarkPlugins={[]} children={content} />