import React from 'react';
import '../styles/FormInput.scss';

const FormInput = ({ label, ...otherProps }) => {
  return (
    <div className='group'>
      <input className='form-input' {...otherProps} id={otherProps.name} />
      {label && (
        <label
          className={`${
            otherProps.value.length ? 'shrink' : ''
          } form-input-label`}
          htmlFor={otherProps.name}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default FormInput;
