import React from 'react';
import './UserPlaylist.css';
import { UserPlaylistItem } from '../UserPlaylistItem/UserPlaylistItem.js';

export class UserPlaylist extends React.Component {
   
    render() {
        return (
            <div className="UserPlaylist">
                <h2>Your Playlist</h2>
                {
                    this.props.playlistList &&
                    this.props.playlistList.map(playlist => {
                        return (
                            <UserPlaylistItem
                                list={this.props.newList}
                                key={playlist.playlistId}
                                playlistName={playlist.playlistName}
                                playlistId={playlist.playlistId}
                            />
                        )
                    })
                }
            </div>
        )
    }
}