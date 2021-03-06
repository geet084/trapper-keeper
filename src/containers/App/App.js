import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import NotFound from '../../components/NotFound/NotFound'
import Header from '../../components/Header/Header'
import NoteForm from '../NoteForm/NoteForm'
import NoteArea from '../NoteArea/NoteArea'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'
import { fetchNotes } from '../../thunks/fetchNotes'
import PropTypes from 'prop-types';
import '../../Main.scss'
let shortID = require('short-id');


export class App extends Component {

  componentDidMount = async () => {
    const url = 'http://localhost:3001/api/v1/notes'
    this.props.fetchNotes(url)
  }

  render() {
    const { error, isLoading } = this.props
    switch (error) {
      case '':
        return (
          <div className="App">
            <Header isLoading={isLoading} />
            <Switch>
              <Route exact path='/' component={NoteArea} />
              <Route path='/new-note' render={() => {
                const note = { title: '', id: shortID.generate(), timestamp: Date.now() }
                return <NoteForm note={note} items={[]} isEdit={false} />
              }} />
              <Route path='/notes/:id' render={({ match }) => {
                const { id } = match.params
                const note = this.props.notes.find(note => note.id === id)
                const items = this.props.items.filter(item => item.noteID === id)
                const newItem = { id: shortID.generate(), description: '', noteID: id, timestamp: Date.now(), isCompleted: false }
                if (note) {
                  return <NoteForm note={note} items={[...items, newItem]} isEdit={true} />
                } else {
                  return <NotFound />
                }
              }} />
              <Route component={NotFound} />
            </Switch>
          </div>
        );
      default:
        return <ErrorMessage error={error} />
    }

  }
}

export const mapStateToProps = (state) => ({
  notes: state.notes,
  items: state.items,
  isLoading: state.isLoading,
  error: state.error
})

export const mapDispatchToProps = (dispatch) => ({
  fetchNotes: (url) => dispatch(fetchNotes(url))
})

App.propTypes = {
  error: PropTypes.string,
  fetchNotes: PropTypes.func,
  isLoading: PropTypes.bool,
  items: PropTypes.array,
  notes: PropTypes.array,
}

App.defaultProps = {
  error: '',
  isLoading: true,
  items: [],
  notes: []
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
