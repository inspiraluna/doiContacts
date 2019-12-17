import React from 'react';
import TextareaAutosize from '@material-ui/core/TextareaAutosize'



const EditEmailTemplate = () => {
    return (
        <div>
            <TextareaAutosize
  
  rows="8" cols="205"
  aria-label="maximum height"
  placeholder="Maximum 4 rows"
  defaultValue="Hello, please give me permission to write you an email.\n\n${confirmation_url}\n\n Yours\n\nPeter" 
/>
        </div>
    )
}


export default EditEmailTemplate;