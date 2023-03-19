import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './art.css';


export default function Art() {

    const [artPiece, setArtPiece] = useState({});
    const [objectIds, setObjectIds] = useState([]);

    const [seenArtworks, setSeenArtworks] = useState([]);

    const [bannedAttributes, setBannedAttributes] = useState({});

    const API_URL = 'https://collectionapi.metmuseum.org/public/collection/v1';

    // Effect for first render to get all objects
    useEffect(() => {
        const fetchObjects = async () => {
            const result = await axios.get(`${API_URL}/objects`);
            console.log(result.data);
            setObjectIds(result.data.objectIDs);
        };
        fetchObjects();
    }, []);


    const handleGenerator = async () => {
        const randomIndex = Math.floor(Math.random() * objectIds.length);
        const randomId = objectIds[randomIndex];

        const result = await axios.get(`${API_URL}/objects/${randomId}`);

        if (result.data.primaryImage === "") {
            handleGenerator();
        }
        else {
            if ((result.data.department in bannedAttributes) || (result.data.medium in bannedAttributes) || (result.data.objectName in bannedAttributes) || (result.data.culture in bannedAttributes)) {
                console.log('banned');
                handleGenerator();
            } 
            else {
                setArtPiece(result.data);
                setSeenArtworks((seenArtworks) => [...seenArtworks, result.data]);
            }
        }
        console.log(result.data);
    };

    const handleBan = (attribute) => {
        setBannedAttributes((prevBannedAttributes) => {
            return {
                ...prevBannedAttributes,
                [attribute]: true,
            };
        });
        console.log(bannedAttributes);
    };

    const handleUnban = (attribute) => {
        const newBannedAttributes = { ...bannedAttributes };
        delete newBannedAttributes[attribute];
        setBannedAttributes(newBannedAttributes);
        console.log('unbanned attribute');
    };

    const displayBannedAttributes = Object.keys(bannedAttributes).map((attribute) => 
        <button onClick={() => handleUnban(attribute)}>{attribute}</button>);


    return (
        <div className = 'container'>

            <div className = 'gallery'>
                <h1>Gallery</h1>
                <div className = 'cards'>
                    {
                        (artPiece && seenArtworks.length > 0) ?
                        (seenArtworks.map(artPiece => (
                            <div className = 'card'>
                                <img
                                src={artPiece.primaryImageSmall} 
                                alt={artPiece.title}
                                />
                                <div className = 'content'>
                                    <h2>{artPiece.title}</h2>
                                </div>
                            </div>
                        )))
                        :
                        (
                            <p>Your previously seen artworks will show here in the Gallery!</p>
                        )
                    }
                </div>
            </div>

            <div className = 'art'>
                <div className = 'card'>
                    <img
                    src={artPiece.primaryImage} 
                    alt={artPiece.title}
                    />
                    
                        {artPiece && artPiece.title ? 
                        (
                            <div className = 'content'>
                                <h2>{artPiece.title}</h2>
                                <h3>Attributes:</h3>
                                <div className = "artPiece-buttons">
                                    <button onClick={() => handleBan(artPiece.department)}>{artPiece.department}</button>
                                    <button onClick={() => handleBan(artPiece.medium)}>{artPiece.medium}</button>
                                    <button onClick={() => handleBan(artPiece.objectName)}>{artPiece.objectName}</button>
                                    <button onClick={() => handleBan(artPiece.culture)}>{artPiece.culture}</button>
                                </div>
                            </div>
                        )
                        :
                        (
                            <div className = "content">
                                <p>No artwork has been generated yet!</p>
                            </div> 
                        )}
                    
                </div>
                <div className = 'buttons'>
                    <button onClick={() => {handleGenerator()}}>Generate</button>
                </div>
            </div>

            <div className = 'banned'>
                <h1>Ban List</h1>
                <div className = 'attribute-list'>
                {
                    (bannedAttributes && Object.keys(bannedAttributes).length > 0) ?
                        (Object.keys(bannedAttributes).map((attribute) => (
                            <button onClick={() => handleUnban(attribute)}>{attribute}</button>))   
                        )
                        :
                        (
                        <p>Your banned attributes will show here!</p>
                        )
                }
                </div>
                
            </div>
        </div>

    );
}