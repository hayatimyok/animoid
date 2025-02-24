import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [videos, setVideos] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [url, setUrl] = useState('');
    const [token, setToken] = useState('');

    useEffect(() => {
        axios.get('/api/videos')
            .then(response => setVideos(response.data))
            .catch(error => console.error('Error fetching videos:', error));
    }, []);

    const handleLogin = () => {
        axios.post('/api/login', { username: 'admin', password: 'password' })
            .then(response => setToken(response.data.token))
            .catch(error => console.error('Error logging in:', error));
    };

    const handleUpload = () => {
        axios.post('/api/videos', { title, description, url }, {
            headers: { 'Authorization': token }
        })
            .then(response => setVideos([...videos, response.data]))
            .catch(error => console.error('Error uploading video:', error));
    };

    return (
        <div>
            <h1>Animoid Admin Panel</h1>
            <button onClick={handleLogin}>Login</button>
            <div>
                <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
                <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
                <input type="text" placeholder="URL" value={url} onChange={e => setUrl(e.target.value)} />
                <button onClick={handleUpload}>Upload Video</button>
            </div>
            <ul>
                {videos.map(video => (
                    <li key={video._id}>
                        <h3>{video.title}</h3>
                        <p>{video.description}</p>
                        <video controls>
                            <source src={video.url} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;