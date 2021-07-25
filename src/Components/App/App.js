import React from 'react';
import './App.css';
import { SearchBar } from '../SearchBar/SearchBar.js';
import { SearchResults } from '../SearchResults/SearchResults.js';
import { Playlist } from '../Playlist/Playlist.js';
import { UserPlaylist } from '../UserPlaylist/UserPlaylist.js'
import Spotify from '../../util/Spotify.js'


export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'My Playlist',
      playlistTracks: [],
      playlistList: []
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlayListName = this.updatePlayListName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.getPlaylist = this.getPlaylist.bind(this);
  }

  addTrack(track) {

    const tracks = this.state.playlistTracks;
    
    if (tracks.find(savedTrack => savedTrack.id === track.id)) {
      return; 
    }

    tracks.push(track);
    this.setState({ playlistTracks: tracks });

  }
  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    
    tracks = tracks.filter(savedTrack => savedTrack.id !== track.id);
  
    this.setState({ playlistTracks: tracks });
  }

  updatePlayListName(name) {
    this.setState({ playlistName: name });
  }

  savePlaylist() {
    const trackUris = this.state.playlistTracks.map(track => track.uri);
    const name = this.state.playlistName;
    Spotify.savePlaylist(name, trackUris).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      })
    })
  } 

  search(term) {
    Spotify.search(term).then(searchResults => {
      this.setState({ searchResults: searchResults })
    });

  }
  getPlaylist() {
    Spotify.getUserPlaylists().then(playlistList => this.setState({ playlistList: playlistList }));
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults 
              searchResults={this.state.searchResults}
              onAdd={this.addTrack} />
            <Playlist 
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlayListName}
              onSave={this.savePlaylist} />
            <UserPlaylist playlistList={this.state.playlistList} />
        </div>
        </div>
      </div>
    )
  }
  componentDidMount() {
    window.addEventListener('load', () => {
      Spotify.getAccessToken();
    })
    this.getPlaylist();
    
  
  }
  componentDidUpdate() {
    this.getPlaylist();
  }
}