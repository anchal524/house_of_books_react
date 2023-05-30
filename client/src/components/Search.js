import React from "react";

const SearchVal = (props) => {
    const handleChange = (e) => {
        props.searchValue(e.target.value);
    };
    return (
        <form
            method='POST'
            onSubmit={(e) => {
                e.preventDefault();
            }}
            name='formName'
            className='trainer-wrapper'
        >
            <label>
                <span>Search Book Here: </span>
                <input
                    autoComplete='off'
                    type='text'
                    name='searchTerm'
                    onChange={handleChange}
                />
            </label>
        </form>
    );
};

export default SearchVal;
