import React, {PropTypes} from 'react';

const SourceImage = ({link}) => {
	return link ? <img id="source" src={link} alt="Original image" /> : null;
};

SourceImage.propTypes = {
	link: PropTypes.string,
};

export default SourceImage;
