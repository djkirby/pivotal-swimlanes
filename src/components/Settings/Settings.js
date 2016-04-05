import React, { PropTypes } from 'react';
import history from '../../history';
import _ from 'lodash';
import HeaderBar from '../Project/HeaderBar';

const styles = {
  board: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    fontFamily: "'Open Sans', helvetica, arial, sans-serif",
    fontSize: 12,
    fontWeight: 400,
    marginLeft: 40
  }
};

const randState = () => Math.random().toString(36).slice(2);

const Settings = ({
  pivotalToken,
  pivotalProjects,
  gitHubAuthorized,
  selectedRepo,
  selectedPivotalProjectId,
  repos,
  onSettingsChange,
  onRepoQueryChange
}) => {
  const authorizeGitHub = e => {
    e.preventDefault();
    let state = randState();
    onSettingsChange({ state });
    let url = 'https://github.com/login/oauth/authorize?client_id=' + process.env.GITHUB_CLIENT_ID + '&redirect_uri=' + process.env.HOST + '/github_authorized&state=' + state + '&scope=repo';
    window.location.href = url;
  };

  const removeGitHubAccount = e => {
    e.preventDefault();
    onSettingsChange({ gitHubAuthorized: false });
  };

  const repoChangeHandler = _.compose(
    _.debounce(onRepoQueryChange, 500),
    _.property('value'),
    _.property('target')
  );

  return (
    <div style={styles.board}>
      <HeaderBar
        heading='Swimlanes Settings'
        sidebarVisible={false}
        showFilter={false}
        showSettings={false} />
      <h1>Swimlanes Settings</h1>
      <form>
        <label><strong>Pivotal API Token: </strong></label>
        <br />
        <label>This is found at the bottom of your Pivotal profile.</label>
        <br />
        <input
          type='text'
          value={pivotalToken}
          onChange={e => onSettingsChange({ pivotalToken: e.target.value })} />
        <br />
        <br />
        <label><strong>Pivotal Project: </strong></label>
        <br />
        <select onChange={e => onSettingsChange({ selectedPivotalProjectId: e.target.value })}>
          <option value='' disabled={_.any(selectedPivotalProjectId)}>
            Select a project
          </option>
          {_.map(pivotalProjects, project =>
            <option key={project.id} value={project.id} defaultValue=''>
              {project.name}
            </option>
          )}
        </select>
        <br />
        <br />
        <label><strong>GitHub Repo: {selectedRepo}</strong></label>
        <br />
        {gitHubAuthorized ? (
          <div>
            <input
              type='text'
              placeholder='Search Repos'
              onChange={repoChangeHandler} />
            {_.any(repos) ? (
              <ul>
                {_.map(repos, (repo, i) =>
                  <li
                    key={i}
                    style={{cursor: 'pointer'}}
                    onClick={() => onSettingsChange({ selectedRepo: repo })}
                  >
                    {repo}
                  </li>
                )}
              </ul>
            ) : null}
            <div>[<a href='' onClick={removeGitHubAccount}>remove account</a>]</div>
          </div>
        ) : (
          <div>
            <a href='' onClick={authorizeGitHub}>
              Authorize GitHub Account
            </a>
            <br />
          </div>
        )}
        <br />
        <button onClick={() => history.pushState(null, '/')}>Continue</button>
      </form>
    </div>
  );
};

Settings.propTypes = {
  pivotalToken: PropTypes.string,
  pivotalProjects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired
    })
  ),
  selectedRepo: PropTypes.string,
  selectedPivotalProjectId: PropTypes.string,
  repos: PropTypes.arrayOf(PropTypes.string),
  herokuAuthorized: PropTypes.bool
};

export default Settings;
