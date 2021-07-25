import React from 'react';
import './UserPlaylistItem.css';

export class UserPlaylistItem extends React.Component {
    render() {
        return (
            <div className="UserPlaylistItem">
                <h3>{this.props.playlistName}</h3>
            </div>
        )
    }
}