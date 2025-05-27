import React from 'react';

const Card = ({ frontImage, backTitle, backSubText }) => {
  const cardStyle = {
    width: '300px',
    height: '350px',
    margin: '1rem auto',
    cursor: 'pointer',
    perspective: '1000px',  // Adding perspective for 3D effect
  };

  const cardInnerStyle = {
    position: 'relative',
    width: '100%',
    height: '100%',
    transition: 'transform 1s',
    transformStyle: 'preserve-3d',
  };

  const cardFrontStyle = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0.5rem',
    backfaceVisibility: 'hidden',  // Hides backface of the card when flipped
  };

  const cardBackStyle = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(37, 99, 235, 0.9)',
    color: 'white',
    display: 'flex',
    alignItems: 'end',
    justifyContent: 'center',
    borderRadius: '0.5rem',
    transform: 'rotateY(180deg)',  // Start the back side flipped
    backfaceVisibility: 'hidden',  // Hides backface of the card when flipped
    padding: '1rem',
    textAlign: 'center',
  };

  return (
    <div style={cardStyle}>
      <div style={cardInnerStyle} className="hover:rotate-y-180">
        {/* Front of the Card */}
        <div style={cardFrontStyle}>
          {frontImage ? (
            <img src={frontImage} alt="front" className="w-full h-full object-cover rounded-lg" />
          ) : (
            <p className="text-center text-gray-800">No Image Available</p>
          )}
        </div>
        
        {/* Back of the Card */}
        <div style={cardBackStyle}>
          <div>
            <h3 className="text-xl font-semibold mb-10">{backTitle}</h3>
            <p className="text-sm">{backSubText}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
